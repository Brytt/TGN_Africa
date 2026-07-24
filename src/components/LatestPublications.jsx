'use client'

import { useMemo, useState } from 'react'
import Reveal from './Reveal'
import { publicationFilters } from '../data/content'

const publications = [
  {
    id: '1',
    category: 'Articles',
    label: 'Article — 8 min read',
    title: 'The Solas of the Reformation in the African Context',
    excerpt: 'How the bedrock principles of the Reformation find unique resonance and application within the vibrant cultural landscapes of modern Africa.',
    image: '/images/publications/featured-study.jpg',
    author: 'Daniel Adebayo',
    scripture: 'Romans 1:16–17',
  },
  {
    id: '2',
    category: 'Devotionals',
    label: 'Devotional',
    title: 'Morning Grace: Psalm 23',
    excerpt: 'A contemplative reading on the Shepherd who remains near.',
    image: '/images/publications/morning-devotional.jpg',
    author: 'Nomsa Dlamini',
    scripture: 'Psalm 23:1–6',
  },
  {
    id: '3',
    category: 'Bible Study',
    label: 'Bible Study',
    title: 'Exodus: God’s Covenant Promise',
    excerpt: 'A study of God’s faithful deliverance through Israel’s wilderness.',
    image: '/images/publications/scripture-notes.jpg',
    author: 'Kwame Mensah',
    scripture: 'Exodus 6:6–8',
  },
  {
    id: '4',
    category: 'Poems',
    label: 'Poem',
    title: 'Song of the Redeemed',
    excerpt: 'A poetic meditation on Christ’s victory and our restored praise.',
    image: '/images/publications/church-teaching.jpg',
    author: 'Ama K. Boateng',
    scripture: 'Revelation 5:9–10',
  },
  {
    id: '5',
    category: 'Articles',
    label: 'Article — 6 min read',
    title: 'Living Gospel Rhythm in Daily Life',
    excerpt: 'Practical ways the gospel shapes worship, work, and community in an African context.',
    image: '/images/publications/family-scripture.jpg',
    author: 'Samuel K. Owusu',
    scripture: 'Colossians 3:16–17',
  },
  {
    id: '6',
    category: 'Devotionals',
    label: 'Devotional',
    title: 'Evening Praise: A Psalm for Rest',
    excerpt: 'Reflecting on the goodness of God at the close of each day.',
    image: '/images/publications/scripture-notes.jpg',
    author: 'Nomsa Dlamini',
    scripture: 'Psalm 4:8',
  },
  {
    id: '7',
    category: 'Poems',
    label: 'Poem',
    title: 'The Promise of Morning',
    excerpt: 'A lyrical meditation on new mercies and redeemed hope.',
    image: '/images/publications/family-scripture.jpg',
    author: 'Ama K. Boateng',
    scripture: 'Lamentations 3:22–23',
  },
]

export default function LatestPublications() {
  const [activeFilter, setActiveFilter] = useState('All')
  const displayedPublications = useMemo(
    () =>
      activeFilter === 'All'
        ? publications.slice(0, 6)
        : publications.filter((publication) => publication.category === activeFilter).slice(0, 6),
    [activeFilter]
  )
  const featuredPublication = displayedPublications[0]
  const secondaryPublication = displayedPublications[1]
  const recentPublications = displayedPublications.slice(2)

  return (
    <section id="latest" className="bg-white py-16 font-sans md:py-24">
      <div className="page-shell">
        <div className="mb-10 md:flex md:items-end md:justify-between">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-midnight-navy/45">From the editors</span>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.025em] text-midnight-navy md:text-5xl">Latest Publications</h2>
          </div>
          <a href="/articles" className="mt-5 inline-flex items-center justify-center border border-midnight-navy bg-midnight-navy px-6 py-3 text-[10px] font-bold uppercase tracking-[0.17em] text-white transition-colors hover:bg-white hover:text-midnight-navy md:mt-0">
            Explore more <span className="ml-2" aria-hidden="true">→</span>
          </a>
        </div>

        <div className="mb-8 flex flex-wrap gap-x-6 gap-y-3 border-y border-midnight-navy/10 py-4" role="group" aria-label="Publication categories">
          {publicationFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`text-[10px] font-bold uppercase tracking-[0.14em] transition-opacity hover:opacity-55 ${
                activeFilter === filter ? 'text-midnight-navy' : 'text-midnight-navy/45'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="md:min-h-[690px]">
        <div className={`grid gap-6 ${secondaryPublication ? 'lg:grid-cols-[1fr_250px]' : ''}`}>
          <Reveal>
            <a href={`/articles/${featuredPublication.id}`} className="group grid h-full overflow-hidden border border-midnight-navy/15 bg-white md:grid-cols-[1.3fr_0.7fr]">
              <div className="overflow-hidden bg-surface-container">
                <img
                  src={featuredPublication.image}
                  alt={featuredPublication.title}
                  className="h-full min-h-[290px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-col p-6">
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/50">{featuredPublication.label}</span>
                <span className="mt-3 text-[11px] font-semibold text-midnight-navy/60">Scripture: {featuredPublication.scripture}</span>
                <h3 className="mt-8 text-xl font-semibold leading-tight text-midnight-navy transition-opacity group-hover:opacity-65">
                  {featuredPublication.title}
                </h3>
                <p className="mt-4 text-xs leading-5 text-charcoal-text/60">{featuredPublication.excerpt}</p>
                <div className="mt-auto flex items-center gap-2 pt-7">
                  <span className="grid size-6 place-items-center rounded-full bg-midnight-navy text-[9px] font-bold text-white">{featuredPublication.author.charAt(0)}</span>
                  <span className="text-[11px] text-midnight-navy/70">{featuredPublication.author}</span>
                </div>
              </div>
            </a>
          </Reveal>

          {secondaryPublication && (
            <Reveal delay={0.06}>
              <a href={`/articles/${secondaryPublication.id}`} className="group flex h-full flex-col overflow-hidden border border-midnight-navy/15 bg-white">
                <div className="overflow-hidden bg-surface-container">
                  <img src={secondaryPublication.image} alt="" className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                </div>
                <div className="flex grow flex-col p-5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/50">{secondaryPublication.label}</span>
                  <span className="mt-2 text-[11px] font-semibold text-midnight-navy/60">Scripture: {secondaryPublication.scripture}</span>
                  <h3 className="mt-4 text-lg font-semibold leading-tight text-midnight-navy transition-opacity group-hover:opacity-65">{secondaryPublication.title}</h3>
                  <p className="mt-3 text-xs leading-5 text-charcoal-text/60">{secondaryPublication.excerpt}</p>
                  <div className="mt-auto flex items-center gap-2 pt-6">
                    <span className="grid size-6 place-items-center rounded-full bg-midnight-navy text-[9px] font-bold text-white">{secondaryPublication.author.charAt(0)}</span>
                    <span className="text-[11px] text-midnight-navy/70">{secondaryPublication.author}</span>
                  </div>
                </div>
              </a>
            </Reveal>
          )}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentPublications.map((publication, index) => (
                <Reveal key={publication.id} delay={0.05 * (index + 1)}>
                  <a href={`/articles/${publication.id}`} className="group flex h-full flex-col border border-midnight-navy/10 bg-white">
                    <div className="relative overflow-hidden bg-surface-container">
                      <img src={publication.image} alt="" className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                      <span className="absolute left-3 top-3 bg-midnight-navy px-2 py-1 text-[7px] font-bold uppercase tracking-[0.14em] text-white">{publication.category}</span>
                    </div>
                    <div className="flex grow flex-col p-5">
                      <h3 className="text-base font-semibold leading-tight text-midnight-navy transition-opacity group-hover:opacity-65">{publication.title}</h3>
                      <p className="mt-2 text-[11px] font-semibold text-midnight-navy/60">Scripture: {publication.scripture}</p>
                      <p className="mt-3 text-xs leading-5 text-charcoal-text/60">{publication.excerpt}</p>
                      <div className="mt-auto flex items-center gap-2 pt-6">
                        <span className="grid size-6 place-items-center rounded-full bg-midnight-navy text-[9px] font-bold text-white">{publication.author.charAt(0)}</span>
                        <span className="text-[11px] text-midnight-navy/70">{publication.author}</span>
                      </div>
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
