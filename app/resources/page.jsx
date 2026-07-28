import AnnouncementBar from '../../src/components/AnnouncementBar'
import Footer from '../../src/components/Footer'
import Navbar from '../../src/components/Navbar'
import { resourceCollections } from '../../src/data/resources'

export const metadata = {
  title: 'Creeds, Confessions, and Historic Documents',
  description: 'Read historic Christian creeds, definitions, catechisms, confessions, and Protestant statements presented by The Gospel Network.',
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white text-charcoal-text">
      <AnnouncementBar />
      <Navbar />
      <main>
        <header className="border-b border-midnight-navy/10 bg-surface-container-low">
          <div className="page-shell grid gap-10 py-16 lg:grid-cols-[1fr_340px] lg:items-end lg:py-24">
            <div>
              <p className="eyebrow text-heritage-gold">Resources</p>
              <h1 className="mt-6 max-w-4xl font-display text-[clamp(3.5rem,7vw,6.8rem)] leading-[0.9] tracking-[-0.035em] text-midnight-navy">
                The faith once delivered, carefully confessed.
              </h1>
            </div>
            <div className="border-l-2 border-heritage-gold pl-6">
              <p className="font-display text-xl leading-8 text-midnight-navy/75">
                A curated reading room for the historic documents that have helped the church articulate, defend, and teach biblical truth.
              </p>
              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-midnight-navy/40">Historical texts remain subordinate to Holy Scripture.</p>
            </div>
          </div>
        </header>

        {resourceCollections.map((collection, collectionIndex) => (
          <section key={collection.id} className={`py-16 md:py-24 ${collectionIndex % 2 ? 'bg-surface-container-low' : 'bg-white'}`}>
            <div className="page-shell">
              <div className="grid gap-7 border-b border-midnight-navy/15 pb-9 lg:grid-cols-[1fr_420px] lg:items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-heritage-gold">{collection.eyebrow}</p>
                  <h2 className="mt-4 font-display text-4xl leading-tight text-midnight-navy md:text-5xl">{collection.title}</h2>
                </div>
                <p className="text-sm leading-7 text-midnight-navy/55">{collection.description}</p>
              </div>

              <div className="mt-8 divide-y divide-midnight-navy/10 border-y border-midnight-navy/10">
                {collection.documents.map((document, index) => (
                  <a
                    key={document.slug}
                    href={`/resources/${document.slug}`}
                    className="group grid gap-4 py-6 transition-colors hover:bg-midnight-navy/[0.025] md:grid-cols-[58px_1fr_150px_110px] md:items-center md:px-4"
                  >
                    <span className="font-display text-lg text-midnight-navy/25">{String(index + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="block font-display text-2xl leading-tight text-midnight-navy transition-transform group-hover:translate-x-1">{document.title}</span>
                      <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.13em] text-midnight-navy/35">{document.type}</span>
                    </span>
                    <span className="text-sm text-midnight-navy/50">{document.date}</span>
                    <span className={`justify-self-start px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] md:justify-self-end ${document.file ? 'bg-midnight-navy text-white' : 'border border-midnight-navy/15 text-midnight-navy/40'}`}>
                      {document.file ? 'Read text' : 'Forthcoming'}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  )
}
