import Reveal from './Reveal'
import { gospelPoints } from '../data/content'

export default function Gospel() {
  return (
    <section id="gospel" className="relative overflow-hidden bg-midnight-navy py-24 text-parchment-ivory md:py-32">
      <div className="page-shell grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <span className="eyebrow mb-7 block tracking-[0.28em] text-heritage-gold">The Core Message</span>
          <h2 className="font-display text-5xl italic leading-tight md:text-6xl">The Gospel: God’s Power for Salvation</h2>
          <div className="mt-10 space-y-8">
            {gospelPoints.map((point) => (
              <div key={point.title} className="group border-l border-heritage-gold/30 pl-7">
                <h3 className="font-display text-2xl font-bold text-heritage-gold transition-transform group-hover:translate-x-2">{point.title}</h3>
                <p className="mt-2 leading-7 text-parchment-ivory/65">{point.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="flex min-h-[520px] flex-col items-center justify-center border border-heritage-gold/20 bg-heritage-gold/5 p-8 text-center md:p-12">
            <span className="material-symbols-outlined mb-7 text-7xl text-heritage-gold">auto_awesome</span>
            <blockquote className="font-display text-3xl italic leading-relaxed">
              “For I am not ashamed of the gospel, for it is the power of God for salvation to everyone who believes...”
            </blockquote>
            <cite className="eyebrow mt-7 not-italic text-heritage-gold">— Romans 1:16</cite>
            <a href="#understand" className="editorial-button mt-12 border-heritage-gold text-heritage-gold hover:bg-heritage-gold hover:text-midnight-navy">
              Deepen your understanding
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
