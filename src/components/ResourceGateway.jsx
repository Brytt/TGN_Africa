'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Reveal from './Reveal'

function shuffled(items) {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }
  return copy
}

export default function ResourceGateway({ publications = [] }) {
  const archivePool = useMemo(() => {
    if (publications.length > 12) return publications.slice(12)
    if (publications.length > 4) return publications.slice(4)
    return publications
  }, [publications])
  const [archives, setArchives] = useState(() => archivePool.slice(0, 7))
  const carouselRef = useRef(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const source = archivePool.length ? archivePool : publications
    setArchives(shuffled(source).slice(0, 7))
    setActiveSlide(0)
  }, [archivePool, publications])

  const moveTo = (index) => {
    const carousel = carouselRef.current
    if (!carousel || archives.length === 0) return
    const normalizedIndex = (index + archives.length) % archives.length
    const card = carousel.children[normalizedIndex]
    if (!card) return
    carousel.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
    setActiveSlide(normalizedIndex)
  }

  useEffect(() => {
    if (paused || archives.length < 2) return undefined
    const interval = window.setInterval(() => {
      setActiveSlide((current) => {
        const next = (current + 1) % archives.length
        const carousel = carouselRef.current
        const card = carousel?.children[next]
        if (carousel && card) carousel.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
        return next
      })
    }, 7000)
    return () => window.clearInterval(interval)
  }, [paused, archives.length])

  if (archives.length === 0) return null

  return (
    <section id="archives" className="overflow-hidden bg-[#eef1f5] py-20 font-sans md:py-28">
      <div className="page-shell">
        <Reveal className="mb-10 grid gap-7 border-t border-midnight-navy/20 pt-6 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-heritage-gold">From the Archives</span>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.025em] text-midnight-navy md:text-6xl">Worth reading again.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-charcoal-text/60">
              Rediscover faithful articles from across the years, selected afresh each time you visit.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="mr-3 text-[11px] font-semibold tabular-nums tracking-[0.12em] text-midnight-navy/45">
              {String(activeSlide + 1).padStart(2, '0')} / {String(archives.length).padStart(2, '0')}
            </span>
            <button type="button" onClick={() => moveTo(activeSlide - 1)} className="grid size-12 place-items-center border border-midnight-navy/20 bg-transparent text-midnight-navy transition-colors hover:bg-midnight-navy hover:text-white" aria-label="Previous archive">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button type="button" onClick={() => moveTo(activeSlide + 1)} className="grid size-12 place-items-center border border-midnight-navy bg-midnight-navy text-white transition-colors hover:bg-white hover:text-midnight-navy" aria-label="Next archive">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </Reveal>

        <div ref={carouselRef} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth shadow-[0_30px_80px_rgba(13,34,64,0.14)]">
          {archives.map((item, index) => (
            <article key={item.id || item.slug || `${item.title}-${index}`} className="group min-w-full snap-start bg-white">
              <a href={`/articles/${item.slug || item.id}`} className="grid min-h-[560px] lg:grid-cols-[1.12fr_0.88fr]">
                <div className="relative min-h-[300px] overflow-hidden bg-midnight-navy lg:min-h-full">
                  {item.image && <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-[1.035]" />}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-midnight-navy/15" />
                  <span className="absolute left-6 top-6 border border-white/40 bg-midnight-navy/75 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md md:left-8 md:top-8">
                    Archive selection {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="relative flex flex-col bg-midnight-navy p-8 text-white md:p-12 lg:p-14">
                  <div className="absolute right-8 top-8 font-display text-7xl text-white/[0.045]">{String(index + 1).padStart(2, '0')}</div>
                  <div className="relative flex flex-wrap items-center gap-3 text-[9px] font-bold uppercase tracking-[0.16em] text-white/55">
                    <span className="text-heritage-gold">{item.type || 'Article'}</span>
                    <span className="size-1 rounded-full bg-white/25" />
                    <span>{item.topic}</span>
                  </div>
                  <h3 className="relative mt-7 font-display text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-white">{item.title}</h3>
                  {item.subtitle && <p className="relative mt-4 font-display text-xl leading-7 text-white/65">{item.subtitle}</p>}
                  <p className="relative mt-6 line-clamp-4 text-sm leading-7 text-white/55">{item.excerpt}</p>
                  <div className="relative mt-auto border-t border-white/15 pt-7">
                    <div className="flex flex-wrap items-center justify-between gap-5">
                      <div className="flex items-center gap-3">
                        {item.authorImage
                          ? <img src={item.authorImage} alt="" className="size-10 rounded-full object-cover" />
                          : <span className="grid size-10 place-items-center rounded-full bg-white/10 text-xs font-semibold">{item.author?.charAt(0)}</span>}
                        <div><p className="text-xs font-semibold text-white">{item.author}</p><p className="mt-1 text-[10px] text-white/40">{item.date} · {item.readingTime}</p></div>
                      </div>
                      <span className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white">Read article <span className="text-lg text-heritage-gold transition-transform group-hover:translate-x-1">→</span></span>
                    </div>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex grow gap-2 sm:max-w-md" aria-label={`Archive ${activeSlide + 1} of ${archives.length}`}>
            {archives.map((item, index) => (
              <button key={item.id || item.slug || index} type="button" onClick={() => moveTo(index)} className={`h-1 grow transition-colors ${activeSlide === index ? 'bg-midnight-navy' : 'bg-midnight-navy/15 hover:bg-midnight-navy/35'}`} aria-label={`Show ${item.title}`} />
            ))}
          </div>
          <a href="/articles" className="text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy">Explore the full archive →</a>
        </div>
      </div>
    </section>
  )
}
