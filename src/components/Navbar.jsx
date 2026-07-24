'use client'

import { useEffect, useRef, useState } from 'react'
import { navItems, topicGroups } from '../data/content'
import { topicSlugByTitle } from '../data/topicBank.generated'

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
      if (event.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [searchOpen])

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const suggestions = normalizedQuery
    ? searchItems.filter((item) => item.label.toLowerCase().includes(normalizedQuery)).slice(0, 7)
    : searchItems.slice(-3)

  return (
    <nav className="sticky top-0 z-50 border-b border-midnight-navy/10 bg-white/95 backdrop-blur-xl">
      <div className="page-shell flex h-20 items-center justify-between md:h-24">
        <div className="hidden items-center gap-8 lg:flex xl:gap-11">
            {navItems.map((item) => (
              item.label === 'Topic' ? (
                <div key={item.label} className="group">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-[14px] font-bold uppercase tracking-[0.16em] text-midnight-navy transition-opacity hover:opacity-55"
                    aria-haspopup="true"
                  >
                    Topic
                    <span className="material-symbols-outlined text-[17px] transition-transform group-hover:rotate-180">keyboard_arrow_down</span>
                  </button>

                  <div className="pointer-events-none absolute left-0 right-0 top-full border-y border-midnight-navy/10 bg-white opacity-0 shadow-[0_24px_55px_rgba(13,34,64,0.10)] transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                    <div className="page-shell py-9">
                      <div className="mb-7 flex items-end justify-between border-b border-midnight-navy/10 pb-5">
                        <div>
                          <span className="eyebrow text-[9px] text-midnight-navy/45">Topic Bank</span>
                          <p className="mt-1 font-display text-2xl text-midnight-navy">Explore theological resources</p>
                        </div>
                        <a href="/topics" className="text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy">
                          View all topics →
                        </a>
                      </div>

                      <div className="grid grid-cols-4 gap-9">
                        {topicGroups.map((group) => (
                          <div key={group.label}>
                            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-midnight-navy/45">{group.label}</p>
                            <ul className="space-y-3">
                              {group.topics.map((topic) => (
                                <li key={topic}>
                                  <a href={`/topics/${topicSlugByTitle[topic]}`} className="block text-[15px] leading-5 text-midnight-navy transition-opacity hover:opacity-55">
                                    {topic}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[14px] font-bold uppercase tracking-[0.16em] text-midnight-navy transition-opacity hover:opacity-55"
                >
                  {item.label}
                </a>
              )
            ))}
        </div>

        <div className="ml-auto flex items-center gap-3 md:gap-5">
          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-midnight-navy transition-opacity hover:opacity-55"
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
          >
            <span className="material-symbols-outlined text-[19px]">{searchOpen ? 'close' : 'search'}</span>
            <span className="hidden sm:inline">Search</span>
          </button>
          <a
            href="/topics"
            className="hidden border border-midnight-navy bg-midnight-navy px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-midnight-navy xl:inline-flex"
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
                    className="flex w-full items-center justify-between py-4 text-base font-extrabold uppercase tracking-[0.14em]"
                    aria-expanded={topicsOpen}
                  >
                    Topic
                    <span className={`material-symbols-outlined transition-transform ${topicsOpen ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                  </button>
                  {topicsOpen && (
                    <div className="pb-5">
                      {topicGroups.map((group) => (
                        <div key={group.label} className="mb-5 last:mb-0">
                          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-midnight-navy/45">{group.label}</p>
                          <div className="space-y-2">
                            {group.topics.map((topic) => (
                              <a
                                key={topic}
                                href={`/topics/${topicSlugByTitle[topic]}`}
                                onClick={() => {
                                  setOpen(false)
                                  setTopicsOpen(false)
                                }}
                                className="block text-base leading-5 text-midnight-navy/75"
                              >
                                {topic}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-midnight-navy/10 py-4 text-base font-extrabold uppercase tracking-[0.14em]"
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
