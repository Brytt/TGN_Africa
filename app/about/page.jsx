import AnnouncementBar from '../../src/components/AnnouncementBar'
import Footer from '../../src/components/Footer'
import Navbar from '../../src/components/Navbar'
import VisionMission from '../../src/components/VisionMission'
import { getAuthors } from '../../src/lib/data'

export const metadata = {
  title: 'About',
  description: 'Learn about The Gospel Network Africa, our founder, contributors, beliefs, mission, and vision.',
}

function Person({ person, label }) {
  return <article className="grid gap-6 border-t border-black/10 py-8 md:grid-cols-[180px_1fr]">
    {person.image ? <img src={person.image} alt="" className="aspect-square w-full object-cover" /> : <div className="grid aspect-square place-items-center bg-black/5 text-3xl font-semibold text-black/30">{person.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>}
    <div><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black/40">{label}</p><h3 className="mt-2 font-display text-3xl text-black">{person.name}</h3><p className="mt-2 text-xs font-medium text-black/50">{[person.role, person.location, person.country].filter(Boolean).join(' · ')}</p><p className="mt-5 max-w-3xl text-sm leading-7 text-black/65">{person.bio || 'This biography has not yet been added to the contributor profile.'}</p></div>
  </article>
}

export default async function AboutPage() {
  const authors = await getAuthors()
  const founder = authors.find((author) => /\b(bright|dami|odame)\b/i.test(author.name)) || authors.find((author) => author.role === 'Super Author') || authors[0]
  const contributors = authors.filter((author) => author.id !== founder?.id)

  return <div className="min-h-screen bg-white text-charcoal-text">
    <AnnouncementBar /><Navbar />
    <main>
      <header className="border-b border-black/10 py-16 md:py-24"><div className="page-shell"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">About TGN Africa</p><h1 className="mt-5 max-w-4xl font-display text-[clamp(3rem,7vw,6rem)] leading-[0.95] text-black">Ancient truth.<br /><em>African voices.</em></h1><p className="mt-8 max-w-2xl text-lg leading-8 text-black/55">The Gospel Network Africa is an editorial and theological network serving the African church with gospel-centered, contextually faithful resources.</p></div></header>

      <section className="py-14 md:py-20"><div className="page-shell">
        <div className="mb-8 max-w-2xl"><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-black/40">Leadership and contributors</p><h2 className="mt-3 text-3xl font-semibold text-black md:text-4xl">People behind the network</h2></div>
        {founder && <Person person={founder} label="Founder" />}
        <div id="contributors">{contributors.map((person) => <Person key={person.id} person={person} label={person.role || 'Contributor'} />)}</div>
      </div></section>

      <VisionMission />

      <section id="faith" className="bg-[#f7f7f6] py-16 md:py-20"><div className="page-shell grid gap-10 lg:grid-cols-[0.65fr_1.35fr]"><div><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-black/40">What we believe</p><h2 className="mt-3 font-display text-4xl text-black">Statement of Faith</h2></div><div className="grid gap-5 sm:grid-cols-2">{[
        ['Scripture', 'We believe the Bible is God’s inspired, trustworthy, and sufficient Word, the final authority for faith and life.'],
        ['The Triune God', 'We believe in one God, eternally existing as Father, Son, and Holy Spirit—holy, sovereign, and worthy of worship.'],
        ['Jesus Christ', 'We believe Jesus Christ is fully God and fully man, crucified for sinners, bodily raised, reigning, and coming again.'],
        ['Salvation', 'We believe salvation is by grace alone, through faith alone, in Christ alone, producing repentance, holiness, and good works.'],
        ['The Church', 'We believe the church is Christ’s people, called to worship, discipleship, fellowship, mission, and faithful witness.'],
        ['Resurrection and Hope', 'We believe in the resurrection of the dead, final judgment, eternal life with God, and the renewal of all things.'],
      ].map(([title, text]) => <article key={title} className="border-t border-black/15 pt-4"><h3 className="font-semibold text-black">{title}</h3><p className="mt-2 text-sm leading-6 text-black/55">{text}</p></article>)}</div></div></section>
    </main>
    <Footer />
  </div>
}
