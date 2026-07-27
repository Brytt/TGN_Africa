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
  const archivePool = useMemo(() => publications.slice(12), [publications])
  const [archives, setArchives] = useState(() => archivePool.slice(0, 9))
  const carouselRef = useRef(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const source = archivePool.length ? archivePool : publications
    setArchives(shuffled(source).slice(0, 9))
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
    }, 4800)
    return () => window.clearInterval(interval)
  }, [paused, archives.length])

  if (archives.length === 0) return null

  return (
    <section id="archives" className="overflow-hidden bg-surface-container-low py-20 font-sans md:py-28">
      <div className="page-shell">
        <Reveal className="mb-10 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-midnight-navy/45">From the Archives</span>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-midnight-navy md:text-5xl">Worth reading again.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-charcoal-text/60">
              Rediscover faithful articles from across the years, selected afresh each time you visit.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => moveTo(activeSlide - 1)} className="grid size-11 place-items-center border border-midnight-navy/15 bg-white text-midnight-navy transition-colors hover:bg-midnight-navy hover:text-white" aria-label="Previous archive">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button type="button" onClick={() => moveTo(activeSlide + 1)} className="grid size-11 place-items-center border border-midnight-navy bg-midnight-navy text-white transition-colors hover:bg-white hover:text-midnight-navy" aria-label="Next archive">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </Reveal>

        <div ref={carouselRef} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth">
          {archives.map((item, index) => (
            <article key={item.id || item.slug || `${item.title}-${index}`} className="group min-w-full snap-start overflow-hidden border border-midnight-navy/10 bg-white sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)]">
              <a href={`/articles/${item.slug || item.id}`} className="flex h-full flex-col">
                <div className="relative overflow-hidden bg-midnight-navy">
                  <img src={item.image} alt="" className="aspect-[16/10] w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/65 via-transparent to-transparent" />
                  <span className="absolute left-5 top-5 border border-white/30 bg-midnight-navy/70 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">Archive {String(index + 1).padStart(2, '0')}</span>
                  <p className="absolute bottom-5 left-5 text-[10px] font-semibold text-white/80">{item.date}</p>
                </div>
                <div className="flex grow flex-col p-6">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-heritage-gold">{item.type || 'Article'}</p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.02em] text-midnight-navy">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-charcoal-text/60">{item.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-midnight-navy/10 pt-5">
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/45">{item.author}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-midnight-navy">Read →</span>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-2" aria-label={`Archive ${activeSlide + 1} of ${archives.length}`}>
            {archives.map((item, index) => (
              <button key={item.id || item.slug || index} type="button" onClick={() => moveTo(index)} className={`h-1 transition-all ${activeSlide === index ? 'w-9 bg-midnight-navy' : 'w-4 bg-midnight-navy/20'}`} aria-label={`Show ${item.title}`} />
            ))}
          </div>
          <a href="/articles" className="text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy">Browse all articles →</a>
        </div>
      </div>
    </section>
  )
}
