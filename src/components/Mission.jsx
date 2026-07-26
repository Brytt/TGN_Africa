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
          <span className="eyebrow mb-5 block tracking-[0.32em] text-charcoal-text/40">Our Manifesto</span>
          <h2 className="font-display text-[clamp(1.8rem,3.4vw,3.1rem)] italic leading-[1.12] text-midnight-navy">
            This network is not a superficial cultural publication, but the result of a thorough examination of{' '}
            <strong className="not-italic text-midnight-navy">Scripture</strong>, its mechanisms and impact on the individual and African society.
          </h2>
        </Reveal>
      </div>
    </section>
  )
}
