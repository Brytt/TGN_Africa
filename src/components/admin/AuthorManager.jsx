'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import AdminSelect from './AdminSelect'

const authorRoles = ['Author', 'Contributing Author', 'Super Author']

const emptyAuthor = {
  name: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  role: 'Author',
  qualification: '',
  church: '',
  denomination: '',
  location: '',
  country: '',
  bio: '',
  expertise: '',
  website: '',
  image: '',
  status: 'Active',
}

function Avatar({ author, size = 'large' }) {
  const initials = author.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
  const sizeClass = size === 'large' ? 'h-12 w-12 text-sm' : 'h-10 w-10 text-xs'
  return author.image
    ? <img src={author.image} alt="" className={`${sizeClass} shrink-0 rounded-2xl object-cover`} />
    : <span className={`${sizeClass} grid shrink-0 place-items-center rounded-2xl bg-midnight-navy/10 font-bold text-midnight-navy`}>{initials}</span>
}

function AuthorForm({ draft, setDraft, onCancel, onSave, editing = false }) {
  const fileRef = useRef(null)
  const fieldClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-midnight-navy/40 focus:ring-2 focus:ring-midnight-navy/10'
  const update = (field) => (event) => setDraft((current) => ({ ...current, [field]: event.target.value }))

  const loadPhoto = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const form = new FormData()
    form.set('file', file)
    form.set('bucket', 'author-avatars')
    const response = await fetch('/api/admin/upload', { method: 'POST', body: form })
    const result = await response.json()
    if (!response.ok) return window.alert(result.error || 'Photo upload failed')
    setDraft((current) => ({ ...current, image: result.path }))
  }

  return (
    <form onSubmit={onSave} className="mx-auto max-w-[1100px]">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
        <div>
          <button type="button" onClick={onCancel} className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-midnight-navy"><span className="material-symbols-outlined text-[17px]">arrow_back</span>Back to authors</button>
          <h2 className="text-2xl font-semibold tracking-tight text-midnight-navy">{editing ? 'Edit author profile' : 'Add a new author'}</h2>
          <p className="mt-1 text-sm text-slate-500">{editing ? 'Update their contributor, ministry, and account details.' : 'Create their contributor profile and ministry details.'}</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600">Cancel</button>
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-midnight-navy px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"><span className="material-symbols-outlined text-[18px]">{editing ? 'save' : 'person_add'}</span>{editing ? 'Save changes' : 'Add author'}</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <section className="rounded-3xl border border-slate-100 bg-white p-5 text-center shadow-sm">
            <div className="mx-auto grid h-32 w-32 place-items-center overflow-hidden rounded-3xl bg-midnight-navy/5">
              {draft.image ? <img src={draft.image} alt="Author preview" className="h-full w-full object-cover" /> : <span className="material-symbols-outlined text-5xl text-midnight-navy/25">person</span>}
            </div>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={loadPhoto} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-midnight-navy/20 hover:text-midnight-navy"><span className="material-symbols-outlined text-[17px]">upload</span>Upload picture</button>
            <p className="mt-3 text-[11px] leading-4 text-slate-400">JPG, PNG, or WebP. A square portrait works best.</p>
          </section>
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Account status</p>
            <AdminSelect variant="field" label="Author status" value={draft.status} onChange={(value) => setDraft((current) => ({ ...current, status: value }))} options={['Active', 'Inactive']} />
          </section>
        </aside>

        <div className="space-y-5">
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
            <h3 className="font-semibold text-midnight-navy">Personal information</h3>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="text-xs font-semibold text-slate-500">Full name<input required value={draft.name} onChange={update('name')} className={fieldClass} placeholder="Author's full name" /></label>
              <div className="text-xs font-semibold text-slate-500">
                <p>Editorial role</p>
                <AdminSelect required variant="field" label="Editorial role" value={draft.role} onChange={(value) => setDraft((current) => ({ ...current, role: value }))} options={authorRoles} placeholder="Select author role" />
              </div>
              <label className="text-xs font-semibold text-slate-500">Email address<input required type="email" value={draft.email} onChange={update('email')} className={fieldClass} placeholder="name@example.com" /></label>
              <label className="text-xs font-semibold text-slate-500">Phone number<input type="tel" value={draft.phone} onChange={update('phone')} className={fieldClass} placeholder="+234..." /></label>
              <label className="text-xs font-semibold text-slate-500">Date of birth<input required type="date" value={draft.dateOfBirth} onChange={update('dateOfBirth')} max={new Date().toISOString().split('T')[0]} className={fieldClass} /><span className="mt-2 block text-[11px] font-normal text-slate-400">Used for private birthday reminders.</span></label>
              <label className="text-xs font-semibold text-slate-500">City / location<input required value={draft.location} onChange={update('location')} className={fieldClass} placeholder="Lagos" /></label>
              <label className="text-xs font-semibold text-slate-500">Country<input required value={draft.country} onChange={update('country')} className={fieldClass} placeholder="Nigeria" /></label>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
            <h3 className="font-semibold text-midnight-navy">Ministry and qualifications</h3>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="text-xs font-semibold text-slate-500 md:col-span-2">Qualifications<input required value={draft.qualification} onChange={update('qualification')} className={fieldClass} placeholder="e.g. M.Div., institution and specialization" /></label>
              <label className="text-xs font-semibold text-slate-500">Church attended<input required value={draft.church} onChange={update('church')} className={fieldClass} placeholder="Church name" /></label>
              <label className="text-xs font-semibold text-slate-500">Denomination<input value={draft.denomination} onChange={update('denomination')} className={fieldClass} placeholder="Denomination or tradition" /></label>
              <label className="text-xs font-semibold text-slate-500 md:col-span-2">Areas of expertise<input value={draft.expertise} onChange={update('expertise')} className={fieldClass} placeholder="Biblical theology, pastoral care, discipleship..." /></label>
              <label className="text-xs font-semibold text-slate-500 md:col-span-2">Author biography<textarea required value={draft.bio} onChange={update('bio')} rows={5} className={`${fieldClass} resize-y leading-6`} placeholder="Introduce the author, their ministry, and the subjects they write about..." /></label>
              <label className="text-xs font-semibold text-slate-500 md:col-span-2">Website or profile link<input type="url" value={draft.website} onChange={update('website')} className={fieldClass} placeholder="https://..." /></label>
            </div>
          </section>
        </div>
      </div>
    </form>
  )
}

export default function AuthorManager({ initialAuthors = [] }) {
  const [authors, setAuthors] = useState(initialAuthors)
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('All roles')
  const [formOpen, setFormOpen] = useState(false)
  const [draft, setDraft] = useState(emptyAuthor)
  const [notice, setNotice] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [activeMenu, setActiveMenu] = useState(null)
  const [previewAuthor, setPreviewAuthor] = useState(null)
  const [birthdayReminderDismissed, setBirthdayReminderDismissed] = useState(false)

  useEffect(() => {
    const closeMenu = (event) => {
      if (event.key === 'Escape' || !event.target.closest?.('[data-author-menu]')) setActiveMenu(null)
    }
    document.addEventListener('pointerdown', closeMenu)
    document.addEventListener('keydown', closeMenu)
    return () => {
      document.removeEventListener('pointerdown', closeMenu)
      document.removeEventListener('keydown', closeMenu)
    }
  }, [])

  useEffect(() => {
    fetch('/api/admin/reminders')
      .then((response) => response.json())
      .then((result) => setBirthdayReminderDismissed(Boolean(result.dismissed)))
      .catch(() => {})
  }, [])

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return authors.filter((author) =>
      (!normalized || [author.name, author.role, author.qualification, author.church, author.location, author.country].some((value) => value.toLowerCase().includes(normalized))) &&
      (role === 'All roles' || author.role === role),
    )
  }, [authors, query, role])

  const upcomingBirthdays = useMemo(() => {
    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return authors
      .filter((author) => author.status === 'Active' && author.dateOfBirth)
      .map((author) => {
        const [, month, day] = author.dateOfBirth.split('-').map(Number)
        let nextBirthday = new Date(today.getFullYear(), month - 1, day)
        if (nextBirthday < startOfToday) nextBirthday = new Date(today.getFullYear() + 1, month - 1, day)
        const daysAway = Math.round((nextBirthday - startOfToday) / 86400000)
        return { ...author, nextBirthday, daysAway }
      })
      .sort((a, b) => a.daysAway - b.daysAway)
      .filter((author) => author.daysAway <= 7)
      .slice(0, 3)
  }, [authors])

  const dismissBirthdayReminder = async () => {
    await fetch('/api/admin/reminders', { method: 'POST' })
    setBirthdayReminderDismissed(true)
  }

  const saveAuthor = async (event) => {
    event.preventDefault()
    const existing = authors.find((author) => author.id === editingId)
    const response = await fetch(existing ? `/api/admin/authors/${editingId}` : '/api/admin/authors', {
      method: existing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    })
    const result = await response.json()
    if (!response.ok) {
      setNotice(result.error || 'Unable to save author.')
      return
    }
    const author = existing
      ? { ...existing, ...draft }
      : {
          ...draft,
          id: result.data.id,
          publications: 0,
        }
    setAuthors((current) => existing ? current.map((item) => item.id === editingId ? author : item) : [author, ...current])
    setDraft(emptyAuthor)
    setFormOpen(false)
    setEditingId(null)
    setNotice(existing ? `${author.name}'s profile was updated.` : `${author.name} was added to the author directory.`)
    window.setTimeout(() => setNotice(''), 3000)
  }

  const editAuthor = (author) => {
    setDraft({ ...emptyAuthor, ...author })
    setEditingId(author.id)
    setActiveMenu(null)
    setFormOpen(true)
  }

  const toggleAuthorStatus = async (author) => {
    const nextStatus = author.status === 'Active' ? 'Inactive' : 'Active'
    const response = await fetch(`/api/admin/authors/${author.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...author, status: nextStatus }),
    })
    if (!response.ok) return setNotice((await response.json()).error || 'Unable to update author.')
    setAuthors((current) => current.map((item) => item.id === author.id ? { ...item, status: nextStatus } : item))
    setActiveMenu(null)
    setNotice(`${author.name} is now ${nextStatus.toLowerCase()}.`)
    window.setTimeout(() => setNotice(''), 3000)
  }

  const removeAuthor = async (author) => {
    if (!window.confirm(`Remove ${author.name} from the author directory?`)) return
    const response = await fetch(`/api/admin/authors/${author.id}`, { method: 'DELETE' })
    if (!response.ok) return setNotice((await response.json()).error || 'Unable to remove author.')
    setAuthors((current) => current.filter((item) => item.id !== author.id))
    setActiveMenu(null)
    setNotice(`${author.name} was removed from the author directory.`)
    window.setTimeout(() => setNotice(''), 3000)
  }

  if (formOpen) {
    return <main className="admin-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-6 xl:px-10"><AuthorForm draft={draft} setDraft={setDraft} editing={Boolean(editingId)} onCancel={() => { setFormOpen(false); setEditingId(null); setDraft(emptyAuthor) }} onSave={saveAuthor} /></main>
  }

  return (
    <main className="admin-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-6 xl:px-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-midnight-navy">Contributor network</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Authors</h2>
            <p className="mt-1 text-sm text-slate-500">Manage writer profiles, roles, churches, and qualifications.</p>
          </div>
          <button type="button" onClick={() => { setEditingId(null); setDraft(emptyAuthor); setFormOpen(true) }} className="inline-flex items-center justify-center gap-2 rounded-full bg-midnight-navy px-5 py-3 text-sm font-medium text-white hover:opacity-90"><span className="material-symbols-outlined text-[19px]">person_add</span>Add author</button>
        </div>

        {notice && <div role="status" className="mb-5 rounded-2xl bg-midnight-navy/5 px-4 py-3 text-sm text-midnight-navy">{notice}</div>}

        {!birthdayReminderDismissed && upcomingBirthdays.length > 0 && <section className="relative mb-6 rounded-3xl border border-heritage-gold/20 bg-gradient-to-r from-heritage-gold/10 to-white p-5 pr-14 shadow-sm md:p-6 md:pr-14" aria-label="Upcoming birthday reminders">
          <button type="button" onClick={dismissBirthdayReminder} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-white hover:text-midnight-navy" aria-label="Dismiss birthday reminders for today" title="Hide until tomorrow"><span className="material-symbols-outlined text-[19px]">close</span></button>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-heritage-gold text-white"><span className="material-symbols-outlined text-[22px]">cake</span></span>
              <div><h3 className="font-semibold text-midnight-navy">Birthday reminders</h3><p className="mt-1 text-xs text-slate-500">Upcoming birthdays for active authors</p></div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {upcomingBirthdays.map((author) => (
                <button key={author.id} type="button" onClick={() => setPreviewAuthor(author)} className="flex items-center gap-3 rounded-2xl border border-white bg-white/80 px-3 py-2.5 text-left shadow-sm hover:border-heritage-gold/30">
                  <Avatar author={author} size="small" />
                  <span><span className="block text-xs font-semibold text-slate-700">{author.name}</span><span className="block text-[10px] text-slate-400">{author.daysAway === 0 ? 'Today' : author.daysAway === 1 ? 'Tomorrow' : `In ${author.daysAway} days`} · {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(author.nextBirthday)}</span></span>
                </button>
              ))}
            </div>
          </div>
        </section>}

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row">
            <label className="relative min-w-0 flex-1">
              <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[19px] text-slate-400">search</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-full border border-slate-200 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-midnight-navy/30 focus:ring-2 focus:ring-midnight-navy/10" placeholder="Search authors, churches, or qualifications..." />
            </label>
            <AdminSelect label="Filter authors by role" value={role} onChange={setRole} options={['All roles', ...authorRoles]} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead><tr className="border-b border-slate-100 text-xs text-slate-900">
                <th className="pb-4 pr-5 font-semibold">Author</th><th className="pb-4 pr-5 font-semibold">Role</th><th className="pb-4 pr-5 font-semibold">Qualification</th><th className="pb-4 pr-5 font-semibold">Church</th><th className="pb-4 pr-5 text-center font-semibold">Publications</th><th className="pb-4 pr-5 font-semibold">Status</th><th className="pb-4 text-center font-semibold">Action</th>
              </tr></thead>
              <tbody>
                {visible.map((author) => (
                  <tr key={author.id} className="border-b border-slate-50 text-sm last:border-0 hover:bg-slate-50/60">
                    <td className="py-4 pr-5"><div className="flex items-center gap-3"><Avatar author={author} /><span className="min-w-0"><span className="block font-semibold text-slate-900">{author.name}</span><span className="block truncate text-xs text-slate-400">{author.email} · {[author.location, author.country].filter(Boolean).join(', ')}</span></span></div></td>
                    <td className="py-4 pr-5"><span className="rounded-full bg-midnight-navy/5 px-3 py-1.5 text-xs font-medium text-midnight-navy">{author.role}</span></td>
                    <td className="max-w-[220px] py-4 pr-5 text-xs leading-5 text-slate-500">{author.qualification}</td>
                    <td className="max-w-[180px] py-4 pr-5 text-xs leading-5 text-slate-500">{author.church}</td>
                    <td className="py-4 pr-5 text-center font-medium tabular-nums text-slate-700">{author.publications}</td>
                    <td className="py-4 pr-5"><span className={`inline-flex items-center gap-1.5 text-xs font-medium ${author.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}><span className={`h-2 w-2 rounded-full ${author.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />{author.status}</span></td>
                    <td className="relative py-4 text-center" data-author-menu>
                      <button type="button" onClick={() => setActiveMenu(activeMenu === author.id ? null : author.id)} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:border-midnight-navy/20 hover:text-midnight-navy" aria-expanded={activeMenu === author.id}>
                        Action<span className="material-symbols-outlined text-[16px]">expand_more</span>
                      </button>
                      {activeMenu === author.id && (
                        <div className="absolute right-0 top-[calc(100%-8px)] z-30 w-44 rounded-2xl border border-slate-100 bg-white p-2 text-left shadow-xl">
                          <button type="button" onClick={() => { setPreviewAuthor(author); setActiveMenu(null) }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"><span className="material-symbols-outlined text-[18px]">visibility</span>Preview profile</button>
                          <button type="button" onClick={() => editAuthor(author)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"><span className="material-symbols-outlined text-[18px]">edit</span>Edit profile</button>
                          <button type="button" onClick={() => toggleAuthorStatus(author)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"><span className="material-symbols-outlined text-[18px]">{author.status === 'Active' ? 'person_off' : 'person_check'}</span>{author.status === 'Active' ? 'Set inactive' : 'Set active'}</button>
                          <div className="my-1 border-t border-slate-100" />
                          <button type="button" onClick={() => removeAuthor(author)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-500 hover:bg-red-50"><span className="material-symbols-outlined text-[18px]">delete</span>Remove author</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!visible.length && <div className="py-14 text-center text-sm text-slate-400">No authors match this search.</div>}
        </section>
      </div>
      {previewAuthor && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-midnight-navy/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="author-preview-name" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewAuthor(null) }}>
          <article className="admin-scroll max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="relative bg-midnight-navy px-6 pb-8 pt-6 text-white md:px-9">
              <button type="button" onClick={() => setPreviewAuthor(null)} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close author preview"><span className="material-symbols-outlined">close</span></button>
              <div className="flex items-end gap-5 pt-10">
                {previewAuthor.image
                  ? <img src={previewAuthor.image} alt="" className="h-24 w-24 shrink-0 rounded-3xl border-4 border-white/15 object-cover" />
                  : <span className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-white/10 text-2xl font-bold">{previewAuthor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>}
                <div className="min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/55">{previewAuthor.role}</span>
                  <h2 id="author-preview-name" className="mt-2 text-3xl font-semibold">{previewAuthor.name}</h2>
                  <p className="mt-1 text-sm text-white/65">{[previewAuthor.location, previewAuthor.country].filter(Boolean).join(', ')}</p>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-9">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Qualifications</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{previewAuthor.qualification || 'Not provided'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Church</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{previewAuthor.church || 'Not provided'}</p>
                  {previewAuthor.denomination && <p className="mt-1 text-xs text-slate-400">{previewAuthor.denomination}</p>}
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Contact</p>
                  <p className="mt-2 break-all text-sm text-slate-700">{previewAuthor.email}</p>
                  {previewAuthor.phone && <p className="mt-1 text-xs text-slate-500">{previewAuthor.phone}</p>}
                  {previewAuthor.dateOfBirth && <p className="mt-2 text-xs text-slate-500">Birthday: {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' }).format(new Date(`${previewAuthor.dateOfBirth}T12:00:00`))}</p>}
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Editorial activity</p>
                  <p className="mt-2 text-sm text-slate-700">{previewAuthor.publications} publications</p>
                  <p className={`mt-1 text-xs font-medium ${previewAuthor.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>{previewAuthor.status} author</p>
                </div>
              </div>
              {previewAuthor.expertise && <div className="mt-6"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Areas of expertise</p><p className="mt-2 text-sm leading-6 text-slate-600">{previewAuthor.expertise}</p></div>}
              <div className="mt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Biography</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{previewAuthor.bio || 'No biography has been added.'}</p>
              </div>
              <div className="mt-7 flex justify-end border-t border-slate-100 pt-5">
                <button type="button" onClick={() => { setPreviewAuthor(null); editAuthor(previewAuthor) }} className="inline-flex items-center gap-2 rounded-full bg-midnight-navy px-5 py-2.5 text-sm font-medium text-white"><span className="material-symbols-outlined text-[18px]">edit</span>Edit author</button>
              </div>
            </div>
          </article>
        </div>
      )}
    </main>
  )
}
