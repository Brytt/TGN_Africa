'use client'

import { useState } from 'react'

export default function VerseHover({ reference, className = '' }) {
  const [passage, setPassage] = useState(null)
  const [status, setStatus] = useState('idle')

  if (!reference) return null

  const load = async () => {
    if (status !== 'idle') return
    setStatus('loading')
    try {
      const response = await fetch(`/api/esv?reference=${encodeURIComponent(reference)}`)
      const result = await response.json()
      if (!response.ok || !result.passage) throw new Error('Passage unavailable')
      setPassage(result.passage)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  return (
    <span className={`group/verse relative inline-flex ${className}`} onMouseEnter={load} onFocus={load}>
      <button type="button" className="inline-flex items-center gap-1 border-b border-dotted border-current text-left" aria-describedby={passage ? `verse-${reference.replace(/\W+/g, '-')}` : undefined}>
        {reference}<span className="material-symbols-outlined text-[14px] opacity-45">menu_book</span>
      </button>
      <span id={`verse-${reference.replace(/\W+/g, '-')}`} role="tooltip" className="pointer-events-none invisible absolute left-0 top-[calc(100%+10px)] z-50 w-[min(390px,calc(100vw-3rem))] translate-y-1 border border-midnight-navy/10 bg-white p-5 text-left opacity-0 shadow-[0_20px_55px_rgba(13,34,64,0.18)] transition-all group-hover/verse:visible group-hover/verse:translate-y-0 group-hover/verse:opacity-100 group-focus-within/verse:visible group-focus-within/verse:translate-y-0 group-focus-within/verse:opacity-100">
        {status === 'loading' && <span className="block font-sans text-xs text-midnight-navy/45">Loading Scripture…</span>}
        {status === 'error' && <span className="block font-sans text-xs text-midnight-navy/45">Passage preview unavailable.</span>}
        {passage && <><span className="mb-3 block font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-midnight-navy/40">{passage.reference} · ESV</span><span className="block font-display text-[15px] leading-7 text-midnight-navy/75 [&_.copyright]:mt-4 [&_.copyright]:font-sans [&_.copyright]:text-[8px] [&_.copyright]:leading-4 [&_.verse-num]:mr-1 [&_.verse-num]:font-sans [&_.verse-num]:text-[8px]" dangerouslySetInnerHTML={{ __html: passage.html }} /><a href="https://www.esv.org/" target="_blank" rel="noreferrer" className="pointer-events-auto mt-3 inline-block font-sans text-[9px] font-bold uppercase tracking-wider text-midnight-navy underline">ESV.org</a></>}
      </span>
    </span>
  )
}
