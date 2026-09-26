import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { SourceTextModule, SyntheticModule, createContext } from 'node:vm'
import test from 'node:test'

// Execute the actual data loaders with a local database fixture and a controlled
// Next cache adapter. No live Supabase requests or credentials are used.
async function dataFixture() {
  const requests = []
  const entries = new Map()
  const afterTasks = []
  let now = 0
  let outage = false
  let publishedCount = 0
  let currentUser = 'reader-a'
  const rows = [{ id: 'article-1', slug: 'article-one', title: 'Article one', body: 'Full article', status: 'published', publication_type: 'Article', reading_time_minutes: 5, published_at: '2026-09-01', created_at: '2026-09-01', author: null }]
  function client(admin) {
    return {
      auth: { getUser: async () => ({ data: { user: { id: currentUser } } }) },
      rpc: async () => ({ data: publishedCount }),
      from(table) {
        const request = { table, admin, filters: [] }
        const builder = {
          select(columns) { request.columns = columns; return builder },
          eq(column, value) { request.filters.push([column, value]); return builder },
          neq() { return builder },
          order() { return builder },
          limit() { return builder },
          in() { return builder },
          contains() { return builder },
          maybeSingle() { request.single = true; return builder },
          then(onValue, onError) {
            requests.push(request)
            let data = table === 'publications' ? rows.map((row) => ({ ...row })) : []
            if (table === 'publication_metrics') data = [{ id: 'article-1', views: 23 }]
            if (table === 'likes' || table === 'bookmarks') data = currentUser === 'reader-a' ? [{ publication_id: 'article-1' }] : []
            if (request.single) data = data[0] || null
            return Promise.resolve({ data: outage ? null : data, error: outage ? { message: 'Quota restricted' } : null, count: 1 }).then(onValue, onError)
          },
        }
        return builder
      },
    }
  }
  const context = createContext({ console: { error() {} } })
  const modules = new Map()
  const stubs = {
    'server-only': {},
    react: { cache: (fn) => fn },
    'next/server': { after: (fn) => afterTasks.push(fn) },
    'next/cache': {
      unstable_cache: (fn, keys, options) => async (...args) => {
        assert.equal(options.revalidate, 60)
        const key = JSON.stringify([keys, args])
        const hit = entries.get(key)
        if (hit && hit.expires > now) return hit.data
        const data = await fn(...args)
        entries.set(key, { data, expires: now + options.revalidate, tags: options.tags })
        return data
      },
      revalidateTag: (tag, options) => {
        assert.equal(options.expire, 0)
        for (const [key, entry] of entries) if (entry.tags.includes(tag)) entries.delete(key)
      },
    },
    [resolve('src/lib/supabase/public.js')]: { createPublicClient: () => client(false) },
    [resolve('src/lib/supabase/server.js')]: { createClient: async () => client(true) },
  }
  async function load(key) {
    if (modules.has(key)) return modules.get(key)
    const stub = stubs[key]
    const module = stub
      ? new SyntheticModule(Object.keys(stub), function () { for (const [name, value] of Object.entries(stub)) this.setExport(name, value) }, { context, identifier: key })
      : new SourceTextModule(await readFile(key, 'utf8'), { context, identifier: key })
    modules.set(key, module)
    await module.link((specifier, parent) => load(specifier.startsWith('.') ? resolve(dirname(parent.identifier), `${specifier}.js`) : specifier))
    return module
  }
  const module = await load(resolve('src/lib/data.js'))
  await module.evaluate()
  return {
    data: module.namespace,
    invalidate: modules.get(resolve('src/lib/public-content-cache.js')).namespace.invalidatePublicContent,
    requests, rows, afterTasks,
    advance: (seconds) => { now += seconds },
    setOutage: (value) => { outage = value },
    setPublished: (value) => { publishedCount = value },
    setUser: (value) => { currentUser = value },
  }
}

test('public reads reuse the cache, expire and reflect editorial invalidation', async () => {
  const f = await dataFixture()
  await f.data.getPublications({ summary: true })
  await f.data.getPublications({ summary: true })
  assert.equal(f.requests.length, 1)
  assert.ok(f.requests[0].filters.some(([key, value]) => key === 'status' && value === 'published'))
  assert.doesNotMatch(f.requests[0].columns, /\bbody\b/)
  f.advance(61)
  await f.data.getPublications({ summary: true })
  assert.equal(f.requests.length, 2)
  f.rows[0].title = 'Edited title'
  f.invalidate()
  const result = await f.data.getPublications({ summary: true })
  assert.equal(result[0].title, 'Edited title')
  assert.equal(f.requests.length, 3)
})

test('quota failures are not cached as empty libraries', async () => {
  const f = await dataFixture()
  f.setOutage(true)
  assert.equal((await f.data.getPublications({ summary: true })).length, 0)
  f.setOutage(false)
  assert.equal((await f.data.getPublications({ summary: true })).length, 1)
  assert.equal(f.requests.length, 2)
})

test('admin reads bypass public caches; full detail and metrics remain available', async () => {
  const f = await dataFixture()
  await f.data.getPublications({ summary: true })
  const admin = await f.data.getPublications({ admin: true })
  await f.data.getPublications({ admin: true })
  assert.equal(admin[0].body, 'Full article')
  assert.equal(admin[0].views, 23)
  assert.equal(f.requests.filter((r) => r.admin && r.table === 'publications').length, 2)
  const article = await f.data.getPublicationBySlug('article-one')
  assert.equal(article.body, 'Full article')
})

test('personal likes/bookmarks are read separately for each user', async () => {
  const f = await dataFixture()
  const first = await f.data.getArticleInteractions('article-1')
  f.setUser('reader-b')
  const second = await f.data.getArticleInteractions('article-1')
  assert.equal(first.userId, 'reader-a')
  assert.equal(first.liked, true)
  assert.equal(first.bookmarked, true)
  assert.equal(second.userId, 'reader-b')
  assert.equal(second.liked, false)
  assert.equal(second.bookmarked, false)
})

test('scheduled publishing invalidates after rendering only when rows changed', async () => {
  const f = await dataFixture()
  await f.data.getPublications({ admin: true })
  assert.equal(f.afterTasks.length, 0)
  await f.data.getPublications({ summary: true })
  f.setPublished(1)
  await f.data.getPublications({ admin: true })
  assert.equal(f.afterTasks.length, 1)
  await f.afterTasks[0]()
  await f.data.getPublications({ summary: true })
  assert.equal(f.requests.filter((r) => !r.admin).length, 2)
})

test('sermon reads are explicit; activity/moderation omit unused large fields', async () => {
  const f = await dataFixture()
  await f.data.getSermons()
  await f.data.getAdminActivity()
  await f.data.getModerationComments()
  assert.doesNotMatch(f.requests[0].columns, /\*/)
  assert.match(f.requests[0].columns, /audio_url/)
  assert.doesNotMatch(f.requests[1].columns, /old_data|new_data/)
  assert.doesNotMatch(f.requests[2].columns, /comment_likes/)
})

async function pollingFixture() {
  const timers = new Map()
  const listeners = new Map()
  const calls = []
  const updates = []
  let nextId = 0
  const document = {
    hidden: false,
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name) => listeners.delete(name),
  }
  const context = createContext({
    document, AbortController: globalThis.AbortController,
    window: {
      setTimeout: (fn, delay) => { timers.set(++nextId, { fn, delay }); return nextId },
      clearTimeout: (id) => timers.delete(id),
    },
    fetch: (_url, options) => new Promise((resolve) => calls.push({ resolve, signal: options.signal })),
  })
  const module = new SourceTextModule(await readFile('src/lib/notification-polling.js', 'utf8'), { context })
  await module.link(() => { throw new Error('Unexpected import') })
  await module.evaluate()
  const stop = module.namespace.startNotificationPolling({ onData: (data) => updates.push(data), onSettled() {} })
  return {
    stop, calls, timers, updates, listeners,
    visible: (visible) => { document.hidden = !visible; listeners.get('visibilitychange')?.() },
    tick: () => { const [id, timer] = timers.entries().next().value; timers.delete(id); timer.fn() },
    respond: async (status = 200) => {
      calls.at(-1).resolve({ status, ok: status === 200, json: async () => ({ data: ['notification'] }) })
      // Drain the fetch/json/finally continuations without real delays.
      for (let i = 0; i < 10; i++) await Promise.resolve()
    },
  }
}

test('polling pauses while hidden, resumes, avoids overlap and cleans up', async () => {
  const f = await pollingFixture()
  assert.equal(f.calls.length, 1)
  f.visible(false)
  f.visible(true)
  assert.equal(f.calls.length, 1)
  await f.respond()
  assert.equal([...f.timers.values()][0].delay, 30000)
  f.visible(false)
  assert.equal(f.timers.size, 0)
  f.visible(true)
  assert.equal(f.calls.length, 2)
  f.stop()
  assert.equal(f.calls[1].signal.aborted, true)
  await f.respond()
  assert.equal(f.timers.size, 0)
  assert.equal(f.listeners.size, 0)
  assert.equal(f.updates.length, 1)
})

test('polling backs off on failures, retains data and stops after auth rejection', async () => {
  const f = await pollingFixture()
  await f.respond()
  f.tick()
  await f.respond(503)
  assert.equal([...f.timers.values()][0].delay, 60000)
  assert.equal(f.updates.length, 1)
  f.tick()
  await f.respond(503)
  assert.equal([...f.timers.values()][0].delay, 120000)
  f.tick()
  await f.respond()
  assert.equal([...f.timers.values()][0].delay, 30000)
  f.tick()
  await f.respond(401)
  assert.equal(f.timers.size, 0)
  const count = f.calls.length
  f.visible(false)
  f.visible(true)
  assert.equal(f.calls.length, count)
  f.stop()
})
