import Reveal from './Reveal'

export default function Mission() {
  return (
    <section id="mission" className="overflow-hidden bg-white py-20 md:py-28">
      <div className="page-shell max-w-5xl text-center">
        <Reveal>
          <div className="mb-10 flex justify-center">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-white" aria-hidden="true">
              <img
                src="/images/brand/gye-nyame-reference.jpeg"
                alt=""
                className="absolute left-1/2 top-[-31px] w-[180px] max-w-none -translate-x-1/2"
              />
            </div>
          </div>
          <div className="mx-auto mb-9 h-px w-12 bg-midnight-navy" />
          <span className="eyebrow mb-8 block tracking-[0.42em] text-charcoal-text/40">Our Manifesto</span>
          <h2 className="font-display text-[clamp(2.35rem,4.5vw,4.2rem)] italic leading-[1.08] text-midnight-navy">
            This network is not a superficial cultural publication, but the result of a thorough examination of{' '}
            <strong className="not-italic text-midnight-navy">Scripture</strong>, its mechanisms and impact on the individual and African society.
          </h2>
        </Reveal>
      </div>
    </section>
  )
}
