'use client'

import { useEffect, useRef, useState } from 'react'

export default function AdminSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false,
  variant = 'pill',
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const selected = options.find((option) => (typeof option === 'string' ? option : option.value) === value)
  const selectedLabel = typeof selected === 'string' ? selected : selected?.label

  useEffect(() => {
    const close = (event) => {
      if (event.key === 'Escape') setOpen(false)
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
    }
  }, [])

  const choose = (option) => {
    onChange(typeof option === 'string' ? option : option.value)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={`relative ${variant === 'field' ? 'w-full' : 'min-w-[145px]'}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-between gap-3 border bg-white text-left text-sm outline-none transition-colors hover:border-midnight-navy/30 focus:ring-2 focus:ring-midnight-navy/10 ${
          variant === 'field'
            ? 'mt-2 rounded-xl border-slate-200 px-4 py-3'
            : 'rounded-full border-slate-200 py-2.5 pl-4 pr-3'
        } ${selectedLabel ? 'text-slate-700' : 'text-slate-400'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <span className={`material-symbols-outlined shrink-0 text-[17px] text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}>expand_more</span>
      </button>

      {required && <input className="pointer-events-none absolute h-px w-px opacity-0" tabIndex={-1} required value={value} onChange={() => {}} aria-hidden="true" />}

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 min-w-max overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl" role="listbox" aria-label={label}>
          {options.map((option) => {
            const optionValue = typeof option === 'string' ? option : option.value
            const optionLabel = typeof option === 'string' ? option : option.label
            const active = optionValue === value
            return (
              <button
                key={optionValue}
                type="button"
                onClick={() => choose(option)}
                className={`flex w-full items-center justify-between gap-5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  active ? 'bg-midnight-navy/5 font-medium text-midnight-navy' : 'text-slate-600 hover:bg-slate-50'
                }`}
                role="option"
                aria-selected={active}
              >
                <span>{optionLabel}</span>
                {active && <span className="material-symbols-outlined text-[17px]">check</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
