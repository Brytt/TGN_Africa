'use client'

import { useEffect, useState } from 'react'
import AnnouncementBar from '../components/AnnouncementBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ArticlePage({ article, related = [], initialComments = [], userId = null, initialLiked = false, initialBookmarked = false, initialLikeCount = 0 }) {
  const [liked, setLiked] = useState(initialLiked)
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [comments] = useState(initialComments)
  const [commentText, setCommentText] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ publicationId: article.id, eventType: 'page_view' }) }).catch(() => {})
  }, [article.id])

  const interact = async (action, payload = {}) => {
    if (!userId) {
      window.location.href = '/account/login'
      return null
    }
    const response = await fetch('/api/interactions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, publicationId: article.id, ...payload }) })
    const result = await response.json()
    if (!response.ok) setMessage(result.error || 'Unable to complete that action.')
    return response.ok ? result : null
  }

  const toggleLike = async () => {
    const result = await interact('like')
    if (!result) return
    setLiked(result.active)
    setLikeCount((count) => count + (result.active ? 1 : -1))
  }
  const toggleBookmark = async () => {
    const result = await interact('bookmark')
    if (result) setBookmarked(result.active)
  }
  const submitComment = async (event) => {
    event.preventDefault()
    const body = commentText.trim()
    if (!body) return
    const result = await interact('comment', { body })
    if (!result) return
    setCommentText('')
    setMessage('Your comment was submitted for editorial review.')
  }

  return (
    <div className="min-h-screen bg-white text-charcoal-text">
      <AnnouncementBar /><Navbar />
      <main>
        <article className="pb-20 pt-14 md:pb-28 md:pt-20">
          <header className="page-shell text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy/40">{article.date}</p>
            <h1 className="mx-auto mt-5 max-w-4xl font-sans text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-midnight-navy">{article.title}</h1>
            {article.subtitle && <p className="mx-auto mt-4 max-w-2xl text-xl font-semibold text-midnight-navy/65">{article.subtitle}</p>}
          </header>
          <div className="page-shell mt-12 max-w-5xl"><img src={article.image} alt="" className="max-h-[620px] w-full object-cover" /></div>
          <div className="mx-auto mt-8 max-w-2xl px-6">
            <div className="flex flex-wrap items-center gap-3 border-b border-midnight-navy/10 pb-6 font-sans">
              <span className="grid size-10 place-items-center rounded-full bg-midnight-navy text-sm font-bold text-white">{article.author.charAt(0)}</span>
              <div><p className="text-xs text-midnight-navy/50">By <strong className="text-midnight-navy">{article.author}</strong></p><p className="mt-1 text-[10px] text-midnight-navy/40">{article.topic} · {article.readingTime}</p></div>
              <div className="ml-auto flex gap-2">
                <button onClick={toggleLike} className={`flex h-9 items-center gap-1.5 border px-3 text-xs ${liked ? 'bg-midnight-navy text-white' : 'text-midnight-navy'}`}><span className="material-symbols-outlined text-lg">{liked ? 'favorite' : 'favorite_border'}</span>{likeCount}</button>
                <button onClick={toggleBookmark} className={`grid size-9 place-items-center border ${bookmarked ? 'bg-midnight-navy text-white' : 'text-midnight-navy'}`} aria-label="Save article"><span className="material-symbols-outlined text-lg">bookmark</span></button>
              </div>
            </div>
            {article.excerpt && <p className="mt-10 text-xl leading-8 text-midnight-navy/70">{article.excerpt}</p>}
            {article.bodyFormat === 'html'
              ? <div className="article-prose article-prose-html mt-8 font-display text-[1.22rem] leading-[1.72] text-charcoal-text/85" dangerouslySetInnerHTML={{ __html: article.body }} />
              : <div className="article-prose mt-8 whitespace-pre-wrap font-display text-[1.22rem] leading-[1.72] text-charcoal-text/85">{article.body}</div>}
            <section className="mt-14 border-t border-midnight-navy/10 pt-10 font-sans">
              <h2 className="text-2xl font-semibold text-midnight-navy">Conversation</h2>
              {message && <p className="mt-4 rounded-xl bg-surface-container-low p-3 text-sm text-midnight-navy">{message}</p>}
              <form onSubmit={submitComment} className="mt-6"><textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} rows={4} className="w-full border border-midnight-navy/15 p-4 text-sm outline-none" placeholder={userId ? 'Add a thoughtful comment…' : 'Sign in to comment'} /><button className="mt-3 bg-midnight-navy px-5 py-2.5 text-xs font-semibold text-white">Submit for review</button></form>
              <div className="mt-8 space-y-4">{comments.map((comment) => <article key={comment.id} className="border-t border-midnight-navy/10 pt-4"><p className="text-xs font-semibold text-midnight-navy">{comment.name}</p><p className="mt-2 text-sm leading-6 text-charcoal-text/70">{comment.body}</p></article>)}</div>
            </section>
          </div>
        </article>
        {related.length > 0 && <section className="bg-surface-container-low py-14"><div className="page-shell"><h2 className="text-2xl font-semibold text-midnight-navy">Related publications</h2><div className="mt-6 grid gap-5 md:grid-cols-3">{related.map((item) => <a key={item.id} href={`/articles/${item.slug}`} className="bg-white p-5"><p className="text-[9px] font-bold uppercase text-midnight-navy/40">{item.type}</p><h3 className="mt-3 font-semibold text-midnight-navy">{item.title}</h3></a>)}</div></div></section>}
      </main>
      <Footer />
    </div>
  )
}
