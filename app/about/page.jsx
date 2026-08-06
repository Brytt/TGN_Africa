import AnnouncementBar from '../../src/components/AnnouncementBar'
import Footer from '../../src/components/Footer'
import Navbar from '../../src/components/Navbar'
import { aboutItems } from '../../src/data/about'

export const metadata = {
  title: 'About Us',
  description: 'Learn about the mission, leadership, identity, and beliefs of The Gospel Network.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-charcoal-text">
      <AnnouncementBar />
      <Navbar />
      <main>
        <header className="border-b border-midnight-navy/10 bg-[#f3f6fb]">
          <div className="page-shell py-16 md:py-24">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-heritage-gold">About The Gospel Network</p>
            <h1 className="tgn-display-heading mt-5 max-w-4xl text-[clamp(3.2rem,7vw,6.8rem)] leading-[0.92] text-midnight-navy">
              One story, told with <em>clarity.</em>
            </h1>
            <p className="tgn-supporting-copy mt-7 max-w-2xl text-[17px] leading-8 md:text-[19px]">
              Explore our leadership messages, identity, mission, vision, and statement of faith. Each subject has its own dedicated page.
            </p>
          </div>
        </header>

        <section className="border-b border-midnight-navy/10 bg-white">
          <div className="page-shell grid place-items-center py-12 md:py-16">
            <img
              src="/images/brand/the-gospel-network-full-logo.jpeg"
              alt="The Gospel Network full logo: the cross and Africa mark, wordmark, Gye Nyame symbol, and mission statement"
              className="h-auto w-full max-w-[520px]"
            />
          </div>
        </section>

        <section className="page-shell py-14 md:py-20">
          <div className="mb-8 flex items-end justify-between border-b border-midnight-navy/15 pb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-midnight-navy/40">Discover</p>
              <h2 className="tgn-display-heading mt-2 text-3xl text-midnight-navy md:text-4xl">About Us</h2>
            </div>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.15em] text-midnight-navy/35 sm:block">06 sections</span>
          </div>
          <div className="grid border-l border-t border-midnight-navy/10 md:grid-cols-2">
            {aboutItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className="tgn-about-card group relative min-h-[230px] border-b border-r border-midnight-navy/10 p-7 transition-all hover:bg-[#f3f6fb] focus-visible:bg-[#f3f6fb] md:p-9"
              >
                <div className="flex items-start justify-between">
                  <span className="tgn-about-card-icon grid size-11 place-items-center bg-midnight-navy text-white transition-colors group-hover:bg-heritage-gold">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </span>
                  <span className="text-[10px] tabular-nums tracking-[0.12em] text-midnight-navy/25">0{index + 1}</span>
                </div>
                <h3 className="tgn-display-heading mt-8 text-2xl text-midnight-navy">{item.label}</h3>
                <p className="tgn-supporting-copy mt-2 max-w-sm text-[15px] leading-7">{item.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  {item.forthcoming ? <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-heritage-gold">Forthcoming</span> : <span />}
                  <span className="text-midnight-navy transition-transform group-hover:translate-x-1">→</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
