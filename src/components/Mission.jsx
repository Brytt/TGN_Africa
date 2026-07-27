import Reveal from './Reveal'

export default function Mission() {
  return (
    <section id="mission" className="overflow-hidden bg-white py-12 md:py-16">
      <div className="page-shell max-w-4xl text-center">
        <Reveal>
          <div className="mb-5 flex justify-center">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-white" aria-hidden="true">
              <img
                src="/images/brand/gye-nyame-reference.jpeg"
                alt=""
                className="absolute left-1/2 top-[-22px] w-[126px] max-w-none -translate-x-1/2"
              />
            </div>
          </div>
          <div className="mx-auto mb-5 h-px w-10 bg-midnight-navy" />
          <span className="eyebrow mb-5 block tracking-[0.32em] text-charcoal-text/40">Our Mission</span>
          <h2 className="font-display text-[clamp(1.8rem,3.4vw,3.1rem)] italic leading-[1.12] text-midnight-navy">
            Declaring the Whole Counsel of God for the{' '}
            <strong className="not-italic text-midnight-navy">Saints of Africa</strong>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl font-sans text-sm leading-7 text-charcoal-text/55">
            The Gospel Network exists to declare the whole counsel of God for the saints of Africa by publishing faithful, clear, and pastorally useful biblical resources that proclaim Christ, strengthen local churches, confront error, and equip believers for maturity and faithful living.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
