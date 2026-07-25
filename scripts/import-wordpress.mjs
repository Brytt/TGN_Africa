import process from 'node:process'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { basename, extname } from 'node:path'
import sanitizeHtml from 'sanitize-html'
import { createClient } from '@supabase/supabase-js'

/* global console, fetch, setTimeout, URL */

process.loadEnvFile?.('.env.local')

const WORDPRESS_ORIGIN = 'https://tgnghana.org'
const DEFAULT_XML = '/Users/odamebrightk/Downloads/tgn.WordPress.2026-07-25-2.xml'
const args = process.argv.slice(2)
const apply = args.includes('--apply')
const xmlFlag = args.indexOf('--xml')
const xmlPath = xmlFlag >= 0 ? args[xmlFlag + 1] : DEFAULT_XML
const TITLE_OVERRIDES = new Map([
  [2711, 'The Error of Antinomianism'],
  [2410, 'Five Truths About the Resurrection'],
])
const TOPIC_OVERRIDES = new Map([
  [7165, 'Growing in Love'],
  [7069, 'The Love of God'],
  [7065, 'The Love of God'],
  [7023, 'Poetry'],
  [6991, 'Poetry'],
  [6981, 'Poetry'],
  [6976, 'Poetry'],
  [6960, 'Poetry'],
  [6956, 'Poetry'],
  [6920, 'Poetry'],
  [6904, 'Poetry'],
  [6859, 'Poetry'],
  [6843, 'The Being and Attributes of God'],
  [6819, 'Joy in the Lord'],
  [5670, 'The Being and Attributes of God'],
  [2711, 'Antinomianism and the Gospel'],
  [2410, 'The Resurrection of Christ'],
  [1479, 'Humanity, Sin, and Salvation'],
  [1004, 'Total Depravity Explained'],
])

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY are required.')
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const slugify = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

const plainText = (html) => sanitizeHtml(String(html || ''), {
  allowedTags: [],
  allowedAttributes: {},
}).replace(/\s+/g, ' ').trim()

const cleanBody = (html) => sanitizeHtml(String(html || ''), {
  allowedTags: [
    'p', 'br', 'h2', 'h3', 'h4', 'h5', 'strong', 'b', 'em', 'i', 'u',
    'blockquote', 'ul', 'ol', 'li', 'a', 'figure', 'figcaption', 'img',
    'hr', 'sup', 'sub', 'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    figure: ['class'],
    figcaption: ['class'],
    p: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
    img: sanitizeHtml.simpleTransform('img', { loading: 'lazy' }, true),
  },
})

async function requestJson(url, attempts = 3) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'TGN-Africa-Migration/1.0' } })
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
      return { data: await response.json(), headers: response.headers }
    } catch (error) {
      lastError = error
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 500))
    }
  }
  throw new Error(`WordPress request failed for ${url}: ${lastError?.message}`)
}

async function getCollection(restBase, query = '') {
  const firstUrl = `${WORDPRESS_ORIGIN}/wp-json/wp/v2/${restBase}?per_page=100&page=1${query}`
  const first = await requestJson(firstUrl)
  const totalPages = Number(first.headers.get('x-wp-totalpages') || 1)
  const rows = [...first.data]
  for (let page = 2; page <= totalPages; page += 1) {
    const result = await requestJson(`${WORDPRESS_ORIGIN}/wp-json/wp/v2/${restBase}?per_page=100&page=${page}${query}`)
    rows.push(...result.data)
  }
  return rows
}

function parseXmlAuthors(xml) {
  const authors = new Map()
  for (const match of xml.matchAll(/<wp:author>([\s\S]*?)<\/wp:author>/g)) {
    const block = match[1]
    const value = (tag) => {
      const found = block.match(new RegExp(`<wp:${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/wp:${tag}>`))
      return found?.[1]?.trim() || ''
    }
    authors.set(Number(value('author_id')), {
      email: value('author_email').toLowerCase(),
      name: value('author_display_name'),
    })
  }
  return authors
}

function topicMatcher(topics) {
  const prepared = topics.map((topic) => ({
    ...topic,
    normalizedTitle: slugify(topic.title),
    leafSlug: String(topic.slug).split('--').at(-1),
    levelWeight: topic.level === 'subsection' ? 3 : topic.level === 'subtopic' ? 2 : 1,
  }))
  return (categories, tags) => {
    const terms = [...categories, ...tags]
    const scored = prepared.map((topic) => {
      let score = 0
      for (const term of terms) {
        const termSlug = slugify(term.slug || term.name)
        const exact = termSlug === topic.normalizedTitle || termSlug === topic.leafSlug
        const partial = termSlug.length >= 4 && (
          topic.normalizedTitle.includes(termSlug) || termSlug.includes(topic.normalizedTitle)
        )
        score = Math.max(score, exact ? 100 + topic.levelWeight : partial ? 40 + topic.levelWeight : 0)
      }
      return { id: topic.id, title: topic.title, score }
    }).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    return scored[0]?.score > 0 ? scored[0] : null
  }
}

function publicationType(categories) {
  const slugs = new Set(categories.map((category) => slugify(category.slug || category.name)))
  if (slugs.has('poems') || slugs.has('poem')) return 'Poem'
  if (slugs.has('devotional') || slugs.has('devotionals')) return 'Devotional'
  if (slugs.has('bible-study')) return 'Bible Study'
  return 'Article'
}

function extensionFor(url, contentType) {
  const sourceExtension = extname(new URL(url).pathname).toLowerCase()
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(sourceExtension)) return sourceExtension
  return {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  }[contentType] || '.jpg'
}

async function runConcurrent(items, limit, worker) {
  const results = new Array(items.length)
  let cursor = 0
  async function next() {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await worker(items[index], index)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next))
  return results
}

async function main() {
  const xml = await readFile(xmlPath, 'utf8')
  const xmlAuthors = parseXmlAuthors(xml)
  const [posts, wordpressUsers, topicsResult, existingPublications, existingAuthors] = await Promise.all([
    getCollection('posts', '&status=publish&_embed=1'),
    getCollection('users', '&_fields=id,name,slug,avatar_urls'),
    supabase.from('topics').select('id,title,slug,level'),
    supabase.from('publications').select('id,legacy_id,slug,title'),
    supabase.from('authors').select('id,profile_id,email,slug,name'),
  ])
  for (const result of [topicsResult, existingPublications, existingAuthors]) {
    if (result.error) throw result.error
  }
  if (posts.length !== 250) throw new Error(`Expected 250 published WordPress posts, received ${posts.length}.`)

  const usedAuthorIds = new Set(posts.map((post) => post.author))
  const authorRows = wordpressUsers
    .filter((user) => usedAuthorIds.has(user.id))
    .map((user) => {
      const privateAuthor = xmlAuthors.get(user.id)
      if (!privateAuthor?.email) throw new Error(`Missing email for WordPress author ${user.id} (${user.name}).`)
      return {
        slug: `${slugify(user.name)}-wp-${user.id}`,
        name: plainText(user.name),
        email: privateAuthor.email,
        editorial_role: 'Author',
        avatar_path: user.avatar_urls?.['96'] || null,
        status: 'active',
      }
    })

  const chooseTopic = topicMatcher(topicsResult.data || [])
  const topicsByTitle = new Map((topicsResult.data || []).map((topic) => [topic.title, topic]))
  const mediaUrls = new Set()
  const postParts = posts.map((post) => {
    const termGroups = post._embedded?.['wp:term'] || []
    const categories = termGroups.flat().filter((term) => term.taxonomy === 'category')
    const tags = termGroups.flat().filter((term) => term.taxonomy === 'post_tag')
    const featuredUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null
    if (featuredUrl) mediaUrls.add(featuredUrl)
    for (const match of String(post.content?.rendered || '').matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
      if (match[1].startsWith('http')) mediaUrls.add(match[1])
    }
    const matchedTopic = chooseTopic(categories, tags)
    const override = topicsByTitle.get(TOPIC_OVERRIDES.get(post.id))
    const topic = matchedTopic || (override ? { id: override.id, title: override.title, score: 200 } : null)
    return { post, categories, tags, featuredUrl, topic }
  })

  const mediaMap = new Map()
  const mediaFailures = []
  if (apply) {
    console.log(`Copying ${mediaUrls.size} referenced WordPress images to Supabase Storage…`)
    await runConcurrent([...mediaUrls], 4, async (url, index) => {
      try {
        const response = await fetch(url, { headers: { 'User-Agent': 'TGN-Africa-Migration/1.0' } })
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
        const contentType = response.headers.get('content-type')?.split(';')[0] || 'image/jpeg'
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(contentType)) {
          throw new Error(`unsupported content type ${contentType}`)
        }
        const buffer = await response.arrayBuffer()
        if (buffer.byteLength > 10 * 1024 * 1024) throw new Error('file exceeds 10 MB')
        const hash = createHash('sha256').update(url).digest('hex').slice(0, 20)
        const safeName = slugify(basename(new URL(url).pathname, extname(new URL(url).pathname))).slice(0, 70) || 'image'
        const path = `wordpress/${hash}-${safeName}${extensionFor(url, contentType)}`
        const upload = await supabase.storage.from('publication-media').upload(path, buffer, {
          contentType,
          upsert: true,
          cacheControl: '31536000',
        })
        if (upload.error) throw upload.error
        const publicUrl = supabase.storage.from('publication-media').getPublicUrl(path).data.publicUrl
        mediaMap.set(url, publicUrl)
        if ((index + 1) % 25 === 0) console.log(`Copied ${index + 1}/${mediaUrls.size} images`)
      } catch (error) {
        mediaFailures.push({ url, error: error.message })
        mediaMap.set(url, url)
      }
    })
  }

  const authorEmailByWpId = new Map(authorRows.map((author) => {
    const wpId = Number(author.slug.split('-wp-').at(-1))
    return [wpId, author.email]
  }))

  const preview = {
    posts: posts.length,
    authors: authorRows.length,
    referencedImages: mediaUrls.size,
    matchedTopics: postParts.filter((item) => item.topic).length,
    unmatchedTopics: postParts.filter((item) => !item.topic).length,
    publicationTypes: Object.groupBy(postParts, (item) => publicationType(item.categories)),
    replacePublications: existingPublications.data?.length || 0,
    removableSyntheticAuthors: (existingAuthors.data || []).filter((author) => !author.profile_id && !authorRows.some((row) => row.email === author.email)).length,
  }
  const unmatched = postParts
    .filter((item) => !item.topic)
    .map((item) => ({
      id: item.post.id,
      title: TITLE_OVERRIDES.get(item.post.id) || plainText(item.post.title?.rendered),
      categories: item.categories.map((category) => category.name),
      tags: item.tags.map((tag) => tag.name),
    }))
  for (const [key, rows] of Object.entries(preview.publicationTypes)) preview.publicationTypes[key] = rows.length
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', ...preview, unmatched }, null, 2))
  if (!apply) {
    console.log('Dry run complete. Re-run with --apply to write to Supabase.')
    return
  }

  const authorUpsert = await supabase.from('authors').upsert(authorRows, { onConflict: 'email' }).select('id,email')
  if (authorUpsert.error) throw authorUpsert.error
  const authorIds = new Map(authorUpsert.data.map((author) => [author.email, author.id]))

  const publicationRows = postParts.map(({ post, categories, tags, featuredUrl, topic }) => {
    let body = String(post.content?.rendered || '')
    for (const [source, target] of mediaMap) body = body.replaceAll(source, target)
    const text = plainText(body)
    return {
      legacy_id: `wordpress:${post.id}`,
      slug: post.slug,
      title: TITLE_OVERRIDES.get(post.id) || plainText(post.title?.rendered),
      subtitle: null,
      excerpt: plainText(post.excerpt?.rendered),
      body: cleanBody(body),
      body_format: 'html',
      publication_type: publicationType(categories),
      author_id: authorIds.get(authorEmailByWpId.get(post.author)),
      topic_id: topic?.id || null,
      cover_path: featuredUrl ? mediaMap.get(featuredUrl) || featuredUrl : null,
      status: 'published',
      reading_time_minutes: Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 220)),
      seo_title: TITLE_OVERRIDES.get(post.id) || plainText(post.title?.rendered),
      seo_description: plainText(post.excerpt?.rendered).slice(0, 320),
      published_at: new Date(`${post.date_gmt || post.date}Z`).toISOString(),
      created_at: new Date(`${post.date_gmt || post.date}Z`).toISOString(),
      updated_at: new Date(`${post.modified_gmt || post.modified}Z`).toISOString(),
      import_metadata: {
        source: 'wordpress',
        wordpress_id: post.id,
        wordpress_url: post.link,
        wordpress_author_id: post.author,
        categories: categories.map(({ id, name, slug }) => ({ id, name, slug })),
        tags: tags.map(({ id, name, slug }) => ({ id, name, slug })),
        selected_topic: topic ? { id: topic.id, title: topic.title, score: topic.score } : null,
      },
    }
  })
  if (publicationRows.some((row) => !row.author_id)) throw new Error('One or more posts could not be mapped to an imported author.')

  for (let offset = 0; offset < publicationRows.length; offset += 50) {
    const batch = publicationRows.slice(offset, offset + 50)
    const result = await supabase.from('publications').upsert(batch, { onConflict: 'legacy_id' })
    if (result.error) throw new Error(`Publication batch ${offset / 50 + 1}: ${result.error.message}`)
  }

  const imported = await supabase
    .from('publications')
    .select('id', { count: 'exact', head: true })
    .like('legacy_id', 'wordpress:%')
  if (imported.error || imported.count !== posts.length) {
    throw new Error(`Verification failed: expected ${posts.length} imported posts, found ${imported.count ?? 'unknown'}.`)
  }

  const removeStarterPublications = await supabase.from('publications').delete().not('legacy_id', 'like', 'wordpress:%')
  if (removeStarterPublications.error) throw removeStarterPublications.error

  const importedEmails = authorRows.map((author) => author.email)
  const removableAuthorIds = (existingAuthors.data || [])
    .filter((author) => !author.profile_id && !importedEmails.includes(author.email))
    .map((author) => author.id)
  if (removableAuthorIds.length) {
    const removeAuthors = await supabase.from('authors').delete().in('id', removableAuthorIds)
    if (removeAuthors.error) throw removeAuthors.error
  }

  console.log(JSON.stringify({
    success: true,
    importedPublications: imported.count,
    importedAuthors: authorRows.length,
    copiedImages: mediaMap.size - mediaFailures.length,
    mediaFailures,
    removedStarterPublications: preview.replacePublications,
    removedSyntheticAuthors: removableAuthorIds.length,
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
