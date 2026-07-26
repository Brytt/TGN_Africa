import Reveal from './Reveal'

export default function VisionMission() {
  return (
    <section className="bg-midnight-navy py-16 text-white md:py-20">
      <div className="page-shell grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2">
        <Reveal className="bg-midnight-navy p-7 md:p-10">
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-heritage-gold">Our mission</span>
          <h2 className="mt-4 font-display text-3xl">Truth for the African church.</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/60">To proclaim the gospel, defend biblical truth, and equip Christians with faithful resources that speak clearly within African churches, cultures, and communities.</p>
        </Reveal>
        <Reveal delay={0.08} className="bg-midnight-navy p-7 md:p-10">
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-heritage-gold">Our vision</span>
          <h2 className="mt-4 font-display text-3xl">A continent shaped by Scripture.</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/60">To see a growing network of mature African voices strengthening local churches and helping believers live under the authority and hope of God’s Word.</p>
        </Reveal>
      </div>
    </section>
  )
}
