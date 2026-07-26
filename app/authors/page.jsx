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
  const [founder, ...network] = authors
  return <div className="min-h-screen bg-[#f7f7f6] text-black">
    <AnnouncementBar /><Navbar />
    <main>
      <header className="border-b border-black/10 bg-white py-14 md:py-20"><div className="page-shell"><p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-black/40">Contributor network</p><h1 className="mt-4 font-display text-5xl md:text-7xl">Authors</h1><p className="mt-6 max-w-2xl text-base leading-7 text-black/55">Meet the pastors, scholars, and writers serving the African church through faithful biblical publishing.</p></div></header>
      <section className="py-12 md:py-16"><div className="page-shell">
        {founder && <a href={`/authors/${founder.slug}`} className="group grid overflow-hidden border border-black/10 bg-white md:grid-cols-[0.72fr_1.28fr]">
          <div className="min-h-[320px] bg-midnight-navy p-7 text-white md:p-10"><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">Founder</p>{founder.image ? <img src={founder.image} alt="" className="mt-8 h-40 w-40 rounded-full border-4 border-white/10 object-cover" /> : <span className="mt-8 grid h-40 w-40 place-items-center rounded-full bg-white/10 text-4xl">{founder.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>}<p className="mt-8 text-xs text-white/50">{[founder.location, founder.country].filter(Boolean).join(', ')}</p></div>
          <div className="flex flex-col p-7 md:p-10"><div className="flex justify-between gap-4"><div><p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-black/35">Leading the network</p><h2 className="mt-3 font-display text-4xl md:text-5xl">{founder.name}</h2></div><span className="text-2xl text-black/25 transition-transform group-hover:translate-x-1">→</span></div><p className="mt-7 max-w-2xl text-base leading-8 text-black/55">{founder.bio || 'Biography coming soon.'}</p><p className="mt-auto border-t border-black/10 pt-6 text-[10px] font-semibold uppercase tracking-wide text-black/40">{founder.publications || 0} publications · View profile</p></div>
        </a>}
        <div className="mt-8 grid gap-px overflow-hidden border border-black/10 bg-black/10 md:grid-cols-2">{network.map((author, index) => <a key={author.id} href={`/authors/${author.slug}`} className="group flex min-h-[260px] flex-col bg-white p-6 transition-colors hover:bg-[#fbfaf5]">
          <div className="flex items-start justify-between gap-4"><div className="flex items-center gap-4">{author.image ? <img src={author.image} alt="" className="h-16 w-16 rounded-full object-cover" /> : <span className="grid h-16 w-16 place-items-center rounded-full bg-black/5 font-semibold">{author.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>}<div><p className="text-[9px] uppercase tracking-wide text-black/35">#{String(index + 2).padStart(2, '0')} · {author.role}</p><h2 className="mt-1 font-display text-2xl">{author.name}</h2></div></div><span className="text-black/25 transition-transform group-hover:translate-x-1">→</span></div><p className="mt-5 line-clamp-3 text-sm leading-6 text-black/50">{author.bio || 'Biography coming soon.'}</p><p className="mt-auto pt-5 text-[10px] font-medium uppercase tracking-wide text-black/35">{author.publications || 0} publications</p>
        </a>)}</div>
      </div></section>
    </main>
    <Footer />
  </div>
}
