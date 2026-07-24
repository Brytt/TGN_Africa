import Reveal from './Reveal'

export default function AfricanVoices({ contributors = [] }) {
  return (
    <section id="authors" className="bg-surface-container-low py-20 md:py-28">
      <div className="page-shell">
        <Reveal className="mb-12 md:flex md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow text-midnight-navy">Contributor network</span>
            <h2 className="mt-3 font-display text-5xl leading-none text-midnight-navy md:text-6xl">African voices.<br /><em>One gospel.</em></h2>
          </div>
          <p className="mt-6 max-w-md leading-7 text-charcoal-text/60 md:mt-0">
            Pastors, scholars, and writers serving the church from within the cultures and communities they understand.
          </p>
        </Reveal>

        <div className="grid border-t border-midnight-navy/15 md:grid-cols-3">
          {contributors.map((contributor, index) => (
            <Reveal
              key={contributor.name}
              delay={index * 0.06}
              className="border-b border-midnight-navy/15 py-8 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <span className="eyebrow text-[9px] text-midnight-navy">{[contributor.location, contributor.country].filter(Boolean).join(', ')}</span>
              <h3 className="mt-5 font-display text-3xl text-midnight-navy">{contributor.name}</h3>
              <p className="mt-2 text-sm font-semibold text-charcoal-text/70">{contributor.role}</p>
              <p className="mt-6 text-sm leading-6 text-charcoal-text/50">{contributor.bio}</p>
              <a href="#author" className="mt-7 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy">
                View profile <span aria-hidden="true">→</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
