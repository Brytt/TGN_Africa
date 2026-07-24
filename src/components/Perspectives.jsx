import Reveal from './Reveal'
import { images, supportingArticles } from '../data/content'

export default function Perspectives() {
  return (
    <section id="theology" className="bg-surface-container-low py-24 md:py-section">
      <div className="page-shell">
        <Reveal className="mb-16 flex flex-col justify-between gap-8 md:mb-24 md:flex-row md:items-end">
          <div>
            <span className="eyebrow mb-4 block text-heritage-gold">Editorial Curation</span>
            <h2 className="font-display text-5xl leading-none text-midnight-navy md:text-7xl">Current Perspectives</h2>
          </div>
          <a href="#latest" className="eyebrow w-fit border-b border-midnight-navy/20 pb-2 transition-colors hover:border-heritage-gold hover:text-heritage-gold">
            Browse all articles
          </a>
        </Reveal>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <Reveal className="group lg:col-span-7">
            <a href="#featured-article" className="block">
              <div className="relative mb-10 aspect-[16/10] overflow-hidden bg-surface-container">
                <img
                  src={images.featuredCrossImage}
                  alt="Stylized Christian cross"
                  className="editorial-image h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/15" />
                <span className="absolute left-6 top-6 bg-midnight-navy px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-parchment-ivory">
                  Featured Study
                </span>
              </div>
              <span className="eyebrow mb-5 block text-heritage-gold">Theology & Society</span>
              <h3 className="max-w-2xl font-display text-4xl leading-tight text-midnight-navy transition-colors group-hover:text-heritage-gold md:text-6xl">
                The Christian Home as a Means of God’s Grace
              </h3>
              <p className="mt-6 max-w-2xl text-lg font-light leading-8 text-charcoal-text/60">
                Exploring how the daily rhythms of a faithful household become a primary conduit for the sanctifying work of the Holy Spirit within our modern African context.
              </p>
              <span className="mt-8 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em]">
                Read full article
                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-2">trending_flat</span>
              </span>
            </a>
          </Reveal>

          <div className="flex flex-col gap-12 lg:col-span-5">
            {supportingArticles.map((article, index) => (
              <Reveal key={article.title} delay={index * 0.08}>
                <a href="#article" className="group grid grid-cols-[110px_1fr] gap-6 border-b border-midnight-navy/10 pb-12 sm:grid-cols-[150px_1fr]">
                  <div className="aspect-square overflow-hidden bg-surface-container">
                    <img src={article.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div>
                    <span className="eyebrow mb-3 block text-[9px] text-heritage-gold">{article.category}</span>
                    <h3 className="font-display text-2xl leading-tight text-midnight-navy transition-all group-hover:italic md:text-3xl">
                      {article.title}
                    </h3>
                    <p className="mt-3 hidden text-sm leading-6 text-charcoal-text/50 sm:block">{article.excerpt}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
