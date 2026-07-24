'use client'

import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'

const series = [
  {
    title: 'Foundations of the Gospel',
    description: 'A clear introduction to the good news of Jesus Christ and the life it creates.',
    lessons: '8 resources',
    scripture: 'Romans 1–8',
    image: '/images/publications/featured-study.jpg',
  },
  {
    title: 'The Church Christ Builds',
    description: 'Biblical teaching on membership, leadership, worship, discipline, and mission.',
    lessons: '10 resources',
    scripture: 'Ephesians 2–4',
    image: '/images/publications/church-teaching.jpg',
  },
  {
    title: 'Reading Scripture Faithfully',
    description: 'Learn to understand biblical texts in context and apply them with wisdom.',
    lessons: '12 resources',
    scripture: '2 Timothy 3:14–17',
    image: '/images/publications/scripture-notes.jpg',
  },
  {
    title: 'Faith in African Public Life',
    description: 'Following Christ with courage and integrity in work, culture, and society.',
    lessons: '7 resources',
    scripture: 'Matthew 5:13–16',
    image: '/images/publications/family-scripture.jpg',
  },
  {
    title: 'Prayer in Every Season',
    description: 'A pastoral journey through praise, lament, confession, and Christian hope.',
    lessons: '9 resources',
    scripture: 'Psalms 42–43',
    image: '/images/publications/morning-devotional.jpg',
  },
]

export default function ResourceGateway() {
  const carouselRef = useRef(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [paused, setPaused] = useState(false)

  const moveTo = (index) => {
    const carousel = carouselRef.current
    if (!carousel) return
    const card = carousel.children[index]
    if (!card) return
    carousel.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
    setActiveSlide(index)
  }

  const nextSlide = () => moveTo((activeSlide + 1) % series.length)
  const previousSlide = () => moveTo((activeSlide - 1 + series.length) % series.length)

  useEffect(() => {
    if (paused) return undefined
    const interval = window.setInterval(() => {
      setActiveSlide((current) => {
        const next = (current + 1) % series.length
        const carousel = carouselRef.current
        const card = carousel?.children[next]
        if (carousel && card) carousel.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
        return next
      })
    }, 4800)
    return () => window.clearInterval(interval)
  }, [paused])

  return (
    <section id="resources" className="overflow-hidden bg-surface-container-low py-20 font-sans md:py-28">
      <div className="page-shell">
        <Reveal className="mb-10 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-midnight-navy/45">Teaching Series</span>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-midnight-navy md:text-5xl">Go deeper, one series at a time.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-charcoal-text/60">
              Structured collections for studying Scripture, strengthening conviction, and serving the local church.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={previousSlide}
              className="grid size-11 place-items-center border border-midnight-navy/15 bg-white text-midnight-navy transition-colors hover:bg-midnight-navy hover:text-white"
              aria-label="Previous series"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="grid size-11 place-items-center border border-midnight-navy bg-midnight-navy text-white transition-colors hover:bg-white hover:text-midnight-navy"
              aria-label="Next series"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </Reveal>

        <div
          ref={carouselRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth"
        >
          {series.map((item, index) => (
            <article
              key={item.title}
              className="group min-w-full snap-start overflow-hidden border border-midnight-navy/10 bg-white sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)]"
            >
              <a href="#series" className="flex h-full flex-col">
                <div className="relative overflow-hidden bg-midnight-navy">
                  <img src={item.image} alt="" className="aspect-[16/10] w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/65 via-transparent to-transparent" />
                  <span className="absolute left-5 top-5 border border-white/30 bg-midnight-navy/70 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                    Series {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="absolute bottom-5 left-5 text-[10px] font-semibold text-white/80">{item.scripture}</p>
                </div>
                <div className="flex grow flex-col p-6">
                  <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-midnight-navy">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-charcoal-text/60">{item.description}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-midnight-navy/10 pt-5">
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/45">{item.lessons}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-midnight-navy">Explore →</span>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-2" aria-label={`Series ${activeSlide + 1} of ${series.length}`}>
            {series.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => moveTo(index)}
                className={`h-1 transition-all ${activeSlide === index ? 'w-9 bg-midnight-navy' : 'w-4 bg-midnight-navy/20'}`}
                aria-label={`Show ${item.title}`}
              />
            ))}
          </div>
          <a href="#all-series" className="text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy">
            Explore all series →
          </a>
        </div>
      </div>
    </section>
  )
}
