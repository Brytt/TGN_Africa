'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return <>
    {pending && <div className="fixed inset-x-0 top-0 z-[100] h-[3px] overflow-hidden bg-white/20" role="progressbar" aria-label="Signing in"><span className="admin-login-progress block h-full w-1/3 bg-[#5ea0e6] shadow-[0_0_12px_rgba(94,160,230,0.9)]" /></div>}
    <button disabled={pending} className="group flex h-13 w-full items-center justify-center gap-2 rounded-full bg-midnight-navy px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(13,34,64,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#17385d] hover:shadow-[0_18px_34px_rgba(13,34,64,0.26)] disabled:cursor-wait disabled:opacity-70">
      {pending ? <><span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Signing in…</> : <>Sign in securely<span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-0.5">arrow_forward</span></>}
    </button>
  </>
}

export default function AdminLoginForm({ action, error, next = '/admin' }) {
  const [showPassword, setShowPassword] = useState(false)
  return <form action={action} className="mt-8 space-y-5">
    <input type="hidden" name="next" value={next} />
    {error && <div className="flex gap-3 rounded-2xl border border-red-100 bg-red-50/80 p-4 text-sm text-red-700"><span className="material-symbols-outlined mt-0.5 text-[19px]">error</span><p className="leading-5">{error}</p></div>}
    <label className="block"><span className="text-[11px] font-semibold text-slate-600">Email address</span><span className="relative mt-2 block"><span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[19px] text-slate-400">mail</span><input required autoComplete="email" type="email" name="email" className="h-13 w-full rounded-2xl border border-slate-200 bg-[#f7f7f8] py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-midnight-navy/30 focus:bg-white focus:ring-4 focus:ring-midnight-navy/[0.06]" placeholder="name@example.com" /></span></label>
    <label className="block"><span className="flex items-center justify-between"><span className="text-[11px] font-semibold text-slate-600">Password</span><a href="/account/forgot-password" className="text-[11px] font-semibold text-midnight-navy/60 transition hover:text-midnight-navy">Forgot password?</a></span><span className="relative mt-2 block"><span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[19px] text-slate-400">lock</span><input required autoComplete="current-password" type={showPassword ? 'text' : 'password'} name="password" minLength={8} className="h-13 w-full rounded-2xl border border-slate-200 bg-[#f7f7f8] py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-midnight-navy/30 focus:bg-white focus:ring-4 focus:ring-midnight-navy/[0.06]" placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-midnight-navy/5 hover:text-midnight-navy" aria-label={showPassword ? 'Hide password' : 'Show password'}><span className="material-symbols-outlined text-[19px]">{showPassword ? 'visibility_off' : 'visibility'}</span></button></span></label>
    <div className="pt-2"><SubmitButton /></div>
  </form>
}
