'use client'

import { useState } from 'react'
import AnnouncementBar from '../../src/components/AnnouncementBar'
import Footer from '../../src/components/Footer'
import Navbar from '../../src/components/Navbar'

export default function SubscribePage() {
  const [notice, setNotice] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [welcomeEmailSent, setWelcomeEmailSent] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const subscribe = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: form.get('displayName'),
        email: form.get('email'),
        company: form.get('company'),
        consent: form.get('consent') === 'on',
      }),
    })
    const result = await response.json()
    setSaving(false)
    if (!response.ok) return setError(result.error || 'Unable to subscribe.')
    event.currentTarget.reset()
    setNotice('You are subscribed. New publications will be delivered to your inbox.')
    setWelcomeEmailSent(Boolean(result.welcomeEmailSent))
    setSubscribed(true)
  }

  const closeSuccess = () => {
    window.location.href = '/'
  }

  return <div className="min-h-screen bg-[#f7f7f6] text-black">
    <AnnouncementBar /><Navbar />
    <main className="grid min-h-[70vh] place-items-center px-6 py-16">
      <div className="grid w-full max-w-5xl overflow-hidden border border-black/10 bg-white lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-midnight-navy p-8 text-white md:p-12"><img src="/images/brand/the-gospel-network-logo.jpeg" alt="" className="h-24 w-24 object-contain" /><p className="mt-10 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">Free publication updates</p><h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">Whole counsel.<br /><em>In your inbox.</em></h1><p className="mt-6 max-w-md text-sm leading-7 text-white/60">Receive an email whenever The Gospel Network publishes a new article, sermon, devotional, Bible study, or poem.</p></div>
        <form onSubmit={subscribe} className="p-8 md:p-12">
          <h2 className="text-2xl font-semibold">Subscribe for free</h2><p className="mt-2 text-sm leading-6 text-black/50">No paid plan. Unsubscribe at any time from any email.</p>
          {notice && <p className="mt-6 bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</p>}
          {error && <p className="mt-6 bg-red-50 p-4 text-sm text-red-600">{error}</p>}
          <label className="mt-7 block text-xs font-semibold text-black/55">Name <span className="font-normal text-black/30">(optional)</span><input name="displayName" className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-midnight-navy" /></label>
          <label className="mt-5 block text-xs font-semibold text-black/55">Email address<input required type="email" name="email" className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-midnight-navy" /></label>
          <label className="hidden">Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
          <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-black/50"><input required type="checkbox" name="consent" className="mt-1 accent-midnight-navy" /><span>I agree to receive new-publication emails from The Gospel Network. I can unsubscribe at any time.</span></label>
          <button disabled={saving} className="mt-7 w-full bg-midnight-navy px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-50">{saving ? 'Subscribing…' : 'Subscribe free'}</button>
        </form>
      </div>
    </main>
    {subscribed && (
      <div className="fixed inset-0 z-[100] grid place-items-center bg-midnight-navy/75 p-5 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="subscription-success-title">
        <div className="relative w-full max-w-xl overflow-hidden border-t-4 border-heritage-gold bg-white px-7 py-10 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)] md:px-12 md:py-14">
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <span className="material-symbols-outlined text-[44px]">mark_email_read</span>
          </div>
          <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-heritage-gold">Subscription confirmed</p>
          <h2 id="subscription-success-title" className="mt-3 font-display text-4xl leading-tight text-midnight-navy md:text-5xl">Thank you for subscribing.</h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-black/60">
            {welcomeEmailSent
              ? 'Welcome to The Gospel Network. A confirmation email is on its way to your inbox. We’ll write to you whenever a new publication is released.'
              : 'Welcome to The Gospel Network. Your address has been saved and you’ll receive an email whenever a new publication is released.'}
          </p>
          <button type="button" onClick={closeSuccess} className="mt-8 inline-flex items-center gap-3 bg-midnight-navy px-7 py-4 text-xs font-bold uppercase tracking-[0.12em] text-white">
            Close and return home <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    )}
    <Footer />
  </div>
}
