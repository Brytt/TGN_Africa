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
            <h1 className="mt-5 max-w-4xl font-display text-[clamp(3.2rem,7vw,6.8rem)] leading-[0.92] text-midnight-navy">
              One story, told with <em>clarity.</em>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-midnight-navy/60 md:text-lg">
              Explore our leadership messages, identity, mission, vision, and statement of faith. Each subject has its own dedicated page.
            </p>
          </div>
        </header>

        <section className="page-shell py-14 md:py-20">
          <div className="mb-8 flex items-end justify-between border-b border-midnight-navy/15 pb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-midnight-navy/40">Discover</p>
              <h2 className="mt-2 font-display text-3xl text-midnight-navy md:text-4xl">About Us</h2>
            </div>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.15em] text-midnight-navy/35 sm:block">06 sections</span>
          </div>
          <div className="grid border-l border-t border-midnight-navy/10 md:grid-cols-2">
            {aboutItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative min-h-[230px] border-b border-r border-midnight-navy/10 p-7 transition-colors hover:bg-[#f3f6fb] md:p-9"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center bg-midnight-navy text-white transition-colors group-hover:bg-heritage-gold">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </span>
                  <span className="text-[10px] tabular-nums tracking-[0.12em] text-midnight-navy/25">0{index + 1}</span>
                </div>
                <h3 className="mt-8 font-display text-2xl text-midnight-navy">{item.label}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-midnight-navy/50">{item.description}</p>
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
