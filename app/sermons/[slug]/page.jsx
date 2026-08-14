import { notFound } from 'next/navigation'
import Navbar from '../../../src/components/Navbar'
import Footer from '../../../src/components/Footer'
import { getSermonBySlug, getSermons } from '../../../src/lib/data'

export const revalidate = 60

function embedVideoUrl(value = '') {
  try {
    const url = new URL(value)
    if (url.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${url.pathname.slice(1)}`
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname.startsWith('/embed/')) return value
      const id = url.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
    }
    if (url.hostname.includes('vimeo.com')) {
      const id = url.pathname.split('/').filter(Boolean).pop()
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`
    }
  } catch {
    return ''
  }
  return ''
}

function downloadUrl(value = '', title = '', extension = '') {
  if (!value) return ''
  const separator = value.includes('?') ? '&' : '?'
  const filename = `${title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'tgn-sermon'}.${extension}`
  return value.includes('/storage/v1/object/public/sermon-media/') ? `${value}${separator}download=${encodeURIComponent(filename)}` : value
}

function audioPlaybackUrl(sermon) {
  try {
    const source = new URL(sermon.audioUrl)
    if (source.hostname === 'cpmfiles1.com') return `/api/sermons/${sermon.id}/audio`
  } catch {
    return sermon.audioUrl
  }
  return sermon.audioUrl
}

export async function generateMetadata({ params }) {
  const sermon = await getSermonBySlug((await params).slug)
  return sermon ? { title: sermon.title, description: sermon.description || `${sermon.title}, preached by ${sermon.speaker}.` } : { title: 'Sermon not found' }
}

export default async function SermonPage({ params }) {
  const sermon = await getSermonBySlug((await params).slug)
  if (!sermon) notFound()
  const embedUrl = embedVideoUrl(sermon.videoUrl)
  const related = (await getSermons()).filter((item) => item.id !== sermon.id && (item.series === sermon.series || item.speaker === sermon.speaker)).slice(0, 3)
  return <><Navbar /><main className="bg-parchment-ivory pb-20 pt-32 md:pt-40"><article>
    <header className="page-shell"><a href="/sermons" className="text-[10px] font-bold uppercase tracking-[0.15em] text-midnight-navy/50">← Sermon archive</a><div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px] lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-heritage-gold">{sermon.series || 'TGN Sermon'}</p><h1 className="mt-5 max-w-4xl font-display text-5xl leading-[1.02] text-midnight-navy md:text-7xl">{sermon.title}</h1></div><dl className="border-l border-midnight-navy/15 pl-6 text-sm"><div><dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-midnight-navy/35">Speaker</dt><dd className="mt-1 font-semibold text-midnight-navy">{sermon.speaker}</dd></div><div className="mt-4"><dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-midnight-navy/35">Scripture</dt><dd className="mt-1 text-midnight-navy/70">{sermon.scripture || 'Not specified'}</dd></div><div className="mt-4"><dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-midnight-navy/35">Preached</dt><dd className="mt-1 text-midnight-navy/70">{sermon.date}</dd></div></dl></div></header>
    <section className="page-shell mt-10"><div className="overflow-hidden bg-midnight-navy shadow-xl">{sermon.videoUrl ? (embedUrl ? <iframe src={embedUrl} title={sermon.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="aspect-video w-full" /> : <video src={sermon.videoUrl} poster={sermon.image || undefined} controls className="aspect-video w-full bg-black object-contain" />) : <div className="relative grid min-h-[360px] place-items-center overflow-hidden p-8 text-center"><div className="relative"><span className="material-symbols-outlined text-6xl text-white">headphones</span><p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">Audio sermon</p><h2 className="mt-2 font-display text-3xl text-white">Listen to {sermon.title}</h2></div></div>}</div>
      {sermon.audioUrl && <div className="border-x border-b border-midnight-navy/10 bg-white p-5 md:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-heritage-gold text-midnight-navy"><span className="material-symbols-outlined">headphones</span></span><audio src={audioPlaybackUrl(sermon)} controls preload="metadata" className="min-w-0 flex-1">Your browser does not support audio playback.</audio><a href={downloadUrl(sermon.audioUrl, sermon.title, 'mp3')} download className="inline-flex shrink-0 items-center justify-center gap-2 border border-midnight-navy px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-midnight-navy"><span className="material-symbols-outlined text-[18px]">download</span>Download audio</a></div></div>}
      {sermon.videoUrl && !embedUrl && <div className="flex justify-end border-x border-b border-midnight-navy/10 bg-white px-5 py-4"><a href={downloadUrl(sermon.videoUrl, sermon.title, 'mp4')} download className="inline-flex items-center gap-2 border border-midnight-navy px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-midnight-navy"><span className="material-symbols-outlined text-[18px]">download</span>Download video</a></div>}
    </section>
    {sermon.description && <section className="page-shell mt-12"><div className="max-w-3xl border-t border-midnight-navy/15 pt-8"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-heritage-gold">About this sermon</p><p className="mt-5 whitespace-pre-line font-display text-xl leading-9 text-midnight-navy/70">{sermon.description}</p></div></section>}
    {related.length > 0 && <section className="page-shell mt-16"><div className="border-b border-midnight-navy/15 pb-4"><p className="text-[9px] font-bold uppercase tracking-[0.15em] text-heritage-gold">Continue listening</p><h2 className="mt-2 font-display text-4xl text-midnight-navy">Related sermons</h2></div><div className="grid gap-px bg-midnight-navy/10 sm:grid-cols-3">{related.map((item) => <a key={item.id} href={`/sermons/${item.slug}`} className="group bg-white p-5"><div className="grid aspect-video w-full place-items-center overflow-hidden bg-midnight-navy">{item.videoUrl && item.image ? <img src={item.image} alt="" className="h-full w-full object-cover" /> : <span className="material-symbols-outlined text-5xl text-white/75">headphones</span>}</div><p className="mt-4 text-[9px] font-bold uppercase tracking-[0.12em] text-heritage-gold">{item.series || 'Sermon'}</p><h3 className="mt-2 font-display text-2xl leading-tight text-midnight-navy">{item.title}</h3><p className="mt-3 text-xs text-midnight-navy/45">{item.speaker} · {item.date}</p></a>)}</div></section>}
  </article></main><Footer /></>
}
