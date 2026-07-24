'use client'

import { useMemo, useState } from 'react'
import Reveal from './Reveal'

export default function LatestPublications({ publications = [] }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const filters = ['All', ...new Set(publications.map((item) => item.type))]
  const displayed = useMemo(() => (activeFilter === 'All' ? publications : publications.filter((item) => item.type === activeFilter)).slice(0, 6), [activeFilter, publications])

  return (
    <section id="latest" className="bg-white py-16 font-sans md:py-24">
      <div className="page-shell">
        <div className="mb-10 md:flex md:items-end md:justify-between"><div><span className="text-[9px] font-bold uppercase tracking-[0.16em] text-midnight-navy/45">From the editors</span><h2 className="mt-3 text-4xl font-semibold tracking-[-0.025em] text-midnight-navy md:text-5xl">Latest Publications</h2></div><a href="/articles" className="mt-5 inline-flex border border-midnight-navy bg-midnight-navy px-6 py-3 text-[10px] font-bold uppercase tracking-[0.17em] text-white md:mt-0">Explore more →</a></div>
        <div className="mb-8 flex flex-wrap gap-5 border-y border-midnight-navy/10 py-4">{filters.map((filter) => <button key={filter} onClick={() => setActiveFilter(filter)} className={`text-[10px] font-bold uppercase tracking-[0.14em] ${activeFilter === filter ? 'text-midnight-navy' : 'text-midnight-navy/40'}`}>{filter}</button>)}</div>
        {!displayed.length ? <p className="border border-midnight-navy/10 bg-surface-container-low py-16 text-center text-sm text-midnight-navy/50">No publications have been published yet.</p> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{displayed.map((publication, index) => <Reveal key={publication.id} delay={index * 0.04}><a href={`/articles/${publication.slug}`} className="group flex h-full flex-col border border-midnight-navy/10 bg-white"><img src={publication.image} alt="" className="aspect-[16/9] w-full object-cover" /><div className="flex grow flex-col p-5"><span className="text-[8px] font-bold uppercase tracking-[0.14em] text-midnight-navy/45">{publication.type} · {publication.readingTime}</span><h3 className="mt-4 text-lg font-semibold leading-tight text-midnight-navy">{publication.title}</h3><p className="mt-3 text-xs leading-5 text-charcoal-text/60">{publication.excerpt}</p><p className="mt-auto pt-6 text-[11px] text-midnight-navy/60">{publication.author}</p></div></a></Reveal>)}</div>}
      </div>
    </section>
  )
}
