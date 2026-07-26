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
    <header id="top" className="relative flex min-h-[78vh] items-center overflow-hidden bg-white py-24 md:min-h-[86vh]">
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
        <span className="hero-reveal eyebrow mb-10 block tracking-[0.38em] text-midnight-navy">
          The Gospel Network Africa
        </span>
        <h1 key={statement} className="hero-quote-transition mx-auto max-w-6xl font-display text-[clamp(2.8rem,6.5vw,6rem)] font-medium leading-[0.98] tracking-[-0.035em] text-midnight-navy">
          {heroStatements[statement]}
        </h1>
        <p className="hero-reveal hero-delay-1 mt-6 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-midnight-navy/40">Acts 20:26–27</p>
        <p className="hero-reveal hero-delay-2 mx-auto mt-10 max-w-2xl text-lg font-light leading-8 text-charcoal-text/65 md:text-xl">
          Thoughtful, church-rooted resources helping Christians across Africa know the truth, live the gospel, and serve the local church.
        </p>
        <div className="hero-reveal hero-delay-3 mt-12 flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
          <a href="#latest" className="editorial-button bg-midnight-navy text-white hover:opacity-80">
            Read latest
          </a>
          <a href="#resources" className="editorial-button border-midnight-navy/15 text-midnight-navy hover:bg-midnight-navy hover:text-parchment-ivory">
            Explore resources
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 opacity-35 md:flex">
        <span className="eyebrow text-[9px] tracking-[0.3em]">Scroll</span>
        <div className="h-10 w-px bg-midnight-navy" />
      </div>
    </header>
  )
}
