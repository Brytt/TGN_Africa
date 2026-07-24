'use client'

import { useState } from 'react'
import { createClient } from '../../../src/lib/supabase/browser'

export default function ResetPasswordPage() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const updatePassword = async (event) => {
    event.preventDefault()
    const password = new FormData(event.currentTarget).get('password')
    const { error: updateError } = await createClient().auth.updateUser({ password })
    if (updateError) setError(updateError.message)
    else setMessage('Your password has been updated. You can now sign in.')
  }
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 font-sans">
      <form onSubmit={updatePassword} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-midnight-navy">Choose a new password</h1>
        {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        {message && <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        <input required type="password" name="password" minLength={8} placeholder="New password" className="mt-7 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
        <button className="mt-6 w-full rounded-full bg-midnight-navy px-5 py-3 text-sm font-semibold text-white">Update password</button>
      </form>
    </main>
  )
}
