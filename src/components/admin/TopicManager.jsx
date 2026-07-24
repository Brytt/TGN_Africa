'use client'

import { useMemo, useState } from 'react'
import AdminSelect from './AdminSelect'

export default function TopicManager({ initialTopics = [] }) {
  const [topics, setTopics] = useState(initialTopics)
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState([])
  const [expandedSubs, setExpandedSubs] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [level, setLevel] = useState('main')
  const [mainTopic, setMainTopic] = useState('')
  const [subtopic, setSubtopic] = useState('')
  const [name, setName] = useState('')
  const [notice, setNotice] = useState('')

  const matchingTopics = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return topics
    return topics.filter((topic) =>
      topic.title.toLowerCase().includes(normalized) ||
      topic.subtopics.some((sub) => sub.title.toLowerCase().includes(normalized) || sub.resources.some((item) => item.title.toLowerCase().includes(normalized))),
    )
  }, [query, topics])

  const selectedMain = topics.find((topic) => topic.title === mainTopic)
  const resetForm = () => {
    setLevel('main')
    setMainTopic('')
    setSubtopic('')
    setName('')
    setFormOpen(false)
  }

  const addTopic = async (event) => {
    event.preventDefault()
    const title = name.trim()
    if (!title) return
    const parentId = level === 'subtopic'
      ? topics.find((topic) => topic.title === mainTopic)?.id
      : level === 'subsection'
        ? selectedMain?.subtopics.find((item) => item.title === subtopic)?.id
        : null
    const response = await fetch('/api/admin/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, level, parentId }),
    })
    const result = await response.json()
    if (!response.ok) {
      setNotice(result.error || 'Unable to add topic.')
      return
    }
    if (level === 'main') {
      setTopics((current) => [...current, { id: result.data.id, title, slug: result.data.slug, subtopics: [] }])
    } else if (level === 'subtopic') {
      setTopics((current) => current.map((topic) => topic.title === mainTopic
        ? { ...topic, subtopics: [...topic.subtopics, { id: result.data.id, title, slug: result.data.slug, resources: [] }] }
        : topic))
      setExpanded((current) => [...new Set([...current, mainTopic])])
    } else {
      setTopics((current) => current.map((topic) => topic.title === mainTopic
        ? { ...topic, subtopics: topic.subtopics.map((sub) => sub.title === subtopic ? { ...sub, resources: [...sub.resources, { id: result.data.id, title, slug: result.data.slug }] } : sub) }
        : topic))
      setExpanded((current) => [...new Set([...current, mainTopic])])
      setExpandedSubs((current) => [...new Set([...current, `${mainTopic}/${subtopic}`])])
    }
    setNotice(`${title} added as a ${level === 'main' ? 'main topic' : level}.`)
    window.setTimeout(() => setNotice(''), 3000)
    resetForm()
  }

  return (
    <main className="admin-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-6 xl:px-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-midnight-navy">Topic bank</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Topics and hierarchy</h2>
            <p className="mt-1 text-sm text-slate-500">Manage main topics, subtopics, and subsections from the editorial topic bank.</p>
          </div>
          <button type="button" onClick={() => setFormOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-midnight-navy px-5 py-3 text-sm font-medium text-white hover:opacity-90">
            <span className="material-symbols-outlined text-[19px]">add</span>Add topic
          </button>
        </div>

        {notice && <div role="status" className="mb-5 rounded-2xl bg-midnight-navy/5 px-4 py-3 text-sm text-midnight-navy">{notice}</div>}

        {formOpen && (
          <form onSubmit={addTopic} className="mb-6 rounded-3xl border border-midnight-navy/10 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-midnight-navy">Add to the topic hierarchy</h3>
                <p className="mt-1 text-xs text-slate-400">Choose where this new entry belongs.</p>
              </div>
              <button type="button" onClick={resetForm} className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-50" aria-label="Close add topic form"><span className="material-symbols-outlined text-[19px]">close</span></button>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500">Level</p>
                <AdminSelect variant="field" label="Topic level" value={level} onChange={(value) => { setLevel(value); setMainTopic(''); setSubtopic('') }} options={[
                  { value: 'main', label: 'Main topic' },
                  { value: 'subtopic', label: 'Subtopic' },
                  { value: 'subsection', label: 'Subsection' },
                ]} />
              </div>
              {level !== 'main' && (
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-500">Main topic</p>
                  <AdminSelect variant="field" label="Parent main topic" value={mainTopic} onChange={(value) => { setMainTopic(value); setSubtopic('') }} options={topics.map((topic) => topic.title)} placeholder="Select main topic" />
                </div>
              )}
              {level === 'subsection' && (
                <div>
                  <p className="mb-2 text-xs font-semibold text-slate-500">Subtopic</p>
                  <AdminSelect variant="field" label="Parent subtopic" value={subtopic} onChange={setSubtopic} options={(selectedMain?.subtopics || []).map((item) => item.title)} placeholder="Select subtopic" />
                </div>
              )}
              <label className="text-xs font-semibold text-slate-500">
                Name
                <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal text-slate-900 outline-none focus:border-midnight-navy/30 focus:ring-2 focus:ring-midnight-navy/10" placeholder={`Enter ${level === 'main' ? 'main topic' : level} name`} />
              </label>
            </div>
            <div className="mt-5 flex justify-end">
              <button type="submit" disabled={(level !== 'main' && !mainTopic) || (level === 'subsection' && !subtopic)} className="rounded-full bg-midnight-navy px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40">Add to topic bank</button>
            </div>
          </form>
        )}

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <label className="relative block">
            <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[19px] text-slate-400">search</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-full border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-midnight-navy/30 focus:ring-2 focus:ring-midnight-navy/10" placeholder="Search the complete topic hierarchy..." />
          </label>
          <div className="mt-6 space-y-3">
            {matchingTopics.map((topic) => {
              const topicOpen = expanded.includes(topic.title) || Boolean(query)
              return (
                <article key={topic.slug} className="overflow-hidden rounded-2xl border border-slate-100">
                  <button type="button" onClick={() => setExpanded((current) => current.includes(topic.title) ? current.filter((item) => item !== topic.title) : [...current, topic.title])} className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-slate-50">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-midnight-navy text-white"><span className="material-symbols-outlined text-[19px]">folder</span></span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-midnight-navy">{topic.title}</span>
                      <span className="block text-xs text-slate-400">{topic.subtopics.length} subtopics · {topic.subtopics.reduce((sum, item) => sum + item.resources.length, 0)} subsections</span>
                    </span>
                    <span className={`material-symbols-outlined text-slate-400 transition-transform ${topicOpen ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>
                  {topicOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/40 px-4 py-3 sm:pl-16">
                      {topic.subtopics.map((sub) => {
                        const key = `${topic.title}/${sub.title}`
                        const subOpen = expandedSubs.includes(key) || Boolean(query)
                        return (
                          <div key={sub.slug} className="border-b border-slate-100 last:border-0">
                            <button type="button" onClick={() => setExpandedSubs((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])} className="flex w-full items-center gap-3 py-3 text-left">
                              <span className="material-symbols-outlined text-[18px] text-slate-400">subdirectory_arrow_right</span>
                              <span className="flex-1 text-sm font-medium text-slate-700">{sub.title}</span>
                              <span className="text-xs text-slate-400">{sub.resources.length}</span>
                              <span className={`material-symbols-outlined text-[17px] text-slate-400 transition-transform ${subOpen ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>
                            {subOpen && <ul className="mb-3 ml-8 grid gap-1 border-l border-slate-200 pl-4 md:grid-cols-2">
                              {sub.resources.map((item) => <li key={item.id} className="rounded-lg px-3 py-2 text-xs leading-5 text-slate-500 hover:bg-white">{item.title}</li>)}
                            </ul>}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
