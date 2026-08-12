'use client'

import { useEffect, useRef, useState } from 'react'
import { contributorItems, navItems, topicGroups } from '../data/content'
import { aboutItems } from '../data/about'

const topicSlugByTitle = Object.fromEntries(topicGroups.flatMap((group) => group.topics).map((title) => [
  title,
  title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
]))

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [topicsOpen, setTopicsOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [contributorsOpen, setContributorsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const searchInputRef = useRef(null)
  const topicsMenuRef = useRef(null)
  const aboutMenuRef = useRef(null)
  const contributorsMenuRef = useRef(null)
  const topicsCloseTimer = useRef(null)
  const aboutCloseTimer = useRef(null)
  const contributorsCloseTimer = useRef(null)

  useEffect(() => {
    setDarkMode(document.documentElement.dataset.theme === 'dark')
    const closeOnResize = () => {
      if (window.innerWidth >= 1024) setOpen(false)
    }
    window.addEventListener('resize', closeOnResize)
    return () => window.removeEventListener('resize', closeOnResize)
  }, [])

  const toggleTheme = () => {
    setDarkMode((current) => {
      const next = !current
      document.documentElement.dataset.theme = next ? 'dark' : 'light'
      window.localStorage.setItem('tgn-theme', next ? 'dark' : 'light')
      return next
    })
  }

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setTopicsOpen(false)
        setAboutOpen(false)
        setContributorsOpen(false)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [searchOpen])

  useEffect(() => {
    const query = searchQuery.trim()
    if (!searchOpen || query.length < 2) {
      setSearchResults([])
      setSearchLoading(false)
      return undefined
    }
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setSearchLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`, { signal: controller.signal })
        const result = await response.json()
        if (response.ok) {
          const data = result.data || {}
          setSearchResults([...(data.articles || []), ...(data.topics || []), ...(data.contributors || []), ...(data.resources || [])].slice(0, 10))
        }
      } catch (error) {
        if (error.name !== 'AbortError') setSearchResults([])
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false)
      }
    }, 220)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [searchOpen, searchQuery])

  useEffect(() => {
    const closeMenusOutside = (event) => {
      if (window.innerWidth >= 1024 && topicsMenuRef.current && !topicsMenuRef.current.contains(event.target)) {
        setTopicsOpen(false)
      }
      if (window.innerWidth >= 1024 && aboutMenuRef.current && !aboutMenuRef.current.contains(event.target)) {
        setAboutOpen(false)
      }
      if (window.innerWidth >= 1024 && contributorsMenuRef.current && !contributorsMenuRef.current.contains(event.target)) {
        setContributorsOpen(false)
      }
    }
    document.addEventListener('pointerdown', closeMenusOutside)
    return () => document.removeEventListener('pointerdown', closeMenusOutside)
  }, [])

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const suggestions = searchResults

  return (
    <>
    <nav className="tgn-navbar fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/95 shadow-[0_6px_24px_rgba(13,34,64,0.06)] backdrop-blur-xl">
      <div className="page-shell relative flex h-20 items-center justify-between md:h-[88px]">
        <div className="flex min-w-0 items-center gap-4 xl:gap-6">
          <a href="/" className="flex shrink-0 items-center gap-3" aria-label="TGN Africa home">
            <span className="relative block h-[76px] w-[76px] md:h-[86px] md:w-[86px]">
              <img
                src="/images/brand/the-gospel-network-logo.jpeg"
                alt=""
                className="tgn-nav-logo-light absolute inset-0 h-full w-full object-contain"
              />
              <img
                src="/images/brand/the-gospel-network-footer-logo-transparent.png"
                alt=""
                className="tgn-nav-logo-dark absolute inset-0 hidden h-full w-full object-contain"
              />
            </span>
            <span className="hidden 2xl:block">
              <span className="block text-[13px] font-extrabold uppercase tracking-[0.13em] text-midnight-navy">TGN Africa</span>
              <span className="mt-0.5 block text-[8px] font-bold uppercase tracking-[0.16em] text-midnight-navy/45">The Gospel Network</span>
            </span>
          </a>

          <div className="hidden items-center gap-6 lg:flex xl:gap-8">
            {navItems.map((item) => (
              item.label === 'Categories' ? (
                <div
                  key={item.label}
                  ref={topicsMenuRef}
                  onMouseEnter={() => {
                    window.clearTimeout(topicsCloseTimer.current)
                    setTopicsOpen(true)
                    setAboutOpen(false)
                    setContributorsOpen(false)
                  }}
                  onMouseLeave={() => {
                    topicsCloseTimer.current = window.setTimeout(() => setTopicsOpen(false), 180)
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setTopicsOpen((value) => !value)
                      setSearchOpen(false)
                      setAboutOpen(false)
                      setContributorsOpen(false)
                    }}
                    className="flex items-center gap-1 text-[17px] font-medium text-black transition-opacity hover:opacity-55"
                    aria-haspopup="true"
                    aria-expanded={topicsOpen}
                    aria-controls="desktop-topics-menu"
                  >
                    Categories
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
                          <div><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-midnight-navy/45">Topic Bank</span><p className="mt-1 font-display text-[1.7rem] text-midnight-navy">Explore theological resources</p></div>
                        </div>
                        <a href="/topics" onClick={() => setTopicsOpen(false)} className="inline-flex items-center gap-2 border-b border-midnight-navy pb-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-midnight-navy">
                          View all topics →
                        </a>
                      </div>

                      <div className="grid grid-cols-4 gap-0">
                        {topicGroups.map((group, groupIndex) => (
                          <section key={group.label} className="min-h-[245px] border-l border-midnight-navy/10 px-6 first:border-l-0 first:pl-0 last:pr-0">
                            <div className="mb-4 flex items-start justify-between gap-3">
                              <p className="text-[11px] font-semibold uppercase leading-4 tracking-[0.13em] text-midnight-navy">{group.label}</p>
                              <span className="text-[10px] tabular-nums text-midnight-navy/25">{String(groupIndex + 1).padStart(2, '0')}</span>
                            </div>
                            <div className="mb-4 h-0.5 w-8 bg-heritage-gold" />
                            <ul className="space-y-2.5">
                              {group.topics.map((topic) => (
                                <li key={topic}>
                                  <a
                                    href={`/topics/${topicSlugByTitle[topic]}`}
                                    onClick={() => setTopicsOpen(false)}
                                    className="group/topic flex items-start justify-between gap-3 text-[15px] leading-[1.4] text-midnight-navy/65 transition-colors hover:text-midnight-navy"
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
              ) : item.label === 'Contributors' ? (
                <div
                  key={item.label}
                  ref={contributorsMenuRef}
                  className="relative"
                  onMouseEnter={() => {
                    window.clearTimeout(contributorsCloseTimer.current)
                    setContributorsOpen(true)
                    setTopicsOpen(false)
                    setAboutOpen(false)
                  }}
                  onMouseLeave={() => {
                    contributorsCloseTimer.current = window.setTimeout(() => setContributorsOpen(false), 180)
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setContributorsOpen((value) => !value)
                      setTopicsOpen(false)
                      setAboutOpen(false)
                      setSearchOpen(false)
                    }}
                    className="flex items-center gap-1 text-[17px] font-medium text-black transition-opacity hover:opacity-55"
                    aria-haspopup="true"
                    aria-expanded={contributorsOpen}
                    aria-controls="desktop-contributors-menu"
                  >
                    Contributors
                    <span className={`material-symbols-outlined text-[17px] transition-transform ${contributorsOpen ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                  </button>
                  <div id="desktop-contributors-menu" className={`absolute left-1/2 top-[calc(100%+25px)] w-[420px] -translate-x-1/2 border border-midnight-navy/15 bg-gradient-to-b from-[#f3f6fb] to-white p-3 shadow-[0_24px_60px_rgba(13,34,64,0.16)] transition-all duration-200 ${contributorsOpen ? 'pointer-events-auto visible translate-y-0 opacity-100' : 'pointer-events-none invisible -translate-y-2 opacity-0'}`}>
                    <div className="flex items-end justify-between border-b border-midnight-navy/15 px-3 pb-4 pt-3">
                      <div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-midnight-navy text-white"><span className="material-symbols-outlined text-[19px]">groups</span></span><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-midnight-navy/45">Editorial team</p><p className="mt-1 font-display text-[1.7rem] leading-none text-midnight-navy">Meet our contributors</p></div></div>
                      <a href="/authors" onClick={() => setContributorsOpen(false)} className="text-[10px] font-bold uppercase tracking-[0.12em] text-midnight-navy">View all →</a>
                    </div>
                    <div className="grid grid-cols-2 gap-1 pt-2">
                      {contributorItems.map((contributor) => (
                        <a key={contributor.href} href={contributor.href} onClick={() => setContributorsOpen(false)} className="group px-3 py-3 hover:bg-[#f3f6fb]">
                          <span className="block text-[15px] font-semibold text-midnight-navy">{contributor.name}</span>
                          <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.1em] text-midnight-navy/40 group-hover:text-heritage-gold">{contributor.role}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : item.label === 'About Us' ? (
                <div
                  key={item.label}
                  ref={aboutMenuRef}
                  className="relative"
                  onMouseEnter={() => {
                    window.clearTimeout(aboutCloseTimer.current)
                    setAboutOpen(true)
                    setTopicsOpen(false)
                    setContributorsOpen(false)
                  }}
                  onMouseLeave={() => {
                    aboutCloseTimer.current = window.setTimeout(() => setAboutOpen(false), 180)
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setAboutOpen((value) => !value)
                      setTopicsOpen(false)
                      setContributorsOpen(false)
                      setSearchOpen(false)
                    }}
                    className="flex items-center gap-1 text-[17px] font-medium text-black transition-opacity hover:opacity-55"
                    aria-haspopup="true"
                    aria-expanded={aboutOpen}
                    aria-controls="desktop-about-menu"
                  >
                    About Us
                    <span className={`material-symbols-outlined text-[17px] transition-transform ${aboutOpen ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                  </button>
                  <div
                    id="desktop-about-menu"
                    className={`absolute right-0 top-[calc(100%+25px)] w-[460px] border border-midnight-navy/15 bg-gradient-to-b from-[#f3f6fb] to-white p-3 shadow-[0_24px_60px_rgba(13,34,64,0.16)] transition-all duration-200 ${
                      aboutOpen ? 'pointer-events-auto visible translate-y-0 opacity-100' : 'pointer-events-none invisible -translate-y-2 opacity-0'
                    }`}
                  >
                    <div className="flex items-center gap-3 border-b border-midnight-navy/15 px-3 pb-4 pt-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-midnight-navy text-white"><span className="material-symbols-outlined text-[19px]">info</span></span>
                      <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-midnight-navy/45">About The Gospel Network</p><p className="mt-1 font-display text-[1.7rem] leading-none text-midnight-navy">Discover our story</p></div>
                    </div>
                    <div className="grid gap-1 pt-2">
                      {aboutItems.map((aboutItem) => (
                        <a
                          key={aboutItem.href}
                          href={aboutItem.href}
                          onClick={() => setAboutOpen(false)}
                          className="group grid grid-cols-[38px_1fr_auto] items-center gap-3 px-3 py-3 transition-colors hover:bg-[#f3f6fb]"
                        >
                          <span className="grid size-9 place-items-center rounded-full bg-midnight-navy/5 text-midnight-navy" aria-hidden="true"><span className="material-symbols-outlined text-[18px]">{aboutItem.icon}</span></span>
                          <span>
                            <span className="block text-[15px] font-semibold text-midnight-navy">{aboutItem.label}</span>
                            <span className="mt-0.5 block text-[12px] leading-5 text-midnight-navy/45">{aboutItem.description}</span>
                          </span>
                          <span className="text-midnight-navy/25 transition-transform group-hover:translate-x-1 group-hover:text-heritage-gold">→</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[17px] font-medium text-black transition-opacity hover:opacity-55"
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
            onClick={toggleTheme}
            className="grid size-10 place-items-center rounded-full border border-midnight-navy/15 text-midnight-navy transition-colors hover:bg-midnight-navy hover:text-white"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            <span className="material-symbols-outlined text-[19px]">{darkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchOpen((value) => !value)
              setTopicsOpen(false)
              setAboutOpen(false)
              setContributorsOpen(false)
            }}
            className="flex items-center gap-2 text-[14px] font-medium text-black transition-opacity hover:opacity-55"
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
          >
            <span className="material-symbols-outlined text-[19px]">{searchOpen ? 'close' : 'search'}</span>
            <span className="hidden sm:inline">Search</span>
          </button>
          <a
            href="/subscribe"
            className="tgn-nav-subscribe hidden border border-midnight-navy bg-midnight-navy px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-midnight-navy xl:inline-flex"
          >
            Subscribe
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
                if (normalizedQuery.length >= 2) window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
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
                {normalizedQuery ? 'Best matches' : 'Search the complete library'}
              </p>
              {searchLoading ? <p className="border-t border-midnight-navy/10 py-5 font-sans text-sm text-midnight-navy/45">Searching articles, topics, tags, categories, and contributors…</p> : suggestions.length > 0 ? (
                <div className="divide-y divide-midnight-navy/10 border-t border-midnight-navy/10">
                  {suggestions.map((suggestion) => (
                    <a
                      key={`${suggestion.kind}-${suggestion.href}`}
                      href={suggestion.href}
                      className="group flex items-center justify-between gap-5 py-3"
                    >
                      <span className="min-w-0"><span className="block truncate font-sans text-sm text-midnight-navy md:text-base">{suggestion.title}</span>{suggestion.meta && <span className="mt-0.5 block truncate text-[10px] text-midnight-navy/40">{suggestion.meta}</span>}</span>
                      <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.15em] text-midnight-navy/35 group-hover:text-midnight-navy">
                        {suggestion.kind} →
                      </span>
                    </a>
                  ))}
                  <a href={`/search?q=${encodeURIComponent(searchQuery.trim())}`} className="block py-4 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-midnight-navy">View all search results →</a>
                </div>
              ) : (
                <p className="border-t border-midnight-navy/10 py-4 font-sans text-sm text-midnight-navy/45">
                  {normalizedQuery.length < 2 ? 'Type at least two letters. Search by title, phrase, topic, category, tag, Scripture, or contributor.' : 'No matches yet. Try a broader term or a different spelling.'}
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
              item.label === 'Categories' ? (
                <div key={item.label} className="border-b border-midnight-navy/10">
                  <button
                    type="button"
                    onClick={() => setTopicsOpen((value) => !value)}
                    className="flex w-full items-center justify-between py-4 text-sm font-medium text-black"
                    aria-expanded={topicsOpen}
                  >
                    Categories
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
              ) : item.label === 'Contributors' ? (
                <div key={item.label} className="border-b border-midnight-navy/10">
                  <button
                    type="button"
                    onClick={() => {
                      setContributorsOpen((value) => !value)
                      setTopicsOpen(false)
                      setAboutOpen(false)
                    }}
                    className="flex w-full items-center justify-between py-4 text-sm font-medium text-black"
                    aria-expanded={contributorsOpen}
                  >
                    Contributors
                    <span className={`material-symbols-outlined transition-transform ${contributorsOpen ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                  </button>
                  {contributorsOpen && (
                    <div className="mb-5 border-l-2 border-midnight-navy pl-4">
                      {contributorItems.map((contributor) => (
                        <a key={contributor.href} href={contributor.href} onClick={() => { setOpen(false); setContributorsOpen(false) }} className="flex items-center justify-between gap-4 border-b border-midnight-navy/10 py-3 last:border-0">
                          <span className="text-[13px] font-medium text-midnight-navy">{contributor.name}</span>
                          <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-midnight-navy/40">{contributor.role}</span>
                        </a>
                      ))}
                      <a href="/authors" onClick={() => { setOpen(false); setContributorsOpen(false) }} className="mt-3 block text-[10px] font-bold uppercase tracking-[0.12em] text-midnight-navy">View all contributors →</a>
                    </div>
                  )}
                </div>
              ) : item.label === 'About Us' ? (
                <div key={item.label} className="border-b border-midnight-navy/10">
                  <button
                    type="button"
                    onClick={() => {
                      setAboutOpen((value) => !value)
                      setTopicsOpen(false)
                    }}
                    className="flex w-full items-center justify-between py-4 text-sm font-medium text-black"
                    aria-expanded={aboutOpen}
                  >
                    About Us
                    <span className={`material-symbols-outlined transition-transform ${aboutOpen ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                  </button>
                  {aboutOpen && (
                    <div className="mb-5 border-l-2 border-midnight-navy pl-4">
                      {aboutItems.map((aboutItem) => (
                        <a
                          key={aboutItem.href}
                          href={aboutItem.href}
                          onClick={() => {
                            setOpen(false)
                            setAboutOpen(false)
                          }}
                          className="flex items-center gap-3 border-b border-midnight-navy/10 py-3 last:border-0"
                        >
                          <span className="grid size-9 place-items-center rounded-full bg-midnight-navy/5 text-midnight-navy" aria-hidden="true"><span className="material-symbols-outlined text-[18px]">{aboutItem.icon}</span></span>
                          <span className="min-w-0 flex-1 text-[13px] font-medium text-midnight-navy">{aboutItem.label}</span>
                          <span className="text-midnight-navy/35">→</span>
                        </a>
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
              href="/subscribe"
              onClick={() => setOpen(false)}
              className="mt-6 bg-midnight-navy px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-parchment-ivory"
            >
              Subscribe
            </a>
          </div>
        </div>
      )}
    </nav>
    <div className="h-20 md:h-[88px]" aria-hidden="true" />
    </>
  )
}
