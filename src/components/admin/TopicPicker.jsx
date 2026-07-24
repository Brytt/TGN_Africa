'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

const levelMeta = {
  main: { label: 'Main topic', icon: 'folder' },
  subtopic: { label: 'Subtopic', icon: 'subdirectory_arrow_right' },
  subsection: { label: 'Subsection', icon: 'segment' },
}

export function flattenTopics(topics = []) {
  return topics.flatMap((topic) => [
    { value: topic.id || topic.title, label: topic.title, level: 'main', path: topic.title },
    ...topic.subtopics.flatMap((subtopic) => [
      { value: subtopic.id || subtopic.title, label: subtopic.title, level: 'subtopic', path: `${topic.title} / ${subtopic.title}` },
      ...subtopic.resources.map((resource) => ({
        value: resource.id || resource,
        label: resource.title || resource,
        level: 'subsection',
        path: `${topic.title} / ${subtopic.title} / ${resource.title || resource}`,
      })),
    ]),
  ])
}

export default function TopicPicker({ value, onChange, topics = [] }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef(null)
  const searchRef = useRef(null)
  const topicOptions = useMemo(() => flattenTopics(topics), [topics])
  const selected = topicOptions.find((item) => item.value === value)
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return topicOptions.filter((item) => !normalized || item.path.toLowerCase().includes(normalized)).slice(0, 80)
  }, [query, topicOptions])

  useEffect(() => {
    const close = (event) => {
      if (event.key === 'Escape') setOpen(false)
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
    }
  }, [])

  const choose = (item) => {
    onChange(item)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative mt-2">
      <button type="button" onClick={() => {
        setOpen((current) => !current)
        window.setTimeout(() => searchRef.current?.focus(), 0)
      }} className={`flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm hover:border-midnight-navy/30 focus:ring-2 focus:ring-midnight-navy/10 ${value ? 'text-slate-700' : 'text-slate-400'}`} aria-haspopup="listbox" aria-expanded={open}>
        <span className="truncate">{selected?.label || 'Search and select a topic'}</span>
        <span className={`material-symbols-outlined shrink-0 text-[18px] transition-transform ${open ? 'rotate-180' : ''}`}>expand_more</span>
      </button>
      <input className="pointer-events-none absolute h-px w-px opacity-0" tabIndex={-1} required value={value} onChange={() => {}} aria-hidden="true" />

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(520px,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
          <div className="relative m-1">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
            <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-midnight-navy/30 focus:ring-2 focus:ring-midnight-navy/10" placeholder="Search main topics, subtopics, or subsections..." />
          </div>
          <div className="admin-scroll mt-2 max-h-80 overflow-y-auto" role="listbox" aria-label="Topics">
            {results.map((item) => (
              <button key={item.path} type="button" onClick={() => choose(item)} className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-slate-50 ${value === item.value ? 'bg-midnight-navy/5' : ''}`} role="option" aria-selected={value === item.value}>
                <span className={`material-symbols-outlined mt-0.5 shrink-0 text-[18px] ${item.level === 'main' ? 'text-midnight-navy' : 'text-slate-400'}`}>{levelMeta[item.level].icon}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-slate-700">{item.label}</span>
                  <span className="mt-0.5 block truncate text-[10px] uppercase tracking-[0.08em] text-slate-400">{levelMeta[item.level].label} · {item.path}</span>
                </span>
                {value === item.value && <span className="material-symbols-outlined ml-auto text-[17px] text-midnight-navy">check</span>}
              </button>
            ))}
            {!results.length && <p className="px-4 py-8 text-center text-sm text-slate-400">No matching topic found.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
