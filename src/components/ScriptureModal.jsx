'use client'

import { createPortal } from 'react-dom'

export default function ScriptureModal({ preview, onClose }) {
  if (!preview || typeof document === 'undefined') return null
  return createPortal(
    <aside role="dialog" aria-modal="false" aria-label={`Scripture preview for ${preview.reference}`} style={preview.position} className="scripture-modal absolute z-[160] max-h-[390px] overflow-hidden rounded-2xl border border-midnight-navy/15 bg-white text-left text-midnight-navy shadow-[0_16px_45px_rgba(7,24,45,0.18)]">
      <header className="flex items-center justify-between gap-4 border-b border-midnight-navy/10 px-4 py-3">
        <div className="min-w-0"><p className="text-[8px] font-bold uppercase tracking-[0.14em] text-midnight-navy/35">Scripture · ESV</p><h2 className="mt-0.5 truncate font-display text-lg font-bold">{preview.passage?.reference || preview.reference}</h2></div>
        <button type="button" onClick={onClose} className="grid size-8 shrink-0 place-items-center rounded-full bg-midnight-navy/5 text-midnight-navy/55 transition hover:bg-midnight-navy hover:text-white" aria-label="Close Scripture preview"><span className="material-symbols-outlined text-[18px]">close</span></button>
      </header>
      <div className="max-h-[320px] overflow-y-auto overscroll-contain px-5 py-4">
        {preview.status === 'loading' && <div className="flex items-center gap-3 py-3 text-xs font-semibold text-midnight-navy/50"><span className="size-3.5 animate-spin rounded-full border-2 border-midnight-navy/15 border-t-midnight-navy" />Loading Scripture…</div>}
        {preview.status === 'error' && <p className="bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">This passage preview is currently unavailable.</p>}
        {preview.passage && <><div className="scripture-modal-copy font-display text-[16px] font-bold leading-7 text-midnight-navy/85 [&_.copyright]:mt-4 [&_.copyright]:font-sans [&_.copyright]:text-[8px] [&_.copyright]:font-semibold [&_.copyright]:leading-4 [&_.copyright]:text-midnight-navy/35 [&_.verse-num]:mr-1 [&_.verse-num]:font-sans [&_.verse-num]:text-[9px] [&_.verse-num]:font-extrabold" dangerouslySetInnerHTML={{ __html: preview.passage.html }} /><a href="https://www.esv.org/" target="_blank" rel="noreferrer" className="mt-4 inline-block border-t border-midnight-navy/10 pt-3 text-[9px] font-bold uppercase tracking-[0.1em] text-midnight-navy/55">Open ESV.org ↗</a></>}
      </div>
    </aside>,
    document.body,
  )
}
