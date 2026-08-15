'use client'

import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function VerseHover({ reference, className = '' }) {
  const [passage, setPassage] = useState(null)
  const [status, setStatus] = useState('idle')
  const [position, setPosition] = useState(null)
  const closeTimer = useRef(null)
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
    } catch { setStatus('error') }
  }
  const open = (event) => {
    window.clearTimeout(closeTimer.current)
    const rect = event.currentTarget.getBoundingClientRect()
    const width = Math.min(390, window.innerWidth - 32)
    const left = Math.max(16, Math.min(rect.left, window.innerWidth - width - 16))
    const estimatedHeight = passage ? 280 : 90
    const top = rect.bottom + estimatedHeight > window.innerHeight ? Math.max(16, rect.top - estimatedHeight - 8) : rect.bottom + 8
    setPosition({ left, top, width })
    load()
  }
  const close = () => { closeTimer.current = window.setTimeout(() => setPosition(null), 180) }
  const popup = position && <span role="tooltip" onMouseEnter={() => window.clearTimeout(closeTimer.current)} onMouseLeave={close} style={position} className="fixed z-[150] border border-midnight-navy/10 bg-white p-5 text-left text-midnight-navy shadow-[0_20px_55px_rgba(13,34,64,0.22)]">
    {status === 'loading' && <span className="block font-sans text-xs text-midnight-navy/45">Loading Scripture…</span>}
    {status === 'error' && <span className="block font-sans text-xs text-midnight-navy/45">Passage preview unavailable.</span>}
    {passage && <><span className="mb-3 block font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-midnight-navy/40">{passage.reference} · ESV</span><span className="block max-h-[310px] overflow-y-auto font-display text-[15px] leading-7 text-midnight-navy/75 [&_.copyright]:mt-4 [&_.copyright]:font-sans [&_.copyright]:text-[8px] [&_.verse-num]:mr-1 [&_.verse-num]:font-sans [&_.verse-num]:text-[8px]" dangerouslySetInnerHTML={{ __html: passage.html }} /><a href="https://www.esv.org/" target="_blank" rel="noreferrer" className="mt-3 inline-block font-sans text-[9px] font-bold uppercase tracking-wider text-midnight-navy underline">ESV.org</a></>}
  </span>
  return <><span className={`relative inline-flex ${className}`}><button type="button" onMouseEnter={open} onMouseLeave={close} onFocus={open} onBlur={close} onClick={(event) => event.preventDefault()} className="inline-flex items-center gap-1 rounded-md bg-heritage-gold/10 px-1.5 py-0.5 font-semibold text-midnight-navy ring-1 ring-inset ring-heritage-gold/25 transition-colors hover:bg-heritage-gold/20"><span>{reference}</span><span className="material-symbols-outlined text-[14px] opacity-50">menu_book</span></button></span>{typeof document !== 'undefined' && popup ? createPortal(popup, document.body) : null}</>
}
