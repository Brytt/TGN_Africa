'use client'

import { useState } from 'react'

export default function CommentManager({ initialComments = [] }) {
  const [comments, setComments] = useState(initialComments)
  const [filter, setFilter] = useState('pending')
  const [notice, setNotice] = useState('')
  const visible = comments.filter((comment) => filter === 'all' || comment.status === filter)
  const moderate = async (comment, status) => {
    const response = await fetch(`/api/admin/comments/${comment.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    const result = await response.json()
    if (!response.ok) return setNotice(result.error || 'Unable to moderate comment.')
    setComments((current) => current.map((item) => item.id === comment.id ? { ...item, status } : item))
    setNotice(`Comment ${status}.`)
  }
  return (
    <main className="admin-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-6 xl:px-10">
      <div className="mx-auto max-w-[1000px]">
        <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-midnight-navy">Community</p><h2 className="mt-2 text-2xl font-semibold text-slate-900">Comment moderation</h2><p className="mt-1 text-sm text-slate-500">Review reader comments before they appear publicly.</p></div>
        {notice && <p className="mt-5 rounded-xl bg-midnight-navy/5 p-3 text-sm text-midnight-navy">{notice}</p>}
        <div className="mt-6 flex gap-2">{['pending', 'approved', 'rejected', 'all'].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${filter === item ? 'bg-midnight-navy text-white' : 'bg-white text-slate-500'}`}>{item}</button>)}</div>
        <section className="mt-5 space-y-3">
          {visible.map((comment) => <article key={comment.id} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><p className="text-xs font-semibold text-midnight-navy">{comment.author_name || 'Reader'} on {comment.publication?.title}</p><p className="mt-3 text-sm leading-6 text-slate-600">{comment.body}</p><p className="mt-3 text-[10px] text-slate-400">{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(comment.created_at))}</p></div><div className="flex shrink-0 items-start gap-2">{comment.status === 'pending' && <><button onClick={() => moderate(comment, 'approved')} className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">Approve</button><button onClick={() => moderate(comment, 'rejected')} className="rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">Reject</button></>}{comment.status === 'approved' && <button onClick={() => moderate(comment, 'hidden')} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">Hide</button>}</div></div></article>)}
          {!visible.length && <div className="rounded-3xl bg-white py-16 text-center text-sm text-slate-400">No comments in this queue.</div>}
        </section>
      </div>
    </main>
  )
}
