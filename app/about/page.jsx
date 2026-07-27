import AnnouncementBar from '../../src/components/AnnouncementBar'
import Footer from '../../src/components/Footer'
import Navbar from '../../src/components/Navbar'
import VisionMission from '../../src/components/VisionMission'
import { getAuthors } from '../../src/lib/data'

export const metadata = {
  title: 'About',
  description: 'Learn about The Gospel Network, our founder, contributors, beliefs, and mission.',
}

function Person({ person, label, compact = false }) {
  return <article className={`grid gap-6 border-t border-black/10 py-8 ${compact ? 'md:grid-cols-[130px_1fr]' : 'md:grid-cols-[220px_1fr]'}`}>
    {person.image ? <img src={person.image} alt="" className="aspect-square w-full object-cover" /> : <div className="grid aspect-square place-items-center bg-black/5 text-3xl font-semibold text-black/30">{person.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>}
    <div><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black/40">{label}</p><h3 className={`mt-2 font-display text-black ${compact ? 'text-2xl' : 'text-4xl'}`}>{person.name}</h3><p className="mt-2 text-xs font-medium text-black/50">{[person.role, person.location, person.country].filter(Boolean).join(' · ')}</p><p className={`mt-5 max-w-3xl text-black/65 ${compact ? 'text-sm leading-6' : 'text-base leading-8'}`}>{person.bio || 'This biography has not yet been added to the contributor profile.'}</p></div>
  </article>
}

export default async function AboutPage() {
  const authors = await getAuthors()
  const founder = authors.find((author) => /\bkwesi\s+sena\b/i.test(author.name))
  const michael = authors.find((author) => /\b(michael|mike)\b/i.test(author.name))

  return <div className="min-h-screen bg-white text-charcoal-text">
    <AnnouncementBar /><Navbar />
    <main>
      <header className="border-b border-black/10 py-12 md:py-16"><div className="page-shell"><h1 className="text-4xl font-semibold tracking-tight text-black md:text-5xl">About Us</h1></div></header>

      <section className="py-12 md:py-20"><div className="page-shell grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="h-fit border-t border-black/15 pt-4 lg:sticky lg:top-24"><nav className="space-y-3 text-sm"><a href="#overview" className="block font-semibold text-black">Overview</a><a href="#mission-vision" className="block text-black/50 hover:text-black">Our mission</a><a href="#resources" className="block text-black/50 hover:text-black">Our resources</a><a href="#leadership" className="block text-black/50 hover:text-black">Leadership</a><a href="#faith" className="block text-black/50 hover:text-black">Statement of faith</a></nav></aside>
        <div id="overview"><p className="font-display text-[clamp(2.4rem,5vw,4.7rem)] font-medium leading-[1.02] text-black">Biblical truth is not foreign to Africa. It is <em>good news for Africa.</em></p><div className="mt-10 max-w-3xl space-y-6 text-base leading-8 text-black/65"><p>The Gospel Network Africa is an editorial and theological network serving the African church with gospel-centered, contextually faithful resources.</p><p>We believe the deepest and most enduring needs of the church are met through the faithful proclamation of Jesus Christ and the careful teaching of Scripture. Our work brings together pastors, scholars, and writers who know the communities they serve.</p><p>Every publication exists to help readers know the truth, live the gospel, and strengthen the local church.</p></div>
          <section id="resources" className="mt-14 border-t border-black/10 pt-9"><h2 className="text-2xl font-semibold text-black">Our Resources</h2><div className="mt-6 grid gap-5 sm:grid-cols-2">{[['Articles', 'Biblical and theological writing addressing doctrine, Christian life, church, and culture.'], ['Bible studies', 'Careful engagement with Scripture for personal reading, discipleship, and church teaching.'], ['Sermons', 'Gospel-centered preaching and pastoral instruction for the African church.'], ['Devotionals and poems', 'Shorter reflections that unite truth, worship, prayer, and Christian imagination.']].map(([title, text]) => <article key={title} className="border-t border-black/15 pt-4"><h3 className="font-semibold text-black">{title}</h3><p className="mt-2 text-sm leading-6 text-black/55">{text}</p></article>)}</div></section>
        </div>
      </div></section>

      <div id="mission-vision"><VisionMission /></div>

      <section id="leadership" className="py-14 md:py-20"><div className="page-shell">
        <div className="mb-8 max-w-2xl"><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-black/40">Leadership</p><h2 className="mt-3 text-3xl font-semibold text-black md:text-4xl">The people guiding the network</h2></div>
        {founder && <Person person={founder} label="Founder" />}
        {michael && <Person person={michael} label={michael.role || 'Contributor'} compact />}
      </div></section>

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
