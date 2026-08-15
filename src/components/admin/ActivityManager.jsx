'use client'

import { useMemo, useState } from 'react'

const actionStyle = {
  created: 'bg-emerald-50 text-emerald-700',
  updated: 'bg-blue-50 text-blue-700',
  deleted: 'bg-red-50 text-red-700',
}

export default function ActivityManager({ initialActivity = [] }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All activity')
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return initialActivity.filter((item) => (type === 'All activity' || item.action === type) && (!term || [item.entity_label, item.entity_type, item.actor?.display_name, item.action].some((value) => value?.toLowerCase().includes(term))))
  }, [initialActivity, query, type])

  return <main className="admin-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-6 xl:px-10"><div className="mx-auto max-w-[1100px]">
    <div className="flex flex-col gap-3 border border-slate-200 bg-white p-4 sm:flex-row"><label className="relative flex-1"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none" placeholder="Search person, record, or section" /></label><select value={type} onChange={(event) => setType(event.target.value)} className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm"><option>All activity</option><option value="created">Created</option><option value="updated">Updated</option><option value="deleted">Deleted</option></select></div>
    <section className="mt-5 border border-slate-200 bg-white"><div className="grid grid-cols-[1fr_auto] border-b border-slate-100 px-5 py-4"><div><h1 className="font-semibold text-slate-900">Administrative activity</h1><p className="mt-1 text-xs text-slate-400">Permanent history of changes to core content and audience records.</p></div><span className="text-xs text-slate-400">{visible.length} records</span></div><div className="divide-y divide-slate-100">{visible.map((item) => <article key={item.id} className="grid gap-3 px-5 py-4 transition-colors hover:bg-midnight-navy/[0.025] md:grid-cols-[130px_minmax(0,1fr)_190px]"><span><span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${actionStyle[item.action]}`}>{item.action}</span></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{item.entity_label || 'Untitled record'}</p><p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-slate-400">{item.entity_type.replaceAll('_', ' ')}</p></div><div className="md:text-right"><p className="text-xs font-medium text-midnight-navy">{item.actor?.display_name || 'System or unknown user'}</p><p className="mt-1 text-[10px] text-slate-400">{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.created_at))}</p></div></article>)}{!visible.length && <p className="px-6 py-16 text-center text-sm text-slate-400">No matching activity.</p>}</div></section>
  </div></main>
}
