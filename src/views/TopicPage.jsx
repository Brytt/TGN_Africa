'use client'

import { useMemo, useState } from 'react'
import AnnouncementBar from '../components/AnnouncementBar'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { topicBank, topicBySlug } from '../data/topicBank.generated'

function TopicDirectory() {
  return (
    <main>
      <section className="border-b border-midnight-navy/10 bg-surface-container-low py-14 md:py-20">
        <div className="page-shell max-w-5xl">
          <span className="eyebrow text-midnight-navy/45">Topic Bank</span>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.98] text-midnight-navy md:text-7xl">
            Explore truth by topic.
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-base leading-7 text-midnight-navy/60">
            A growing library of biblical, theological, pastoral, and culturally grounded resources for the African church.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="page-shell grid gap-px overflow-hidden border border-midnight-navy/10 bg-midnight-navy/10 md:grid-cols-2">
          {topicBank.map((topic, index) => (
            <a
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="group flex min-h-52 flex-col justify-between bg-white p-7 transition-colors hover:bg-surface-container-low md:p-9"
            >
              <div className="flex items-start justify-between gap-5">
                <span className="font-sans text-[10px] font-bold tracking-[0.18em] text-midnight-navy/35">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="material-symbols-outlined text-xl text-midnight-navy/35 transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </div>
              <div>
                <h2 className="max-w-xl font-display text-2xl leading-tight text-midnight-navy md:text-3xl">{topic.title}</h2>
                <p className="mt-3 font-sans text-xs uppercase tracking-[0.12em] text-midnight-navy/45">
                  {topic.subtopics.length} subtopics
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}

export default function TopicPage({ topicSlug }) {
  const topic = topicBySlug[topicSlug]
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const visibleSubtopics = useMemo(() => {
    if (!topic || !normalizedQuery) return topic?.subtopics || []
    return topic.subtopics
      .map((subtopic) => ({
        ...subtopic,
        resources: subtopic.resources.filter((resource) => resource.toLowerCase().includes(normalizedQuery)),
      }))
      .filter(
        (subtopic) =>
          subtopic.title.toLowerCase().includes(normalizedQuery) || subtopic.resources.length > 0,
      )
  }, [normalizedQuery, topic])

  if (!topicSlug) {
    return (
      <div className="min-h-screen bg-white text-charcoal-text">
        <AnnouncementBar />
        <Navbar />
        <TopicDirectory />
        <Footer />
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-white text-charcoal-text">
        <AnnouncementBar />
        <Navbar />
        <main className="page-shell py-24 text-center">
          <span className="eyebrow text-midnight-navy/45">Topic not found</span>
          <h1 className="mt-4 font-display text-5xl text-midnight-navy">This topic is not in the library.</h1>
          <a href="/topics" className="editorial-button mt-8 bg-midnight-navy text-white">Browse all topics</a>
        </main>
        <Footer />
      </div>
    )
  }

  const resourceCount = topic.subtopics.reduce((total, subtopic) => total + subtopic.resources.length, 0)

  return (
    <div className="min-h-screen bg-white text-charcoal-text">
      <AnnouncementBar />
      <Navbar />
      <main>
        <section className="border-b border-midnight-navy/10 bg-surface-container-low py-12 md:py-20">
          <div className="page-shell">
            <a href="/topics" className="inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy/50 hover:text-midnight-navy">
              <span aria-hidden="true">←</span> All topics
            </a>
            <div className="mt-8 grid gap-9 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
              <div>
                <span className="eyebrow text-midnight-navy/45">Topic guide</span>
                <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.04] text-midnight-navy md:text-6xl">
                  {topic.title}
                </h1>
                <p className="mt-6 max-w-2xl font-sans text-base leading-7 text-midnight-navy/60">
                  Follow a clear path through the key questions, doctrines, and pastoral concerns within this subject.
                </p>
              </div>
              <div className="grid grid-cols-2 border-y border-midnight-navy/15 py-5 font-sans">
                <div>
                  <span className="block text-2xl font-semibold text-midnight-navy">{topic.subtopics.length}</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/40">Subtopics</span>
                </div>
                <div className="border-l border-midnight-navy/15 pl-5">
                  <span className="block text-2xl font-semibold text-midnight-navy">{resourceCount}</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/40">Resources</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="page-shell grid gap-10 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-16">
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <label htmlFor="topic-filter" className="eyebrow text-[9px] text-midnight-navy/45">Find within this topic</label>
              <div className="mt-3 flex items-center border-b border-midnight-navy/30">
                <span className="material-symbols-outlined mr-2 text-lg text-midnight-navy/35">search</span>
                <input
                  id="topic-filter"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search titles..."
                  className="min-w-0 grow bg-transparent py-3 font-sans text-sm text-midnight-navy outline-none placeholder:text-midnight-navy/30"
                />
              </div>

              <nav className="mt-9 hidden border-t border-midnight-navy/10 pt-6 lg:block" aria-label="On this page">
                <p className="eyebrow text-[9px] text-midnight-navy/40">On this page</p>
                <ol className="mt-4 space-y-3">
                  {topic.subtopics.map((subtopic, index) => (
                    <li key={subtopic.slug}>
                      <a href={`#${subtopic.slug}`} className="group flex gap-3 font-sans text-xs leading-5 text-midnight-navy/55 hover:text-midnight-navy">
                        <span className="text-midnight-navy/25 group-hover:text-midnight-navy/50">{String(index + 1).padStart(2, '0')}</span>
                        {subtopic.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <div>
              <div className="mb-7 flex items-end justify-between border-b border-midnight-navy/15 pb-4">
                <div>
                  <span className="eyebrow text-[9px] text-midnight-navy/40">Library map</span>
                  <h2 className="mt-1 font-display text-3xl text-midnight-navy">Subtopics and resources</h2>
                </div>
                {normalizedQuery && (
                  <button type="button" onClick={() => setQuery('')} className="font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-midnight-navy/45">
                    Clear search
                  </button>
                )}
              </div>

              {visibleSubtopics.length ? (
                <div className="space-y-12">
                  {visibleSubtopics.map((subtopic) => (
                    <article key={subtopic.slug} id={subtopic.slug} className="scroll-mt-36">
                      <div className="flex items-start gap-5">
                        <span className="pt-1 font-sans text-[10px] font-bold tracking-[0.18em] text-midnight-navy/30">
                          {String(topic.subtopics.findIndex((item) => item.slug === subtopic.slug) + 1).padStart(2, '0')}
                        </span>
                        <div className="grow">
                          <h3 className="font-display text-3xl leading-tight text-midnight-navy">{subtopic.title}</h3>
                          <p className="mt-2 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-midnight-navy/35">
                            {subtopic.resources.length} {subtopic.resources.length === 1 ? 'resource' : 'resources'}
                          </p>
                        </div>
                      </div>
                      <ol className="mt-6 grid gap-px overflow-hidden border border-midnight-navy/10 bg-midnight-navy/10 sm:grid-cols-2">
                        {subtopic.resources.map((resource, resourceIndex) => (
                          <li key={resource} className="group flex min-h-24 gap-4 bg-white p-5 transition-colors hover:bg-surface-container-low">
                            <span className="font-sans text-[9px] font-bold tracking-[0.14em] text-midnight-navy/25">
                              {String(resourceIndex + 1).padStart(2, '0')}
                            </span>
                            <span className="font-sans text-sm font-medium leading-5 text-midnight-navy">{resource}</span>
                          </li>
                        ))}
                      </ol>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="border border-midnight-navy/10 px-6 py-14 text-center">
                  <p className="font-display text-2xl text-midnight-navy">No matching resources found.</p>
                  <button type="button" onClick={() => setQuery('')} className="mt-4 font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-midnight-navy/50">
                    Show all resources
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="border-t border-midnight-navy/10 bg-surface-container-low py-14 md:py-20">
          <div className="page-shell">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <span className="eyebrow text-[9px] text-midnight-navy/40">Continue exploring</span>
                <h2 className="mt-2 font-display text-3xl text-midnight-navy md:text-4xl">All other topics</h2>
              </div>
              <a href="/topics" className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-midnight-navy">View topic index →</a>
            </div>
            <div className="mt-8 grid gap-px overflow-hidden border border-midnight-navy/10 bg-midnight-navy/10 md:grid-cols-2 lg:grid-cols-3">
              {topicBank.filter((item) => item.slug !== topic.slug).map((item) => (
                <a key={item.slug} href={`/topics/${item.slug}`} className="group flex min-h-32 flex-col justify-between bg-white p-5 transition-colors hover:bg-midnight-navy">
                  <span className="font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-midnight-navy/35 group-hover:text-white/40">
                    {item.subtopics.length} subtopics
                  </span>
                  <span className="mt-5 font-display text-xl leading-tight text-midnight-navy group-hover:text-white">{item.title}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
