import { navItems } from '../data/content'

export default function Footer() {
  return (
    <footer id="contributors" className="mb-0 bg-midnight-navy pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-12 text-white md:py-14">
      <div className="page-shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
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
            <p className="mt-5 text-sm leading-6 text-parchment-ivory/55">
              The Gospel Network exists to declare the whole counsel of God for the saints of Africa by publishing faithful, clear, and pastorally useful biblical resources that proclaim Christ, strengthen local churches, confront error, and equip believers for maturity and faithful living.
            </p>
            <div className="mt-6 flex gap-5">
              {['public', 'language', 'mail'].map((icon) => (
                <a key={icon} href="#social" className="transition-opacity hover:opacity-60" aria-label={icon}>
                  <span className="material-symbols-outlined">{icon}</span>
                </a>
              ))}
            </div>

          </div>

          <div className="flex shrink-0 flex-col items-center justify-center text-center lg:px-8">
            <div className="relative size-16 overflow-hidden rounded-full bg-white" aria-hidden="true">
              <img
                src="/images/brand/gye-nyame-reference.jpeg"
                alt=""
                className="absolute left-1/2 top-1/2 w-[144px] max-w-none -translate-x-1/2 -translate-y-[40.5%]"
              />
            </div>
            <p className="mt-4 font-display text-xl text-white">Gye Nyame</p>
            <p className="mt-1 text-sm text-white/50">Except for God</p>
          </div>

          <div className="grid grid-cols-2 gap-10 md:gap-20 lg:justify-self-end">
            <div>
              <span className="eyebrow mb-5 block text-white">Navigation</span>
              <ul className="space-y-3">
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
              <span className="eyebrow mb-5 block text-white">Resources</span>
              <ul className="space-y-3 text-sm text-parchment-ivory/55">
                <li><a href="/about/statement-of-faith" className="transition-colors hover:text-parchment-ivory">Statement of Faith</a></li>
                <li><a href="#privacy" className="transition-colors hover:text-parchment-ivory">Privacy Policy</a></li>
                <li><a href="#contact" className="transition-colors hover:text-parchment-ivory">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-parchment-ivory/10 pt-6 md:flex-row md:items-center">
          <p className="eyebrow text-[9px] text-parchment-ivory/35">Established 2015 · © {new Date().getFullYear()} The Gospel Network. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="eyebrow text-[9px] text-parchment-ivory/35">Developed by API Technologies Dubai</span>
            <div className="h-px w-12 bg-white/30" />
          </div>
        </div>
      </div>
    </footer>
  )
}
