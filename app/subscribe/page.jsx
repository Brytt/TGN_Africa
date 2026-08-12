'use client'

import { useEffect, useRef, useState } from 'react'
import AnnouncementBar from '../../src/components/AnnouncementBar'
import Footer from '../../src/components/Footer'
import Navbar from '../../src/components/Navbar'

export default function SubscribePage() {
  const [subscribed, setSubscribed] = useState(false)
  const [welcomeEmailSent, setWelcomeEmailSent] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const successRef = useRef(null)

  useEffect(() => {
    if (!subscribed) return undefined
    successRef.current?.focus()
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSubscribed(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [subscribed])

  const subscribe = async (event) => {
    event.preventDefault()
    const formElement = event.currentTarget
    setSaving(true)
    setError('')
    const form = new FormData(formElement)
    try {
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
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Unable to subscribe right now. Please try again.')
      formElement.reset()
      setWelcomeEmailSent(Boolean(result.welcomeEmailSent))
      setSubscribed(true)
    } catch (requestError) {
      setError(requestError.message || 'Unable to subscribe right now. Please check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  return <div className="min-h-screen bg-[#f7f7f6] text-black">
    <AnnouncementBar /><Navbar />
    <main className="grid min-h-[70vh] place-items-center px-6 py-16">
      <div className="grid w-full max-w-5xl overflow-hidden border border-black/10 bg-white lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-midnight-navy p-8 text-center text-white md:p-12"><img src="/images/brand/the-gospel-network-footer-logo-transparent.png" alt="The Gospel Network" className="mx-auto h-28 w-28 object-contain" /><p className="mt-10 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">Our mission</p><h1 className="mt-4 font-display text-4xl not-italic leading-tight md:text-5xl">Declaring the Whole Counsel of God <span className="not-italic">for the Saints of Africa.</span></h1><p className="mx-auto mt-6 max-w-md text-sm leading-7 text-white/60">The Gospel Network exists to declare the whole counsel of God for the saints of Africa by publishing faithful, clear, and pastorally useful biblical resources that proclaim Christ, strengthen local churches, confront error, and equip believers for maturity and faithful living.</p></div>
        <form onSubmit={subscribe} className="p-8 text-center not-italic md:p-12">
          <h2 className="text-2xl font-semibold">Subscribe for free</h2><p className="mt-2 text-sm leading-6 text-black/50">No paid plan. Unsubscribe at any time from any email.</p>
          {error && <p role="alert" aria-live="assertive" className="mt-6 border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}
          <label className="mt-7 block text-xs font-semibold text-black/55">Name <span className="font-normal text-black/30">(optional)</span><input name="displayName" className="mt-2 w-full border border-black/15 px-4 py-3 text-left text-sm not-italic outline-none focus:border-midnight-navy" /></label>
          <label className="mt-5 block text-xs font-semibold text-black/55">Email address<input required type="email" name="email" className="mt-2 w-full border border-black/15 px-4 py-3 text-left text-sm not-italic outline-none focus:border-midnight-navy" /></label>
          <label className="hidden">Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
          <label className="mx-auto mt-5 flex max-w-md items-start justify-center gap-3 text-left text-xs not-italic leading-5 text-black/50"><input required type="checkbox" name="consent" className="mt-1 accent-midnight-navy" /><span>I agree to receive new-publication emails from The Gospel Network. I can unsubscribe at any time.</span></label>
          <button disabled={saving} className="mt-7 w-full bg-midnight-navy px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-50">{saving ? 'Subscribing…' : 'Subscribe'}</button>
        </form>
      </div>
    </main>
    {subscribed && (
      <div className="fixed inset-0 z-[100] grid place-items-center bg-midnight-navy/70 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="subscription-success-title">
        <div ref={successRef} tabIndex={-1} className="relative w-full max-w-md overflow-hidden border-t-4 border-heritage-gold bg-white px-7 py-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.4)] outline-none md:px-9 md:py-9">
          <button type="button" onClick={() => setSubscribed(false)} className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-midnight-navy/45 transition-colors hover:bg-midnight-navy/5 hover:text-midnight-navy" aria-label="Close subscription confirmation"><span className="material-symbols-outlined text-[20px]">close</span></button>
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <span className="material-symbols-outlined text-[36px]">mark_email_read</span>
          </div>
          <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-heritage-gold">Subscription confirmed</p>
          <h2 id="subscription-success-title" className="mt-3 font-display text-3xl leading-tight text-midnight-navy md:text-4xl">Thank you for subscribing.</h2>
          <p aria-live="polite" className="mx-auto mt-4 max-w-sm text-sm leading-6 text-black/60">
            {welcomeEmailSent
              ? 'Welcome to The Gospel Network. A confirmation email is on its way to your inbox. We’ll write to you whenever a new publication is released.'
              : 'Welcome to The Gospel Network. Your address has been saved and you’ll receive an email whenever a new publication is released.'}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><button type="button" onClick={() => setSubscribed(false)} className="border border-midnight-navy/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-midnight-navy">Close</button><a href="/articles" className="bg-midnight-navy px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white">Explore articles →</a></div>
        </div>
      </div>
    )}
    <Footer />
  </div>
}
