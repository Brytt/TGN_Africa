'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../src/lib/supabase/browser'

export default function ResetPasswordPage() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [invitation, setInvitation] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setInvitation(user?.user_metadata?.onboarding_required === true || window.location.hash.includes('type=invite'))
    })
  }, [])
  const updatePassword = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const password = String(form.get('password') || '')
    const confirmation = String(form.get('confirmation') || '')
    if (password !== confirmation) {
      setError('The passwords do not match.')
      return
    }
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) setError(updateError.message)
    else {
      const { data: { user } } = await supabase.auth.getUser()
      setMessage(invitation ? 'Your password has been created. Opening your profile…' : 'Your password has been updated.')
      window.location.href = user?.user_metadata?.onboarding_required === true ? '/account/onboarding' : '/admin'
    }
  }
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 font-sans">
      <form onSubmit={updatePassword} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <img src="/images/brand/tgn-africa-logo-transparent.png" alt="TGN Africa" className="mx-auto h-24 w-20 object-contain" />
        <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-midnight-navy/50">The Gospel Network Africa</p>
        <h1 className="mt-3 text-center text-3xl font-semibold text-midnight-navy">{invitation ? 'Create your password' : 'Choose a new password'}</h1>
        {invitation && <p className="mt-2 text-center text-sm leading-6 text-slate-500">Choose a secure password. You will complete your author profile next.</p>}
        {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        {message && <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        <input required type="password" name="password" minLength={8} placeholder="New password" className="mt-7 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
        <input required type="password" name="confirmation" minLength={8} placeholder="Confirm new password" className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
        <button className="mt-6 w-full rounded-full bg-midnight-navy px-5 py-3 text-sm font-semibold text-white">{invitation ? 'Create password and continue' : 'Update password'}</button>
      </form>
    </main>
  )
}
