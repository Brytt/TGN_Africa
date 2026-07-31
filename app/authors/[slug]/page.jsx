import { notFound } from 'next/navigation'
import AnnouncementBar from '../../../src/components/AnnouncementBar'
import Footer from '../../../src/components/Footer'
import Navbar from '../../../src/components/Navbar'
import { getAuthors, getPublications } from '../../../src/lib/data'

export const metadata = { title: 'Author Profile' }

export default async function AuthorPage({ params }) {
  const { slug } = await params
  const [authors, publications] = await Promise.all([getAuthors(), getPublications({ summary: true })])
  const author = authors.find((item) => item.slug === slug)
  if (!author) notFound()
  const authored = publications.filter((item) => item.authorId === author.id)

  return <div className="min-h-screen bg-[#f7f7f6] text-black">
    <AnnouncementBar /><Navbar />
    <main>
      <header className="border-b border-black/10 bg-white py-14 md:py-20"><div className="page-shell grid gap-8 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
        {author.image ? <img src={author.image} alt="" className="aspect-square w-full max-w-[220px] rounded-full object-cover" /> : <span className="grid aspect-square w-full max-w-[220px] place-items-center rounded-full bg-black/5 text-5xl font-semibold text-black/25">{author.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>}
        <div><a href="/authors" className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/40">← All authors</a><h1 className="mt-5 font-display text-5xl leading-none md:text-7xl">{author.name}</h1><p className="mt-4 text-xs font-medium text-black/45">{[author.role, author.location, author.country].filter(Boolean).join(' · ')}</p><p className="mt-7 max-w-3xl whitespace-pre-line text-base leading-8 text-black/60">{author.bio || 'This author has not yet added a biography.'}</p></div>
      </div></header>
      <section className="py-12 md:py-16"><div className="page-shell"><div className="flex items-end justify-between border-b border-black/10 pb-5"><div><p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-black/40">Published work</p><h2 className="mt-2 text-3xl font-semibold">Publications by {author.name}</h2></div><span className="text-sm text-black/40">{authored.length} total</span></div>
        {authored.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{authored.map((item) => <a key={item.id} href={`/articles/${item.slug}`} className="group flex min-h-[340px] flex-col border border-black/10 bg-white">{item.image && <img src={item.image} alt="" className="aspect-[16/9] w-full object-cover" />}<div className="flex grow flex-col p-4"><p className="text-[9px] uppercase tracking-wide text-black/40">{item.type} · {item.date}</p><h3 className="mt-3 text-base font-semibold leading-6">{item.title}</h3><p className="mt-3 line-clamp-3 text-xs leading-5 text-black/50">{item.excerpt}</p><span className="mt-auto pt-5 text-[10px] font-semibold uppercase tracking-wide">Read publication →</span></div></a>)}</div> : <p className="mt-8 border border-black/10 bg-white py-14 text-center text-sm text-black/45">No published work is currently attached to this author.</p>}
      </div></section>
    </main>
    <Footer />
  </div>
}
