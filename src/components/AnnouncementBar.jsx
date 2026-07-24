'use client'

import { useState } from 'react'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="relative z-[60] flex items-center justify-center bg-midnight-navy px-12 py-3 text-heritage-gold">
      <p className="text-center font-body text-[10px] font-semibold uppercase tracking-[0.22em] md:text-[11px]">
        Join us for the Pan-African Theology Symposium — Accra, Ghana
      </p>
      <button
        type="button"
        className="absolute right-4 grid size-8 place-items-center transition-colors hover:bg-white/10"
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  )
}
