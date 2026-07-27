'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import AdminSelect from './AdminSelect'

const periodConfig = {
  'Last 30 days': 30,
  'Last 3 months': 3,
  'Last 6 months': 6,
  'This year': 'year',
}

const typeColors = {
  Article: '#0D2240',
  Devotional: '#C5A059',
  'Bible Study': '#64748b',
  Sermon: '#0f766e',
  Poem: '#9f7aea',
}

const toDateValue = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const fromDateValue = (value, endOfDay = false) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0)
}

function DateCalendar({ label, value, onChange, min, max }) {
  const selected = fromDateValue(value)
  const [viewYear, setViewYear] = useState(selected.getFullYear())
  const [viewMonth, setViewMonth] = useState(selected.getMonth())
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 16 }, (_, index) => currentYear - 12 + index)
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)]

  useEffect(() => {
    setViewYear(selected.getFullYear())
    setViewMonth(selected.getMonth())
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const selectDay = (day) => {
    const next = toDateValue(new Date(viewYear, viewMonth, day))
    if ((!min || next >= min) && (!max || next <= max)) onChange(next)
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <div className="grid grid-cols-[1fr_110px] gap-2">
        <select value={viewMonth} onChange={(event) => setViewMonth(Number(event.target.value))} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-midnight-navy/30">
          {Array.from({ length: 12 }, (_, month) => <option key={month} value={month}>{new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2020, month, 1))}</option>)}
        </select>
        <select value={viewYear} onChange={(event) => setViewYear(Number(event.target.value))} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-midnight-navy/30">
          {years.map((year) => <option key={year}>{year}</option>)}
        </select>
      </div>
      <div className="mt-4 grid grid-cols-7 text-center text-[10px] font-semibold uppercase text-slate-400">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day} className="py-1">{day}</span>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} />
          const dateValue = toDateValue(new Date(viewYear, viewMonth, day))
          const disabled = (min && dateValue < min) || (max && dateValue > max)
          const active = dateValue === value
          return <button key={day} type="button" disabled={disabled} onClick={() => selectDay(day)} className={`grid aspect-square place-items-center rounded-lg text-xs transition-colors ${active ? 'bg-midnight-navy font-semibold text-white' : 'text-slate-600 hover:bg-midnight-navy/5'} disabled:cursor-not-allowed disabled:text-slate-200`}>{day}</button>
        })}
      </div>
      <p className="mt-3 rounded-xl bg-midnight-navy/5 px-3 py-2 text-center text-xs font-semibold text-midnight-navy">{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(selected)}</p>
    </section>
  )
}

function DateRangePicker({ from, to, onFromChange, onToChange }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  useEffect(() => {
    const close = (event) => {
      if (event.key === 'Escape' || (containerRef.current && !containerRef.current.contains(event.target))) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
    }
  }, [])
  return (
    <div ref={containerRef} className="relative">
      <button type="button" onClick={() => setOpen((current) => !current)} className="inline-flex min-h-11 items-center gap-3 rounded-full border border-midnight-navy/15 bg-white px-4 py-2 text-left text-xs text-slate-600 shadow-sm" aria-expanded={open}>
        <span className="material-symbols-outlined text-[19px] text-midnight-navy">date_range</span>
        <span><span className="block text-[9px] font-bold uppercase tracking-wide text-slate-400">Custom dates</span><span className="font-semibold text-midnight-navy">{from} → {to}</span></span>
        <span className="material-symbols-outlined ml-1 text-[17px]">expand_more</span>
      </button>
      {open && <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(720px,calc(100vw-3rem))] rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-2xl">
        <div className="mb-4"><h3 className="font-semibold text-midnight-navy">Choose reporting dates</h3><p className="mt-1 text-xs text-slate-500">Select the year and month directly, then choose a day.</p></div>
        <div className="grid gap-4 md:grid-cols-2">
          <DateCalendar label="From" value={from} max={to} onChange={onFromChange} />
          <DateCalendar label="To" value={to} min={from} onChange={onToChange} />
        </div>
        <div className="mt-4 flex justify-end"><button type="button" onClick={() => setOpen(false)} className="rounded-full bg-midnight-navy px-5 py-2.5 text-xs font-semibold text-white">Apply date range</button></div>
      </div>}
    </div>
  )
}

export default function AnalyticsManager({ publications = [], editorialTasks = [], authors = [], analyticsEvents = [], subscribers = [] }) {
  const [period, setPeriod] = useState('This year')
  const [metric, setMetric] = useState('Views')
  const todayValue = toDateValue(new Date())
  const [customFrom, setCustomFrom] = useState(`${new Date().getFullYear()}-01-01`)
  const [customTo, setCustomTo] = useState(todayValue)

  const range = useMemo(() => {
    const now = new Date()
    if (period === 'Custom range') return { start: fromDateValue(customFrom), end: fromDateValue(customTo, true) }
    if (periodConfig[period] === 'year') return { start: new Date(now.getFullYear(), 0, 1), end: now }
    const start = new Date(now)
    if (period === 'Last 30 days') start.setDate(start.getDate() - 29)
    else start.setMonth(start.getMonth() - periodConfig[period])
    start.setHours(0, 0, 0, 0)
    return { start, end: now }
  }, [customFrom, customTo, period])
  const periodLabel = period === 'Custom range'
    ? `${new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(range.start)} – ${new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(range.end)}`
    : period

  const report = useMemo(() => {
    const monthCount = Math.max(1, (range.end.getFullYear() - range.start.getFullYear()) * 12 + range.end.getMonth() - range.start.getMonth() + 1)
    const visibleMonths = Array.from({ length: monthCount }, (_, index) => {
      const date = new Date(range.start.getFullYear(), range.start.getMonth() + index, 1)
      const month = date.getMonth()
      const year = date.getFullYear()
      const monthPublications = publications.filter((item) => {
        const itemDate = new Date(item.publishedAt)
        return itemDate >= range.start && itemDate <= range.end && itemDate.getMonth() === month && itemDate.getFullYear() === year
      })
      const views = analyticsEvents.filter((event) => {
        const eventDate = new Date(event.created_at)
        return event.event_type === 'page_view' && eventDate >= range.start && eventDate <= range.end && eventDate.getMonth() === month && eventDate.getFullYear() === year
      }).length
      return {
        key: `${year}-${month}`,
        month: new Intl.DateTimeFormat('en-US', { month: 'short', year: monthCount > 12 ? '2-digit' : undefined }).format(date),
        published: monthPublications.filter((item) => item.status === 'Published').length,
        drafts: monthPublications.filter((item) => item.status === 'Draft').length,
        views,
      }
    })
    const published = Math.round(visibleMonths.reduce((sum, item) => sum + item.published, 0))
    const drafts = Math.round(visibleMonths.reduce((sum, item) => sum + item.drafts, 0))
    const views = visibleMonths.reduce((sum, item) => sum + item.views, 0)
    const engaged = analyticsEvents.filter((event) => event.event_type === 'read' && new Date(event.created_at) >= range.start && new Date(event.created_at) <= range.end).length
    const rangePublications = publications.filter((item) => {
      const date = new Date(item.publishedAt)
      return date >= range.start && date <= range.end
    })
    const avgRead = rangePublications.length ? rangePublications.reduce((sum, item) => sum + (item.readingTimeMinutes || 0), 0) / rangePublications.length : 0
    const typeCounts = Object.keys(typeColors).map((type) => ({
      type,
      count: rangePublications.filter((item) => item.type === type).length,
    }))
    return { visibleMonths, published, drafts, views, engaged, avgRead, typeCounts, rangePublications }
  }, [analyticsEvents, publications, range])

  const chartMax = Math.max(1, ...report.visibleMonths.map((item) => metric === 'Views' ? item.views : item.published))
  const activeSubscribers = subscribers.filter((subscriber) => subscriber.status === 'active')
  const newSubscribers = activeSubscribers.filter((subscriber) => {
    const date = new Date(subscriber.consented_at || subscriber.created_at)
    return date >= range.start && date <= range.end
  }).length
  const topPublications = [...report.rangePublications].sort((a, b) => b.views - a.views).slice(0, 6)
  const authorPerformance = Object.values(report.rangePublications.reduce((acc, item) => {
    acc[item.author] ||= { author: item.author, publications: 0, views: 0 }
    acc[item.author].publications += 1
    acc[item.author].views += item.views
    return acc
  }, {})).sort((a, b) => b.views - a.views).slice(0, 5)
  const today = new Date()
  const birthdayAuthors = authors.filter((author) => {
    if (!author.dateOfBirth || author.status !== 'Active') return false
    const [, month, day] = author.dateOfBirth.split('-').map(Number)
    return month === today.getMonth() + 1 && day === today.getDate()
  })

  const exportCsv = () => {
    const rows = [
      ['TGN Africa Editorial Analytics Report'],
      ['Reporting period', periodLabel],
      ['Total views', report.views],
      ['Published', report.published],
      ['Drafts', report.drafts],
      ['Engaged readers', report.engaged],
      ['Active subscribers', activeSubscribers.length],
      ['New subscribers in period', newSubscribers],
      [],
      ['Top publications'],
      ['Title', 'Type', 'Author', 'Status', 'Views'],
      ...topPublications.map((item) => [item.title, item.type, item.author, item.status, item.views]),
      [],
      ['Author performance'],
      ['Author', 'Publications', 'Views'],
      ...authorPerformance.map((item) => [item.author, item.publications, item.views]),
    ]
    const csv = rows.map((row) => row.map((value = '') => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tgn-africa-analytics-${period.toLowerCase().replaceAll(' ', '-')}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="admin-scroll min-h-0 flex-1 overflow-y-auto bg-slate-50/50 px-6 pb-10 pt-6 xl:px-10">
      <div className="admin-report mx-auto max-w-[1180px]">
        <div className="admin-report-toolbar mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-midnight-navy">Performance report</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Analytics</h2>
            <p className="mt-1 text-sm text-slate-500">Measure editorial output and reader engagement.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <AdminSelect label="Reporting period" value={period} onChange={setPeriod} options={[...Object.keys(periodConfig), 'Custom range']} />
            {period === 'Custom range' && <DateRangePicker from={customFrom} to={customTo} onFromChange={setCustomFrom} onToChange={setCustomTo} />}
            <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:border-midnight-navy/20 hover:text-midnight-navy"><span className="material-symbols-outlined text-[18px]">download</span>Export CSV</button>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-midnight-navy px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"><span className="material-symbols-outlined text-[18px]">print</span>Print report</button>
          </div>
        </div>

        <header className="admin-print-header mb-6 hidden border-b-2 border-midnight-navy pb-5">
          <div className="flex items-center justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-midnight-navy">TGN Africa</p><h1 className="mt-1 text-2xl font-semibold text-midnight-navy">Editorial Analytics Report</h1></div>
            <div className="text-right text-xs text-slate-500"><p>{periodLabel}</p><p>Generated {new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date())}</p></div>
          </div>
        </header>

        {birthdayAuthors.length > 0 && (
          <section className="admin-report-control mb-6 rounded-3xl border border-heritage-gold/25 bg-gradient-to-r from-heritage-gold/15 via-white to-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-heritage-gold text-white"><span className="material-symbols-outlined text-[24px]">celebration</span></span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-heritage-gold">Birthday today</p>
                  <h3 className="mt-1 font-semibold text-midnight-navy">{birthdayAuthors.map((author) => author.name).join(' and ')}</h3>
                  <p className="mt-1 text-xs text-slate-500">Celebrate our {birthdayAuthors.length === 1 ? 'author' : 'authors'} today.</p>
                </div>
              </div>
              <a href="/admin/authors" className="inline-flex items-center justify-center gap-2 rounded-full bg-midnight-navy px-4 py-2.5 text-xs font-semibold text-white"><span className="material-symbols-outlined text-[17px]">cake</span>View author profile</a>
            </div>
          </section>
        )}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="Performance summary">
          {[
            { label: 'Total views', value: report.views.toLocaleString(), icon: 'visibility' },
            { label: 'Published', value: report.published, icon: 'task_alt' },
            { label: 'Completed reads', value: report.engaged.toLocaleString(), icon: 'group' },
            { label: 'Active subscribers', value: activeSubscribers.length.toLocaleString(), icon: 'mark_email_read', detail: `${newSubscribers.toLocaleString()} joined in period` },
            { label: 'Average read time', value: `${report.avgRead.toFixed(1)} min`, icon: 'schedule' },
          ].map((item) => (
            <article key={item.label} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-midnight-navy/5 text-midnight-navy"><span className="material-symbols-outlined text-[21px]">{item.icon}</span></span><span className="max-w-[150px] text-right text-[10px] font-medium text-slate-400">{item.detail || periodLabel}</span></div>
              <strong className="mt-5 block text-3xl font-semibold tracking-tight text-slate-900">{item.value}</strong>
              <p className="mt-1 text-xs text-slate-500">{item.label}</p>
            </article>
          ))}
        </section>

        <section className="mb-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
          <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-7 flex items-center justify-between gap-4">
              <div><h3 className="font-semibold text-slate-900">Publishing performance</h3><p className="mt-1 text-xs text-slate-400">Measured monthly output and readership</p></div>
              <div className="admin-report-control"><AdminSelect label="Chart metric" value={metric} onChange={setMetric} options={['Views', 'Publications']} /></div>
            </div>
            <div className="overflow-x-auto">
              <div className="flex h-64 min-w-full items-end gap-3 border-b border-slate-200 px-2 pt-5">
                {report.visibleMonths.map((item) => {
                  const value = metric === 'Views' ? item.views : item.published
                  return (
                    <div key={item.key} className="group flex h-full min-w-12 flex-1 flex-col items-center justify-end">
                      <span className="mb-2 text-[10px] font-semibold text-slate-500 opacity-0 group-hover:opacity-100">{value.toLocaleString()}</span>
                      <div className="w-full max-w-9 rounded-t-xl bg-midnight-navy transition-opacity hover:opacity-80" style={{ height: `${Math.max(8, (value / chartMax) * 88)}%` }} />
                      <span className="mt-3 whitespace-nowrap text-[10px] text-slate-400">{item.month}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <h3 className="font-semibold text-slate-900">Content mix</h3>
            <p className="mt-1 text-xs text-slate-400">Publications by format</p>
            <div className="mt-7 space-y-5">
              {report.typeCounts.map((item) => {
                const percentage = report.rangePublications.length ? Math.round((item.count / report.rangePublications.length) * 100) : 0
                return <div key={item.type}><div className="mb-2 flex justify-between text-xs"><span className="font-medium text-slate-600">{item.type}</span><span className="text-slate-400">{item.count} · {percentage}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: `${percentage}%`, background: typeColors[item.type] }} /></div></div>
              })}
            </div>
          </article>
        </section>

        <section className="mb-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.7fr)]">
          <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5"><h3 className="font-semibold text-slate-900">Top-performing publications</h3><p className="mt-1 text-xs text-slate-400">Ranked by total views</p></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead><tr className="border-b border-slate-100 text-[11px] text-slate-400"><th className="pb-3 font-medium">Publication</th><th className="pb-3 font-medium">Type</th><th className="pb-3 font-medium">Author</th><th className="pb-3 text-right font-medium">Views</th></tr></thead>
                <tbody>{topPublications.map((item, index) => <tr key={item.id} className="border-b border-slate-50 text-xs last:border-0"><td className="py-3 pr-4"><span className="mr-3 text-slate-300">{String(index + 1).padStart(2, '0')}</span><span className="font-medium text-slate-700">{item.title}</span></td><td className="py-3 pr-4 text-slate-500">{item.type}</td><td className="py-3 pr-4 text-slate-500">{item.author}</td><td className="py-3 text-right font-semibold tabular-nums text-slate-700">{item.views.toLocaleString()}</td></tr>)}</tbody>
              </table>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <h3 className="font-semibold text-slate-900">Author performance</h3>
            <p className="mt-1 text-xs text-slate-400">Reach by contributor</p>
            <div className="mt-5 divide-y divide-slate-100">
              {authorPerformance.map((item) => <div key={item.author} className="flex items-center gap-3 py-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-midnight-navy/5 text-xs font-bold text-midnight-navy">{item.author.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-slate-700">{item.author}</span><span className="text-[10px] text-slate-400">{item.publications} publications</span></span><span className="text-xs font-semibold tabular-nums text-slate-700">{item.views.toLocaleString()}</span></div>)}
            </div>
          </article>
        </section>

        <section className="mb-6 grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)]">
          <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <h3 className="font-semibold text-slate-900">Editorial workflow</h3>
              <p className="mt-1 text-xs text-slate-400">Priority work requiring attention</p>
            </div>
            <div className="space-y-3">
              {editorialTasks.map((task) => (
                <div key={task.id} className={`admin-task-${task.tone} rounded-2xl p-4`}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">{task.label}</span>
                    <span className="rounded-full bg-white/70 px-2 py-1 text-[10px] font-semibold text-slate-500">{task.due}</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-5 text-slate-800">{task.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{task.meta}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div><h3 className="font-semibold text-slate-900">Recent publishing activity</h3><p className="mt-1 text-xs text-slate-400">Latest editorial updates</p></div>
              <a href="/admin/content" className="admin-report-control text-xs font-semibold text-midnight-navy hover:underline">View content</a>
            </div>
            <div className="divide-y divide-slate-100">
              {publications.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3">
                  <img src={item.image} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-slate-700">{item.title}</span>
                    <span className="text-[10px] text-slate-400">{item.author} · {item.type}</span>
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                    item.status === 'Published' ? 'bg-emerald-50 text-emerald-600' :
                    item.status === 'Draft' ? 'bg-amber-50 text-amber-600' :
                    item.status === 'Scheduled' ? 'bg-sky-50 text-sky-600' :
                    'bg-midnight-navy/5 text-midnight-navy'
                  }`}>{item.status}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <footer className="admin-print-footer hidden border-t border-slate-200 pt-4 text-[10px] text-slate-400">
          TGN Africa Editorial Platform · Internal performance report · {periodLabel}
        </footer>
      </div>
    </main>
  )
}
