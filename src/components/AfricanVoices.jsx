import Reveal from './Reveal'

const roleRank = { Founder: 6, 'Managing Editor': 5, 'Deputy Editor': 4, Contributor: 3, 'Guest Author': 1 }
const authorPriority = (author) => /\bkwesi\s+sena\b/i.test(author.name) ? 2 : /\b(michael|mike)\b/i.test(author.name) ? 1 : 0

export default function AfricanVoices({ contributors = [] }) {
  const ranked = [...contributors].sort((a, b) =>
    authorPriority(b) - authorPriority(a) ||
    (roleRank[b.role] || 0) - (roleRank[a.role] || 0) ||
    (b.publications || 0) - (a.publications || 0) ||
    a.name.localeCompare(b.name),
  )
  const carousel = ranked.length > 1 ? [...ranked, ...ranked] : ranked

  return (
    <section id="authors" className="overflow-hidden bg-surface-container-low py-16 md:py-20">
      <div className="page-shell">
        <Reveal className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="eyebrow text-midnight-navy">Contributor network</span>
            <h2 className="mt-3 font-display text-4xl leading-none text-midnight-navy md:text-5xl">Leading voices.<br /><em>One gospel.</em></h2>
          </div>
          <div className="max-w-md md:text-right"><p className="text-sm leading-6 text-charcoal-text/60">Authors are ranked by editorial responsibility and published contribution.</p><a href="/about#contributors" className="mt-3 inline-flex text-[10px] font-semibold uppercase tracking-[0.14em] text-midnight-navy">Meet the network →</a></div>
        </Reveal>
      </div>
      {carousel.length > 0 && <div className="contributor-marquee flex w-max gap-4 px-5 motion-reduce:flex-wrap motion-reduce:justify-center">
        {carousel.map((contributor, index) => (
          <article key={`${contributor.id}-${index}`} className="flex w-[280px] shrink-0 flex-col border border-midnight-navy/10 bg-white p-5 md:w-[320px]">
            <div className="flex items-center gap-3">
              {contributor.image ? <img src={contributor.image} alt="" className="h-14 w-14 rounded-full object-cover" /> : <span className="grid h-14 w-14 place-items-center rounded-full bg-midnight-navy/5 font-semibold text-midnight-navy">{contributor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>}
              <span className="min-w-0"><span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-midnight-navy/45">#{(index % ranked.length) + 1} · {contributor.role}</span><strong className="mt-1 block truncate text-base text-black">{contributor.name}</strong></span>
            </div>
            <p className="mt-4 line-clamp-3 min-h-[60px] text-xs leading-5 text-black/55">{contributor.bio || 'Author profile biography coming soon.'}</p>
            <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-4 text-[10px] text-black/45"><span>{contributor.publications || 0} publications</span><a href={`/authors/${contributor.slug}`} className="font-semibold text-midnight-navy">View profile →</a></div>
          </article>
        ))}
      </div>}
    </section>
  )
}
