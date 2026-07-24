import { lazy, Suspense } from 'react'
import Reveal from './Reveal'

const BookScene = lazy(() => import('./BookScene'))

export default function SeriesShowcase() {
  return (
    <section id="series" className="relative overflow-hidden bg-midnight-navy py-24 text-parchment-ivory md:py-section">
      <div className="page-shell relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <span className="eyebrow mb-7 block tracking-[0.35em] text-heritage-gold">Immersive Learning</span>
          <h2 className="font-display text-[clamp(4rem,7vw,6rem)] font-medium leading-[0.88]">
            Deepen Your
            <br />
            <em className="font-normal">Convictions</em>
          </h2>
          <p className="mt-9 max-w-md text-lg font-light leading-8 text-parchment-ivory/60">
            Curated series provide extensive theological exploration and practical application for the modern African believer.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#catalog" className="editorial-button bg-heritage-gold text-midnight-navy hover:bg-parchment-ivory">
              Browse all series
            </a>
            <a href="#catalog" className="editorial-button border-parchment-ivory/20 text-parchment-ivory hover:bg-white/5">
              View catalog
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <Suspense
            fallback={
              <div className="grid h-[430px] w-full place-items-center border border-parchment-ivory/10 text-center md:h-[600px]">
                <span className="eyebrow text-parchment-ivory/40">Loading the series collection</span>
              </div>
            }
          >
            <BookScene />
          </Suspense>
        </Reveal>
      </div>
      <div className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2 select-none font-display text-[20rem] italic text-white/[0.018]">
        Truth
      </div>
    </section>
  )
}
