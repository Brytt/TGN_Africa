'use client'

import { useEffect, useState } from 'react'
import { images } from '../data/content'

const heroStatements = [
  'Therefore I testify to you this day that I am innocent of the blood of all.',
  'For I did not shrink from declaring to you the whole counsel of God.',
]

export default function Hero() {
  const [statement, setStatement] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => setStatement((current) => (current + 1) % heroStatements.length), 6000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <header id="top" className="relative flex items-center overflow-hidden bg-white py-12 md:min-h-[86vh] md:py-24">
      <div className="hero-background absolute inset-0">
        <img
          src={images.hero}
          alt="Pan-African Christian fellowship"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="editorial-image h-full w-full object-cover grayscale opacity-[0.11]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/20 to-white" />
      </div>

      <div className="page-shell relative z-10 text-center">
        <div className="hero-reveal mx-auto mb-8 flex w-fit flex-col items-center font-display uppercase leading-none text-midnight-navy md:mb-12" aria-label="The Gospel Network">
          <span className="translate-x-[0.28em] text-[clamp(0.75rem,1.2vw,1rem)] font-semibold tracking-[0.56em]">The</span>
          <span className="mt-2 text-[clamp(2rem,4.4vw,3.9rem)] font-medium tracking-[0.17em]">Gospel</span>
          <span className="mt-2 translate-x-[0.24em] text-[clamp(0.8rem,1.5vw,1.2rem)] font-semibold tracking-[0.48em]">Network</span>
        </div>
        <h1 key={statement} className="hero-quote-transition tgn-display-heading mx-auto max-w-6xl text-[clamp(2.8rem,6.5vw,6rem)] leading-[0.98] text-midnight-navy">
          {heroStatements[statement]}
        </h1>
        <p className="hero-reveal hero-delay-1 mt-6 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-midnight-navy/40">Acts 20:26–27</p>
        <div className="hero-reveal hero-delay-2 mt-12 flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
          <a href="#latest" className="editorial-button min-w-[210px] bg-midnight-navy text-white hover:opacity-80">
            Read latest
          </a>
          <a href="/subscribe" className="editorial-button group min-w-[210px] gap-3 border-midnight-navy bg-white text-midnight-navy shadow-[0_8px_24px_rgba(13,34,64,0.08)] duration-300 hover:-translate-y-0.5 hover:bg-midnight-navy hover:text-white hover:shadow-[0_14px_32px_rgba(13,34,64,0.18)]">
            <span className="material-symbols-outlined text-[18px]">mail</span>
            Subscribe
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </header>
  )
}
