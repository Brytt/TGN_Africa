'use client'

import { createPortal } from 'react-dom'

export default function ScriptureModal({ preview, onClose }) {
  if (!preview || typeof document === 'undefined') return null
  return createPortal(
    <aside role="dialog" aria-modal="false" aria-label={`Scripture preview for ${preview.reference}`} className="scripture-modal fixed inset-x-4 bottom-4 z-[160] max-h-[min(72vh,620px)] overflow-hidden rounded-[26px] border border-white/70 bg-white/95 text-left text-midnight-navy shadow-[0_30px_90px_rgba(7,24,45,0.28)] backdrop-blur-xl sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-24 sm:w-[430px]">
      <header className="flex items-center justify-between gap-4 border-b border-midnight-navy/10 bg-gradient-to-r from-[#07182d] to-[#24486f] px-5 py-4 text-white">
        <div className="min-w-0"><p className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/45">Scripture · English Standard Version</p><h2 className="mt-1 truncate font-display text-xl font-bold tracking-[-0.01em]">{preview.passage?.reference || preview.reference}</h2></div>
        <button type="button" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:rotate-90 hover:bg-white/20" aria-label="Close Scripture preview"><span className="material-symbols-outlined text-[21px]">close</span></button>
      </header>
      <div className="max-h-[calc(min(72vh,620px)-76px)] overflow-y-auto overscroll-contain px-6 py-6 sm:px-7">
        {preview.status === 'loading' && <div className="flex items-center gap-3 py-5 text-sm font-semibold text-midnight-navy/50"><span className="size-4 animate-spin rounded-full border-2 border-midnight-navy/15 border-t-midnight-navy" />Loading Scripture…</div>}
        {preview.status === 'error' && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">This passage preview is currently unavailable.</p>}
        {preview.passage && <><div className="scripture-modal-copy font-display text-[18px] font-semibold leading-8 text-midnight-navy/85 sm:text-[19px] sm:leading-9 [&_.copyright]:mt-6 [&_.copyright]:font-sans [&_.copyright]:text-[9px] [&_.copyright]:font-semibold [&_.copyright]:leading-5 [&_.copyright]:text-midnight-navy/40 [&_.verse-num]:mr-1 [&_.verse-num]:font-sans [&_.verse-num]:text-[10px] [&_.verse-num]:font-extrabold" dangerouslySetInnerHTML={{ __html: preview.passage.html }} /><div className="mt-6 flex items-center justify-between border-t border-midnight-navy/10 pt-4"><span className="text-[9px] font-bold uppercase tracking-[0.13em] text-midnight-navy/35">The Gospel Network</span><a href="https://www.esv.org/" target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-[0.12em] text-midnight-navy underline decoration-midnight-navy/25 underline-offset-4">Open ESV.org ↗</a></div></>}
      </div>
    </aside>,
    document.body,
  )
}
