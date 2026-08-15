'use client'

import { useEffect, useId, useState } from 'react'
import ScriptureModal from './ScriptureModal'

export default function VerseHover({ reference, className = '' }) {
  const id = useId()
  const [passage, setPassage] = useState(null)
  const [status, setStatus] = useState('idle')
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(null)

  useEffect(() => {
    const closeOther = (event) => { if (event.detail !== id) setOpen(false) }
    window.addEventListener('tgn-scripture-open', closeOther)
    return () => window.removeEventListener('tgn-scripture-open', closeOther)
  }, [id])

  if (!reference) return null
  const show = async (event) => {
    event?.preventDefault()
    event?.stopPropagation()
    window.dispatchEvent(new CustomEvent('tgn-scripture-open', { detail: id }))
    const rect = event.currentTarget.getBoundingClientRect()
    const width = Math.min(360, window.innerWidth - 24)
    const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)) + window.scrollX
    const top = rect.bottom + window.scrollY + 8
    setPosition({ left, top, width })
    setOpen(true)
    if (status !== 'idle') return
    setStatus('loading')
    try {
      const response = await fetch(`/api/esv?reference=${encodeURIComponent(reference)}`)
      const result = await response.json()
      if (!response.ok || !result.passage) throw new Error('Passage unavailable')
      setPassage(result.passage); setStatus('ready')
    } catch { setStatus('error') }
  }

  return <><span className={`relative inline-flex ${className}`}><button type="button" onMouseEnter={show} onFocus={show} onClick={show} className="inline-flex items-center gap-1 rounded-md bg-heritage-gold/10 px-1.5 py-0.5 font-semibold text-midnight-navy ring-1 ring-inset ring-heritage-gold/25 transition-colors hover:bg-heritage-gold/20"><span>{reference}</span><span className="material-symbols-outlined text-[14px] opacity-50">menu_book</span></button></span>{open && position && <ScriptureModal preview={{ reference, passage, status, position }} onClose={() => setOpen(false)} />}</>
}
