'use client'

import { useMemo, useState } from 'react'

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
  const seriesOptions = [...new Set(sermons.map((item) => item.series).filter(Boolean))].sort()
  const speakerOptions = [...new Set(sermons.map((item) => item.speaker).filter(Boolean))].sort()
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return sermons.filter((item) => (!term || [item.title, item.speaker, item.scripture, item.series, item.description].some((value) => value?.toLowerCase().includes(term))) && (series === 'All series' || item.series === series) && (speaker === 'All speakers' || item.speaker === speaker))
  }, [query, series, sermons, speaker])
  const featured = visible[0]
  const rest = visible.slice(1)

  return <main className="min-h-[70vh] bg-[#f7f7f6] py-12 font-sans text-charcoal-text md:py-16"><div className="page-shell">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40">The Gospel Network library</p><h1 className="tgn-display-heading mt-3 text-4xl text-black md:text-5xl">Sermons</h1></div><p className="text-xs text-black/40">{visible.length} sermon{visible.length === 1 ? '' : 's'}</p></div>

    {featured && <a href={`/sermons/${featured.slug}`} className="group mt-10 grid overflow-hidden border border-black/10 bg-white md:grid-cols-[1.2fr_0.8fr]"><div className="aspect-[16/10] min-h-[280px] md:aspect-auto"><Artwork sermon={featured} priority /></div><div className="flex flex-col p-6 md:p-8"><div className="flex items-center justify-between"><p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-black/40">{featured.series || 'Featured sermon'}</p><span className="grid size-10 place-items-center rounded-full bg-midnight-navy text-white"><span className="material-symbols-outlined text-[20px]">{featured.videoUrl ? 'play_arrow' : 'headphones'}</span></span></div><h2 className="mt-8 text-2xl font-semibold leading-tight text-black md:text-3xl">{featured.title}</h2><p className="mt-3 text-sm font-medium text-black/65">{featured.speaker}</p>{featured.description && <p className="mt-5 line-clamp-4 text-xs leading-6 text-black/55">{featured.description}</p>}<p className="mt-auto pt-8 text-[10px] text-black/50">{featured.scripture || 'Scripture not listed'} · {featured.date}</p></div></a>}

    <section className="mt-8 grid gap-3 border-y border-black/10 py-4 md:grid-cols-[1fr_200px_200px]" aria-label="Filter sermons"><label className="relative"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[19px] text-black/30">search</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full border-0 bg-white py-3 pl-10 pr-4 text-sm text-black outline-none ring-black/10 focus:ring-1" placeholder="Search sermons or Scripture" /></label><select value={series} onChange={(event) => setSeries(event.target.value)} className="border-0 bg-white px-4 py-3 text-sm text-black outline-none"><option>All series</option>{seriesOptions.map((item) => <option key={item}>{item}</option>)}</select><select value={speaker} onChange={(event) => setSpeaker(event.target.value)} className="border-0 bg-white px-4 py-3 text-sm text-black outline-none"><option>All speakers</option>{speakerOptions.map((item) => <option key={item}>{item}</option>)}</select></section>

    {rest.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{rest.map((sermon) => <a key={sermon.id} href={`/sermons/${sermon.slug}`} className="group flex min-h-[350px] flex-col border border-black/10 bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"><div className="relative aspect-[16/9] overflow-hidden"><Artwork sermon={sermon} /><span className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-full bg-white text-midnight-navy shadow-md"><span className="material-symbols-outlined text-[18px]">{sermon.videoUrl ? 'play_arrow' : 'headphones'}</span></span></div><div className="flex grow flex-col p-4"><p className="text-[9px] font-semibold uppercase tracking-wide text-black/40">{sermon.series || 'TGN Sermon'}</p><h2 className="mt-3 line-clamp-3 text-[15px] font-semibold leading-[1.35] text-black">{sermon.title}</h2><p className="mt-2 text-[11px] font-medium text-black/55">{sermon.speaker}</p><p className="mt-auto pt-5 text-[10px] leading-4 text-black/45">{sermon.scripture || 'Scripture not listed'} · {sermon.date}</p></div></a>)}</div> : !featured && <div className="mt-8 border border-black/10 bg-white px-6 py-16 text-center text-sm text-black/50">No sermons match your search or filters.</div>}
  </div></main>
}
