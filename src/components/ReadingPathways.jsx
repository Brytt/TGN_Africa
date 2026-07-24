import Reveal from './Reveal'
import { pathways } from '../data/content'

export default function ReadingPathways() {
  return (
    <section className="bg-surface-container-high py-24 md:py-32">
      <div className="page-shell max-w-6xl">
        <Reveal className="mb-14 text-center">
          <span className="eyebrow text-heritage-gold">Step by Step</span>
          <h2 className="mt-2 font-display text-5xl italic text-midnight-navy md:text-6xl">Reading Pathways</h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {pathways.map((pathway, index) => (
            <div key={pathway.number} className="contents">
              <Reveal
                delay={index * 0.08}
                className={`border-l-4 border-heritage-gold p-8 md:p-10 ${
                  pathway.dark ? 'bg-midnight-navy text-parchment-ivory' : 'bg-white text-midnight-navy'
                }`}
              >
                <span className="eyebrow text-heritage-gold">{pathway.number}</span>
                <h3 className="mt-7 font-display text-3xl leading-tight">{pathway.title}</h3>
                <p className={`mt-5 leading-7 ${pathway.dark ? 'text-parchment-ivory/60' : 'text-charcoal-text/60'}`}>{pathway.description}</p>
                <a
                  href="#pathway"
                  className={`eyebrow mt-9 inline-block border-b pb-1 text-[9px] transition-colors hover:text-heritage-gold ${
                    pathway.dark ? 'border-parchment-ivory' : 'border-charcoal-text'
                  }`}
                >
                  {pathway.action}
                </a>
              </Reveal>
              {index < pathways.length - 1 && (
                <div className="grid place-items-center py-2 text-charcoal-text/20 lg:px-2 lg:py-0">
                  <span className="material-symbols-outlined rotate-90 lg:rotate-0">trending_flat</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
