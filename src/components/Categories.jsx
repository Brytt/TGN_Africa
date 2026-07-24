import Reveal from './Reveal'
import { categories } from '../data/content'

export default function Categories() {
  return (
    <section id="culture" className="bg-white py-24 md:py-section">
      <div className="page-shell">
        <Reveal className="mb-16 text-center md:mb-24">
          <span className="eyebrow mb-5 block tracking-[0.36em] text-heritage-gold">Topic Taxonomy</span>
          <h2 className="font-display text-5xl leading-[0.95] text-midnight-navy md:text-7xl">
            Questions the
            <br />
            Gospel Answers
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {categories.map((category, index) => (
            <Reveal key={category.title} delay={index * 0.06}>
              <a
                href="#category"
                className={`group flex min-h-[360px] flex-col justify-between border p-8 transition-transform duration-500 hover:-translate-y-2 md:p-10 ${
                  category.featured
                    ? 'border-midnight-navy bg-midnight-navy text-parchment-ivory lg:-translate-y-8'
                    : 'border-midnight-navy/5 bg-surface-container-low text-midnight-navy'
                }`}
              >
                <div>
                  <span className="material-symbols-outlined mb-7 text-5xl text-heritage-gold">{category.icon}</span>
                  <h3 className="font-display text-3xl leading-tight transition-colors group-hover:text-heritage-gold">{category.title}</h3>
                  <p className={`mt-4 text-sm leading-6 ${category.featured ? 'text-parchment-ivory/45' : 'text-charcoal-text/50'}`}>
                    {category.description}
                  </p>
                </div>
                <span className={`eyebrow mt-10 text-[9px] ${category.featured ? 'text-parchment-ivory/30' : 'text-midnight-navy/30'}`}>
                  {category.count}
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
