import AnnouncementBar from '../../src/components/AnnouncementBar'
import Footer from '../../src/components/Footer'
import Navbar from '../../src/components/Navbar'
import { searchSite } from '../../src/lib/search'

export const metadata = {
  title: 'Search',
  description: 'Search articles, topics, resources, Scripture references, and contributors from The Gospel Network.',
}

function ResultGroup({ title, items }) {
  if (!items.length) return null
  return (
    <section className="border-t border-midnight-navy/15 py-9">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-display text-3xl text-midnight-navy">{title}</h2>
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-midnight-navy/35">{items.length} shown</span>
      </div>
      <div className="grid gap-px overflow-hidden border border-midnight-navy/10 bg-midnight-navy/10 sm:grid-cols-2">
        {items.map((item) => (
          <a key={`${item.kind}-${item.href}`} href={item.href} className="group flex min-h-40 gap-5 bg-white p-5 transition-colors hover:bg-[#f3f6fb] md:p-6">
            {item.image && <img src={item.image} alt="" className="h-24 w-28 shrink-0 object-cover" />}
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-heritage-gold">{item.kind}</span>
              <span className="mt-2 font-display text-xl leading-tight text-midnight-navy group-hover:underline">{item.title}</span>
              {item.meta && <span className="mt-auto pt-4 text-[10px] leading-5 text-midnight-navy/45">{item.meta}</span>}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default async function SearchPage({ searchParams }) {
  const query = String((await searchParams)?.q || '').trim()
  const results = await searchSite(query, { limit: 40 })
  const shown = results.articles.length + results.topics.length + results.contributors.length + results.resources.length

  return (
    <div className="min-h-screen bg-[#f7f7f6] text-charcoal-text">
      <AnnouncementBar />
      <Navbar />
      <main>
        <header className="border-b border-midnight-navy/10 bg-white py-12 md:py-16">
          <div className="page-shell max-w-5xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-heritage-gold">Search the library</p>
            <h1 className="mt-4 font-display text-5xl leading-none text-midnight-navy md:text-7xl">Find what you need.</h1>
            <form action="/search" className="mt-9 flex border-b-2 border-midnight-navy">
              <span className="material-symbols-outlined self-center text-midnight-navy/45">search</span>
              <input name="q" type="search" defaultValue={query} autoFocus placeholder="Search titles, phrases, topics, tags, categories, Scripture…" className="min-w-0 flex-1 bg-transparent px-4 py-4 text-lg text-midnight-navy outline-none md:text-xl" />
              <button className="self-center bg-midnight-navy px-5 py-3 text-[10px] font-bold uppercase tracking-[0.13em] text-white">Search</button>
            </form>
            {query.length >= 2 && <p className="mt-5 text-sm text-midnight-navy/50">{shown ? `${results.total || results.articles.length} publication matches, plus related topics, contributors, and resources for “${query}”.` : `No results found for “${query}”.`}</p>}
          </div>
        </header>

        <div className="page-shell max-w-5xl py-10 md:py-14">
          {query.length < 2 ? <p className="border border-midnight-navy/10 bg-white p-8 text-sm leading-7 text-midnight-navy/55">Enter at least two letters. Search examines publication titles, subtitles, summaries, full article text, Scripture references, authors, topics, subtopics, publication types, WordPress tags, and categories.</p> : <>
            <ResultGroup title="Publications" items={results.articles} />
            <ResultGroup title="Topics and categories" items={results.topics} />
            <ResultGroup title="Contributors" items={results.contributors} />
            <ResultGroup title="Historic resources" items={results.resources} />
            {!shown && <div className="border border-midnight-navy/10 bg-white px-7 py-14 text-center"><span className="material-symbols-outlined text-4xl text-midnight-navy/25">search_off</span><h2 className="mt-4 font-display text-3xl text-midnight-navy">Nothing matched this search.</h2><p className="mt-3 text-sm text-midnight-navy/50">Try fewer words, a broader theological term, an author’s surname, or a Scripture reference.</p></div>}
          </>}
        </div>
      </main>
      <Footer />
    </div>
  )
}
