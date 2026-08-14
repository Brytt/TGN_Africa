'use client'

import { useState } from 'react'

export default function EmailUpdateManager({ initialUpdates = [], activeSubscriberCount = 0 }) {
  const [updates, setUpdates] = useState(initialUpdates)
  const [draft, setDraft] = useState({ subject: '', preheader: '', message: '' })
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState('')
  const fieldClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-midnight-navy/40 focus:ring-2 focus:ring-midnight-navy/10'
  const send = async (event) => {
    event.preventDefault()
    if (!window.confirm(`Send this update to ${activeSubscriberCount} active subscriber${activeSubscriberCount === 1 ? '' : 's'}? This cannot be undone.`)) return
    setSending(true); setNotice('')
    const response = await fetch('/api/admin/email-updates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) })
    const result = await response.json(); setSending(false)
    if (!response.ok) return window.alert(result.error || 'Unable to send update')
    const record = { id: crypto.randomUUID(), ...draft, recipient_count: result.data.sent, failed_count: result.data.failed, sent_at: new Date().toISOString() }
    setUpdates((current) => [record, ...current]); setDraft({ subject: '', preheader: '', message: '' })
    setNotice(`Update sent to ${result.data.sent} subscriber${result.data.sent === 1 ? '' : 's'}${result.data.failed ? `; ${result.data.failed} failed` : ''}.`)
  }
  return <main className="admin-scroll min-h-0 flex-1 overflow-y-auto bg-slate-50/50 p-6 xl:p-10"><div className="mx-auto max-w-[1120px]"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-midnight-navy">Audience communication</p><h1 className="mt-2 text-2xl font-semibold text-slate-900">Email updates</h1><p className="mt-1 text-sm text-slate-500">Send general announcements to all active newsletter subscribers.</p></div>{notice && <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</p>}
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]"><form onSubmit={send} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-semibold text-midnight-navy">Compose update</h2><span className="rounded-full bg-midnight-navy/5 px-3 py-1 text-xs font-semibold text-midnight-navy">{activeSubscriberCount} recipients</span></div><label className="mt-6 block text-xs font-semibold text-slate-500">SUBJECT<input required maxLength={160} value={draft.subject} onChange={(event) => setDraft((current) => ({ ...current, subject: event.target.value }))} className={fieldClass} placeholder="Important news from The Gospel Network" /></label><label className="mt-5 block text-xs font-semibold text-slate-500">PREVIEW TEXT <span className="font-normal text-slate-400">(optional)</span><input value={draft.preheader} onChange={(event) => setDraft((current) => ({ ...current, preheader: event.target.value }))} className={fieldClass} placeholder="A short summary shown beside the subject" /></label><label className="mt-5 block text-xs font-semibold text-slate-500">MESSAGE<textarea required rows={12} value={draft.message} onChange={(event) => setDraft((current) => ({ ...current, message: event.target.value }))} className={`${fieldClass} resize-y leading-6`} placeholder="Write your update here. Leave a blank line between paragraphs." /></label><div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5"><p className="max-w-sm text-xs leading-5 text-slate-400">Every email includes the TGN footer and the subscriber’s unsubscribe link.</p><button disabled={sending || !activeSubscriberCount} className="rounded-full bg-midnight-navy px-6 py-3 text-sm font-semibold text-white disabled:opacity-40">{sending ? 'Sending…' : 'Review & send'}</button></div></form>
      <aside className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><h2 className="font-semibold text-midnight-navy">Recent sends</h2><div className="mt-4 divide-y divide-slate-100">{updates.map((item) => <article key={item.id} className="py-4"><p className="text-sm font-semibold text-slate-800">{item.subject}</p><p className="mt-1 text-xs text-slate-400">{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.sent_at))}</p><p className="mt-2 text-xs text-slate-500">{item.recipient_count} delivered{item.failed_count ? ` · ${item.failed_count} failed` : ''}</p></article>)}{!updates.length && <p className="py-10 text-center text-sm text-slate-400">No general updates have been sent yet.</p>}</div></aside>
    </div></div></main>
}
