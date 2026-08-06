'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import AdminSelect from './AdminSelect'

const authorRoles = ['Founder', 'Managing Editor', 'Deputy Editor', 'Contributor', 'Guest Author']
const menuOptions = [
  ['analytics', 'Analytics'],
  ['content', 'Content'],
  ['comments', 'Comments'],
  ['authors', 'Authors'],
  ['subscribers', 'Subscribers'],
  ['topics', 'Topics'],
]

const emptyGuestAuthor = {
  name: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  role: 'Guest Author',
  isStaff: false,
  menuAccess: [],
  qualification: '',
  church: '',
  denomination: '',
  location: '',
  country: '',
  bio: '',
  shortBio: '',
  expertise: '',
  linkedin: '',
  instagram: '',
  facebook: '',
  image: '',
  status: 'Active',
  publications: 0,
}

function Avatar({ author, size = 'large' }) {
  const initials = author.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
  const sizeClass = size === 'large' ? 'h-12 w-12 text-sm' : 'h-10 w-10 text-xs'
  return author.image
    ? <img src={author.image} alt="" className={`${sizeClass} shrink-0 rounded-2xl object-cover`} />
    : <span className={`${sizeClass} grid shrink-0 place-items-center rounded-2xl bg-midnight-navy/10 font-bold text-midnight-navy`}>{initials}</span>
}

export default function AuthorManager({ initialAuthors = [], canManageAccess = false, canEditProfiles = false }) {
  const photoInput = useRef(null)
  const [authors, setAuthors] = useState(initialAuthors)
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('All roles')
  const [notice, setNotice] = useState('')
  const [activeMenu, setActiveMenu] = useState(null)
  const [previewAuthor, setPreviewAuthor] = useState(null)
  const [editingAuthor, setEditingAuthor] = useState(null)
  const [savingAuthor, setSavingAuthor] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
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

  const changeAuthorRole = async (author, nextRole) => {
    if (author.role === nextRole) return
    const response = await fetch(`/api/admin/authors/${author.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'changeRole', role: nextRole }),
    })
    if (!response.ok) return setNotice((await response.json()).error || 'Unable to change author role.')
    setAuthors((current) => current.map((item) => item.id === author.id ? { ...item, role: nextRole } : item))
    setPreviewAuthor((current) => current?.id === author.id ? { ...current, role: nextRole } : current)
    setActiveMenu(null)
    setNotice(`${author.name} is now ${nextRole}.`)
    window.setTimeout(() => setNotice(''), 3000)
  }

  const toggleMenuAccess = async (author, permission) => {
    const current = author.menuAccess || []
    const menuAccess = current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission]
    const response = await fetch(`/api/admin/authors/${author.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'changeAccess', menuAccess }),
    })
    if (!response.ok) return setNotice((await response.json()).error || 'Unable to update menu access.')
    setAuthors((items) => items.map((item) => item.id === author.id ? { ...item, menuAccess } : item))
    setNotice(`${author.name}'s additional menu access was updated.`)
    window.setTimeout(() => setNotice(''), 3000)
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

  const updateEditingAuthor = (field) => (event) => setEditingAuthor((current) => ({ ...current, [field]: event.target.value }))

  const beginGuestAuthor = () => {
    setEditingAuthor({ ...emptyGuestAuthor, isNew: true })
    setNotice('')
  }

  const uploadAuthorPhoto = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setUploadingPhoto(true)
    setNotice('Uploading contributor picture…')
    try {
      const form = new FormData()
      form.set('file', file)
      form.set('bucket', 'author-avatars')
      const response = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const result = await response.json()
      if (!response.ok) return setNotice(result.error || 'Unable to upload contributor picture.')
      setEditingAuthor((current) => ({ ...current, image: result.path }))
      setNotice('Picture uploaded. Save the profile to keep this change.')
    } catch {
      setNotice('Unable to upload contributor picture. Please try again.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const saveAuthor = async (event) => {
    event.preventDefault()
    if (uploadingPhoto) return
    setSavingAuthor(true)
    try {
      const isNew = editingAuthor.isNew
      const response = await fetch(isNew ? '/api/admin/authors' : `/api/admin/authors/${editingAuthor.id}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingAuthor, role: isNew ? 'Guest Author' : editingAuthor.role }),
      })
      const result = await response.json()
      if (!response.ok) return setNotice(result.error || `Unable to ${isNew ? 'add' : 'update'} contributor profile.`)
      const savedAuthor = { ...editingAuthor, id: result.data?.id || editingAuthor.id }
      delete savedAuthor.isNew
      setAuthors((current) => isNew
        ? [...current, savedAuthor].sort((left, right) => left.name.localeCompare(right.name))
        : current.map((author) => author.id === editingAuthor.id ? savedAuthor : author))
      setPreviewAuthor((current) => current?.id === editingAuthor.id ? savedAuthor : current)
      setEditingAuthor(null)
      setNotice(isNew ? `${editingAuthor.name} was added as a guest contributor.` : `${editingAuthor.name}'s profile was updated.`)
      window.setTimeout(() => setNotice(''), 3000)
    } catch {
      setNotice('Unable to update contributor profile. Please try again.')
    } finally {
      setSavingAuthor(false)
    }
  }

  const removeAuthor = async (author) => {
    if (!window.confirm(`Permanently delete ${author.name}, their author profile and login account? This cannot be undone.`)) return
    const response = await fetch(`/api/admin/authors/${author.id}`, { method: 'DELETE' })
    if (!response.ok) return setNotice((await response.json()).error || 'Unable to remove author.')
    setAuthors((current) => current.filter((item) => item.id !== author.id))
    setActiveMenu(null)
    setNotice(`${author.name} was permanently deleted. Their email can now be invited as a completely new account.`)
    window.setTimeout(() => setNotice(''), 3000)
  }

  return (
    <main className="admin-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-6 xl:px-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-midnight-navy">Contributor network</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Staff and guest authors</h2>
            <p className="mt-1 text-sm text-slate-500">The six staff members are clearly identified. Everyone else remains a Guest Author and is not counted as staff.</p>
            </div>
            {canEditProfiles && <button type="button" onClick={beginGuestAuthor} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-midnight-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-midnight-navy/90"><span className="material-symbols-outlined text-[19px]">person_add</span>Add guest contributor</button>}
          </div>
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
                    <td className="py-4 pr-5"><span className="rounded-full bg-midnight-navy/5 px-3 py-1.5 text-xs font-medium text-midnight-navy">{author.role}</span><span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{author.isStaff ? 'Staff' : 'Guest'}</span></td>
                    <td className="max-w-[220px] py-4 pr-5 text-xs leading-5 text-slate-500">{author.qualification}</td>
                    <td className="max-w-[180px] py-4 pr-5 text-xs leading-5 text-slate-500">{author.church}</td>
                    <td className="py-4 pr-5 text-center font-medium tabular-nums text-slate-700">{author.publications}</td>
                    <td className="py-4 pr-5"><span className={`inline-flex items-center gap-1.5 text-xs font-medium ${author.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}><span className={`h-2 w-2 rounded-full ${author.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />{author.status}</span></td>
                    <td className="relative py-4 text-center" data-author-menu>
                      <button type="button" onClick={() => setActiveMenu(activeMenu === author.id ? null : author.id)} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:border-midnight-navy/20 hover:text-midnight-navy" aria-expanded={activeMenu === author.id}>
                        Action<span className="material-symbols-outlined text-[16px]">expand_more</span>
                      </button>
                      {activeMenu === author.id && (
                        <div className="absolute right-0 top-[calc(100%-8px)] z-30 w-56 rounded-2xl border border-slate-100 bg-white p-2 text-left shadow-xl">
                          <button type="button" onClick={() => { setPreviewAuthor(author); setActiveMenu(null) }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"><span className="material-symbols-outlined text-[18px]">visibility</span>Preview profile</button>
                          {canEditProfiles && <button type="button" onClick={() => { setEditingAuthor({ ...author }); setActiveMenu(null) }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"><span className="material-symbols-outlined text-[18px]">edit</span>Edit profile</button>}
                          {canManageAccess && <><p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Change role</p>
                          {authorRoles.map((authorRole) => (
                            <button key={authorRole} type="button" onClick={() => changeAuthorRole(author, authorRole)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-slate-50 ${author.role === authorRole ? 'font-semibold text-midnight-navy' : 'text-slate-600'}`}>
                              {authorRole}{author.role === authorRole && <span className="material-symbols-outlined text-[17px]">check</span>}
                            </button>
                          ))}</>}
                          {canManageAccess && author.isStaff && author.role !== 'Founder' && <>
                            <div className="my-1 border-t border-slate-100" />
                            <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Additional menu access</p>
                            {menuOptions.map(([permission, label]) => (
                              <button key={permission} type="button" onClick={() => toggleMenuAccess(author, permission)} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                                {label}{author.menuAccess?.includes(permission) && <span className="material-symbols-outlined text-[17px] text-emerald-600">check</span>}
                              </button>
                            ))}
                          </>}
                          <div className="my-1 border-t border-slate-100" />
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
              {Object.entries({ linkedin: previewAuthor.linkedin, instagram: previewAuthor.instagram, facebook: previewAuthor.facebook }).some(([, url]) => url) && <div className="mt-6"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Social profiles</p><div className="mt-3 flex flex-wrap gap-2">{Object.entries({ linkedin: previewAuthor.linkedin, instagram: previewAuthor.instagram, facebook: previewAuthor.facebook }).filter(([, url]) => url).map(([network, url]) => <a key={network} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold capitalize text-midnight-navy hover:bg-slate-50"><span className="material-symbols-outlined text-[16px]">open_in_new</span>{network}</a>)}</div></div>}
              <div className="mt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Full profile biography</p>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">{previewAuthor.bio || 'No biography has been added.'}</p>
              </div>
              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Concise article biography</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{previewAuthor.shortBio || 'No concise article biography has been added.'}</p>
              </div>
            </div>
          </article>
        </div>
      )}
      {editingAuthor && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-midnight-navy/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="edit-author-title" onMouseDown={(event) => { if (event.target === event.currentTarget && !savingAuthor) setEditingAuthor(null) }}>
          <form onSubmit={saveAuthor} className="admin-scroll max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-midnight-navy">{editingAuthor.isNew ? 'Guest contributor' : 'Contributor profile'}</p><h2 id="edit-author-title" className="mt-2 text-2xl font-semibold text-slate-900">{editingAuthor.isNew ? 'Add guest contributor' : `Edit ${editingAuthor.name}`}</h2>{editingAuthor.isNew && <p className="mt-1 text-sm text-slate-500">This creates an author profile without staff or login access.</p>}</div>
              <button type="button" disabled={savingAuthor || uploadingPhoto} onClick={() => setEditingAuthor(null)} className="grid size-10 place-items-center rounded-full text-slate-400 hover:bg-slate-50 disabled:opacity-40" aria-label="Close profile editor"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="mt-7 flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center">
              {editingAuthor.image
                ? <img src={editingAuthor.image} alt={`Current profile for ${editingAuthor.name}`} className="size-24 shrink-0 rounded-2xl object-cover" />
                : <span className="grid size-24 shrink-0 place-items-center rounded-2xl bg-midnight-navy/10 text-2xl font-bold text-midnight-navy">{editingAuthor.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'A'}</span>}
              <div>
                <input ref={photoInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadAuthorPhoto} className="hidden" />
                <button type="button" disabled={uploadingPhoto || savingAuthor} onClick={() => photoInput.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-midnight-navy disabled:cursor-wait disabled:opacity-50"><span className="material-symbols-outlined text-[18px]">add_a_photo</span>{uploadingPhoto ? 'Uploading…' : editingAuthor.image ? 'Change profile picture' : 'Upload profile picture'}</button>
                <p className="mt-2 text-[11px] text-slate-400">JPG, PNG or WebP, up to 5 MB. A square portrait works best.</p>
              </div>
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {[
                ['name', 'Full name', 'text'], ['email', 'Email address', 'email'], ['phone', 'Phone number', 'tel'], ['dateOfBirth', 'Date of birth', 'date'],
                ['qualification', 'Qualification', 'text'], ['church', 'Church', 'text'], ['denomination', 'Denomination', 'text'], ['expertise', 'Area of expertise', 'text'],
                ['location', 'City', 'text'], ['country', 'Country', 'text'], ['linkedin', 'LinkedIn profile', 'url'], ['instagram', 'Instagram profile', 'url'], ['facebook', 'Facebook profile', 'url'],
              ].map(([field, label, type]) => <label key={field} className="text-xs font-semibold text-slate-500">{label}<input required={field === 'name' || field === 'email'} type={type} value={editingAuthor[field] || ''} onChange={updateEditingAuthor(field)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal text-slate-900 outline-none focus:border-midnight-navy/40 focus:ring-2 focus:ring-midnight-navy/10" /></label>)}
              <label className="text-xs font-semibold text-slate-500 md:col-span-2">Full contributor biography<textarea value={editingAuthor.bio || ''} onChange={updateEditingAuthor('bio')} rows={8} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal leading-6 text-slate-900 outline-none focus:border-midnight-navy/40 focus:ring-2 focus:ring-midnight-navy/10" /></label>
              <label className="text-xs font-semibold text-slate-500 md:col-span-2">Concise article biography<textarea value={editingAuthor.shortBio || ''} onChange={updateEditingAuthor('shortBio')} rows={3} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal leading-6 text-slate-900 outline-none focus:border-midnight-navy/40 focus:ring-2 focus:ring-midnight-navy/10" /></label>
            </div>
            <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button type="button" disabled={savingAuthor || uploadingPhoto} onClick={() => setEditingAuthor(null)} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 disabled:opacity-40">Cancel</button>
              <button disabled={savingAuthor || uploadingPhoto} className="inline-flex items-center gap-2 rounded-full bg-midnight-navy px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"><span className="material-symbols-outlined text-[18px]">save</span>{uploadingPhoto ? 'Uploading picture…' : savingAuthor ? 'Saving…' : editingAuthor.isNew ? 'Add contributor' : 'Save profile'}</button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}
