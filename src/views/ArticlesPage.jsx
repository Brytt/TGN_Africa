'use client'

import { useMemo, useState } from 'react'
import AnnouncementBar from '../components/AnnouncementBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ArticlesPage({ articles = [], authors = [], topics = [] }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const filters = ['All', ...new Set(articles.map((article) => article.type))]
  const filtered = useMemo(() => activeFilter === 'All' ? articles : articles.filter((article) => article.type === activeFilter), [activeFilter, articles])
  const featured = filtered.slice(0, 2)
  const recent = filtered.slice(2)

  return (
    <div className="min-h-screen bg-white text-charcoal-text">
      <AnnouncementBar />
      <Navbar />
      <main className="font-sans">
        <section className="py-12 md:py-16">
          <div className="page-shell">
            <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-midnight-navy/45">TGN Africa library</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.025em] text-midnight-navy md:text-5xl">Publications</h1>
            {!articles.length ? (
              <div className="mt-12 border border-midnight-navy/10 bg-surface-container-low px-6 py-16 text-center">
                <h2 className="text-xl font-semibold text-midnight-navy">No published content yet</h2>
                <p className="mt-2 text-sm text-charcoal-text/55">Published work will appear here automatically.</p>
              </div>
            ) : (
              <>
                <div className="mt-9 grid gap-6 lg:grid-cols-2">
                  {featured.map((article) => (
                    <a key={article.id} href={`/articles/${article.slug}`} className="group grid overflow-hidden border border-midnight-navy/15 bg-white md:grid-cols-[1.15fr_0.85fr]">
                      <img src={article.image} alt="" className="h-full min-h-[270px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                      <div className="flex flex-col p-6">
                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/50">{article.type}</span>
                        <h2 className="mt-8 text-xl font-semibold leading-tight text-midnight-navy">{article.title}</h2>
                        {article.subtitle && <p className="mt-2 text-sm font-semibold text-midnight-navy/65">{article.subtitle}</p>}
                        <p className="mt-4 text-xs leading-5 text-charcoal-text/60">{article.excerpt}</p>
                        <p className="mt-auto pt-7 text-[11px] text-midnight-navy/60">{article.author} · {article.readingTime}</p>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap gap-3 border-y border-midnight-navy/10 py-5" role="group" aria-label="Filter publications">
                  {filters.map((filter) => <button key={filter} onClick={() => setActiveFilter(filter)} className={`rounded-full px-4 py-2 text-xs font-semibold ${activeFilter === filter ? 'bg-midnight-navy text-white' : 'bg-surface-container-low text-midnight-navy'}`}>{filter}</button>)}
                </div>

                <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recent.map((article) => (
                    <a key={article.id} href={`/articles/${article.slug}`} className="group border border-midnight-navy/10 bg-white">
                      <img src={article.image} alt="" className="aspect-[16/9] w-full object-cover" />
                      <div className="p-5">
                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/45">{article.type} · {article.topic}</span>
                        <h2 className="mt-4 text-lg font-semibold leading-tight text-midnight-navy">{article.title}</h2>
                        <p className="mt-3 line-clamp-3 text-xs leading-5 text-charcoal-text/55">{article.excerpt}</p>
                        <p className="mt-5 text-[10px] text-midnight-navy/50">{article.author} · {article.date}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}

            <div className="mt-12 grid gap-8 border-t border-midnight-navy/10 pt-8 md:grid-cols-2">
              <div><p className="text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/40">Authors</p><div className="mt-3 flex flex-wrap gap-2">{authors.map((author) => <span key={author.id} className="rounded-full bg-surface-container-low px-3 py-1.5 text-xs text-midnight-navy/70">{author.name}</span>)}</div></div>
              <div><p className="text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/40">Main topics</p><div className="mt-3 flex flex-wrap gap-2">{topics.map((topic) => <a key={topic.id} href={`/topics/${topic.slug}`} className="rounded-full bg-surface-container-low px-3 py-1.5 text-xs text-midnight-navy/70">{topic.title}</a>)}</div></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
