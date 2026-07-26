'use client'

import { useEffect, useMemo, useState } from 'react'
import AnnouncementBar from '../components/AnnouncementBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PAGE_SIZE = 24
const categories = ['All', 'Article', 'Devotional', 'Bible Study', 'Sermon', 'Poem']

function paginationItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
  const pages = new Set([1, total, current - 1, current, current + 1])
  if (current <= 4) [2, 3, 4, 5].forEach((page) => pages.add(page))
  if (current >= total - 3) [total - 4, total - 3, total - 2, total - 1].forEach((page) => pages.add(page))
  const sorted = [...pages].filter((page) => page > 0 && page <= total).sort((a, b) => a - b)
  return sorted.flatMap((page, index) => index && page - sorted[index - 1] > 1 ? ['…', page] : [page])
}

export default function ArticlesPage({ articles = [], authors = [], topics = [] }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [page, setPage] = useState(1)
  const filters = [...categories, ...new Set(articles.map((article) => article.type).filter((type) => !categories.includes(type)))]
  const filtered = useMemo(() => activeFilter === 'All' ? articles : articles.filter((article) => article.type === activeFilter), [activeFilter, articles])
  const featured = filtered.slice(0, 2)
  const recent = filtered.slice(2)
  const pageCount = Math.max(1, Math.ceil(recent.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const visible = recent.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  useEffect(() => setPage(1), [activeFilter])
  const goToPage = (nextPage) => {
    setPage(nextPage)
    document.getElementById('publication-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-[#f7f7f6] text-charcoal-text">
      <AnnouncementBar /><Navbar />
      <main className="font-sans">
        <section className="py-12 md:py-16">
          <div className="page-shell">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40">TGN Africa library</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.025em] text-black md:text-5xl">Publications</h1>
            {featured.length > 0 && <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,2.15fr)_minmax(280px,0.85fr)]">
              {featured.map((article, index) => <a key={article.id} href={`/articles/${article.slug}`} className={`group overflow-hidden border border-black/10 bg-white ${index === 0 ? 'grid md:grid-cols-[1.2fr_0.8fr]' : 'flex flex-col'}`}>
                <img src={article.image} alt="" className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${index === 0 ? 'h-full min-h-[300px]' : 'aspect-[16/9]'}`} />
                <div className="flex flex-1 flex-col p-5 md:p-6"><p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-black/40">{article.type}</p><h2 className={`${index === 0 ? 'mt-8 text-2xl' : 'mt-4 text-xl'} font-semibold leading-tight text-black`}>{article.title}</h2>{article.subtitle && <p className="mt-2 text-sm font-medium text-black/60">{article.subtitle}</p>}<p className="mt-4 line-clamp-4 text-xs leading-5 text-black/55">{article.excerpt}</p><div className="mt-auto flex items-center gap-2 pt-7">{article.authorImage && <img src={article.authorImage} alt="" className="h-7 w-7 rounded-full object-cover" />}<span className="text-[10px] text-black/55">{article.author} · {article.date}</span></div></div>
              </a>)}
            </div>}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-y border-black/10 py-4" aria-label="Filter publications">
              {filters.map((filter) => <button key={filter} onClick={() => setActiveFilter(filter)} className={`text-[11px] font-medium text-black ${activeFilter === filter ? 'underline decoration-2 underline-offset-[17px]' : 'opacity-45 hover:opacity-75'}`}>{filter}</button>)}
            </div>

            <div id="publication-grid" className="scroll-mt-28">
              {!visible.length ? <div className="mt-10 border border-black/10 bg-white px-6 py-16 text-center text-sm text-black/50">No publications in this category.</div> : <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {visible.map((article) => (
                  <a key={article.id} href={`/articles/${article.slug}`} className="group flex min-h-[350px] flex-col border border-black/10 bg-white transition-transform hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative overflow-hidden"><img src={article.image} alt="" className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" /><span className="absolute left-3 top-3 bg-black/75 px-2 py-1 text-[8px] font-medium uppercase tracking-wide text-white">{article.type}</span></div>
                    <div className="flex grow flex-col p-4">
                      <p className="text-[9px] uppercase tracking-wide text-black/40">{article.date} · {article.readingTime}</p>
                      <h2 className="mt-3 line-clamp-3 text-[15px] font-semibold leading-[1.35] text-black">{article.title}</h2>
                      <p className="mt-2 line-clamp-3 text-[11px] leading-5 text-black/55">{article.excerpt}</p>
                      <p className="mt-auto pt-5 text-[10px] font-medium text-black/55">{article.author}</p>
                    </div>
                  </a>
                ))}
              </div>}
            </div>

            {pageCount > 1 && <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Publication pages">
              <button type="button" disabled={safePage === 1} onClick={() => goToPage(safePage - 1)} className="mr-2 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-medium text-black disabled:opacity-30">← Previous</button>
              {paginationItems(safePage, pageCount).map((item, index) => item === '…' ? <span key={`ellipsis-${index}`} className="px-1 text-black/35">…</span> : <button key={item} type="button" onClick={() => goToPage(item)} className={`grid h-9 min-w-9 place-items-center rounded-full px-2 text-xs ${item === safePage ? 'bg-black font-semibold text-white' : 'bg-white text-black hover:bg-black/5'}`} aria-current={item === safePage ? 'page' : undefined}>{item}</button>)}
              <button type="button" disabled={safePage === pageCount} onClick={() => goToPage(safePage + 1)} className="ml-2 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-medium text-black disabled:opacity-30">Next →</button>
            </nav>}

            <section className="mt-14 border-t border-black/10 pt-9"><div className="mb-7 flex items-end justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-black/40">Explore the library</p><h2 className="mt-2 text-2xl font-semibold text-black">Main topics</h2></div><a href="/topics" className="text-xs font-medium text-black">All topics →</a></div>
              <div className="grid gap-x-9 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{topics.slice(0, 8).map((topic) => <div key={topic.id}><a href={`/topics/${topic.slug}`} className="text-base font-semibold text-black hover:underline">{topic.title} →</a><p className="mt-2 text-[9px] font-semibold uppercase tracking-wide text-black/35">Popular topics</p><ul className="mt-3 space-y-2">{topic.subtopics.slice(0, 6).map((subtopic) => <li key={subtopic.id}><a href={`/topics/${subtopic.slug}`} className="text-xs leading-5 text-black/55 hover:text-black">{subtopic.title}</a></li>)}</ul></div>)}</div>
            </section>
            <section className="mt-12 border-t border-black/10 pt-8"><p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-black/40">Contributing authors</p><div className="mt-3 flex flex-wrap gap-2">{authors.map((author) => <span key={author.id} className="rounded-full bg-white px-3 py-1.5 text-xs text-black/65">{author.name}</span>)}</div></section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
