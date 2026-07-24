'use client'

import { useState } from 'react'
import AnnouncementBar from '../components/AnnouncementBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { articles } from './ArticlesPage'

const articleParagraphs = [
  'Faithfulness rarely begins with a dramatic moment. More often, it takes shape through ordinary attention to the Word of God, the life of the local church, and the people the Lord has placed near us.',
  'Scripture does not invite us merely to collect religious information. God speaks so that his people might know him, trust his promises, and be formed into the likeness of Christ. Careful reading therefore belongs together with prayer, obedience, and life in Christian community.',
  'This matters deeply for churches across Africa. We do not need a borrowed Christianity detached from our questions, histories, cities, villages, families, and public life. We need the unchanging gospel brought faithfully to the actual places where God has called us to live.',
]

export default function ArticlePage({ articleId }) {
  const article = articles.find((item) => item.id === Number(articleId)) ?? articles[0]
  const related = articles.filter((item) => item.id !== article.id).slice(0, 3)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(24 + article.id)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'TGN Reader',
      text: 'Thank you for connecting theological clarity with the life of the local church.',
      date: 'Today',
    },
  ])

  const toggleLike = () => {
    setLiked((current) => !current)
    setLikeCount((count) => count + (liked ? -1 : 1))
  }

  const submitComment = (event) => {
    event.preventDefault()
    const text = commentText.trim()
    if (!text) return
    setComments((current) => [
      ...current,
      { id: Date.now(), name: 'Guest Reader', text, date: 'Just now' },
    ])
    setCommentText('')
  }

  return (
    <div className="min-h-screen bg-white text-charcoal-text">
      <AnnouncementBar />
      <Navbar />
      <main>
        <section className="bg-black py-7 text-white">
          <div className="page-shell flex items-center gap-5">
            <button type="button" className="grid size-9 shrink-0 place-items-center rounded-full border border-white/40" aria-label="Play article audio">
              <span className="material-symbols-outlined text-lg">play_arrow</span>
            </button>
            <span className="text-[10px] text-white/55">00:00</span>
            <div className="h-px grow bg-white/25"><div className="h-px w-1/4 bg-white" /></div>
            <span className="hidden text-xs text-white/60 sm:block">{article.title}</span>
            <button type="button" className="hidden items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-white/55 md:flex">
              <span className="material-symbols-outlined text-base">download</span> Download
            </button>
          </div>
        </section>

        <article className="pb-20 pt-14 md:pb-28 md:pt-20">
          <header className="page-shell text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy/40">{article.date}</p>
            <h1 className="mx-auto mt-5 max-w-4xl font-sans text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-midnight-navy">
              {article.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl font-sans text-xl font-semibold text-midnight-navy/65 md:text-2xl">{article.subtitle}</p>
          </header>

          <div className="page-shell mt-12 max-w-5xl">
            <img src={article.image} alt="" className="max-h-[620px] w-full object-cover" />
          </div>

          <div className="mx-auto mt-8 max-w-2xl px-6">
            <div className="flex items-center gap-3 border-b border-midnight-navy/10 pb-6">
              <span className="grid size-10 place-items-center rounded-full bg-midnight-navy font-sans text-sm font-bold text-white">{article.author.charAt(0)}</span>
              <div className="font-sans">
                <p className="text-xs text-midnight-navy/50">Article by <span className="font-semibold text-midnight-navy">{article.author}</span></p>
                <p className="mt-1 text-[10px] text-midnight-navy/40">{article.topic} · {article.scripture} · {article.readingTime}</p>
              </div>
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={toggleLike}
                  className={`flex h-9 items-center gap-1.5 border px-3 font-sans text-xs transition-colors ${
                    liked ? 'border-midnight-navy bg-midnight-navy text-white' : 'border-midnight-navy/10 text-midnight-navy'
                  }`}
                  aria-pressed={liked}
                  aria-label={liked ? 'Unlike article' : 'Like article'}
                >
                  <span className="material-symbols-outlined text-lg">{liked ? 'favorite' : 'favorite_border'}</span>
                  {likeCount}
                </button>
                <a
                  href="#comments"
                  className="flex h-9 items-center gap-1.5 border border-midnight-navy/10 px-3 font-sans text-xs text-midnight-navy"
                  aria-label="View comments"
                >
                  <span className="material-symbols-outlined text-lg">chat_bubble</span>
                  {comments.length}
                </a>
                <button type="button" className="grid size-9 place-items-center border border-midnight-navy/10 text-midnight-navy" aria-label="Share article">
                  <span className="material-symbols-outlined text-lg">share</span>
                </button>
                <button type="button" className="grid size-9 place-items-center border border-midnight-navy/10 text-midnight-navy" aria-label="Save article">
                  <span className="material-symbols-outlined text-lg">bookmark</span>
                </button>
              </div>
            </div>

            <div className="mt-6 border border-midnight-navy/10 bg-surface-container-low p-5 font-sans text-sm leading-6 text-midnight-navy/65">
              This article is part of TGN’s growing collection on <a href="/#resources" className="font-semibold text-midnight-navy underline decoration-midnight-navy/25 underline-offset-4">{article.topic}</a>.
            </div>

            <div className="article-prose mt-10 font-display text-[1.22rem] leading-[1.72] text-charcoal-text/85 md:text-[1.3rem]">
              <p>{article.excerpt}</p>
              {articleParagraphs.map((paragraph, index) => (
                <div key={paragraph}>
                  {index === 1 && <h2 className="mb-5 mt-12 font-sans text-2xl font-semibold tracking-[-0.02em] text-midnight-navy md:text-3xl">Truth for the whole of life</h2>}
                  <p className="mt-6">{paragraph}</p>
                </div>
              ))}

              <blockquote className="my-12 border-l-4 border-midnight-navy pl-6 font-display text-2xl italic leading-snug text-midnight-navy md:text-3xl">
                “Your word is a lamp to my feet and a light to my path.”
                <cite className="mt-3 block font-sans text-[10px] font-bold uppercase tracking-[0.15em] not-italic text-midnight-navy/45">Psalm 119:105</cite>
              </blockquote>

              <h2 className="mb-5 mt-12 font-sans text-2xl font-semibold tracking-[-0.02em] text-midnight-navy md:text-3xl">Rooted in the local church</h2>
              <p>
                Theological resources serve Christians best when they return us to worship, fellowship, service, and witness. The goal is not simply informed readers, but mature disciples who love Christ and strengthen his church.
              </p>
            </div>

            <div className="mt-14 flex items-center justify-between border-y border-midnight-navy/10 py-5 font-sans">
              <a href="/articles" className="text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy">← All articles</a>
              <span className="text-[10px] uppercase tracking-[0.12em] text-midnight-navy/40">{article.readingTime}</span>
            </div>

            <section id="comments" className="scroll-mt-28 pt-14 font-sans">
              <div className="flex items-end justify-between border-b border-midnight-navy/10 pb-4">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-midnight-navy/40">Conversation</span>
                  <h2 className="mt-2 text-2xl font-semibold text-midnight-navy">Comments</h2>
                </div>
                <span className="text-sm text-midnight-navy/45">{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
              </div>

              <form onSubmit={submitComment} className="py-7">
                <label htmlFor="article-comment" className="mb-2 block text-xs font-semibold text-midnight-navy">Join the conversation</label>
                <textarea
                  id="article-comment"
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  rows="4"
                  placeholder="Share a thoughtful response..."
                  className="w-full resize-y border border-midnight-navy/15 bg-white p-4 text-base text-charcoal-text outline-none transition-colors placeholder:text-charcoal-text/35 focus:border-midnight-navy"
                />
                <div className="mt-3 flex items-center justify-between gap-4">
                  <p className="text-[11px] text-charcoal-text/45">Please keep comments gracious, relevant, and constructive.</p>
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="shrink-0 bg-midnight-navy px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Post comment
                  </button>
                </div>
              </form>

              <div className="border-t border-midnight-navy/10">
                {comments.map((comment) => (
                  <article key={comment.id} className="border-b border-midnight-navy/10 py-6">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-midnight-navy text-xs font-bold text-white">{comment.name.charAt(0)}</span>
                      <div>
                        <p className="text-sm font-semibold text-midnight-navy">{comment.name}</p>
                        <p className="text-[10px] text-midnight-navy/40">{comment.date}</p>
                      </div>
                    </div>
                    <p className="mt-4 leading-7 text-charcoal-text/70">{comment.text}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </article>

        <section className="bg-surface-container-low py-14 md:py-20">
          <div className="page-shell">
            <h2 className="font-sans text-2xl font-semibold text-midnight-navy">Related Articles</h2>
            <div className="mt-7 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <a key={item.id} href={`/articles/${item.id}`} className="group bg-white">
                  <img src={item.image} alt="" className="aspect-[16/9] w-full object-cover" />
                  <div className="p-5 font-sans">
                    <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-midnight-navy/45">{item.type}</span>
                    <h3 className="mt-3 text-lg font-semibold leading-tight text-midnight-navy transition-opacity group-hover:opacity-65">{item.title}</h3>
                    <p className="mt-4 text-[11px] text-midnight-navy/50">{item.author}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
