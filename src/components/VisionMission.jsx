import Reveal from './Reveal'

export default function VisionMission() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="page-shell border-y border-black/10 py-16 md:py-24">
        <Reveal className="grid gap-8 lg:grid-cols-[0.55fr_1.45fr]">
          <div><span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/40">Our mission</span><div className="mt-5 h-px w-12 bg-heritage-gold" /></div>
          <div><h2 className="max-w-4xl font-display text-[clamp(2.5rem,5vw,4.8rem)] leading-[1.02] text-black">Declaring the Whole Counsel of God for the <em>Saints of Africa</em></h2><p className="mt-7 max-w-3xl text-base leading-8 text-black/55">The Gospel Network exists to declare the whole counsel of God for the saints of Africa by publishing faithful, clear, and pastorally useful biblical resources that proclaim Christ, strengthen local churches, confront error, and equip believers for maturity and faithful living.</p></div>
        </Reveal>
      </div>
      <div className="page-shell py-16 md:py-24">
        <Reveal delay={0.08} className="grid gap-8 lg:grid-cols-[0.55fr_1.45fr]">
          <div><span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/40">Our vision</span><div className="mt-5 h-px w-12 bg-heritage-gold" /></div>
          <div><p className="max-w-4xl font-display text-[clamp(2.2rem,4.5vw,4.2rem)] italic leading-[1.06] text-midnight-navy">A continent where mature African voices serve thriving local churches under the authority, sufficiency, and hope of Scripture.</p><a href="/about" className="mt-8 inline-flex border-b border-black pb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-black">Learn about the network →</a></div>
        </Reveal>
      </div>
    </section>
  )
}
