import AnnouncementBar from './AnnouncementBar'
import Footer from './Footer'
import Navbar from './Navbar'

export default function AboutSectionPage({ eyebrow = 'About Us', title, introduction, children }) {
  return (
    <div className="min-h-screen bg-white text-charcoal-text">
      <AnnouncementBar />
      <Navbar />
      <main>
        <header className="border-b border-midnight-navy/10 bg-[#f3f6fb]">
          <div className="page-shell grid gap-8 py-14 md:py-20 lg:grid-cols-[220px_minmax(0,760px)] lg:gap-16">
            <div>
              <a href="/about" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-midnight-navy/50 hover:text-midnight-navy">← All About Us</a>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-heritage-gold">{eyebrow}</p>
              <h1 className="tgn-display-heading mt-4 text-[clamp(2.7rem,6vw,5.2rem)] leading-[0.98] text-midnight-navy">{title}</h1>
              {introduction && <p className="tgn-supporting-copy mt-6 max-w-2xl text-[17px] leading-8 md:text-[19px]">{introduction}</p>}
            </div>
          </div>
        </header>
        <section className="page-shell grid gap-8 py-12 md:py-20 lg:grid-cols-[220px_minmax(0,760px)] lg:gap-16">
          <aside className="hidden border-t border-midnight-navy/20 pt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-midnight-navy/40 lg:block">The Gospel Network</aside>
          <div>{children}</div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export function ForthcomingNotice({ item }) {
  return (
    <div className="border border-midnight-navy/15 bg-[#f8fafc] p-7 md:p-10">
      <span className="grid size-11 place-items-center bg-midnight-navy text-white"><span className="material-symbols-outlined">schedule</span></span>
      <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-heritage-gold">Forthcoming</p>
      <h2 className="tgn-display-heading mt-3 text-3xl text-midnight-navy">This page is ready for the approved text.</h2>
      <p className="tgn-supporting-copy mt-4 max-w-xl text-[15px] leading-7">
        The final {item} is still being prepared. It will be published here as soon as the approved copy is available.
      </p>
    </div>
  )
}
