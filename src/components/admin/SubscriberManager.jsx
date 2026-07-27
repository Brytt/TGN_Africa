'use client'

import { useMemo, useState } from 'react'

export default function SubscriberManager({ initialSubscribers = [] }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('active')
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return initialSubscribers.filter((item) =>
      (filter === 'all' || item.status === filter) &&
      (!normalized || item.email.toLowerCase().includes(normalized) || item.display_name?.toLowerCase().includes(normalized)),
    )
  }, [filter, initialSubscribers, query])
  const activeCount = initialSubscribers.filter((item) => item.status === 'active').length

  const exportCsv = () => {
    const rows = [['Name', 'Email', 'Status', 'Consent date', 'Source'], ...visible.map((item) => [item.display_name || '', item.email, item.status, item.consented_at, item.source])]
    const csv = rows.map((row) => row.map((value) => `"${String(value || '').replaceAll('"', '""')}"`).join(',')).join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    link.download = 'the-gospel-network-subscribers.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return <main className="admin-scroll min-h-0 flex-1 overflow-y-auto bg-slate-50/50 px-6 pb-10 pt-6 xl:px-10"><div className="mx-auto max-w-[1100px]">
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-midnight-navy">Audience</p><h2 className="mt-2 text-2xl font-semibold text-slate-900">Subscribers</h2><p className="mt-1 text-sm text-slate-500">People who consented to receive new-publication emails.</p></div><button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-midnight-navy"><span className="material-symbols-outlined text-[17px]">download</span>Export CSV</button></div>
    <div className="mt-6 grid gap-4 sm:grid-cols-3">{[['Active subscribers', activeCount], ['All records', initialSubscribers.length], ['Unsubscribed', initialSubscribers.length - activeCount]].map(([label, value]) => <article key={label} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><strong className="text-3xl text-midnight-navy">{value}</strong><p className="mt-1 text-xs text-slate-500">{label}</p></article>)}</div>
    <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><div className="flex flex-col gap-3 sm:flex-row"><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm outline-none" placeholder="Search name or email..." /><div className="flex gap-2">{['active', 'unsubscribed', 'all'].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${filter === item ? 'bg-midnight-navy text-white' : 'bg-slate-50 text-slate-500'}`}>{item}</button>)}</div></div>
      <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b border-slate-100 text-xs text-slate-500"><th className="pb-3 font-semibold">Subscriber</th><th className="pb-3 font-semibold">Status</th><th className="pb-3 font-semibold">Consent date</th><th className="pb-3 font-semibold">Source</th></tr></thead><tbody>{visible.map((item) => <tr key={item.id} className="border-b border-slate-50 text-sm"><td className="py-4"><span className="block font-medium text-slate-800">{item.display_name || 'Unnamed subscriber'}</span><span className="text-xs text-slate-400">{item.email}</span></td><td><span className={`rounded-full px-3 py-1 text-xs font-medium ${item.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{item.status}</span></td><td className="text-xs text-slate-500">{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(item.consented_at))}</td><td className="text-xs capitalize text-slate-500">{item.source}</td></tr>)}</tbody></table>{!visible.length && <p className="py-14 text-center text-sm text-slate-400">No subscribers match this view.</p>}</div>
    </section>
  </div></main>
}
