'use client'

import { useEffect, useMemo, useState } from 'react'
import AnnouncementBar from '../components/AnnouncementBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import { topicGroups } from '../data/content'
import { topicSlugByTitle } from '../data/topicBank.generated'

// Shared with the dynamic article reader until editorial content moves to the CMS.
export const articles = [
  {
    id: 1,
    type: 'Article',
    title: 'The Solas of the Reformation in the African Context',
    subtitle: 'Ancient convictions for the church today',
    excerpt: 'How the bedrock principles of the Reformation speak with clarity and urgency to churches across modern Africa.',
    author: 'Daniel Adebayo',
    date: 'July 21, 2026',
    readingTime: '8 min read',
    image: '/images/publications/featured-study.jpg',
    topic: 'Theology',
    scripture: 'Romans 1:16–17',
  },
  {
    id: 2,
    type: 'Article',
    title: 'The Local Church Is More Than a Sunday Gathering',
    subtitle: 'Recovering the household of God',
    excerpt: 'The church is not an event we attend but a covenant people through whom Christ displays his wisdom.',
    author: 'Kwame Mensah',
    date: 'July 18, 2026',
    readingTime: '6 min read',
    image: '/images/publications/church-teaching.jpg',
    topic: 'Church',
    scripture: 'Ephesians 2:19–22',
  },
  {
    id: 3,
    type: 'Bible Study',
    title: 'Exodus and the God Who Keeps Covenant',
    subtitle: 'Reading deliverance through the whole Bible',
    excerpt: 'Israel’s rescue reveals the character of the God who remembers his promises and redeems a people for himself.',
    author: 'Nomsa Dlamini',
    date: 'July 15, 2026',
    readingTime: '10 min read',
    image: '/images/publications/scripture-notes.jpg',
    topic: 'Scripture',
    scripture: 'Exodus 6:6–8',
  },
  {
    id: 4,
    type: 'Article',
    title: 'When the Prosperity Gospel Meets the Cross',
    subtitle: 'Why suffering cannot be edited out of discipleship',
    excerpt: 'The cross confronts every message that treats God as a path to comfort, status, or material success.',
    author: 'Samuel K. Owusu',
    date: 'July 12, 2026',
    readingTime: '7 min read',
    image: '/images/publications/family-scripture.jpg',
    topic: 'Discernment',
    scripture: '1 Corinthians 1:18',
  },
  {
    id: 5,
    type: 'Devotional',
    title: 'Morning Grace: The Shepherd Who Stays Near',
    subtitle: 'A meditation on Psalm 23',
    excerpt: 'The comfort of Psalm 23 is not the absence of valleys but the presence of the Shepherd within them.',
    author: 'Nomsa Dlamini',
    date: 'July 8, 2026',
    readingTime: '4 min read',
    image: '/images/publications/morning-devotional.jpg',
    topic: 'Christian Life',
    scripture: 'Psalm 23:1–6',
  },
  {
    id: 6,
    type: 'Article',
    title: 'Christian Faithfulness in the African Public Square',
    subtitle: 'Truth, courage, and neighbor love',
    excerpt: 'Public witness begins with churches formed by Scripture and Christians committed to costly integrity.',
    author: 'Kwame Mensah',
    date: 'July 4, 2026',
    readingTime: '9 min read',
    image: '/images/publications/church-teaching.jpg',
    topic: 'Culture',
    scripture: 'Matthew 5:13–16',
  },
  {
    id: 7,
    type: 'Article',
    title: 'Why Ordinary Faithfulness Still Matters',
    subtitle: 'Serving Christ without needing a platform',
    excerpt: 'The kingdom often advances through quiet obedience that will never become visible or impressive.',
    author: 'Daniel Adebayo',
    date: 'July 1, 2026',
    readingTime: '6 min read',
    image: '/images/publications/featured-study.jpg',
    topic: 'Discipleship',
    scripture: '1 Corinthians 15:58',
  },
  {
    id: 8,
    type: 'Bible Study',
    title: 'Learning to Pray with the Psalms',
    subtitle: 'When our own words are not enough',
    excerpt: 'God has given his people a vocabulary for praise, lament, confession, and hope.',
    author: 'Nomsa Dlamini',
    date: 'June 28, 2026',
    readingTime: '8 min read',
    image: '/images/publications/scripture-notes.jpg',
    topic: 'Prayer',
    scripture: 'Psalm 86:1–7',
  },
  {
    id: 9,
    type: 'Article',
    title: 'A Theology of Work for African Cities',
    subtitle: 'Vocation, dignity, and neighbor love',
    excerpt: 'Daily work becomes an arena for worship when it is received as service before the Lord.',
    author: 'Samuel K. Owusu',
    date: 'June 24, 2026',
    readingTime: '7 min read',
    image: '/images/publications/family-scripture.jpg',
    topic: 'Work',
    scripture: 'Colossians 3:23–24',
  },
  {
    id: 10,
    type: 'Devotional',
    title: 'New Mercies for an Uncertain Morning',
    subtitle: 'Hope from Lamentations 3',
    excerpt: 'Christian hope does not deny grief; it remembers the steadfast love of God in the middle of it.',
    author: 'Kwame Mensah',
    date: 'June 20, 2026',
    readingTime: '4 min read',
    image: '/images/publications/morning-devotional.jpg',
    topic: 'Hope',
    scripture: 'Lamentations 3:22–23',
  },
]

const filters = ['All', 'Article', 'Bible Study', 'Devotional']
const authors = ['Daniel Adebayo', 'Kwame Mensah', 'Nomsa Dlamini', 'Samuel K. Owusu']

export default function ArticlesPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const filteredArticles = useMemo(
    () => activeFilter === 'All' ? articles : articles.filter((article) => article.type === activeFilter),
    [activeFilter]
  )
  const featured = articles.slice(0, 2)
  const recent = filteredArticles.filter((article) => !featured.some((featuredArticle) => featuredArticle.id === article.id))
  const pageSize = 12
  const totalPages = Math.max(1, Math.ceil(recent.length / pageSize))
  const paginatedArticles = recent.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilter])

  return (
    <div className="min-h-screen bg-white text-charcoal-text">
      <AnnouncementBar />
      <Navbar />
      <main className="font-sans">
        <section className="py-12 md:py-16">
          <div className="page-shell">
            <h1 className="text-4xl font-semibold tracking-[-0.025em] text-midnight-navy md:text-5xl">Articles</h1>

            <div className="mt-9 grid gap-6 lg:grid-cols-[1fr_250px]">
              <Reveal>
                <a href={`/articles/${featured[0].id}`} className="group grid h-full overflow-hidden border border-midnight-navy/15 bg-white md:grid-cols-[1.3fr_0.7fr]">
                  <div className="overflow-hidden bg-surface-container">
                    <img src={featured[0].image} alt="" className="h-full min-h-[290px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                  </div>
                  <div className="flex flex-col p-6">
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/50">{featured[0].type}</span>
                    <span className="mt-3 text-[11px] font-semibold text-midnight-navy/60">Scripture: {featured[0].scripture}</span>
                    <h2 className="mt-8 text-xl font-semibold leading-tight text-midnight-navy">{featured[0].title}</h2>
                    <p className="mt-2 text-[13px] font-semibold leading-5 text-midnight-navy/70">{featured[0].subtitle}</p>
                    <p className="mt-4 text-xs leading-5 text-charcoal-text/60">{featured[0].excerpt}</p>
                    <div className="mt-auto flex items-center gap-2 pt-7">
                      <span className="grid size-6 place-items-center rounded-full bg-midnight-navy text-[9px] font-bold text-white">{featured[0].author.charAt(0)}</span>
                      <span className="text-[11px] text-midnight-navy/70">{featured[0].author}</span>
                    </div>
                  </div>
                </a>
              </Reveal>

              <Reveal delay={0.06}>
                <a href={`/articles/${featured[1].id}`} className="group flex h-full flex-col overflow-hidden border border-midnight-navy/15 bg-white">
                  <div className="overflow-hidden bg-surface-container">
                    <img src={featured[1].image} alt="" className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                  </div>
                  <div className="flex grow flex-col p-5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/50">{featured[1].type}</span>
                  <span className="mt-2 text-[11px] font-semibold text-midnight-navy/60">Scripture: {featured[1].scripture}</span>
                  <h2 className="mt-4 text-lg font-semibold leading-tight text-midnight-navy">{featured[1].title}</h2>
                    <p className="mt-2 text-[12px] font-semibold leading-5 text-midnight-navy/65">{featured[1].subtitle}</p>
                    <p className="mt-3 text-xs leading-5 text-charcoal-text/60">{featured[1].excerpt}</p>
                    <div className="mt-auto flex items-center gap-2 pt-6">
                      <span className="grid size-6 place-items-center rounded-full bg-midnight-navy text-[9px] font-bold text-white">{featured[1].author.charAt(0)}</span>
                      <span className="text-[11px] text-midnight-navy/70">{featured[1].author}</span>
                    </div>
                  </div>
                </a>
              </Reveal>
            </div>

            <div className="mt-9 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <a href="/#authors" className="text-[11px] font-semibold text-midnight-navy">All Authors →</a>
                <p className="mt-3 text-[8px] font-bold uppercase tracking-[0.14em] text-midnight-navy/40">Our teachers</p>
                <ul className="mt-2 space-y-1.5">
                  {authors.map((author) => <li key={author}><a href="#author" className="text-[11px] text-midnight-navy/65">{author}</a></li>)}
                </ul>
              </div>
              {topicGroups.slice(0, 3).map((group) => (
                <div key={group.label}>
                  <a href="/topics" className="text-[11px] font-semibold text-midnight-navy">{group.label} →</a>
                  <p className="mt-3 text-[8px] font-bold uppercase tracking-[0.14em] text-midnight-navy/40">Popular topics</p>
                  <ul className="mt-2 space-y-1.5">
                    {group.topics.slice(0, 6).map((topic) => <li key={topic}><a href={`/topics/${topicSlugByTitle[topic]}`} className="text-[11px] leading-4 text-midnight-navy/65">{topic}</a></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low py-10 md:py-14">
          <div className="page-shell">
            <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-medium text-midnight-navy">Recent</h2>
              <div className="flex flex-wrap gap-5" role="group" aria-label="Filter articles">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`text-[9px] font-bold uppercase tracking-[0.14em] ${activeFilter === filter ? 'text-midnight-navy' : 'text-midnight-navy/35'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {paginatedArticles.map((article) => (
                <Reveal key={article.id}>
                  <a href={`/articles/${article.id}`} className="group flex h-full flex-col border border-midnight-navy/10 bg-white">
                    <div className="relative overflow-hidden bg-surface-container">
                      <img src={article.image} alt="" className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                      <span className="absolute left-3 top-3 bg-midnight-navy px-2 py-1 text-[7px] font-bold uppercase tracking-[0.14em] text-white">{article.type}</span>
                    </div>
                    <div className="flex grow flex-col p-5">
                      <h3 className="text-base font-semibold leading-tight text-midnight-navy">{article.title}</h3>
                      <p className="mt-2 text-[11px] font-semibold text-midnight-navy/60">Scripture: {article.scripture}</p>
                      <p className="mt-2 text-[12px] font-semibold leading-4 text-midnight-navy/65">{article.subtitle}</p>
                      <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.08em] text-midnight-navy/40">{article.date}</p>
                      <p className="mt-3 text-xs leading-5 text-charcoal-text/60">{article.excerpt}</p>
                      <div className="mt-auto flex items-center gap-2 pt-6">
                        <span className="grid size-6 place-items-center rounded-full bg-midnight-navy text-[9px] font-bold text-white">{article.author.charAt(0)}</span>
                        <span className="text-[11px] text-midnight-navy/70">{article.author}</span>
                      </div>
                    </div>
                  </a>
                </Reveal>
              ))}
              {recent.length === 0 && <p className="text-sm text-midnight-navy/50">No recent resources in this format yet.</p>}
            </div>

            {recent.length > 0 && (
              <nav className="mt-9 flex items-center justify-between border-t border-midnight-navy/10 pt-6" aria-label="Article pagination">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy transition-opacity disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <span aria-hidden="true">←</span> Previous
                </button>
                <span className="text-xs font-semibold tracking-[0.12em] text-midnight-navy/55">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy transition-opacity disabled:cursor-not-allowed disabled:opacity-25"
                >
                  Next <span aria-hidden="true">→</span>
                </button>
              </nav>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
