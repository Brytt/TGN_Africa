'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { adminPublications } from '../../data/adminContent'

const types = ['All types', 'Article', 'Devotional', 'Bible Study', 'Sermon', 'Poem']
const statuses = ['All statuses', 'Published', 'Draft', 'In review', 'Scheduled', 'Archived']
const statusStyles = {
  Published: 'bg-emerald-50 text-emerald-600',
  Draft: 'bg-amber-50 text-amber-600',
  'In review': 'bg-indigo-50 text-indigo-600',
  Scheduled: 'bg-sky-50 text-sky-600',
  Archived: 'bg-slate-100 text-slate-500',
}

function SelectControl({ label, value, onChange, options }) {
  return (
    <label className="relative min-w-[145px]">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full appearance-none rounded-full border border-slate-200 bg-white py-2.5 pl-4 pr-9 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-indigo-600/20">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
      <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[17px] text-slate-400">expand_more</span>
    </label>
  )
}

export default function ContentManager() {
  const searchParams = useSearchParams()
  const menuRef = useRef(null)
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [type, setType] = useState('All types')
  const [status, setStatus] = useState('All statuses')
  const [sort, setSort] = useState('Newest first')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState([])
  const [activeMenu, setActiveMenu] = useState(null)
  const [notice, setNotice] = useState('')
  const pageSize = 6

  useEffect(() => {
    const closeMenu = (event) => {
      if (event.key === 'Escape' || (menuRef.current && !menuRef.current.contains(event.target))) setActiveMenu(null)
    }
    document.addEventListener('pointerdown', closeMenu)
    document.addEventListener('keydown', closeMenu)
    return () => {
      document.removeEventListener('pointerdown', closeMenu)
      document.removeEventListener('keydown', closeMenu)
    }
  }, [])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const result = adminPublications.filter((item) => {
      const matchesSearch = !normalized || [item.title, item.author, item.id, item.topic, item.type].some((value) => value.toLowerCase().includes(normalized))
      return matchesSearch && (type === 'All types' || item.type === type) && (status === 'All statuses' || item.status === status)
    })
    return [...result].sort((a, b) => {
      if (sort === 'Title A–Z') return a.title.localeCompare(b.title)
      if (sort === 'Most viewed') return b.views - a.views
      return new Date(b.publishedAt) - new Date(a.publishedAt)
    })
  }, [query, sort, status, type])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  useEffect(() => {
    setPage(1)
  }, [query, sort, status, type])

  const announce = (message) => {
    setNotice(message)
    setActiveMenu(null)
    window.setTimeout(() => setNotice(''), 2800)
  }

  const toggleAll = () => {
    const visibleIds = visible.map((item) => item.id)
    const allSelected = visibleIds.every((id) => selected.includes(id))
    setSelected((current) => allSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])])
  }

  const resetFilters = () => {
    setQuery('')
    setType('All types')
    setStatus('All statuses')
    setSort('Newest first')
  }

  return (
    <main className="admin-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-6 xl:px-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">Publishing library</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">All content</h2>
            <p className="mt-1 text-sm text-slate-500">Review and organize every TGN Africa publication.</p>
          </div>
          <button type="button" onClick={() => announce('The new publication editor is planned for a future phase.')} className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700">
            <span className="material-symbols-outlined text-[19px]">add</span>New publication
          </button>
        </div>

        {notice && <div role="status" className="mb-5 flex items-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700"><span className="material-symbols-outlined text-[19px]">info</span>{notice}</div>}

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Search content</span>
                <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[19px] text-slate-400">search</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-full border border-slate-200 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600/20" placeholder="Search title, author, ID, topic..." />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <SelectControl label="Content type" value={type} onChange={setType} options={types} />
                <SelectControl label="Publication status" value={status} onChange={setStatus} options={statuses} />
                <SelectControl label="Sort content" value={sort} onChange={setSort} options={['Newest first', 'Title A–Z', 'Most viewed']} />
              </div>
            </div>
            <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-400">
                Showing {filtered.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length} publications
              </p>
              {(query || type !== 'All types' || status !== 'All statuses' || sort !== 'Newest first') && (
                <button type="button" onClick={resetFilters} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800">
                  <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>Clear filters
                </button>
              )}
            </div>
          </div>

          {selected.length > 0 && (
            <div className="mb-4 flex flex-col justify-between gap-3 rounded-2xl bg-indigo-50 px-4 py-3 sm:flex-row sm:items-center">
              <p className="text-sm font-medium text-indigo-700">{selected.length} publication{selected.length === 1 ? '' : 's'} selected</p>
              <div className="flex flex-wrap gap-2">
                {['Archive', 'Delete'].map((action) => (
                  <button key={action} type="button" onClick={() => announce(`${action} is a non-persistent prototype action.`)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${action === 'Delete' ? 'bg-white text-red-600' : 'bg-white text-slate-600'}`}>{action}</button>
                ))}
                <button type="button" onClick={() => setSelected([])} className="rounded-full px-3 py-1.5 text-xs font-medium text-indigo-600">Clear</button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-900">
                  <th className="pb-4 pr-3">
                    <input type="checkbox" checked={visible.length > 0 && visible.every((item) => selected.includes(item.id))} onChange={toggleAll} className="h-4 w-4 rounded accent-indigo-600" aria-label="Select all visible content" />
                  </th>
                  <th className="pb-4 pr-4 font-semibold">Publication</th>
                  <th className="pb-4 pr-4 font-semibold">Author</th>
                  <th className="pb-4 pr-4 font-semibold">Topic</th>
                  <th className="pb-4 pr-4 font-semibold">Status</th>
                  <th className="pb-4 pr-4 font-semibold">Published</th>
                  <th className="pb-4 pr-4 text-right font-semibold">Views</th>
                  <th className="pb-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-500">
                {visible.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="py-3.5 pr-3">
                      <input type="checkbox" checked={selected.includes(item.id)} onChange={() => setSelected((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} className="h-4 w-4 rounded accent-indigo-600" aria-label={`Select ${item.title}`} />
                    </td>
                    <td className="max-w-[300px] py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-slate-900">{item.title}</span>
                          <span className="block text-[11px] text-slate-400">{item.id} · {item.type}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">{item.author}</td>
                    <td className="py-3.5 pr-4"><span className="inline-block max-w-[140px] truncate align-bottom">{item.topic}</span></td>
                    <td className="py-3.5 pr-4"><span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${statusStyles[item.status]}`}>{item.status}</span></td>
                    <td className="whitespace-nowrap py-3.5 pr-4">{item.publishedAt}</td>
                    <td className="py-3.5 pr-4 text-right tabular-nums">{item.views ? item.views.toLocaleString() : '—'}</td>
                    <td className="relative py-3.5 text-center">
                      <button type="button" onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)} className="grid h-8 w-8 place-items-center rounded-full border border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600" aria-label={`Actions for ${item.title}`} aria-expanded={activeMenu === item.id}>
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                      {activeMenu === item.id && (
                        <div ref={menuRef} className="absolute right-8 top-12 z-20 w-40 rounded-2xl border border-slate-100 bg-white p-2 text-left shadow-xl">
                          {['Preview', 'Edit', 'Duplicate', 'Archive', 'Delete'].map((action) => (
                            <button key={action} type="button" onClick={() => announce(`${action} “${item.title}” — prototype only.`)} className={`block w-full rounded-xl px-3 py-2 text-sm hover:bg-slate-50 ${action === 'Delete' ? 'text-red-500' : 'text-slate-600'}`}>{action}</button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!visible.length && (
            <div className="py-16 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
              <h3 className="mt-3 font-semibold text-slate-900">No publications found</h3>
              <p className="mt-1 text-sm text-slate-400">Try a different search or clear the current filters.</p>
              <button type="button" onClick={resetFilters} className="mt-5 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">Clear filters</button>
            </div>
          )}

          {filtered.length > pageSize && (
            <nav className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5" aria-label="Content pagination">
              <button type="button" disabled={safePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="flex items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">
                <span className="material-symbols-outlined text-[17px]">arrow_back</span>Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                  <button key={number} type="button" onClick={() => setPage(number)} className={`h-9 w-9 rounded-full text-sm ${safePage === number ? 'bg-indigo-600 font-medium text-white' : 'text-slate-500 hover:bg-slate-50'}`} aria-current={safePage === number ? 'page' : undefined}>{number}</button>
                ))}
              </div>
              <button type="button" disabled={safePage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="flex items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">
                Next<span className="material-symbols-outlined text-[17px]">arrow_forward</span>
              </button>
            </nav>
          )}
        </section>
      </div>
    </main>
  )
}
