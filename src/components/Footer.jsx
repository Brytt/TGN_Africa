import { navItems } from '../data/content'

export default function Footer() {
  return (
    <footer id="contributors" className="bg-midnight-navy py-20 text-white md:py-28">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-16 lg:flex-row">
          <div className="max-w-md">
            <a href="#top" className="inline-flex items-center gap-4 text-white">
              <span className="relative block h-24 w-24 overflow-hidden">
                <img
                  src="/images/brand/the-gospel-network-footer-logo-transparent.png"
                  alt=""
                  className="h-full w-full object-contain"
                />
              </span>
              <span>
                <span className="block font-display text-2xl uppercase tracking-[0.14em]">The Gospel Network</span>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/50">Africa</span>
              </span>
            </a>
            <p className="mt-7 leading-7 text-parchment-ivory/55">
              Equipping the African church through the proclamation of the gospel and the defense of biblical truth with resources that are contextually relevant and scripturally sound.
            </p>
            <div className="mt-9 flex gap-5">
              {['public', 'language', 'mail'].map((icon) => (
                <a key={icon} href="#social" className="transition-opacity hover:opacity-60" aria-label={icon}>
                  <span className="material-symbols-outlined">{icon}</span>
                </a>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-8">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-white" aria-hidden="true">
                <img
                  src="/images/brand/gye-nyame-reference.jpeg"
                  alt=""
                  className="absolute left-1/2 top-1/2 w-[144px] max-w-none -translate-x-1/2 -translate-y-[40.5%]"
                />
              </div>
              <div>
                <span className="eyebrow text-[9px] text-white/45">Our heritage</span>
                <p className="mt-1 font-display text-xl text-white">Gye Nyame</p>
                <p className="text-sm text-white/50">Except for God</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 md:gap-24">
            <div>
              <span className="eyebrow mb-7 block text-white">Navigation</span>
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-parchment-ivory/55 transition-colors hover:text-parchment-ivory">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="eyebrow mb-7 block text-white">Resources</span>
              <ul className="space-y-4 text-sm text-parchment-ivory/55">
                <li><a href="/about/statement-of-faith" className="transition-colors hover:text-parchment-ivory">Statement of Faith</a></li>
                <li><a href="#privacy" className="transition-colors hover:text-parchment-ivory">Privacy Policy</a></li>
                <li><a href="#contact" className="transition-colors hover:text-parchment-ivory">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col justify-between gap-5 border-t border-parchment-ivory/10 pt-9 md:flex-row md:items-center">
          <p className="eyebrow text-[9px] text-parchment-ivory/35">Established 2015 · © {new Date().getFullYear()} The Gospel Network. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="eyebrow text-[9px] text-parchment-ivory/35">Designed for Truth</span>
            <div className="h-px w-12 bg-white/30" />
          </div>
        </div>
      </div>
    </footer>
  )
}
