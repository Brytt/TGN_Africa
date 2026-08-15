import { notFound } from 'next/navigation'
import Navbar from '../../../src/components/Navbar'
import Footer from '../../../src/components/Footer'
import VerseHover from '../../../src/components/VerseHover'
import { SermonViewTracker } from '../../../src/components/SermonAnalytics'
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
  const primaryAction = sermon.videoUrl ? 'Watch sermon' : 'Listen to sermon'
  return <><Navbar /><SermonViewTracker sermonId={sermon.id} primaryEvent={sermon.videoUrl ? 'watch' : 'listen'} /><main className="min-h-screen bg-[#f7f7f6] pb-20 pt-32 font-sans md:pt-40"><article className="sermon-preview page-shell">
    <a href="/sermons" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-midnight-navy/50 transition hover:text-midnight-navy">← Sermon archive</a>

    <header className="mt-7 grid overflow-hidden rounded-[32px] border border-midnight-navy/[0.08] bg-white shadow-[0_24px_70px_rgba(13,34,64,0.11)] lg:grid-cols-[1.12fr_0.88fr]">
      <div className="group relative min-h-[360px] overflow-hidden bg-midnight-navy lg:min-h-[560px]">{sermon.image ? <img src={sermon.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.025]" /> : <span className="absolute inset-0 grid place-items-center"><span className="material-symbols-outlined text-8xl text-white/50">graphic_eq</span></span>}<div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/55 via-transparent to-transparent" /><span className="absolute bottom-6 left-6 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-midnight-navy shadow-lg backdrop-blur">{sermon.mediaType} sermon</span></div>
      <div className="flex flex-col p-7 md:p-10 lg:p-12"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy/45">{sermon.series || 'The Gospel Network sermon'}</p><h1 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-0.035em] text-midnight-navy md:text-5xl">{sermon.title}</h1><p className="mt-5 text-sm font-semibold text-midnight-navy/70">{sermon.speaker} <span className="mx-2 text-midnight-navy/20">·</span> {sermon.date} <span className="mx-2 text-midnight-navy/20">·</span> {sermon.series || 'Sermon'}</p><p className="mt-3 text-xs text-midnight-navy/45">{sermon.scripture ? <VerseHover reference={sermon.scripture} /> : 'Scripture reference not specified'}</p>{sermon.description && <p className="mt-7 line-clamp-5 text-sm leading-7 text-midnight-navy/55">{sermon.description}</p>}<a href="#sermon-player" className="mt-auto inline-flex w-fit items-center gap-3 rounded-full bg-midnight-navy px-6 py-3.5 text-xs font-bold text-white shadow-[0_12px_30px_rgba(13,34,64,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#17385d] hover:shadow-[0_18px_38px_rgba(13,34,64,0.28)]"><span className="material-symbols-outlined text-[20px]">{sermon.videoUrl ? 'play_arrow' : 'headphones'}</span>{primaryAction}</a></div>
    </header>

    <section id="sermon-player" className="scroll-mt-28 pt-10">{sermon.videoUrl && <div className="overflow-hidden rounded-[28px] bg-midnight-navy shadow-[0_20px_55px_rgba(13,34,64,0.14)]">{embedUrl ? <iframe src={embedUrl} title={sermon.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="aspect-video w-full" /> : <video src={sermon.videoUrl} poster={sermon.image || undefined} controls className="aspect-video w-full bg-black object-contain" />}</div>}
      {sermon.audioUrl && <div className={`${sermon.videoUrl ? 'rounded-b-[28px] border-t-0' : 'rounded-[28px] shadow-[0_14px_40px_rgba(13,34,64,0.08)]'} border border-midnight-navy/10 bg-white p-5 md:p-7`}><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-midnight-navy text-white"><span className="material-symbols-outlined">headphones</span></span><audio src={audioPlaybackUrl(sermon)} controls preload="metadata" className="min-w-0 flex-1">Your browser does not support audio playback.</audio><a href={downloadUrl(sermon.audioUrl, sermon.title, 'mp3')} download className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-midnight-navy/15 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-midnight-navy transition hover:bg-midnight-navy/5"><span className="material-symbols-outlined text-[18px]">download</span>Download</a></div></div>}
      {sermon.videoUrl && !embedUrl && <div className="flex justify-end rounded-b-[28px] border border-t-0 border-midnight-navy/10 bg-white px-5 py-4"><a href={downloadUrl(sermon.videoUrl, sermon.title, 'mp4')} download className="inline-flex items-center gap-2 rounded-full border border-midnight-navy/15 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-midnight-navy transition hover:bg-midnight-navy/5"><span className="material-symbols-outlined text-[18px]">download</span>Download video</a></div>}
    </section>

    <section className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="rounded-[28px] border border-midnight-navy/[0.07] bg-white p-7 shadow-[0_10px_35px_rgba(13,34,64,0.05)] md:p-10"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-midnight-navy/40">About this sermon</p><h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-midnight-navy">Message overview</h2><p className="mt-6 whitespace-pre-line text-[15px] leading-8 text-midnight-navy/65">{sermon.description || 'No description has been added for this sermon yet.'}</p></div><aside className="rounded-[28px] bg-midnight-navy p-7 text-white shadow-[0_16px_45px_rgba(13,34,64,0.14)]"><p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40">Sermon details</p><dl className="mt-6 divide-y divide-white/10">{[['Scripture', sermon.scripture || 'Not specified'], ['Speaker', sermon.speaker], ['Date', sermon.date], ['Category', sermon.series || 'Sermon'], ['Format', sermon.mediaType]].map(([label, value]) => <div key={label} className="py-4 first:pt-0"><dt className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/35">{label}</dt><dd className="mt-1.5 text-sm font-medium capitalize text-white/85">{value}</dd></div>)}</dl></aside></section>


    {related.length > 0 && <section className="mt-16"><div className="flex items-end justify-between border-b border-midnight-navy/10 pb-5"><div><p className="text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/40">Continue listening</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.025em] text-midnight-navy">Related sermons</h2></div><a href="/sermons" className="text-xs font-semibold text-midnight-navy">View all →</a></div><div className="mt-7 grid gap-6 sm:grid-cols-3">{related.map((item) => <a key={item.id} href={`/sermons/${item.slug}`} className="group overflow-hidden rounded-[22px] border border-midnight-navy/[0.08] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"><div className="grid aspect-video w-full place-items-center overflow-hidden bg-midnight-navy">{item.image ? <img src={item.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]" /> : <span className="material-symbols-outlined text-5xl text-white/75">headphones</span>}</div><div className="p-5"><p className="text-[9px] font-bold uppercase tracking-[0.12em] text-midnight-navy/40">{item.series || 'Sermon'}</p><h3 className="mt-3 text-lg font-semibold leading-tight text-midnight-navy">{item.title}</h3><p className="mt-3 text-xs text-midnight-navy/45">{item.speaker} · {item.date}</p></div></a>)}</div></section>}
  </article></main><Footer /></>
}
