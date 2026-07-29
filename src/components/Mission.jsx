import Reveal from './Reveal'

export default function Mission() {
  return (
    <section id="mission" className="overflow-hidden bg-transparent py-0">
      <div className="page-shell max-w-4xl text-center">
        <Reveal>
          <div className="mb-5 flex justify-center">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-white" aria-hidden="true">
              <img
                src="/images/brand/gye-nyame-reference.jpeg"
                alt=""
                className="absolute left-1/2 top-1/2 w-[126px] max-w-none -translate-x-1/2 -translate-y-[40.5%]"
              />
            </div>
          </div>
          <div className="mx-auto mb-5 h-px w-10 bg-midnight-navy" />
          <span className="eyebrow mb-5 block italic tracking-[0.32em] text-charcoal-text/40">Our Mission</span>
          <h2 className="font-display text-[clamp(1.8rem,3.4vw,3.1rem)] italic leading-[1.12] text-midnight-navy">
            <span className="block">Declaring the Whole Counsel of God</span>
            <strong className="mt-1 block whitespace-nowrap italic text-midnight-navy">for the Saints of Africa</strong>
          </h2>
        </Reveal>
      </div>
    </section>
  )
}
