'use client'

import { useState } from 'react'
import AdminSelect from './AdminSelect'

const initialSettings = {
  siteName: 'The Gospel Network Africa',
  siteDescription: 'Theological resources for the African church.',
  contactEmail: 'editorial@tgnafrica.org',
  timezone: 'Africa/Lagos',
  defaultStatus: 'Draft',
  reviewRequired: true,
  emailNotifications: true,
  publishingNotifications: true,
  weeklyReport: true,
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-5 py-4">
      <span><span className="block text-sm font-medium text-slate-700">{label}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{description}</span></span>
      <button type="button" onClick={() => onChange(!checked)} className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-midnight-navy' : 'bg-slate-200'}`} role="switch" aria-checked={checked} aria-label={label}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}

export default function SettingsManager({ initialValues = {}, limited = false }) {
  const [settings, setSettings] = useState({ ...initialSettings, ...initialValues })
  const [notice, setNotice] = useState('')
  const [noticeType, setNoticeType] = useState('success')
  const [inviting, setInviting] = useState(false)
  const [invite, setInvite] = useState({ displayName: '', email: '' })
  const fieldClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-midnight-navy/30 focus:ring-2 focus:ring-midnight-navy/10'
  const update = (field) => (event) => setSettings((current) => ({ ...current, [field]: event.target.value }))

  const save = async (event) => {
    event.preventDefault()
    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    const result = await response.json()
    if (!response.ok) {
      setNoticeType('error')
      setNotice(result.error || 'Unable to save settings.')
      return
    }
    setNoticeType('success')
    setNotice('Settings saved successfully.')
    window.setTimeout(() => setNotice(''), 3000)
  }

  const inviteStaff = async (event) => {
    event.preventDefault()
    setInviting(true)
    setNotice('')
    const response = await fetch('/api/admin/invite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(invite) })
    const result = await response.json()
    setInviting(false)
    if (!response.ok) {
      setNoticeType('error')
      setNotice(result.error || 'Unable to send invitation.')
      return
    }
    setInvite({ displayName: '', email: '' })
    setNoticeType('success')
    setNotice(`Invitation sent to ${invite.email}. They will be asked to create a password and complete their profile.`)
  }

  return (
    <main className="admin-scroll min-h-0 flex-1 overflow-y-auto bg-slate-50/50 px-6 pb-10 pt-6 xl:px-10">
      <form onSubmit={save} className="mx-auto max-w-[980px]">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-midnight-navy">Administration</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Settings</h2><p className="mt-1 text-sm text-slate-500">Configure the editorial platform and publishing workflow.</p></div>
          {!limited && <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-midnight-navy px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"><span className="material-symbols-outlined text-[18px]">save</span>Save settings</button>}
        </div>
        {notice && <div role="status" className={`mb-5 rounded-2xl px-4 py-3 text-sm ${noticeType === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>{notice}</div>}

        <div className="space-y-6">
          {!limited && <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
            <div><h3 className="font-semibold text-midnight-navy">Invite staff member</h3><p className="mt-1 text-xs text-slate-400">Staff accounts are invitation-only. Assign the minimum role they need.</p></div>
            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <label className="text-xs font-semibold text-slate-500">Name<input value={invite.displayName} onChange={(event) => setInvite((current) => ({ ...current, displayName: event.target.value }))} className={fieldClass} placeholder="Full name" /></label>
              <label className="text-xs font-semibold text-slate-500">Email<input type="email" value={invite.email} onChange={(event) => setInvite((current) => ({ ...current, email: event.target.value }))} className={fieldClass} placeholder="staff@example.com" /></label>
              <button type="button" onClick={inviteStaff} disabled={inviting || !invite.email || !invite.displayName} className="rounded-full bg-midnight-navy px-5 py-3 text-sm font-medium text-white disabled:opacity-40">{inviting ? 'Sending…' : 'Send invite'}</button>
            </div>
            <p className="mt-4 text-xs text-slate-400">Every new staff account begins as an Author. A Super Author can change the tier later from the Authors menu.</p>
          </section>}

          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
            <div><h3 className="font-semibold text-midnight-navy">General settings</h3><p className="mt-1 text-xs text-slate-400">Basic information used across the public website.</p></div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="text-xs font-semibold text-slate-500">Site name<input required readOnly={limited} value={settings.siteName} onChange={update('siteName')} className={`${fieldClass} ${limited ? 'bg-slate-50' : ''}`} /></label>
              <label className="text-xs font-semibold text-slate-500">Editorial contact email<input required readOnly={limited} type="email" value={settings.contactEmail} onChange={update('contactEmail')} className={`${fieldClass} ${limited ? 'bg-slate-50' : ''}`} /></label>
              <label className="text-xs font-semibold text-slate-500 md:col-span-2">Site description<textarea readOnly={limited} value={settings.siteDescription} onChange={update('siteDescription')} rows={3} className={`${fieldClass} resize-y ${limited ? 'bg-slate-50' : ''}`} /></label>
              {!limited && <div className="text-xs font-semibold text-slate-500"><p>Timezone</p><AdminSelect variant="field" label="Timezone" value={settings.timezone} onChange={(value) => setSettings((current) => ({ ...current, timezone: value }))} options={['Africa/Lagos', 'Africa/Accra', 'Africa/Johannesburg', 'Africa/Nairobi', 'Asia/Dubai']} /></div>}
            </div>
          </section>

          {!limited && <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
            <div><h3 className="font-semibold text-midnight-navy">Editorial workflow</h3><p className="mt-1 text-xs text-slate-400">Control how new publications move through review.</p></div>
            <div className="mt-5 max-w-sm text-xs font-semibold text-slate-500"><p>Default publication status</p><AdminSelect variant="field" label="Default publication status" value={settings.defaultStatus} onChange={(value) => setSettings((current) => ({ ...current, defaultStatus: value }))} options={['Draft', 'In review', 'Scheduled']} /></div>
            <div className="mt-4 divide-y divide-slate-100">
              <Toggle checked={settings.reviewRequired} onChange={(value) => setSettings((current) => ({ ...current, reviewRequired: value }))} label="Require editorial review" description="New work must be reviewed before it can be published." />
              <Toggle checked={settings.publishingNotifications} onChange={(value) => setSettings((current) => ({ ...current, publishingNotifications: value }))} label="Publishing notifications" description="Notify editors when content is scheduled or published." />
            </div>
          </section>}

          {!limited && <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
            <div><h3 className="font-semibold text-midnight-navy">Reports and notifications</h3><p className="mt-1 text-xs text-slate-400">Choose which editorial updates you receive.</p></div>
            <div className="mt-4 divide-y divide-slate-100">
              <Toggle checked={settings.emailNotifications} onChange={(value) => setSettings((current) => ({ ...current, emailNotifications: value }))} label="Email notifications" description="Receive important workflow and account alerts by email." />
              <Toggle checked={settings.weeklyReport} onChange={(value) => setSettings((current) => ({ ...current, weeklyReport: value }))} label="Weekly analytics report" description="Receive a weekly summary of readership and publishing performance." />
            </div>
          </section>}
        </div>
      </form>
    </main>
  )
}
