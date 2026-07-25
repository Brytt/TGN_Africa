'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '../../../app/auth/actions'

const navGroups = [
  {
    label: 'Workspace',
    items: [
      { label: 'Analytics', icon: 'monitoring', href: '/admin' },
      { label: 'Content', icon: 'article', href: '/admin/content' },
      { label: 'Comments', icon: 'forum', href: '/admin/comments' },
    ],
  },
  {
    label: 'Manage',
    items: [
      { label: 'Authors', icon: 'group', href: '/admin/authors' },
      { label: 'Topics', icon: 'category', href: '/admin/topics' },
      { label: 'Settings', icon: 'settings', href: '/admin/settings' },
    ],
  },
]

export default function AdminShell({ children, initialSearchResults = [], profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchRef = useRef(null)
  const profileRef = useRef(null)
  const notificationsRef = useRef(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [query, setQuery] = useState('')
  const pageDetails = pathname.startsWith('/admin/content')
    ? { eyebrow: 'Publishing', title: 'Content library', icon: 'article' }
    : pathname.startsWith('/admin/comments')
      ? { eyebrow: 'Community', title: 'Comment moderation', icon: 'forum' }
    : pathname.startsWith('/admin/authors')
      ? { eyebrow: 'Contributors', title: 'Author directory', icon: 'group' }
      : pathname.startsWith('/admin/topics')
        ? { eyebrow: 'Taxonomy', title: 'Topic bank', icon: 'category' }
        : pathname.startsWith('/admin/settings')
          ? { eyebrow: 'Administration', title: 'Platform settings', icon: 'settings' }
          : { eyebrow: 'Performance', title: 'Analytics & reports', icon: 'monitoring' }

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return initialSearchResults.slice(0, 4)
    return initialSearchResults
      .filter((item) => [item.title, item.author, item.type, item.topic].some((value) => value.toLowerCase().includes(normalized)))
      .slice(0, 5)
  }, [initialSearchResults, query])

  useEffect(() => {
    const closeMenus = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setProfileOpen(false)
        setNotificationsOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false)
      if (searchRef.current && !searchRef.current.contains(event.target)) setSearchOpen(false)
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) setNotificationsOpen(false)
    }
    document.addEventListener('keydown', closeMenus)
    document.addEventListener('pointerdown', closeMenus)
    return () => {
      document.removeEventListener('keydown', closeMenus)
      document.removeEventListener('pointerdown', closeMenus)
    }
  }, [])

  const goToContent = (title = '') => {
    const suffix = title ? `?q=${encodeURIComponent(title)}` : ''
    setSearchOpen(false)
    setMobileOpen(false)
    router.push(`/admin/content${suffix}`)
  }

  if (pathname === '/admin/login') return children

  return (
    <div className="admin-app min-h-screen bg-white text-slate-700 antialiased xl:h-screen">
      <div className="admin-shell flex min-h-screen w-full flex-col overflow-hidden bg-white xl:h-screen xl:min-h-0 xl:flex-row">
        <aside className={`relative z-40 flex shrink-0 items-center justify-between border-b border-midnight-navy/10 bg-white px-5 py-4 transition-[width] duration-300 xl:flex-col xl:items-stretch xl:border-b-0 xl:border-r xl:px-3 xl:py-5 ${sidebarExpanded ? 'xl:w-[248px]' : 'xl:w-[88px]'}`}>
          <div className="flex min-w-0 items-center gap-3 xl:flex-col xl:items-stretch">
            <div className={`flex items-center ${sidebarExpanded ? 'xl:justify-between' : 'xl:justify-center'}`}>
              <a href="/admin" className="flex min-w-0 items-center gap-3" aria-label="TGN Admin home">
                <span className="relative h-16 w-14 shrink-0 transition-opacity hover:opacity-90">
                  <img
                    src="/images/brand/tgn-africa-logo-transparent.png"
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </span>
                {sidebarExpanded && (
                  <span className="hidden min-w-0 xl:block">
                    <span className="block truncate text-sm font-bold tracking-tight text-midnight-navy">TGN Africa</span>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Editorial</span>
                  </span>
                )}
              </a>
              {sidebarExpanded && (
                <button type="button" onClick={() => setSidebarExpanded(false)} className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-midnight-navy xl:flex" aria-label="Use icon-only sidebar" title="Icon-only sidebar">
                  <span className="material-symbols-outlined text-[19px]">left_panel_close</span>
                </button>
              )}
            </div>

            <nav className={`${mobileOpen ? 'flex' : 'hidden'} absolute left-4 right-4 top-[76px] flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-3 shadow-xl sm:static sm:flex sm:flex-row sm:gap-1 sm:border-0 sm:p-0 sm:shadow-none xl:mt-8 xl:flex-col xl:gap-6`} aria-label="Admin navigation">
              {navGroups.map((group) => (
                <div key={group.label} className="flex flex-col gap-1 sm:flex-row xl:flex-col">
                  {sidebarExpanded && <p className="hidden px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 xl:block">{group.label}</p>}
                  {group.items.map((item) => {
                    const active = item.href && (pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)))
                    const itemClass = `group flex h-11 items-center gap-3 rounded-xl px-3 transition-colors sm:w-11 sm:justify-center sm:px-0 xl:w-full ${sidebarExpanded ? 'xl:justify-start xl:px-3' : 'xl:justify-center xl:px-0'}`
                    if (item.disabled) {
                      return (
                        <button key={item.label} type="button" disabled title={`${item.label} — coming soon`} className={`${itemClass} text-slate-300`} aria-label={`${item.label}, coming soon`}>
                          <span className="material-symbols-outlined shrink-0 text-[21px]">{item.icon}</span>
                          <span className={`text-sm font-medium sm:hidden ${sidebarExpanded ? 'xl:block' : 'xl:hidden'}`}>{item.label}</span>
                        </button>
                      )
                    }
                    return (
                      <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)} title={!sidebarExpanded ? item.label : undefined} className={`${itemClass} ${active ? 'bg-midnight-navy text-white shadow-sm' : 'text-slate-500 hover:bg-midnight-navy/5 hover:text-midnight-navy'}`} aria-current={active ? 'page' : undefined} aria-label={item.label}>
                        <span className="material-symbols-outlined shrink-0 text-[21px]">{item.icon}</span>
                        <span className={`text-sm font-medium sm:hidden ${sidebarExpanded ? 'xl:block' : 'xl:hidden'}`}>{item.label}</span>
                      </a>
                    )
                  })}
                </div>
              ))}
            </nav>
          </div>

          <div className={`flex items-center gap-1 xl:flex-col ${sidebarExpanded ? 'xl:items-stretch' : 'xl:items-center'}`}>
            {!sidebarExpanded && (
              <button type="button" onClick={() => setSidebarExpanded(true)} className="hidden h-11 w-11 items-center justify-center rounded-xl text-slate-500 hover:bg-midnight-navy/5 hover:text-midnight-navy xl:flex" aria-label="Show sidebar text" title="Show icon and text">
                <span className="material-symbols-outlined text-[20px]">left_panel_open</span>
              </button>
            )}
            <a href="/" className={`flex h-11 items-center gap-3 rounded-xl text-slate-500 transition-colors hover:bg-midnight-navy/5 hover:text-midnight-navy ${sidebarExpanded ? 'xl:px-3' : 'w-11 justify-center'}`} aria-label="View public website">
              <span className="material-symbols-outlined shrink-0 text-[21px]">open_in_new</span>
              {sidebarExpanded && <span className="hidden text-sm font-medium xl:block">View website</span>}
            </a>
            <button type="button" className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 sm:hidden" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen} aria-label="Toggle admin navigation">
              <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="relative z-30 border-b border-midnight-navy/10 bg-white px-6 py-4 xl:px-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-midnight-navy/5 text-midnight-navy">
                <span className="material-symbols-outlined text-[22px]">{pageDetails.icon}</span>
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  <span>Admin</span><span>/</span><span className="text-midnight-navy/60">{pageDetails.eyebrow}</span>
                </div>
                <h1 className="truncate text-xl font-semibold tracking-tight text-midnight-navy">{pageDetails.title}</h1>
              </div>
              <span className="ml-2 hidden h-8 w-px bg-slate-100 2xl:block" />
              <span className="hidden items-center gap-2 text-xs text-slate-400 2xl:flex">
                <span className="material-symbols-outlined text-[17px]">calendar_today</span>
                {new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date())}
              </span>
            </div>
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="relative min-w-0 flex-1 lg:w-[300px] lg:flex-none" ref={searchRef}>
                <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[19px] text-slate-400">search</span>
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value)
                    setSearchOpen(true)
                  }}
                  onFocus={() => setSearchOpen(true)}
                  className="w-full rounded-full border-0 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none ring-midnight-navy/20 placeholder:text-slate-400 focus:ring-2"
                  placeholder="Search content..."
                  aria-label="Search all content"
                />
                {searchOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-[min(390px,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
                    {results.length ? results.map((item) => (
                      <button key={item.id} type="button" onClick={() => goToContent(item.title)} className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-slate-50">
                        <img src={item.image} alt="" className="h-9 w-9 rounded-xl object-cover" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-slate-900">{item.title}</span>
                          <span className="block text-xs text-slate-400">{item.type} · {item.author}</span>
                        </span>
                      </button>
                    )) : <p className="px-3 py-5 text-center text-sm text-slate-400">No content found.</p>}
                    <button type="button" onClick={() => goToContent(query)} className="mt-1 w-full rounded-xl bg-midnight-navy/5 px-3 py-2.5 text-sm font-medium text-midnight-navy hover:bg-midnight-navy/10">View all content</button>
                  </div>
                )}
              </div>
              <a href="/admin/settings" className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-100 text-slate-500 transition-colors hover:border-midnight-navy/20 hover:text-midnight-navy sm:flex" title="Settings" aria-label="Settings">
                <span className="material-symbols-outlined text-[20px]">settings</span>
              </a>
              <div className="relative" ref={notificationsRef}>
                <button type="button" onClick={() => setNotificationsOpen((value) => !value)} className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-100 text-slate-600 hover:bg-slate-50" aria-label="Notifications" aria-expanded={notificationsOpen}>
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-72 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl">
                    <p className="font-semibold text-slate-900">Editorial notifications</p>
                    <p className="mt-3 rounded-xl bg-midnight-navy/5 p-3 text-xs leading-5 text-slate-600">Two drafts are ready for review and one sermon is scheduled this week.</p>
                  </div>
                )}
              </div>
              <div className="relative hidden sm:block" ref={profileRef}>
                <button type="button" onClick={() => setProfileOpen((value) => !value)} className="flex items-center gap-3 rounded-full border border-slate-100 p-1 pr-3 hover:bg-slate-50" aria-expanded={profileOpen}>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-midnight-navy/10 text-sm font-semibold text-midnight-navy">{(profile?.display_name || 'Admin').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span>
                  <span className="hidden text-left 2xl:block">
                    <span className="block text-xs font-semibold text-slate-900">{profile?.display_name || 'Editorial user'}</span>
                    <span className="block text-[11px] capitalize text-slate-500">{profile?.role || 'staff'}</span>
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-slate-400">expand_more</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-52 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
                    <button type="button" className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50">Profile settings</button>
                    <a href="/" className="block rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50">View public site</a>
                    <form action={signOut}><button className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-red-500 hover:bg-red-50">Sign out</button></form>
                  </div>
                )}
              </div>
            </div>
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  )
}
