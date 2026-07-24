'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { adminPublications } from '../../data/adminContent'

const navItems = [
  { label: 'Overview', icon: 'dashboard', href: '/admin' },
  { label: 'Content', icon: 'article', href: '/admin/content' },
  { label: 'Authors', icon: 'group', disabled: true },
  { label: 'Topics', icon: 'category', disabled: true },
  { label: 'Media', icon: 'image', disabled: true },
  { label: 'Analytics', icon: 'monitoring', disabled: true },
]

export default function AdminShell({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchRef = useRef(null)
  const profileRef = useRef(null)
  const notificationsRef = useRef(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return adminPublications.slice(0, 4)
    return adminPublications
      .filter((item) => [item.title, item.author, item.type, item.topic].some((value) => value.toLowerCase().includes(normalized)))
      .slice(0, 5)
  }, [query])

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

  return (
    <div className="admin-app min-h-screen bg-white text-slate-700 antialiased xl:h-screen">
      <div className="admin-shell flex min-h-screen w-full flex-col overflow-hidden bg-white xl:h-screen xl:min-h-0 xl:flex-row">
        <aside className="relative z-40 flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4 xl:w-[88px] xl:flex-col xl:border-b-0 xl:border-r xl:px-0 xl:py-7">
          <div className="flex items-center gap-3 xl:flex-col xl:gap-8">
            <a href="/admin" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm transition-colors hover:bg-indigo-700" aria-label="TGN Admin home">
              <span className="material-symbols-outlined text-[25px]">auto_stories</span>
            </a>
            <nav className={`${mobileOpen ? 'flex' : 'hidden'} absolute left-4 right-4 top-[76px] flex-col gap-1 rounded-3xl border border-slate-100 bg-white p-3 shadow-xl sm:static sm:flex sm:flex-row sm:border-0 sm:p-0 sm:shadow-none xl:flex-col xl:gap-3`} aria-label="Admin navigation">
              {navItems.map((item) => {
                const active = item.href && (pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)))
                if (item.disabled) {
                  return (
                    <button key={item.label} type="button" disabled title={`${item.label} — coming soon`} className="flex h-12 items-center gap-3 rounded-2xl px-4 text-slate-300 sm:w-12 sm:justify-center sm:px-0" aria-label={`${item.label}, coming soon`}>
                      <span className="material-symbols-outlined text-[21px]">{item.icon}</span>
                      <span className="text-sm font-medium sm:hidden">{item.label}</span>
                    </button>
                  )
                }
                return (
                  <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className={`flex h-12 items-center gap-3 rounded-2xl px-4 transition-colors sm:w-12 sm:justify-center sm:px-0 ${active ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'}`} aria-current={active ? 'page' : undefined} aria-label={item.label}>
                    <span className="material-symbols-outlined text-[21px]">{item.icon}</span>
                    <span className="text-sm font-medium sm:hidden">{item.label}</span>
                  </a>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-1 xl:flex-col xl:gap-3">
            <button type="button" disabled className="hidden h-12 w-12 items-center justify-center rounded-2xl text-slate-300 sm:flex" title="Help — coming soon" aria-label="Help, coming soon">
              <span className="material-symbols-outlined text-[21px]">help</span>
            </button>
            <a href="/" className="flex h-12 w-12 items-center justify-center rounded-2xl text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600" aria-label="View public website">
              <span className="material-symbols-outlined text-[21px]">logout</span>
            </a>
            <button type="button" className="flex h-12 w-12 items-center justify-center rounded-2xl text-slate-500 sm:hidden" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen} aria-label="Toggle admin navigation">
              <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="relative z-30 flex flex-col gap-5 border-b border-slate-100 px-6 py-6 lg:flex-row lg:items-center lg:justify-between xl:border-b-0 xl:px-10 xl:pb-4 xl:pt-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Good morning, Amara</h1>
              <p className="mt-1 text-sm text-slate-500">Here is today&apos;s publishing overview</p>
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
                  className="w-full rounded-full border-0 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none ring-indigo-600/20 placeholder:text-slate-400 focus:ring-2"
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
                    <button type="button" onClick={() => goToContent(query)} className="mt-1 w-full rounded-xl bg-indigo-50 px-3 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100">View all content</button>
                  </div>
                )}
              </div>
              <button type="button" disabled className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-100 text-slate-400 sm:flex" title="Settings — coming soon" aria-label="Settings, coming soon">
                <span className="material-symbols-outlined text-[20px]">settings</span>
              </button>
              <div className="relative" ref={notificationsRef}>
                <button type="button" onClick={() => setNotificationsOpen((value) => !value)} className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-100 text-slate-600 hover:bg-slate-50" aria-label="Notifications" aria-expanded={notificationsOpen}>
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-72 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl">
                    <p className="font-semibold text-slate-900">Editorial notifications</p>
                    <p className="mt-3 rounded-xl bg-indigo-50 p-3 text-xs leading-5 text-slate-600">Two drafts are ready for review and one sermon is scheduled this week.</p>
                  </div>
                )}
              </div>
              <div className="relative hidden sm:block" ref={profileRef}>
                <button type="button" onClick={() => setProfileOpen((value) => !value)} className="flex items-center gap-3 rounded-full border border-slate-100 p-1 pr-3 hover:bg-slate-50" aria-expanded={profileOpen}>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">AN</span>
                  <span className="hidden text-left 2xl:block">
                    <span className="block text-xs font-semibold text-slate-900">Amara Nwosu</span>
                    <span className="block text-[11px] text-slate-500">Managing editor</span>
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-slate-400">expand_more</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-52 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
                    <button type="button" className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50">Profile settings</button>
                    <a href="/" className="block rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50">View public site</a>
                  </div>
                )}
              </div>
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  )
}
