'use client'

import { useMemo, useState } from 'react'
import { adminPublications, editorialTasks, monthlyPublishing } from '../../data/adminContent'

const stats = [
  { label: 'Total publications', value: '318', change: '12%', direction: 'up', icon: 'library_books', color: 'orange' },
  { label: 'Drafts in progress', value: '18', change: '4%', direction: 'down', icon: 'edit_note', color: 'purple' },
  { label: 'Published this month', value: '24', change: '18%', direction: 'up', icon: 'task_alt', color: 'green' },
]

const statusStyles = {
  Published: 'bg-emerald-50 text-emerald-600',
  Draft: 'bg-amber-50 text-amber-600',
  'In review': 'bg-indigo-50 text-indigo-600',
  Scheduled: 'bg-sky-50 text-sky-600',
  Archived: 'bg-slate-100 text-slate-500',
}

function MoreButton({ label }) {
  return (
    <button type="button" className="grid h-8 w-8 place-items-center rounded-full border border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600" aria-label={label}>
      <span className="material-symbols-outlined text-[18px]">more_vert</span>
    </button>
  )
}

export default function AdminOverview() {
  const [period, setPeriod] = useState('Monthly')
  const [tableQuery, setTableQuery] = useState('')
  const [selected, setSelected] = useState([])
  const [notice, setNotice] = useState('')

  const recentContent = useMemo(() => {
    const normalized = tableQuery.trim().toLowerCase()
    return adminPublications
      .filter((item) => !normalized || [item.title, item.author, item.type].some((value) => value.toLowerCase().includes(normalized)))
      .slice(0, 5)
  }, [tableQuery])

  const toggleAll = () => setSelected(selected.length === recentContent.length ? [] : recentContent.map((item) => item.id))
  const toggleOne = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <main className="admin-scroll min-w-0 flex-1 overflow-y-auto px-6 pb-8 pt-5 xl:px-10">
        <section className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3" aria-label="Publishing statistics">
          {stats.map((stat) => (
            <article key={stat.label} className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`admin-stat-icon admin-stat-${stat.color} grid h-10 w-10 shrink-0 place-items-center rounded-xl`}>
                    <span className="material-symbols-outlined text-[21px]">{stat.icon}</span>
                  </span>
                  <span className="truncate text-sm font-medium text-slate-600">{stat.label}</span>
                </div>
                <MoreButton label={`More options for ${stat.label}`} />
              </div>
              <div className="flex items-end gap-3">
                <strong className="text-3xl font-semibold tracking-tight text-slate-900">{stat.value}</strong>
                <span className={`mb-0.5 flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium ${stat.direction === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  <span className="material-symbols-outlined text-[14px]">{stat.direction === 'up' ? 'trending_up' : 'trending_down'}</span>
                  {stat.change}
                </span>
              </div>
              <p className="mt-3 text-[11px] text-slate-400">Compared with last month</p>
              <span className={`admin-dot-pattern admin-dots-${stat.color}`} aria-hidden="true" />
            </article>
          ))}
        </section>

        <section className="mb-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">Publishing statistics</h2>
              <p className="mt-1 text-xs text-slate-400">Editorial output across 2026</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />Published</span>
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-orange-400" />Drafts</span>
              <label className="relative">
                <span className="sr-only">Chart period</span>
                <select value={period} onChange={(event) => setPeriod(event.target.value)} className="appearance-none rounded-full border border-slate-200 bg-white py-2 pl-4 pr-9 text-sm outline-none focus:ring-2 focus:ring-indigo-600/20">
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Yearly</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[17px] text-slate-400">expand_more</span>
              </label>
            </div>
          </div>
          <div className="admin-scroll overflow-x-auto">
            <div className="admin-chart relative h-64 min-w-[610px]" aria-label={`${period} chart of published and draft content`}>
              <div className="absolute bottom-7 left-0 top-0 flex flex-col justify-between text-[10px] text-slate-400">
                <span>30</span><span>20</span><span>10</span><span>0</span>
              </div>
              <div className="absolute bottom-7 left-9 right-0 top-0 flex items-end justify-between border-b border-dashed border-slate-200 px-2">
                {monthlyPublishing.map((item) => {
                  const active = item.month === 'Jun'
                  return (
                    <div key={item.month} className="group relative flex h-full w-9 items-end justify-center">
                      <div className="absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-2 text-[10px] text-white shadow-lg group-hover:block group-focus-within:block">
                        {item.published} published · {item.drafts} drafts
                      </div>
                      <button type="button" className="flex w-8 flex-col justify-end rounded-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-400" aria-label={`${item.month}: ${item.published} published and ${item.drafts} drafts`}>
                        <span className={`w-full rounded-t-full ${active ? 'bg-indigo-600' : 'bg-gradient-to-t from-indigo-100 to-indigo-200/50'}`} style={{ height: `${item.published * 4.1}px` }} />
                        <span className={`w-full rounded-b-full ${active ? 'bg-orange-400' : 'bg-gradient-to-b from-orange-100 to-orange-200/50'}`} style={{ height: `${item.drafts * 3.6}px` }} />
                      </button>
                    </div>
                  )
                })}
              </div>
              <div className="absolute bottom-0 left-9 right-0 flex justify-between px-2 text-[10px] text-slate-400">
                {monthlyPublishing.map((item) => <span key={item.month} className={`w-9 text-center ${item.month === 'Jun' ? 'font-semibold text-slate-900' : ''}`}>{item.month}</span>)}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">Recent content</h2>
              <p className="mt-1 text-xs text-slate-400">{selected.length ? `${selected.length} selected` : 'Latest editorial activity'}</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="relative hidden sm:block">
                <span className="sr-only">Search recent content</span>
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
                <input value={tableQuery} onChange={(event) => setTableQuery(event.target.value)} placeholder="Search..." className="w-56 rounded-full border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-600/20" />
              </label>
              <button type="button" onClick={() => {
                setNotice('Export prepared for this prototype.')
                window.setTimeout(() => setNotice(''), 2500)
              }} className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                <span className="material-symbols-outlined text-[18px]">download</span>Export
              </button>
            </div>
          </div>
          {notice && <p role="status" className="mb-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">{notice}</p>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-900">
                  <th className="pb-3 pr-3">
                    <input type="checkbox" checked={recentContent.length > 0 && selected.length === recentContent.length} onChange={toggleAll} className="h-4 w-4 rounded border-slate-300 accent-indigo-600" aria-label="Select all recent content" />
                  </th>
                  <th className="pb-3 pr-4 font-semibold">Publication</th>
                  <th className="pb-3 pr-4 font-semibold">Author</th>
                  <th className="pb-3 pr-4 font-semibold">Type</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-500">
                {recentContent.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="py-3 pr-3"><input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleOne(item.id)} className="h-4 w-4 rounded border-slate-300 accent-indigo-600" aria-label={`Select ${item.title}`} /></td>
                    <td className="max-w-[290px] py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-slate-900">{item.title}</span>
                          <span className="block text-[11px] text-slate-400">{item.id}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">{item.author}</td>
                    <td className="py-3 pr-4">{item.type}</td>
                    <td className="py-3 pr-4"><span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${statusStyles[item.status]}`}>{item.status}</span></td>
                    <td className="py-3 text-center"><MoreButton label={`Actions for ${item.title}`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!recentContent.length && <p className="py-12 text-center text-sm text-slate-400">No recent content matches your search.</p>}
          </div>
        </section>
      </main>

      <aside className="admin-scroll hidden w-[330px] shrink-0 overflow-y-auto border-l border-slate-100 px-6 py-6 2xl:block">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Editorial queue</h2>
            <p className="mt-1 text-xs text-slate-400">Items needing attention</p>
          </div>
          <MoreButton label="Editorial queue options" />
        </div>
        <div className="space-y-4">
          {editorialTasks.map((task) => (
            <article key={task.id} className={`admin-task-card admin-task-${task.tone} relative overflow-hidden rounded-[2rem] p-5 shadow-sm`}>
              <div className="relative flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-indigo-600 shadow-sm">
                  <span className="material-symbols-outlined text-[21px]">{task.label.includes('review') ? 'rate_review' : task.label.includes('Scheduled') ? 'calendar_month' : 'edit_note'}</span>
                </span>
                <button type="button" className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-400 shadow-sm hover:text-indigo-600" aria-label={`Save ${task.title}`}>
                  <span className="material-symbols-outlined text-[20px]">bookmark</span>
                </button>
              </div>
              <p className="relative mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-600">{task.label}</p>
              <h3 className="relative mt-2 text-lg font-semibold leading-6 text-slate-900">{task.title}</h3>
              <p className="relative mt-2 text-xs text-slate-500">{task.meta}</p>
              <div className="relative mt-6 flex items-center justify-between">
                <span className="rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">{task.due}</span>
                <button type="button" onClick={() => setNotice(`${task.title} opened in prototype mode.`)} className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                  Review <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </article>
          ))}
        </div>
        <a href="/admin/content" className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
          View all content <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
        </a>
      </aside>
    </div>
  )
}
