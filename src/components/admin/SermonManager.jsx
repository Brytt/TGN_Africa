'use client'

import { useMemo, useState } from 'react'
import AdminSelect from './AdminSelect'

const emptySermon = { title: '', slug: '', speaker: '', scripture: '', series: '', description: '', mediaType: 'audio', audioUrl: '', videoUrl: '', image: '', status: 'Draft', preachedAt: new Date().toISOString().slice(0, 10), publishedAt: '' }
const fieldClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-midnight-navy/40 focus:ring-2 focus:ring-midnight-navy/10'

export default function SermonManager({ initialSermons = [] }) {
  const [sermons, setSermons] = useState(initialSermons)
  const [draft, setDraft] = useState(emptySermon)
  const [editingId, setEditingId] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState('')
  const update = (field) => (event) => setDraft((current) => ({ ...current, [field]: event.target.value }))
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return sermons.filter((sermon) => !term || [sermon.title, sermon.speaker, sermon.series, sermon.scripture].some((value) => value?.toLowerCase().includes(term)))
  }, [query, sermons])

  const openEditor = (sermon = null) => {
    setEditingId(sermon?.id || null)
    setDraft(sermon ? { ...sermon, status: sermon.status || 'Draft' } : emptySermon)
    setEditorOpen(true)
    setNotice('')
  }

  const uploadCover = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.set('file', file)
    form.set('bucket', 'publication-media')
    const response = await fetch('/api/admin/upload', { method: 'POST', body: form })
    const result = await response.json()
    setUploading(false)
    if (!response.ok) return window.alert(result.error || 'Cover upload failed')
    setDraft((current) => ({ ...current, image: result.path }))
  }

  const save = async (event) => {
    event.preventDefault()
    setSaving(true)
    const response = await fetch(editingId ? `/api/admin/sermons/${editingId}` : '/api/admin/sermons', {
      method: editingId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft),
    })
    const result = await response.json()
    setSaving(false)
    if (!response.ok) return window.alert(result.error || 'Unable to save sermon')
    const saved = { ...draft, id: editingId || result.data.id, date: new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(`${draft.preachedAt}T12:00:00`)) }
    setSermons((current) => editingId ? current.map((item) => item.id === editingId ? saved : item) : [saved, ...current])
    setEditorOpen(false)
    setNotice(editingId ? 'Sermon updated.' : 'Sermon created.')
  }

  const remove = async (sermon) => {
    if (!window.confirm(`Delete “${sermon.title}”?`)) return
    const response = await fetch(`/api/admin/sermons/${sermon.id}`, { method: 'DELETE' })
    const result = await response.json()
    if (!response.ok) return window.alert(result.error || 'Unable to delete sermon')
    setSermons((current) => current.filter((item) => item.id !== sermon.id))
    setNotice('Sermon deleted.')
  }

  if (editorOpen) return <main className="admin-scroll min-h-0 flex-1 overflow-y-auto bg-slate-50/50 p-6 xl:p-10"><form onSubmit={save} className="mx-auto max-w-[1050px]">
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><button type="button" onClick={() => setEditorOpen(false)} className="mb-3 text-xs font-semibold text-slate-500">← Back to sermons</button><h1 className="text-2xl font-semibold text-midnight-navy">{editingId ? 'Edit sermon' : 'Add sermon'}</h1><p className="mt-1 text-sm text-slate-500">Publish audio, video, or both from one sermon record.</p></div><button disabled={saving} className="rounded-full bg-midnight-navy px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save sermon'}</button></div>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <label className="block text-xs font-semibold text-slate-500">TITLE<input required value={draft.title} onChange={update('title')} className={`${fieldClass} text-lg font-semibold`} placeholder="The title of the sermon" /></label>
        <div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="text-xs font-semibold text-slate-500">SPEAKER<input required value={draft.speaker} onChange={update('speaker')} className={fieldClass} placeholder="Preacher or teacher" /></label><label className="text-xs font-semibold text-slate-500">DATE PREACHED<input required type="date" value={draft.preachedAt} onChange={update('preachedAt')} className={fieldClass} /></label></div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="text-xs font-semibold text-slate-500">SCRIPTURE PASSAGE<input value={draft.scripture} onChange={update('scripture')} className={fieldClass} placeholder="e.g. Romans 8:1–11" /></label><label className="text-xs font-semibold text-slate-500">SERIES<input value={draft.series} onChange={update('series')} className={fieldClass} placeholder="e.g. Life in the Spirit" /></label></div>
        <label className="mt-5 block text-xs font-semibold text-slate-500">DESCRIPTION<textarea rows={7} value={draft.description} onChange={update('description')} className={`${fieldClass} resize-y leading-6`} placeholder="Introduce the sermon and its main burden…" /></label>
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5"><p className="text-xs font-semibold text-slate-500">MEDIA</p><div className="mt-3"><AdminSelect label="Media type" variant="field" value={draft.mediaType} onChange={(mediaType) => setDraft((current) => ({ ...current, mediaType }))} options={[{ label: 'Audio only', value: 'audio' }, { label: 'Video only', value: 'video' }, { label: 'Video and audio', value: 'both' }]} /></div>
          {(draft.mediaType === 'audio' || draft.mediaType === 'both') && <label className="mt-4 block text-xs font-semibold text-slate-500">AUDIO URL<input required type="url" value={draft.audioUrl} onChange={update('audioUrl')} className={fieldClass} placeholder="https://…/sermon.mp3" /></label>}
          {(draft.mediaType === 'video' || draft.mediaType === 'both') && <label className="mt-4 block text-xs font-semibold text-slate-500">VIDEO URL<input required type="url" value={draft.videoUrl} onChange={update('videoUrl')} className={fieldClass} placeholder="YouTube, Vimeo, or direct video URL" /></label>}
        </div>
      </section>
      <aside className="space-y-5"><section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><h2 className="font-semibold text-midnight-navy">Publishing</h2><div className="mt-4"><AdminSelect label="Sermon status" variant="field" value={draft.status} onChange={(status) => setDraft((current) => ({ ...current, status }))} options={['Draft', 'Published', 'Archived']} /></div><label className="mt-4 block text-xs font-semibold text-slate-500">CUSTOM LINK <span className="font-normal text-slate-400">(optional)</span><input value={draft.slug} onChange={update('slug')} className={fieldClass} placeholder="generated-from-title" /></label></section>
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><h2 className="font-semibold text-midnight-navy">Cover image</h2><label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold"><span className="material-symbols-outlined text-[17px]">upload</span>{uploading ? 'Uploading…' : 'Upload cover'}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadCover} className="hidden" /></label><div className="mt-4 aspect-[16/10] overflow-hidden rounded-2xl bg-slate-50">{draft.image ? <img src={draft.image} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center text-xs text-slate-400">No cover selected</span>}</div></section>
      </aside>
    </div>
  </form></main>

  return <main className="admin-scroll min-h-0 flex-1 overflow-y-auto bg-slate-50/50 p-6 xl:p-10"><div className="mx-auto max-w-[1120px]">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-midnight-navy">Media library</p><h1 className="mt-2 text-2xl font-semibold text-slate-900">Sermons</h1><p className="mt-1 text-sm text-slate-500">Manage sermon audio, video, speakers, Scripture and series.</p></div><button onClick={() => openEditor()} className="inline-flex items-center gap-2 rounded-full bg-midnight-navy px-5 py-3 text-sm font-semibold text-white"><span className="material-symbols-outlined text-[18px]">add</span>Add sermon</button></div>
    {notice && <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</p>}
    <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-full border border-slate-200 px-4 py-2.5 text-sm outline-none" placeholder="Search sermons, speakers, series, or Scripture…" /><div className="mt-5 divide-y divide-slate-100">{visible.map((sermon) => <article key={sermon.id} className="grid gap-4 py-5 sm:grid-cols-[110px_1fr_auto] sm:items-center"><img src={sermon.image} alt="" className="aspect-[16/10] w-full rounded-xl object-cover" /><div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-midnight-navy/5 px-2.5 py-1 text-[10px] font-bold uppercase text-midnight-navy">{sermon.mediaType}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">{sermon.status}</span></div><h2 className="mt-2 font-semibold text-slate-900">{sermon.title}</h2><p className="mt-1 text-xs text-slate-500">{sermon.speaker} · {sermon.scripture || 'No passage'} · {sermon.date}</p></div><div className="flex gap-2"><button onClick={() => openEditor(sermon)} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold">Edit</button><button onClick={() => remove(sermon)} className="rounded-full border border-red-100 px-4 py-2 text-xs font-semibold text-red-600">Delete</button></div></article>)}{!visible.length && <p className="py-16 text-center text-sm text-slate-400">No sermons found.</p>}</div></section>
  </div></main>
}
