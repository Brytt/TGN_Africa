'use client'

import { useEffect, useMemo, useState } from 'react'

const PAGE_SIZE = 6

function paginationItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
  const pages = new Set([1, total, current - 1, current, current + 1])
  return [...pages].filter((item) => item > 0 && item <= total).sort((a, b) => a - b).flatMap((item, index, values) => index && item - values[index - 1] > 1 ? ['…', item] : [item])
}

function Artwork({ sermon, priority = false }) {
  return <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-midnight-navy via-[#17385d] to-[#315d89]">
    {sermon.image ? <img src={sermon.image} alt="" loading={priority ? 'eager' : 'lazy'} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" /> : <span className="absolute inset-0 grid place-items-center"><span className="material-symbols-outlined text-7xl text-white/60">graphic_eq</span></span>}
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/5" />
  </div>
}

export default function SermonsPage({ sermons = [] }) {
  const [query, setQuery] = useState('')
  const [series, setSeries] = useState('All series')
  const [speaker, setSpeaker] = useState('All speakers')
  const [page, setPage] = useState(1)
  const seriesOptions = [...new Set(sermons.map((item) => item.series).filter(Boolean))].sort()
  const speakerOptions = [...new Set(sermons.map((item) => item.speaker).filter(Boolean))].sort()
  const featured = sermons[0]
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return sermons.slice(1).filter((item) => (!term || [item.title, item.speaker, item.scripture, item.series, item.description].some((value) => value?.toLowerCase().includes(term))) && (series === 'All series' || item.series === series) && (speaker === 'All speakers' || item.speaker === speaker))
  }, [query, series, sermons, speaker])
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const rest = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  useEffect(() => setPage(1), [query, series, speaker])

  const goToPage = (nextPage) => {
    setPage(nextPage)
    document.getElementById('sermon-archive')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return <main className="min-h-[70vh] bg-[#f7f7f6] py-12 font-sans text-charcoal-text md:py-16"><div className="page-shell">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-midnight-navy/45">The Gospel Network library</p><h1 className="tgn-display-heading mt-3 text-4xl text-midnight-navy md:text-5xl">Sermons</h1></div><p className="text-xs text-midnight-navy/40">{sermons.length} sermon{sermons.length === 1 ? '' : 's'}</p></div>

    {featured && <a href={`/sermons/${featured.slug}`} className="group mt-10 grid overflow-hidden rounded-[30px] border border-midnight-navy/[0.08] bg-white shadow-[0_18px_55px_rgba(13,34,64,0.09)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(13,34,64,0.14)] md:grid-cols-[1.2fr_0.8fr]"><div className="aspect-[16/10] min-h-[300px] overflow-hidden md:aspect-auto"><Artwork sermon={featured} priority /></div><div className="flex flex-col p-7 md:p-10"><div className="flex items-center justify-between"><p className="text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/45">Latest sermon · {featured.series || 'TGN Sermon'}</p><span className="grid size-11 place-items-center rounded-full bg-midnight-navy text-white shadow-[0_8px_22px_rgba(13,34,64,0.22)] transition-transform duration-300 group-hover:scale-105"><span className="material-symbols-outlined text-[21px]">{featured.videoUrl ? 'play_arrow' : 'headphones'}</span></span></div><h2 className="mt-8 text-3xl font-semibold leading-[1.08] tracking-[-0.025em] text-midnight-navy md:text-4xl">{featured.title}</h2><p className="mt-4 text-sm font-semibold text-midnight-navy/70">{featured.speaker}</p>{featured.description && <p className="mt-6 line-clamp-4 text-sm leading-6 text-midnight-navy/55">{featured.description}</p>}<div className="mt-auto flex items-center justify-between gap-4 border-t border-midnight-navy/[0.08] pt-6"><p className="text-[10px] text-midnight-navy/45">{featured.scripture || 'Scripture not listed'} · {featured.date}</p><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-midnight-navy">{featured.videoUrl ? 'Watch' : 'Listen'} →</span></div></div></a>}

    <section className="mt-8 grid gap-3 border-y border-black/10 py-4 md:grid-cols-[1fr_200px_200px]" aria-label="Filter sermons"><label className="relative"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[19px] text-black/30">search</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full border-0 bg-white py-3 pl-10 pr-4 text-sm text-black outline-none ring-black/10 focus:ring-1" placeholder="Search sermons or Scripture" /></label><select value={series} onChange={(event) => setSeries(event.target.value)} className="border-0 bg-white px-4 py-3 text-sm text-black outline-none"><option>All series</option>{seriesOptions.map((item) => <option key={item}>{item}</option>)}</select><select value={speaker} onChange={(event) => setSpeaker(event.target.value)} className="border-0 bg-white px-4 py-3 text-sm text-black outline-none"><option>All speakers</option>{speakerOptions.map((item) => <option key={item}>{item}</option>)}</select></section>

    <div id="sermon-archive" className="scroll-mt-28">{rest.length ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{rest.map((sermon) => <a key={sermon.id} href={`/sermons/${sermon.slug}`} className="group flex min-h-[390px] flex-col overflow-hidden rounded-[24px] border border-midnight-navy/[0.08] bg-white shadow-[0_7px_25px_rgba(13,34,64,0.045)] transition-all duration-300 hover:-translate-y-1.5 hover:border-midnight-navy/15 hover:shadow-[0_20px_48px_rgba(13,34,64,0.12)]"><div className="relative aspect-[16/9] overflow-hidden"><Artwork sermon={sermon} /><span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-[10px] font-bold text-midnight-navy shadow-lg backdrop-blur"><span className="material-symbols-outlined text-[17px]">{sermon.videoUrl ? 'play_arrow' : 'headphones'}</span>{sermon.videoUrl ? 'Watch' : 'Listen'}</span></div><div className="flex grow flex-col p-5"><p className="text-[9px] font-bold uppercase tracking-[0.13em] text-midnight-navy/40">{sermon.series || 'TGN Sermon'}</p><h2 className="mt-4 line-clamp-3 text-[18px] font-semibold leading-[1.3] tracking-[-0.015em] text-midnight-navy">{sermon.title}</h2><p className="mt-3 text-xs font-semibold text-midnight-navy/60">{sermon.speaker}</p><div className="mt-auto flex items-end justify-between gap-3 border-t border-midnight-navy/[0.07] pt-5 text-[10px] leading-4 text-midnight-navy/40"><span>{sermon.scripture || 'Scripture not listed'}</span><span className="shrink-0">{sermon.date}</span></div></div></a>)}</div> : <div className="mt-8 rounded-[24px] border border-midnight-navy/10 bg-white px-6 py-16 text-center text-sm text-midnight-navy/45">No sermons match your search or filters.</div>}</div>

    {pageCount > 1 && <nav className="mt-11 flex flex-wrap items-center justify-center gap-2" aria-label="Sermon pages"><button type="button" disabled={safePage === 1} onClick={() => goToPage(safePage - 1)} className="mr-2 rounded-full border border-midnight-navy/15 bg-white px-4 py-2.5 text-xs font-semibold text-midnight-navy transition hover:bg-midnight-navy/5 disabled:opacity-30">← Previous</button>{paginationItems(safePage, pageCount).map((item, index) => item === '…' ? <span key={`ellipsis-${index}`} className="px-1 text-midnight-navy/30">…</span> : <button key={item} type="button" onClick={() => goToPage(item)} className={`grid h-10 min-w-10 place-items-center rounded-full px-2 text-xs transition ${item === safePage ? 'bg-midnight-navy font-semibold text-white shadow-lg' : 'bg-white text-midnight-navy hover:bg-midnight-navy/5'}`} aria-current={item === safePage ? 'page' : undefined}>{item}</button>)}<button type="button" disabled={safePage === pageCount} onClick={() => goToPage(safePage + 1)} className="ml-2 rounded-full border border-midnight-navy/15 bg-white px-4 py-2.5 text-xs font-semibold text-midnight-navy transition hover:bg-midnight-navy/5 disabled:opacity-30">Next →</button></nav>}
  </div></main>
}
