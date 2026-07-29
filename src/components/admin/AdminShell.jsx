'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '../../../app/auth/actions'

const navGroups = [
  {
    label: 'Workspace',
    items: [
      { label: 'Analytics', icon: 'monitoring', href: '/admin', permission: 'analytics' },
      { label: 'Content', icon: 'article', href: '/admin/content', permission: 'content' },
      { label: 'Comments', icon: 'forum', href: '/admin/comments', permission: 'comments' },
    ],
  },
  {
    label: 'Manage',
    items: [
      { label: 'Authors', icon: 'group', href: '/admin/authors', permission: 'authors' },
      { label: 'Subscribers', icon: 'mark_email_read', href: '/admin/subscribers', permission: 'subscribers' },
      { label: 'Topics', icon: 'category', href: '/admin/topics', permission: 'topics' },
      { label: 'My account', icon: 'manage_accounts', href: '/admin/account' },
      { label: 'General settings', icon: 'settings', href: '/admin/settings', permission: 'settings' },
    ],
  },
]

export default function AdminShell({ children, profile, authorTier = 'Guest Author', menuAccess = [], dateOfBirth = '' }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchRef = useRef(null)
  const profileRef = useRef(null)
  const notificationsRef = useRef(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notificationsLoading, setNotificationsLoading] = useState(true)
  const [previewNotification, setPreviewNotification] = useState(null)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const displayName = profile?.display_name?.trim() || 'Editorial user'
  const firstName = displayName.split(/\s+/)[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const today = new Date()
  const isBirthday = Boolean(dateOfBirth && Number(dateOfBirth.slice(5, 7)) === today.getMonth() + 1 && Number(dateOfBirth.slice(8, 10)) === today.getDate())
  const isFounder = authorTier === 'Founder'
  const seniorStaff = ['Founder', 'Managing Editor', 'Deputy Editor'].includes(authorTier)
  const contributor = authorTier === 'Contributor'
  const baselineAccess = seniorStaff
    ? ['analytics', 'content', 'comments', 'authors', 'subscribers', 'topics']
    : contributor
      ? ['analytics', 'content', 'comments']
      : ['content']
  if (isFounder) baselineAccess.push('settings')
  const allowedMenus = new Set([...baselineAccess, ...menuAccess])
  const canSeeItem = (item) => !item.permission || allowedMenus.has(item.permission)
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

  useEffect(() => {
    const normalized = query.trim()
    if (!searchOpen || normalized.length < 2) {
      setSearchResults([])
      setSearching(false)
      return undefined
    }
    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setSearching(true)
      try {
        const response = await fetch(`/api/admin/publications?q=${encodeURIComponent(normalized)}`, { signal: controller.signal })
        const result = await response.json()
        if (response.ok) setSearchResults(result.data || [])
      } catch (error) {
        if (error.name !== 'AbortError') setSearchResults([])
      } finally {
        if (!controller.signal.aborted) setSearching(false)
      }
    }, 250)
    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [query, searchOpen])

  useEffect(() => {
    let active = true
    const loadNotifications = async () => {
      try {
        const response = await fetch('/api/admin/notifications', { cache: 'no-store' })
        const result = await response.json()
        if (active && response.ok) setNotifications(result.data || [])
      } catch {
        if (active) setNotifications([])
      } finally {
        if (active) setNotificationsLoading(false)
      }
    }
    loadNotifications()
    const interval = window.setInterval(loadNotifications, 30000)
    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [])

  const unreadNotifications = notifications.filter((item) => !item.read).length

  const previewActivity = async (item) => {
    setPreviewNotification(item)
    if (item.read) return
    setNotifications((current) => current.map((notification) => notification.id === item.id ? { ...notification, read: true } : notification))
    await fetch('/api/admin/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId: item.id, action: 'read' }),
    }).catch(() => {})
  }

  const clearNotification = async (item) => {
    const response = await fetch('/api/admin/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId: item.id, action: 'clear' }),
    })
    if (!response.ok) return
    setNotifications((current) => current.filter((notification) => notification.id !== item.id))
    if (previewNotification?.id === item.id) setPreviewNotification(null)
  }

  const clearAllNotifications = async () => {
    if (!notifications.length || !window.confirm('Clear all of your notifications? This will not affect other users.')) return
    const response = await fetch('/api/admin/notifications', { method: 'DELETE' })
    if (!response.ok) return
    setNotifications([])
    setPreviewNotification(null)
  }

  const notificationTime = (value) => {
    const date = new Date(value)
    const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000))
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(date)
  }

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
            <div className={`flex items-center ${sidebarExpanded ? 'xl:justify-between' : 'xl:flex-col xl:justify-center xl:gap-1'}`}>
              <Link href="/admin" prefetch={false} onMouseEnter={() => router.prefetch('/admin')} className="flex min-w-0 items-center gap-3" aria-label="TGN Admin home">
                <span className="relative h-16 w-14 shrink-0 transition-opacity hover:opacity-90">
                  <img
                    src="/images/brand/the-gospel-network-logo.jpeg"
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
              </Link>
              {sidebarExpanded && (
                <button type="button" onClick={() => setSidebarExpanded(false)} className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-midnight-navy xl:flex" aria-label="Use icon-only sidebar" title="Icon-only sidebar">
                  <span className="material-symbols-outlined text-[19px]">left_panel_close</span>
                </button>
              )}
              {!sidebarExpanded && (
                <button type="button" onClick={() => setSidebarExpanded(true)} className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-midnight-navy xl:flex" aria-label="Expand sidebar" title="Expand sidebar">
                  <span className="material-symbols-outlined text-[19px]">left_panel_open</span>
                </button>
              )}
            </div>

            <nav className={`${mobileOpen ? 'flex' : 'hidden'} absolute left-4 right-4 top-[76px] flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-3 shadow-xl sm:static sm:flex sm:flex-row sm:gap-1 sm:border-0 sm:p-0 sm:shadow-none xl:mt-8 xl:flex-col xl:gap-6`} aria-label="Admin navigation">
              {navGroups.map((group) => (
                <div key={group.label} className="flex flex-col gap-1 sm:flex-row xl:flex-col">
                  {sidebarExpanded && <p className="hidden px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 xl:block">{group.label}</p>}
                  {group.items.filter(canSeeItem).map((item) => {
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
                      <Link key={item.label} href={item.href} prefetch={false} onMouseEnter={() => router.prefetch(item.href)} onFocus={() => router.prefetch(item.href)} onClick={() => setMobileOpen(false)} title={!sidebarExpanded ? item.label : undefined} className={`${itemClass} ${active ? 'bg-midnight-navy text-white shadow-sm' : 'text-slate-500 hover:bg-midnight-navy/5 hover:text-midnight-navy'}`} aria-current={active ? 'page' : undefined} aria-label={item.label}>
                        <span className="material-symbols-outlined shrink-0 text-[21px]">{item.icon}</span>
                        <span className={`text-sm font-medium sm:hidden ${sidebarExpanded ? 'xl:block' : 'xl:hidden'}`}>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              ))}
            </nav>
          </div>

          <div className={`flex items-center gap-1 xl:flex-col ${sidebarExpanded ? 'xl:items-stretch' : 'xl:items-center'}`}>
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
          <header className="sticky top-0 z-30 border-b border-midnight-navy/10 bg-gradient-to-r from-[#f4f7ff] via-white to-[#fff8e8] px-6 py-4 shadow-[0_8px_30px_rgba(15,28,75,0.04)] xl:px-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${isBirthday ? 'bg-heritage-gold text-white' : 'bg-midnight-navy text-white'}`}>
                <span className="material-symbols-outlined text-[22px]">{isBirthday ? 'cake' : 'waving_hand'}</span>
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  <span>TGN Africa Admin</span><span>/</span><span className="text-midnight-navy/60">{authorTier}</span>
                </div>
                <h1 className="truncate text-xl font-semibold tracking-tight text-midnight-navy">{isBirthday ? `Happy birthday, ${firstName}!` : `${greeting}, ${firstName}`}</h1>
                <p className="mt-0.5 hidden text-xs text-slate-400 md:block">{isBirthday ? 'Wishing you a joyful celebration from the editorial team. 🎈' : 'Welcome to your editorial workspace.'}</p>
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
                    {searching ? (
                      <p className="px-3 py-5 text-center text-sm text-slate-400">Searching…</p>
                    ) : searchResults.length ? searchResults.map((item) => (
                      <button key={item.id} type="button" onClick={() => goToContent(item.title)} className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-slate-50">
                        <img src={item.image} alt="" className="h-9 w-9 rounded-xl object-cover" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-slate-900">{item.title}</span>
                          <span className="block text-xs text-slate-400">{item.type} · {item.author}</span>
                        </span>
                      </button>
                    )) : <p className="px-3 py-5 text-center text-sm text-slate-400">{query.trim().length < 2 ? 'Type at least two letters to search.' : 'No content found.'}</p>}
                    <button type="button" onClick={() => goToContent(query)} className="mt-1 w-full rounded-xl bg-midnight-navy/5 px-3 py-2.5 text-sm font-medium text-midnight-navy hover:bg-midnight-navy/10">View all content</button>
                  </div>
                )}
              </div>
              {isFounder && (
                <Link href="/admin/settings" prefetch={false} onMouseEnter={() => router.prefetch('/admin/settings')} className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-100 text-slate-500 transition-colors hover:border-midnight-navy/20 hover:text-midnight-navy sm:flex" title="Settings" aria-label="Settings">
                  <span className="material-symbols-outlined text-[20px]">settings</span>
                </Link>
              )}
              <div className="relative" ref={notificationsRef}>
                <button type="button" onClick={() => { setNotificationsOpen((value) => !value); setPreviewNotification(null) }} className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-100 text-slate-600 hover:bg-slate-50" aria-label={`${unreadNotifications} unread notifications`} aria-expanded={notificationsOpen}>
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  {unreadNotifications > 0 && <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-bold text-white">{unreadNotifications > 9 ? '9+' : unreadNotifications}</span>}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-[min(390px,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                      <div><p className="font-semibold text-slate-900">Editorial notifications</p><p className="mt-0.5 text-[10px] text-slate-400">Updates automatically every 30 seconds</p></div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-midnight-navy/5 px-2.5 py-1 text-[10px] font-semibold text-midnight-navy">{notifications.length} recent</span>
                        {notifications.length > 0 && <button type="button" onClick={clearAllNotifications} className="text-[10px] font-semibold text-red-500 hover:underline">Clear all</button>}
                      </div>
                    </div>
                    <div className="admin-scroll max-h-[430px] overflow-y-auto p-2">
                      {previewNotification ? (
                        <div className="p-3">
                          <button type="button" onClick={() => setPreviewNotification(null)} className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-midnight-navy"><span className="material-symbols-outlined text-[16px]">arrow_back</span>All notifications</button>
                          <span className={`mt-5 grid size-12 place-items-center rounded-xl ${previewNotification.type === 'publication' ? 'bg-emerald-50 text-emerald-600' : previewNotification.type === 'subscriber' ? 'bg-sky-50 text-sky-600' : previewNotification.type === 'comment' ? 'bg-violet-50 text-violet-600' : 'bg-amber-50 text-amber-600'}`}><span className="material-symbols-outlined text-[22px]">{previewNotification.icon}</span></span>
                          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">{notificationTime(previewNotification.createdAt)}</p>
                          <h3 className="mt-2 text-lg font-semibold text-slate-900">{previewNotification.title}</h3>
                          <p className="mt-3 text-sm leading-6 text-slate-600">{previewNotification.detail || previewNotification.description}</p>
                          <div className="mt-6 flex gap-2 border-t border-slate-100 pt-4">
                            <Link href={previewNotification.href} onClick={() => setNotificationsOpen(false)} className="flex-1 rounded-xl bg-midnight-navy px-4 py-3 text-center text-xs font-semibold text-white">View activity</Link>
                            <button type="button" onClick={() => clearNotification(previewNotification)} className="inline-flex items-center gap-1 rounded-xl border border-red-100 px-4 py-3 text-xs font-semibold text-red-500"><span className="material-symbols-outlined text-[16px]">delete</span>Clear</button>
                          </div>
                        </div>
                      ) : notificationsLoading ? <p className="px-3 py-8 text-center text-sm text-slate-400">Loading activity…</p> : notifications.length ? notifications.map((item) => (
                        <div key={item.id} className={`group flex items-center gap-2 rounded-xl p-1 ${item.read ? '' : 'bg-midnight-navy/[0.035]'}`}>
                          <button type="button" onClick={() => previewActivity(item)} className="flex min-w-0 flex-1 gap-3 rounded-xl p-2 text-left hover:bg-slate-50">
                            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${item.type === 'publication' ? 'bg-emerald-50 text-emerald-600' : item.type === 'subscriber' ? 'bg-sky-50 text-sky-600' : item.type === 'comment' ? 'bg-violet-50 text-violet-600' : 'bg-amber-50 text-amber-600'}`}><span className="material-symbols-outlined text-[19px]">{item.icon}</span></span>
                            <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-xs font-semibold text-slate-800">{!item.read && <span className="size-1.5 rounded-full bg-red-500" />}{item.title}</span><span className="shrink-0 text-[10px] text-slate-400">{notificationTime(item.createdAt)}</span></span><span className="mt-1 block line-clamp-2 text-xs leading-5 text-slate-500">{item.description}</span></span>
                          </button>
                          <button type="button" onClick={() => clearNotification(item)} className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-300 opacity-0 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 focus:opacity-100" aria-label={`Clear ${item.title}`}><span className="material-symbols-outlined text-[17px]">close</span></button>
                        </div>
                      )) : <p className="px-3 py-8 text-center text-sm text-slate-400">No recent activity yet.</p>}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative hidden sm:block" ref={profileRef}>
                <button type="button" onClick={() => setProfileOpen((value) => !value)} className="flex items-center gap-3 rounded-full border border-slate-100 p-1 pr-3 hover:bg-slate-50" aria-expanded={profileOpen}>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-midnight-navy/10 text-sm font-semibold text-midnight-navy">{displayName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span>
                  <span className="hidden text-left 2xl:block">
                    <span className="block text-xs font-semibold text-slate-900">{displayName}</span>
                    <span className="block text-[11px] text-slate-500">{authorTier}</span>
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-slate-400">expand_more</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-52 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
                    <Link href="/admin/account" onClick={() => setProfileOpen(false)} className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50">Profile settings</Link>
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
