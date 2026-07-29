'use client'

import { useEffect, useState } from 'react'
import AnnouncementBar from '../components/AnnouncementBar'
import ArticleBody from '../components/ArticleBody'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

function fullDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

function initials(name = '') {
  return name.split(' ').filter(Boolean).map((part) => part[0]).slice(0, 2).join('')
}

function readLength(value = '') {
  const minutes = String(value).match(/\d+/)?.[0]
  return minutes ? `${minutes}-minute read` : value
}

export default function ArticlePage({ article, related = [], initialComments = [], userId = null, initialLiked = false, initialBookmarked = false, initialLikeCount = 0 }) {
  const [liked, setLiked] = useState(initialLiked)
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [comments, setComments] = useState(initialComments)
  const [commentText, setCommentText] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
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
    const result = await interact('comment', { body, parentId: replyingTo?.id || null })
    if (!result) return
    setCommentText('')
    setReplyingTo(null)
    setMessage('Your comment was submitted for editorial review.')
  }

  const toggleCommentLike = async (comment) => {
    const result = await interact('comment_like', { commentId: comment.id })
    if (!result) return
    setComments((current) => current.map((item) => item.id === comment.id ? {
      ...item,
      liked: result.active,
      likeCount: Math.max(0, item.likeCount + (result.active ? 1 : -1)),
    } : item))
  }

  return (
    <div className="min-h-screen bg-white text-charcoal-text">
      <AnnouncementBar />
      <Navbar />
      <main>
        <article className="pb-16 pt-12 md:pb-24 md:pt-20">
          <header className="page-shell">
            <div className="mx-auto max-w-[900px]">
              <a href={article.topicSlug ? `/topics/${article.topicSlug}` : '/topics'} className="tgn-article-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-midnight-navy hover:underline">
                {article.topic}
              </a>
              <h1 className="tgn-article-serif mt-5 text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-midnight-navy">{article.title}</h1>
              {article.subtitle && <p className="tgn-article-serif mt-5 max-w-[760px] text-[clamp(1.2rem,2.5vw,1.55rem)] leading-[1.4] text-charcoal-text/70">{article.subtitle}</p>}

              <div className="tgn-article-sans mt-8 flex flex-wrap items-center gap-4">
                {article.authorImage
                  ? <img src={article.authorImage} alt="" className="size-12 rounded-full object-cover" />
                  : <span className="grid size-12 place-items-center rounded-full bg-midnight-navy text-sm font-bold text-white">{initials(article.author)}</span>}
                <div>
                  <a href={article.authorSlug ? `/authors/${article.authorSlug}` : '/authors'} className="text-[15px] font-semibold text-midnight-navy hover:underline">{article.author}</a>
                  <p className="mt-0.5 text-sm text-charcoal-text/55">{fullDate(article.publishedAt)} · {readLength(article.readingTime)}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={toggleLike} className={`flex h-10 items-center gap-1.5 border px-3 text-xs ${liked ? 'border-midnight-navy bg-midnight-navy text-white' : 'border-midnight-navy/20 text-midnight-navy'}`} aria-label={liked ? 'Unlike article' : 'Like article'}><span className="material-symbols-outlined text-lg">{liked ? 'favorite' : 'favorite_border'}</span>{likeCount}</button>
                  <button onClick={toggleBookmark} className={`grid size-10 place-items-center border ${bookmarked ? 'border-midnight-navy bg-midnight-navy text-white' : 'border-midnight-navy/20 text-midnight-navy'}`} aria-label="Save article"><span className="material-symbols-outlined text-lg">bookmark</span></button>
                </div>
              </div>
            </div>
          </header>

          {article.image && (
            <figure className="page-shell mt-10 max-w-[1100px]">
              <img src={article.image} alt={`Featured image for ${article.title}`} className="aspect-video w-full object-cover" />
            </figure>
          )}

          <div className="mx-auto mt-12 max-w-[720px] px-5 sm:px-6">
            {article.excerpt && <p className="tgn-article-serif mb-9 border-b border-midnight-navy/10 pb-9 text-[21px] leading-[1.55] text-midnight-navy/75">{article.excerpt}</p>}
            <ArticleBody body={article.body} bodyFormat={article.bodyFormat} />

            <section className="mt-16 border-y border-midnight-navy/15 py-8">
              <div className="grid gap-6 sm:grid-cols-[96px_1fr]">
                {article.authorImage
                  ? <img src={article.authorImage} alt={article.author} className="size-24 rounded-full object-cover" />
                  : <span className="grid size-24 place-items-center rounded-full bg-midnight-navy text-2xl font-semibold text-white">{initials(article.author)}</span>}
                <div>
                  <p className="tgn-article-sans text-[10px] font-bold uppercase tracking-[0.16em] text-heritage-gold">About the contributor</p>
                  <h2 className="tgn-article-serif mt-2 text-3xl font-semibold text-midnight-navy">{article.author}</h2>
                  <p className="tgn-article-sans mt-1 text-xs text-midnight-navy/45">{article.authorRole}</p>
                  <p className="tgn-article-serif mt-4 text-base leading-7 text-charcoal-text/65">{article.authorShortBio || 'Read more from this contributor and explore their publications for The Gospel Network.'}</p>
                  <div className="tgn-article-sans mt-5 flex flex-wrap gap-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-midnight-navy">
                    <a href={article.authorSlug ? `/authors/${article.authorSlug}` : '/authors'} className="border-b border-midnight-navy pb-1">View profile</a>
                    <a href={article.authorSlug ? `/authors/${article.authorSlug}` : '/articles'} className="border-b border-midnight-navy pb-1">All articles</a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </article>

        {related.length > 0 && (
          <section className="bg-surface-container-low py-14 md:py-20">
            <div className="page-shell">
              <p className="tgn-article-sans text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy/45">Continue reading</p>
              <h2 className="tgn-article-serif mt-2 text-3xl font-semibold text-midnight-navy">Related articles</h2>
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {related.map((item) => <a key={item.id} href={`/articles/${item.slug}`} className="group border-t-2 border-midnight-navy bg-white p-6"><p className="tgn-article-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-midnight-navy/45">{item.topic}</p><h3 className="tgn-article-serif mt-4 text-xl font-semibold leading-snug text-midnight-navy group-hover:underline">{item.title}</h3><p className="tgn-article-sans mt-5 text-xs text-midnight-navy/45">{item.author} · {fullDate(item.publishedAt)}</p></a>)}
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-[720px] px-5 py-14 sm:px-6 md:py-20">
          <p className="tgn-article-sans text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy/45">Reader response</p>
          <h2 className="tgn-article-serif mt-2 text-3xl font-semibold text-midnight-navy">Respond to this article</h2>
          {message && <p className="tgn-article-sans mt-4 bg-surface-container-low p-3 text-sm text-midnight-navy">{message}</p>}
          <form onSubmit={submitComment} className="tgn-article-sans mt-6 border border-midnight-navy/15 p-5">
            {replyingTo && <div className="mb-3 flex items-center justify-between bg-surface-container-low px-3 py-2 text-xs text-midnight-navy"><span>Replying to {replyingTo.name}</span><button type="button" onClick={() => setReplyingTo(null)} aria-label="Cancel reply">×</button></div>}
            <textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} rows={4} className="w-full resize-y border-0 p-1 text-sm outline-none" placeholder={userId ? 'Add a thoughtful comment…' : 'Sign in to comment'} />
            <button className="mt-3 bg-midnight-navy px-5 py-3 text-xs font-semibold text-white">Submit comment</button>
          </form>
          <div className="tgn-article-sans mt-8 space-y-4">
            {comments.map((comment) => <article key={comment.id} className="border border-midnight-navy/10 p-5">{comment.replyingTo && <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-midnight-navy/40">Replying to {comment.replyingTo}</p>}<p className="text-xs font-semibold text-midnight-navy">{comment.name}</p><p className="mt-2 text-sm leading-6 text-charcoal-text/70">{comment.body}</p><div className="mt-4 flex items-center gap-4"><button type="button" onClick={() => toggleCommentLike(comment)} className={`inline-flex items-center gap-1 text-xs ${comment.liked ? 'font-semibold text-rose-600' : 'text-midnight-navy/50'}`}><span className="material-symbols-outlined text-[17px]">{comment.liked ? 'favorite' : 'favorite_border'}</span>{comment.likeCount}</button><button type="button" onClick={() => setReplyingTo(comment)} className="text-xs font-medium text-midnight-navy/60">Reply</button></div></article>)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
