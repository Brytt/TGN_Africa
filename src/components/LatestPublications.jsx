import Reveal from './Reveal'

export default function LatestPublications({ publications = [] }) {
  const displayed = publications.slice(0, 12)

  return (
    <section id="latest" className="bg-[#f7f7f6] py-16 font-sans md:py-24">
      <div className="page-shell">
        <div className="mb-7">
          <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/45">From the editors</span>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.025em] text-black md:text-4xl">Latest Publications</h2>
        </div>
        {!displayed.length ? <p className="border border-black/10 bg-white py-16 text-center text-sm text-black/50">No publications have been published yet.</p> : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {displayed.map((publication, index) => <Reveal key={publication.id} delay={(index % 3) * 0.035} className="h-full"><a href={`/articles/${publication.slug}`} className="group flex h-full min-h-[360px] flex-col border border-black/10 bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative overflow-hidden"><img src={publication.image} alt="" className="aspect-[16/8.5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" /><span className="absolute left-3 top-3 bg-black/75 px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.12em] text-white">{publication.type}</span></div>
                <div className="flex grow flex-col p-4">
                  <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-black/40">{publication.date} · {publication.readingTime}</span>
                  <h3 className="mt-3 line-clamp-2 text-[16px] font-semibold leading-[1.3] text-black">{publication.title}</h3>
                  <p className="mt-2 line-clamp-3 text-[12px] leading-5 text-black/55">{publication.excerpt}</p>
                  <div className="mt-auto flex items-center gap-2 pt-5">
                    {publication.authorImage ? <img src={publication.authorImage} alt="" className="h-7 w-7 rounded-full object-cover" /> : <span className="grid h-7 w-7 place-items-center rounded-full bg-black/5 text-[9px] font-semibold text-black">{publication.author.charAt(0)}</span>}
                    <p className="text-[10px] font-medium text-black/65">{publication.author}</p>
                  </div>
                </div>
              </a></Reveal>)}
            </div>
            <div className="mt-10 flex justify-center"><a href="/articles" className="inline-flex items-center gap-3 bg-black px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.13em] text-white transition-opacity hover:opacity-75">View more <span aria-hidden="true">→</span></a></div>
          </>
        )}
      </div>
    </section>
  )
}
