'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/browser'

const inputClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-midnight-navy/30 focus:ring-2 focus:ring-midnight-navy/10'

export default function AccountSettings({ initialProfile = {}, email = '', onboarding = false }) {
  const router = useRouter()
  const [profile, setProfile] = useState({
    displayName: initialProfile.name || initialProfile.displayName || '',
    phone: initialProfile.phone || '',
    dateOfBirth: initialProfile.dateOfBirth || '',
    qualification: initialProfile.qualification || '',
    church: initialProfile.church || '',
    denomination: initialProfile.denomination || '',
    city: initialProfile.location || '',
    country: initialProfile.country || '',
    bio: initialProfile.bio || '',
    expertise: initialProfile.expertise || '',
    website: initialProfile.website || '',
  })
  const [profileNotice, setProfileNotice] = useState('')
  const [passwordNotice, setPasswordNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const update = (field) => (event) => setProfile((current) => ({ ...current, [field]: event.target.value }))

  const saveProfile = async (event) => {
    event.preventDefault()
    setSaving(true)
    setProfileNotice('')
    const response = await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
    const result = await response.json()
    setSaving(false)
    if (!response.ok) {
      setProfileNotice(result.error || 'Unable to update your profile.')
      return
    }
    setProfileNotice('Your profile has been updated.')
    router.refresh()
    if (onboarding) router.replace('/admin')
  }

  const changePassword = async (event) => {
    event.preventDefault()
    setPasswordNotice('')
    const form = new FormData(event.currentTarget)
    const password = String(form.get('password') || '')
    const confirmation = String(form.get('confirmation') || '')
    if (password !== confirmation) {
      setPasswordNotice('The passwords do not match.')
      return
    }
    const { error } = await createClient().auth.updateUser({ password })
    if (error) {
      setPasswordNotice(error.message)
      return
    }
    event.currentTarget.reset()
    setPasswordNotice('Password changed successfully.')
  }

  const content = (
    <div className={onboarding ? 'w-full max-w-4xl rounded-3xl border border-slate-100 bg-white p-6 shadow-xl md:p-9' : 'mx-auto max-w-[1080px]'}>
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-midnight-navy">{onboarding ? 'Staff onboarding' : 'My account'}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{onboarding ? 'Complete your profile' : 'Profile and security'}</h2>
        <p className="mt-2 text-sm text-slate-500">{onboarding ? 'Add your staff details before entering the editorial workspace.' : 'Keep your profile details and password up to date.'}</p>
      </div>

      <div className={`grid gap-6 ${onboarding ? '' : 'xl:grid-cols-[1.45fr_0.85fr]'}`}>
        <form onSubmit={saveProfile} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
          <div><h3 className="font-semibold text-midnight-navy">Profile details</h3><p className="mt-1 text-xs text-slate-400">These details identify you throughout the editorial platform.</p></div>
          {profileNotice && <p role="status" className="mt-5 rounded-xl bg-midnight-navy/5 px-4 py-3 text-sm text-midnight-navy">{profileNotice}</p>}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="text-xs font-semibold text-slate-500">Full name<input required value={profile.displayName} onChange={update('displayName')} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-500">Email address<input readOnly value={email} className={`${inputClass} bg-slate-50 text-slate-500`} /></label>
            <label className="text-xs font-semibold text-slate-500">Phone number<input value={profile.phone} onChange={update('phone')} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-500">Date of birth<input type="date" value={profile.dateOfBirth} onChange={update('dateOfBirth')} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-500">Qualification<input value={profile.qualification} onChange={update('qualification')} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-500">Church<input value={profile.church} onChange={update('church')} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-500">Denomination<input value={profile.denomination} onChange={update('denomination')} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-500">Area of expertise<input value={profile.expertise} onChange={update('expertise')} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-500">City<input value={profile.city} onChange={update('city')} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-500">Country<input value={profile.country} onChange={update('country')} className={inputClass} /></label>
            <label className="text-xs font-semibold text-slate-500 md:col-span-2">Website<input type="url" value={profile.website} onChange={update('website')} className={inputClass} placeholder="https://" /></label>
            <label className="text-xs font-semibold text-slate-500 md:col-span-2">Biography<textarea value={profile.bio} onChange={update('bio')} rows={4} className={`${inputClass} resize-y`} /></label>
          </div>
          <button disabled={saving} className="mt-6 rounded-full bg-midnight-navy px-6 py-3 text-sm font-medium text-white disabled:opacity-50">{saving ? 'Saving…' : onboarding ? 'Save and continue' : 'Save profile'}</button>
        </form>

        {!onboarding && (
          <form onSubmit={changePassword} className="h-fit rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
            <div><h3 className="font-semibold text-midnight-navy">Change password</h3><p className="mt-1 text-xs leading-5 text-slate-400">Use at least eight characters and keep your account password private.</p></div>
            {passwordNotice && <p role="status" className="mt-5 rounded-xl bg-midnight-navy/5 px-4 py-3 text-sm text-midnight-navy">{passwordNotice}</p>}
            <label className="mt-5 block text-xs font-semibold text-slate-500">New password<input required name="password" type="password" minLength={8} className={inputClass} /></label>
            <label className="mt-4 block text-xs font-semibold text-slate-500">Confirm new password<input required name="confirmation" type="password" minLength={8} className={inputClass} /></label>
            <button className="mt-6 w-full rounded-full border border-midnight-navy bg-midnight-navy px-5 py-3 text-sm font-medium text-white">Change password</button>
          </form>
        )}
      </div>
    </div>
  )

  if (onboarding) return <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10 font-sans">{content}</main>
  return <main className="admin-scroll min-h-0 flex-1 overflow-y-auto bg-slate-50/50 px-6 pb-10 pt-6 xl:px-10">{content}</main>
}
