import AnnouncementBar from '../../src/components/AnnouncementBar'
import Footer from '../../src/components/Footer'
import Navbar from '../../src/components/Navbar'
import { getAuthors } from '../../src/lib/data'

export const metadata = {
  title: 'Authors',
  description: 'Meet the pastors, scholars, and writers contributing to The Gospel Network Africa.',
}

const priority = (author) => /\bkwesi\s+sena\b/i.test(author.name) ? 2 : /\b(michael|mike)\b/i.test(author.name) ? 1 : 0

export default async function AuthorsPage() {
  const authors = (await getAuthors()).sort((a, b) => priority(b) - priority(a) || (b.publications || 0) - (a.publications || 0) || a.name.localeCompare(b.name))
  return <div className="min-h-screen bg-[#f7f7f6] text-black">
    <AnnouncementBar /><Navbar />
    <main>
      <header className="border-b border-black/10 bg-white py-14 md:py-20"><div className="page-shell"><p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-black/40">Contributor network</p><h1 className="mt-4 font-display text-5xl md:text-7xl">Authors</h1><p className="mt-6 max-w-2xl text-base leading-7 text-black/55">Meet the pastors, scholars, and writers serving the African church through faithful biblical publishing.</p></div></header>
      <section className="py-12 md:py-16"><div className="page-shell grid gap-px overflow-hidden border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-3">
        {authors.map((author, index) => <a key={author.id} href={`/authors/${author.slug}`} className="group flex min-h-[360px] flex-col bg-white p-6 transition-colors hover:bg-[#fbfaf5]">
          <div className="flex items-start justify-between"><span className="text-[9px] font-semibold uppercase tracking-[0.13em] text-black/35">#{String(index + 1).padStart(2, '0')} · {index === 0 ? 'Founder' : author.role}</span><span className="text-black/35 transition-transform group-hover:translate-x-1">→</span></div>
          <div className="mt-7 flex items-center gap-4">{author.image ? <img src={author.image} alt="" className="h-20 w-20 rounded-full object-cover" /> : <span className="grid h-20 w-20 place-items-center rounded-full bg-black/5 text-xl font-semibold">{author.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>}<div><h2 className="font-display text-3xl">{author.name}</h2><p className="mt-1 text-xs text-black/45">{[author.location, author.country].filter(Boolean).join(', ')}</p></div></div>
          <p className="mt-7 line-clamp-4 text-sm leading-6 text-black/55">{author.bio || 'Biography coming soon.'}</p>
          <p className="mt-auto border-t border-black/10 pt-5 text-[10px] font-medium uppercase tracking-wide text-black/40">{author.publications || 0} publications</p>
        </a>)}
      </div></section>
    </main>
    <Footer />
  </div>
}
