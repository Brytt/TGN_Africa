'use client'

import { useMemo, useState } from 'react'
import AnnouncementBar from '../components/AnnouncementBar'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

export default function TopicPage({ topics = [], topic = null, publications = [] }) {
  const [query, setQuery] = useState('')
  const visibleSubtopics = useMemo(() => {
    if (!topic) return []
    const normalized = query.trim().toLowerCase()
    if (!normalized) return topic.subtopics
    return topic.subtopics.filter((subtopic) => subtopic.title.toLowerCase().includes(normalized))
  }, [query, topic])

  return (
    <div className="min-h-screen bg-white text-charcoal-text">
      <AnnouncementBar /><Navbar />
      {!topic ? (
        <main>
          <section className="border-b border-midnight-navy/10 bg-surface-container-low py-14 md:py-20"><div className="page-shell max-w-5xl"><span className="eyebrow text-midnight-navy/45">Topic Bank</span><h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.98] text-midnight-navy md:text-7xl">Explore truth by topic.</h1><p className="mt-6 max-w-2xl font-sans text-base leading-7 text-midnight-navy/60">Browse the complete biblical, theological, pastoral, and cultural library.</p></div></section>
          <section className="py-14 md:py-20"><div className="page-shell grid gap-px overflow-hidden border border-midnight-navy/10 bg-midnight-navy/10 md:grid-cols-2">{topics.map((item, index) => <a key={item.id} href={`/topics/${item.slug}`} className="group flex min-h-52 flex-col justify-between bg-white p-7 hover:bg-surface-container-low md:p-9"><span className="text-[10px] font-bold tracking-[0.18em] text-midnight-navy/35">{String(index + 1).padStart(2, '0')}</span><div><h2 className="font-display text-2xl leading-tight text-midnight-navy md:text-3xl">{item.title}</h2><p className="mt-3 text-xs uppercase tracking-[0.12em] text-midnight-navy/45">{item.subtopics.length} subtopics</p></div></a>)}</div></section>
        </main>
      ) : (
        <main>
          <section className="border-b border-midnight-navy/10 bg-surface-container-low py-12 md:py-20"><div className="page-shell"><a href="/topics" className="text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy/50">← All topics</a><h1 className="mt-8 max-w-4xl font-display text-4xl text-midnight-navy md:text-6xl">{topic.title}</h1><p className="mt-5 text-sm text-midnight-navy/55">{topic.subtopics.length} subtopics</p></div></section>
          <section className="py-12 md:py-16"><div className="page-shell grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]"><aside><label className="relative block"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-midnight-navy/35">search</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full border border-midnight-navy/15 py-3 pl-10 pr-3 text-sm outline-none" placeholder="Search subtopics" /></label></aside><div className="grid gap-3 md:grid-cols-2">{visibleSubtopics.map((subtopic) => <a key={subtopic.id} href={`/topics/${subtopic.slug}`} className="group flex min-h-28 items-center justify-between gap-5 border border-midnight-navy/10 bg-white p-5 transition-colors hover:bg-surface-container-low"><h2 className="font-display text-2xl leading-tight text-midnight-navy">{subtopic.title}</h2><span className="shrink-0 text-heritage-gold transition-transform group-hover:translate-x-1">→</span></a>)}</div></div></section>
          {publications.length > 0 && <section className="bg-surface-container-low py-14"><div className="page-shell"><h2 className="font-display text-3xl text-midnight-navy">Published in this topic</h2>
            <div className="mt-7 grid gap-5 lg:grid-cols-2">{publications.slice(0, 2).map((item) => <a key={item.id} href={`/articles/${item.slug}`} className={`group grid overflow-hidden border border-black/10 bg-white ${item.image ? 'sm:grid-cols-[1.1fr_0.9fr]' : ''}`}>{item.image && <img src={item.image} alt="" className="h-full min-h-[240px] w-full object-cover" />}<div className="flex flex-col p-5"><p className="text-[9px] font-semibold uppercase tracking-wide text-black/40">{item.type}</p><h3 className="mt-6 text-xl font-semibold leading-tight text-black">{item.title}</h3><p className="mt-3 line-clamp-3 text-xs leading-5 text-black/55">{item.excerpt}</p><p className="mt-auto pt-6 text-[10px] text-black/45">{item.author} · {item.date}</p></div></a>)}</div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{publications.slice(2).map((item) => <a key={item.id} href={`/articles/${item.slug}`} className="border border-black/10 bg-white">{item.image && <img src={item.image} alt="" className="aspect-[16/9] w-full object-cover" />}<div className="p-4"><p className="text-[9px] uppercase tracking-wide text-black/40">{item.type}</p><h3 className="mt-3 text-sm font-semibold leading-5 text-black">{item.title}</h3><p className="mt-4 text-[10px] text-black/45">{item.author}</p></div></a>)}</div>
          </div></section>}
        </main>
      )}
      <Footer />
    </div>
  )
}
