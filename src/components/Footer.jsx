import { navItems } from '../data/content'

export default function Footer() {
  return (
    <footer id="contributors" className="mb-0 bg-midnight-navy pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-12 text-white md:py-14">
      <div className="page-shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
          <div className="max-w-md">
            <a href="#top" className="inline-flex items-center gap-5 text-white" aria-label="The Gospel Network home">
              <span className="relative block h-24 w-24 overflow-hidden">
                <img
                  src="/images/brand/the-gospel-network-footer-logo-transparent.png"
                  alt=""
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="flex flex-col items-center font-display uppercase leading-none text-white">
                <span className="translate-x-[0.22em] text-[10px] font-semibold tracking-[0.48em]">The</span>
                <span className="mt-1.5 text-[32px] font-medium tracking-[0.14em]">Gospel</span>
                <span className="mt-1.5 translate-x-[0.18em] text-[12px] font-semibold tracking-[0.4em]">Network</span>
              </span>
            </a>
            <p className="mt-5 text-sm leading-6 text-parchment-ivory/55">
              The Gospel Network exists to declare the whole counsel of God for the saints of Africa by publishing faithful, clear, and pastorally useful biblical resources that proclaim Christ, strengthen local churches, confront error, and equip believers for maturity and faithful living.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-center justify-center text-center lg:px-8">
            <div className="relative size-20 overflow-hidden" aria-hidden="true">
              <img
                src="/images/brand/gye-nyame-footer-transparent.png"
                alt=""
                className="h-full w-full object-contain"
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
                <li><a href="mailto:info@tgnafrica.com" className="transition-colors hover:text-parchment-ivory">info@tgnafrica.com</a></li>
                <li><a href="#privacy" className="transition-colors hover:text-parchment-ivory">Privacy Policy</a></li>
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
