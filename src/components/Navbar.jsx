'use client'

import { useEffect, useRef, useState } from 'react'
import { navItems, topicGroups } from '../data/content'

const topicSlugByTitle = Object.fromEntries(topicGroups.flatMap((group) => group.topics).map((title) => [
  title,
  title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
]))

const searchItems = [
  ...topicGroups.flatMap((group) => group.topics.map((topic) => ({ label: topic, type: 'Topic', href: `/topics/${topicSlugByTitle[topic]}` }))),
  { label: 'The Solas of the Reformation in the African Context', type: 'Article', href: '/articles/1' },
  { label: 'The Local Church Is More Than a Sunday Gathering', type: 'Article', href: '/articles/2' },
  { label: 'Exodus and the God Who Keeps Covenant', type: 'Bible Study', href: '/articles/3' },
  { label: 'When the Prosperity Gospel Meets the Cross', type: 'Article', href: '/articles/4' },
  { label: 'Morning Grace: The Shepherd Who Stays Near', type: 'Devotional', href: '/articles/5' },
  { label: 'Christian Faithfulness in the African Public Square', type: 'Article', href: '/articles/6' },
  { label: 'Daniel Adebayo', type: 'Author', href: '/#authors' },
  { label: 'Kwame Mensah', type: 'Author', href: '/#authors' },
  { label: 'Nomsa Dlamini', type: 'Author', href: '/#authors' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [topicsOpen, setTopicsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)
  const topicsMenuRef = useRef(null)

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 1024) setOpen(false)
    }
    window.addEventListener('resize', closeOnResize)
    return () => window.removeEventListener('resize', closeOnResize)
  }, [])

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setTopicsOpen(false)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [searchOpen])

  useEffect(() => {
    const closeTopicsOutside = (event) => {
      if (window.innerWidth >= 1024 && topicsMenuRef.current && !topicsMenuRef.current.contains(event.target)) {
        setTopicsOpen(false)
      }
    }
    document.addEventListener('pointerdown', closeTopicsOutside)
    return () => document.removeEventListener('pointerdown', closeTopicsOutside)
  }, [])

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const suggestions = normalizedQuery
    ? searchItems.filter((item) => item.label.toLowerCase().includes(normalizedQuery)).slice(0, 7)
    : searchItems.slice(-3)

  return (
    <nav className="sticky top-0 z-50 border-b border-black/10 bg-white/95 shadow-[0_6px_24px_rgba(13,34,64,0.06)] backdrop-blur-xl">
      <div className="page-shell relative flex h-16 items-center justify-between md:h-[72px]">
        <div className="flex min-w-0 items-center gap-7 xl:gap-10">
          <a href="/" className="flex shrink-0 items-center gap-3" aria-label="TGN Africa home">
            <span className="relative block h-12 w-11 md:h-14 md:w-12">
              <img
                src="/images/brand/tgn-africa-logo-transparent.png"
                alt=""
                className="absolute inset-0 h-full w-full object-contain"
              />
            </span>
            <span className="hidden 2xl:block">
              <span className="block text-[13px] font-extrabold uppercase tracking-[0.13em] text-midnight-navy">TGN Africa</span>
              <span className="mt-0.5 block text-[8px] font-bold uppercase tracking-[0.16em] text-midnight-navy/45">The Gospel Network</span>
            </span>
          </a>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex xl:gap-9">
            {navItems.map((item) => (
              item.label === 'Topic' ? (
                <div key={item.label} ref={topicsMenuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setTopicsOpen((value) => !value)
                      setSearchOpen(false)
                    }}
                    className="flex items-center gap-1 text-[13px] font-medium text-black transition-opacity hover:opacity-55"
                    aria-haspopup="true"
                    aria-expanded={topicsOpen}
                    aria-controls="desktop-topics-menu"
                  >
                    Topic
                    <span className={`material-symbols-outlined text-[17px] transition-transform ${topicsOpen ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                  </button>

                  <div
                    id="desktop-topics-menu"
                    className={`absolute left-1/2 top-full w-screen -translate-x-1/2 border-y border-midnight-navy/15 bg-gradient-to-b from-[#f3f6fb] to-white shadow-[0_26px_60px_rgba(13,34,64,0.14)] transition-all duration-200 ${
                      topicsOpen ? 'pointer-events-auto visible opacity-100' : 'pointer-events-none invisible opacity-0'
                    }`}
                  >
                    <div className="page-shell py-8">
                      <div className="mb-7 flex items-end justify-between border-b border-midnight-navy/15 pb-5">
                        <div className="flex items-center gap-4">
                          <span className="grid h-11 w-11 place-items-center rounded-full bg-midnight-navy text-white"><span className="material-symbols-outlined text-[20px]">library_books</span></span>
                          <div><span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-midnight-navy/45">Topic Bank</span><p className="mt-1 font-display text-2xl text-midnight-navy">Explore theological resources</p></div>
                        </div>
                        <a href="/topics" onClick={() => setTopicsOpen(false)} className="inline-flex items-center gap-2 border-b border-midnight-navy pb-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-midnight-navy">
                          View all topics →
                        </a>
                      </div>

                      <div className="grid grid-cols-4 gap-0">
                        {topicGroups.map((group, groupIndex) => (
                          <section key={group.label} className="min-h-[245px] border-l border-midnight-navy/10 px-6 first:border-l-0 first:pl-0 last:pr-0">
                            <div className="mb-4 flex items-start justify-between gap-3">
                              <p className="text-[10px] font-semibold uppercase leading-4 tracking-[0.13em] text-midnight-navy">{group.label}</p>
                              <span className="text-[10px] tabular-nums text-midnight-navy/25">{String(groupIndex + 1).padStart(2, '0')}</span>
                            </div>
                            <div className="mb-4 h-0.5 w-8 bg-heritage-gold" />
                            <ul className="space-y-2.5">
                              {group.topics.map((topic) => (
                                <li key={topic}>
                                  <a
                                    href={`/topics/${topicSlugByTitle[topic]}`}
                                    onClick={() => setTopicsOpen(false)}
                                    className="group/topic flex items-start justify-between gap-3 text-[13px] leading-[1.35] text-midnight-navy/65 transition-colors hover:text-midnight-navy"
                                  >
                                    <span>{topic}</span><span className="shrink-0 text-heritage-gold opacity-0 transition-opacity group-hover/topic:opacity-100">→</span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </section>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[13px] font-medium text-black transition-opacity hover:opacity-55"
                >
                  {item.label}
                </a>
              )
            ))}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3 md:gap-5">
          <button
            type="button"
            onClick={() => {
              setSearchOpen((value) => !value)
              setTopicsOpen(false)
            }}
            className="flex items-center gap-2 text-[12px] font-medium text-black transition-opacity hover:opacity-55"
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
          >
            <span className="material-symbols-outlined text-[19px]">{searchOpen ? 'close' : 'search'}</span>
            <span className="hidden sm:inline">Search</span>
          </button>
          <a
            href="/topics"
            className="hidden border border-black bg-black px-4 py-2.5 text-[10px] font-semibold text-white transition-colors hover:bg-white hover:text-black xl:inline-flex"
          >
            Explore resources
          </a>
          <button
            type="button"
            className="grid size-10 place-items-center lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="absolute left-0 right-0 top-full z-20 border-y border-midnight-navy/10 bg-white shadow-[0_24px_55px_rgba(13,34,64,0.10)]">
          <div className="page-shell py-7 md:py-9">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                if (suggestions[0]) window.location.href = suggestions[0].href
              }}
            >
              <label htmlFor="site-search" className="text-[9px] font-bold uppercase tracking-[0.17em] text-midnight-navy/40">
                Search TGN resources
              </label>
              <div className="mt-3 flex items-center border-b-2 border-midnight-navy">
                <span className="material-symbols-outlined mr-3 text-2xl text-midnight-navy/45">search</span>
                <input
                  ref={searchInputRef}
                  id="site-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search articles, topics, Scripture, or authors..."
                  autoComplete="off"
                  className="min-w-0 grow bg-transparent py-3 font-sans text-xl text-midnight-navy outline-none placeholder:text-midnight-navy/30 md:text-2xl"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-midnight-navy/45">
                    Clear
                  </button>
                )}
              </div>
            </form>

            <div className="mt-5">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/35">
                {normalizedQuery ? 'Suggestions' : 'Popular searches'}
              </p>
              {suggestions.length > 0 ? (
                <div className="divide-y divide-midnight-navy/10 border-t border-midnight-navy/10">
                  {suggestions.map((suggestion) => (
                    <a
                      key={`${suggestion.type}-${suggestion.label}`}
                      href={suggestion.href}
                      className="group flex items-center justify-between gap-5 py-3"
                    >
                      <span className="font-sans text-sm text-midnight-navy md:text-base">{suggestion.label}</span>
                      <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/35 group-hover:text-midnight-navy">
                        {suggestion.type} →
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="border-t border-midnight-navy/10 py-4 font-sans text-sm text-midnight-navy/45">
                  No suggestions yet. Try a broader word such as “church,” “gospel,” or “Scripture.”
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {open && (
        <div id="mobile-navigation" className="border-t border-midnight-navy/10 bg-parchment-ivory lg:hidden">
          <div className="page-shell flex flex-col py-6">
            {navItems.map((item) => (
              item.label === 'Topic' ? (
                <div key={item.label} className="border-b border-midnight-navy/10">
                  <button
                    type="button"
                    onClick={() => setTopicsOpen((value) => !value)}
                    className="flex w-full items-center justify-between py-4 text-sm font-medium text-black"
                    aria-expanded={topicsOpen}
                  >
                    Topic
                    <span className={`material-symbols-outlined transition-transform ${topicsOpen ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                  </button>
                  {topicsOpen && (
                    <div className="space-y-3 pb-5">
                      {topicGroups.map((group) => (
                        <section key={group.label} className="rounded-2xl border border-black/10 bg-white p-4">
                          <p className="mb-3 border-b border-black/10 pb-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-black/45">{group.label}</p>
                          <div className="space-y-1">
                            {group.topics.map((topic) => (
                              <a
                                key={topic}
                                href={`/topics/${topicSlugByTitle[topic]}`}
                                onClick={() => {
                                  setOpen(false)
                                  setTopicsOpen(false)
                                }}
                                className="block rounded-lg px-2 py-2 text-sm leading-5 text-black/65 hover:bg-black/5 hover:text-black"
                              >
                                {topic}
                              </a>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-midnight-navy/10 py-4 text-sm font-medium text-black"
                >
                  {item.label}
                </a>
              )
            ))}
            <a
              href="/topics"
              onClick={() => setOpen(false)}
              className="mt-6 bg-midnight-navy px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-parchment-ivory"
            >
              Explore resources
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
