'use client'

import { useMemo, useState } from 'react'
import AdminSelect from './AdminSelect'
import { createClient } from '../../lib/supabase/browser'

const emptySermon = { title: '', slug: '', speaker: '', scripture: '', series: '', description: '', mediaType: 'audio', audioUrl: '', videoUrl: '', image: '', status: 'Draft', preachedAt: new Date().toISOString().slice(0, 10), publishedAt: '' }
const fieldClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-midnight-navy/40 focus:ring-2 focus:ring-midnight-navy/10'
const maximumMediaFileSize = 50 * 1024 * 1024

function previewAudioUrl(sermon) {
  try {
    return new URL(sermon.audioUrl).hostname === 'cpmfiles1.com' ? `/api/sermons/${sermon.id}/audio` : sermon.audioUrl
  } catch {
    return sermon.audioUrl
  }
}

function previewVideoUrl(value = '') {
  try {
    const url = new URL(value)
    if (url.hostname.includes('youtu.be')) return { embed: `https://www.youtube.com/embed/${url.pathname.slice(1)}` }
    if (url.hostname.includes('youtube.com')) return { embed: `https://www.youtube.com/embed/${url.searchParams.get('v') || url.pathname.split('/').pop()}` }
    if (url.hostname.includes('vimeo.com')) return { embed: `https://player.vimeo.com/video/${url.pathname.split('/').filter(Boolean).pop()}` }
  } catch {
    return { direct: value }
  }
  return { direct: value }
}

export default function SermonManager({ initialSermons = [] }) {
  const [sermons, setSermons] = useState(initialSermons)
  const [draft, setDraft] = useState(emptySermon)
  const [editingId, setEditingId] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [previewSermon, setPreviewSermon] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState('')
  const [mediaSources, setMediaSources] = useState({ audio: 'link', video: 'link' })
  const [notice, setNotice] = useState('')
  const update = (field) => (event) => setDraft((current) => ({ ...current, [field]: event.target.value }))
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return sermons.filter((sermon) => !term || [sermon.title, sermon.speaker, sermon.series, sermon.scripture].some((value) => value?.toLowerCase().includes(term)))
  }, [query, sermons])

  const openEditor = (sermon = null) => {
    setEditingId(sermon?.id || null)
    setDraft(sermon ? { ...sermon, status: sermon.status || 'Draft' } : emptySermon)
    setMediaSources({
      audio: !sermon || (sermon.audioUrl && !sermon.audioUrl.includes('/storage/v1/object/public/sermon-media/')) ? 'link' : 'file',
      video: !sermon || (sermon.videoUrl && !sermon.videoUrl.includes('/storage/v1/object/public/sermon-media/')) ? 'link' : 'file',
    })
    setEditorOpen(true)
    setNotice('')
    setSaveError('')
  }

  const chooseMediaSource = (kind, source) => {
    if (mediaSources[kind] === source) return
    setMediaSources((current) => ({ ...current, [kind]: source }))
    setDraft((current) => ({ ...current, [`${kind}Url`]: '' }))
  }

  const changeMediaType = (mediaType) => {
    setSaveError('')
    setDraft((current) => ({
      ...current,
      mediaType,
      audioUrl: mediaType === 'video' ? '' : current.audioUrl,
      videoUrl: mediaType === 'audio' ? '' : current.videoUrl,
    }))
  }

  const validateMedia = () => {
    if (uploadingMedia) return `Please wait for the ${uploadingMedia} upload to finish.`
    const requiredKinds = draft.mediaType === 'both' ? ['audio', 'video'] : [draft.mediaType]
    for (const kind of requiredKinds) {
      const value = draft[`${kind}Url`]?.trim()
      if (!value) return `${kind === 'audio' ? 'Audio' : 'Video'} is required. ${mediaSources[kind] === 'file' ? `Upload a ${kind} file` : `Add a ${kind} link`} before saving.`
      try {
        const url = new URL(value)
        if (mediaSources[kind] === 'link') {
          const path = url.pathname.toLowerCase()
          const playable = kind === 'audio'
            ? /\.(mp3|m4a|wav|ogg|oga|webm)$/.test(path)
            : /\.(mp4|webm|mov|m4v)$/.test(path) || url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be') || url.hostname.includes('vimeo.com')
          if (!playable) return `${kind === 'audio' ? 'Audio' : 'Video'} link appears to be a webpage, not playable media. Use a direct ${kind === 'audio' ? 'MP3, M4A, WAV, or OGG' : 'MP4/WebM, YouTube, or Vimeo'} link.`
        }
      } catch {
        return `Enter a valid ${kind} link before saving.`
      }
      const uploaded = value.includes('/storage/v1/object/public/sermon-media/')
      if (mediaSources[kind] === 'file' && !uploaded) return `Upload the ${kind} file before saving.`
      if (mediaSources[kind] === 'link' && uploaded) return `Enter an external ${kind} link or switch the source to Upload file.`
    }
    return ''
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

  const uploadMedia = (kind) => async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const expectedPrefix = kind === 'audio' ? 'audio/' : 'video/'
    if (!file.type.startsWith(expectedPrefix)) return window.alert(`Please select an ${kind} file.`)
    if (file.size > maximumMediaFileSize) {
      setSaveError(`${kind === 'audio' ? 'Audio' : 'Video'} file is ${(file.size / 1024 / 1024).toFixed(1)} MB. This Supabase project currently accepts files up to 50 MB. Compress the file, or choose “Use link” and add a YouTube, Vimeo, podcast, or direct media link.`)
      event.target.value = ''
      return
    }
    setSaveError('')
    setUploadingMedia(kind)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setUploadingMedia('')
      return window.alert('Your admin session has expired. Please sign in again.')
    }
    const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || (kind === 'audio' ? 'mp3' : 'mp4')
    const path = `${user.id}/${kind}/${crypto.randomUUID()}.${extension}`
    const { error } = await supabase.storage.from('sermon-media').upload(path, file, { contentType: file.type, cacheControl: '3600', upsert: false })
    setUploadingMedia('')
    if (error) {
      const message = error.message?.toLowerCase().includes('maximum allowed size') || error.message?.toLowerCase().includes('too large')
        ? 'Supabase rejected this file because it exceeds the project-wide upload limit. Use a file smaller than 50 MB or switch to “Use link”.'
        : (error.message || `${kind} upload failed.`)
      setSaveError(message)
      return
    }
    const { data } = supabase.storage.from('sermon-media').getPublicUrl(path)
    setDraft((current) => ({ ...current, [`${kind}Url`]: data.publicUrl }))
  }

  const save = async (event) => {
    event.preventDefault()
    const requestedStatus = event.nativeEvent?.submitter?.value || draft.status
    const submission = { ...draft, status: requestedStatus }
    const validationError = validateMedia()
    if (validationError) {
      setSaveError(validationError)
      return
    }
    setSaveError('')
    setSaving(true)
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 20000)
    let response
    let result
    try {
      response = await fetch(editingId ? `/api/admin/sermons/${editingId}` : '/api/admin/sermons', {
        method: editingId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(submission), signal: controller.signal,
      })
      result = await response.json()
    } catch (error) {
      setSaving(false)
      setSaveError(error.name === 'AbortError' ? 'Saving took longer than expected. Check your connection and try again.' : 'The sermon could not be saved. Check your connection and try again.')
      return
    } finally {
      window.clearTimeout(timeout)
    }
    setSaving(false)
    if (!response.ok) return setSaveError(result.error || 'Unable to save sermon')
    const saved = { ...submission, id: editingId || result.data.id, date: new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(`${draft.preachedAt}T12:00:00`)) }
    setSermons((current) => editingId ? current.map((item) => item.id === editingId ? saved : item) : [saved, ...current])
    setEditorOpen(false)
    setNotice(requestedStatus === 'Published' ? 'Sermon published and is now visible on the website.' : requestedStatus === 'Archived' ? 'Sermon archived and removed from the public website.' : 'Sermon saved as a draft.')
  }

  const remove = async (sermon) => {
    if (!window.confirm(`Delete “${sermon.title}”?`)) return
    const response = await fetch(`/api/admin/sermons/${sermon.id}`, { method: 'DELETE' })
    const result = await response.json()
    if (!response.ok) return window.alert(result.error || 'Unable to delete sermon')
    setSermons((current) => current.filter((item) => item.id !== sermon.id))
    setNotice('Sermon deleted.')
  }

  const changeStatus = async (sermon, status) => {
    const action = status === 'Published' ? 'publish' : 'archive'
    if (!window.confirm(`${action === 'publish' ? 'Publish' : 'Archive'} “${sermon.title}”?`)) return
    setNotice('')
    const response = await fetch(`/api/admin/sermons/${sermon.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...sermon, status }),
    })
    const result = await response.json()
    if (!response.ok) return window.alert(result.error || `Unable to ${action} sermon`)
    setSermons((current) => current.map((item) => item.id === sermon.id ? { ...item, status } : item))
    setNotice(status === 'Published' ? 'Sermon published and is now visible on the website.' : 'Sermon archived and removed from the public website.')
  }

  if (editorOpen) return <main className="admin-scroll min-h-0 flex-1 overflow-y-auto bg-slate-50/50 p-6 xl:p-10"><form onSubmit={save} className="mx-auto max-w-[1050px]">
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><button type="button" onClick={() => setEditorOpen(false)} className="mb-3 text-xs font-semibold text-slate-500">← Back to sermons</button><h1 className="text-2xl font-semibold text-midnight-navy">{editingId ? 'Edit sermon' : 'Add sermon'}</h1><p className="mt-1 text-sm text-slate-500">Publish audio, video, or both from one sermon record.</p></div><div className="flex flex-wrap gap-3">{editingId && <button type="submit" value="Archived" disabled={saving || Boolean(uploadingMedia)} className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-500 disabled:opacity-50">Archive</button>}<button type="submit" value="Draft" disabled={saving || Boolean(uploadingMedia)} className="rounded-full border border-midnight-navy px-5 py-3 text-sm font-semibold text-midnight-navy disabled:opacity-50">{saving ? 'Saving…' : 'Save draft'}</button><button type="submit" value="Published" disabled={saving || Boolean(uploadingMedia)} className="inline-flex items-center gap-2 rounded-full bg-midnight-navy px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"><span className="material-symbols-outlined text-[18px]">publish</span>{uploadingMedia ? 'Media uploading…' : saving ? 'Publishing…' : draft.status === 'Published' ? 'Update published sermon' : 'Publish sermon'}</button></div></div>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <label className="block text-xs font-semibold text-slate-500">TITLE<input required value={draft.title} onChange={update('title')} className={`${fieldClass} text-lg font-semibold`} placeholder="The title of the sermon" /></label>
        <div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="text-xs font-semibold text-slate-500">SPEAKER<input required value={draft.speaker} onChange={update('speaker')} className={fieldClass} placeholder="Preacher or teacher" /></label><label className="text-xs font-semibold text-slate-500">DATE PREACHED<input required type="date" value={draft.preachedAt} onChange={update('preachedAt')} className={fieldClass} /></label></div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="text-xs font-semibold text-slate-500">SCRIPTURE PASSAGE<input value={draft.scripture} onChange={update('scripture')} className={fieldClass} placeholder="e.g. Romans 8:1–11" /></label><label className="text-xs font-semibold text-slate-500">SERIES<input value={draft.series} onChange={update('series')} className={fieldClass} placeholder="e.g. Life in the Spirit" /></label></div>
        <label className="mt-5 block text-xs font-semibold text-slate-500">DESCRIPTION<textarea rows={7} value={draft.description} onChange={update('description')} className={`${fieldClass} resize-y leading-6`} placeholder="Introduce the sermon and its main burden…" /></label>
        {saveError && <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"><span className="material-symbols-outlined text-[19px]">error</span><span>{saveError}</span></div>}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5"><p className="text-xs font-semibold text-slate-500">MEDIA</p><div className="mt-3"><AdminSelect label="Media type" variant="field" value={draft.mediaType} onChange={changeMediaType} options={[{ label: 'Audio only', value: 'audio' }, { label: 'Video only', value: 'video' }, { label: 'Video and audio', value: 'both' }]} /></div>
          {(draft.mediaType === 'audio' || draft.mediaType === 'both') && <div className="mt-5"><p className="text-xs font-semibold text-slate-500">AUDIO SOURCE</p><div className="mt-2 grid grid-cols-2 rounded-xl bg-slate-200/70 p-1">{[['file', 'Upload file'], ['link', 'Use link']].map(([value, label]) => <button key={value} type="button" onClick={() => chooseMediaSource('audio', value)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${mediaSources.audio === value ? 'bg-white text-midnight-navy shadow-sm' : 'text-slate-500'}`}>{label}</button>)}</div>{mediaSources.audio === 'file' ? <><label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-midnight-navy/25 bg-white px-4 py-5 text-sm font-semibold text-midnight-navy hover:bg-midnight-navy/5"><span className="material-symbols-outlined">audio_file</span>{uploadingMedia === 'audio' ? 'Uploading audio…' : draft.audioUrl ? 'Replace audio file' : 'Choose audio file'}<input type="file" accept="audio/mpeg,audio/mp4,audio/wav,audio/ogg,audio/webm,.m4a" onChange={uploadMedia('audio')} disabled={Boolean(uploadingMedia)} className="hidden" /></label><p className="mt-2 text-[11px] text-slate-400">Maximum file size: 50 MB. Use Link for larger audio.</p>{draft.audioUrl && <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-emerald-50 px-3 py-2"><span className="truncate text-xs text-emerald-700">Audio file ready</span><button type="button" onClick={() => setDraft((current) => ({ ...current, audioUrl: '' }))} className="text-xs font-semibold text-red-600">Remove</button></div>}</> : <label className="mt-3 block text-xs font-semibold text-slate-500">DIRECT AUDIO URL<input required type="url" value={draft.audioUrl} onChange={update('audioUrl')} className={fieldClass} placeholder="https://…/sermon.mp3" /><span className="mt-2 block text-[11px] font-normal leading-5 text-slate-400">Paste the actual MP3, M4A, WAV, OGG, or WebM file—not the webpage containing its player.</span></label>}</div>}
          {(draft.mediaType === 'video' || draft.mediaType === 'both') && <div className="mt-6"><p className="text-xs font-semibold text-slate-500">VIDEO SOURCE</p><div className="mt-2 grid grid-cols-2 rounded-xl bg-slate-200/70 p-1">{[['file', 'Upload file'], ['link', 'Use link']].map(([value, label]) => <button key={value} type="button" onClick={() => chooseMediaSource('video', value)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${mediaSources.video === value ? 'bg-white text-midnight-navy shadow-sm' : 'text-slate-500'}`}>{label}</button>)}</div>{mediaSources.video === 'file' ? <><label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-midnight-navy/25 bg-white px-4 py-5 text-sm font-semibold text-midnight-navy hover:bg-midnight-navy/5"><span className="material-symbols-outlined">video_file</span>{uploadingMedia === 'video' ? 'Uploading video…' : draft.videoUrl ? 'Replace video file' : 'Choose video file'}<input type="file" accept="video/mp4,video/webm,video/quicktime,.m4v" onChange={uploadMedia('video')} disabled={Boolean(uploadingMedia)} className="hidden" /></label><p className="mt-2 text-[11px] text-slate-400">Maximum file size: 50 MB. YouTube or Vimeo is recommended for larger video.</p>{draft.videoUrl && <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-emerald-50 px-3 py-2"><span className="truncate text-xs text-emerald-700">Video file ready</span><button type="button" onClick={() => setDraft((current) => ({ ...current, videoUrl: '' }))} className="text-xs font-semibold text-red-600">Remove</button></div>}</> : <label className="mt-3 block text-xs font-semibold text-slate-500">VIDEO URL<input required type="url" value={draft.videoUrl} onChange={update('videoUrl')} className={fieldClass} placeholder="YouTube, Vimeo, or direct video URL" /></label>}</div>}
        </div>
      </section>
      <aside className="space-y-5"><section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><h2 className="font-semibold text-midnight-navy">Publishing</h2><div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><span className="text-xs font-semibold text-slate-500">Current status</span><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-midnight-navy shadow-sm">{draft.status}</span></div><label className="mt-4 block text-xs font-semibold text-slate-500">CUSTOM LINK <span className="font-normal text-slate-400">(optional)</span><input value={draft.slug} onChange={update('slug')} className={fieldClass} placeholder="generated-from-title" /></label></section>
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"><h2 className="font-semibold text-midnight-navy">Sermon artwork</h2><p className="mt-1 text-xs leading-5 text-slate-400">Cover image shown in the sermon library and player for audio or video.</p><label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold"><span className="material-symbols-outlined text-[17px]">upload</span>{uploading ? 'Uploading…' : draft.image ? 'Replace artwork' : 'Upload artwork'}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadCover} disabled={uploading} className="hidden" /></label><div className="mt-4 aspect-square overflow-hidden rounded-[22px] bg-gradient-to-br from-midnight-navy to-[#27496f] shadow-inner">{draft.image ? <img src={draft.image} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center text-center text-xs text-white/55"><span><span className="material-symbols-outlined mb-2 block text-4xl">graphic_eq</span>No artwork selected</span></span>}</div></section>
      </aside>
    </div>
  </form></main>

  return <><main className="admin-scroll min-h-0 flex-1 overflow-y-auto bg-[#f5f5f7] p-5 md:p-8 xl:p-10"><div className="mx-auto max-w-[1180px]">
    <header className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#07182d] via-midnight-navy to-[#24486f] px-7 py-8 text-white shadow-[0_24px_70px_rgba(13,34,64,0.20)] md:px-10 md:py-10"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50"><span className="size-1.5 rounded-full bg-heritage-gold" />TGN Media Library</div><h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Sermons</h1><p className="mt-3 max-w-xl text-sm leading-6 text-white/55">Review every message, listen before publishing, and manage the sermon archive from one calm workspace.</p></div><button onClick={() => openEditor()} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-midnight-navy shadow-lg transition-transform hover:scale-[1.02]"><span className="material-symbols-outlined text-[18px]">add</span>Add sermon</button></div><div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">{[['All sermons', sermons.length], ['Published', sermons.filter((item) => item.status === 'Published').length], ['Drafts', sermons.filter((item) => item.status === 'Draft').length]].map(([label, value]) => <div key={label}><strong className="block text-2xl font-semibold tracking-tight">{value}</strong><span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-white/40">{label}</span></div>)}</div></header>
    {notice && <p className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</p>}
    <section className="mt-6"><div className="flex flex-col gap-3 rounded-2xl border border-black/[0.05] bg-white/85 p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center"><label className="relative min-w-0 flex-1"><span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[19px] text-slate-400">search</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-xl bg-[#f5f5f7] py-3 pl-11 pr-4 text-sm outline-none ring-midnight-navy/10 focus:ring-2" placeholder="Search title, speaker, series, or Scripture" /></label><span className="px-3 text-xs font-medium text-slate-400">{visible.length} result{visible.length === 1 ? '' : 's'}</span></div>
      <div className="mt-5 grid gap-4">{visible.map((sermon) => <article key={sermon.id} className="group overflow-hidden rounded-[28px] border border-black/[0.055] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.09)]"><div className="grid md:grid-cols-[190px_minmax(0,1fr)]"><div className="relative min-h-[190px] overflow-hidden bg-gradient-to-br from-midnight-navy to-[#2f557d]">{sermon.image ? <img src={sermon.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> : <span className="absolute inset-0 grid place-items-center"><span className="material-symbols-outlined text-6xl text-white/70">graphic_eq</span></span>}<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" /><button type="button" onClick={() => setPreviewSermon(sermon)} className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-midnight-navy shadow-lg backdrop-blur transition-transform hover:scale-105"><span className="material-symbols-outlined text-[17px]">play_arrow</span>Listen</button></div>
        <div className="flex min-w-0 flex-col p-5 md:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.11em] ${sermon.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : sermon.status === 'Archived' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-700'}`}>{sermon.status}</span><span className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">{sermon.series || 'Standalone sermon'}</span></div><span className="text-[11px] font-medium text-slate-400">{sermon.date}</span></div><div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto]"><div className="min-w-0"><h2 className="text-[clamp(1.35rem,2vw,1.75rem)] font-semibold leading-tight tracking-[-0.025em] text-slate-950">{sermon.title}</h2><div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs"><span className="inline-flex items-center gap-1.5 font-semibold text-midnight-navy"><span className="material-symbols-outlined text-[16px] text-heritage-gold">person</span>{sermon.speaker}</span><span className="inline-flex items-center gap-1.5 text-slate-500"><span className="material-symbols-outlined text-[16px] text-heritage-gold">menu_book</span>{sermon.scripture || 'Scripture not listed'}</span><span className="inline-flex items-center gap-1.5 capitalize text-slate-400"><span className="material-symbols-outlined text-[16px]">{sermon.videoUrl ? 'videocam' : 'headphones'}</span>{sermon.mediaType}</span></div>{sermon.description && <p className="mt-4 line-clamp-2 max-w-2xl text-xs leading-5 text-slate-400">{sermon.description}</p>}</div><div className="flex flex-wrap content-end items-end justify-start gap-2 lg:max-w-[250px] lg:justify-end">{sermon.status !== 'Published' ? <button onClick={() => changeStatus(sermon, 'Published')} className="inline-flex items-center gap-1.5 rounded-full bg-midnight-navy px-4 py-2.5 text-xs font-semibold text-white"><span className="material-symbols-outlined text-[16px]">publish</span>Publish</button> : <button onClick={() => changeStatus(sermon, 'Archived')} className="rounded-full border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-500">Archive</button>}<button onClick={() => openEditor(sermon)} className="rounded-full border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</button><button onClick={() => remove(sermon)} className="grid size-9 place-items-center rounded-full text-slate-300 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${sermon.title}`}><span className="material-symbols-outlined text-[18px]">delete</span></button></div></div></div></div></article>)}{!visible.length && <div className="rounded-[28px] border border-dashed border-slate-200 bg-white py-20 text-center"><span className="material-symbols-outlined text-5xl text-slate-200">podcasts</span><p className="mt-3 text-sm text-slate-400">No sermons match this search.</p></div>}</div>
    </section>
  </div></main>{previewSermon && <div className="fixed inset-0 z-[100] grid place-items-center bg-[#07182d]/65 p-4 backdrop-blur-md" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewSermon(null) }}><section role="dialog" aria-modal="true" aria-label={`Preview ${previewSermon.title}`} className="w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-[0_35px_100px_rgba(0,0,0,0.35)]"><div className="relative aspect-[16/8] overflow-hidden bg-gradient-to-br from-midnight-navy to-[#315a83]">{previewSermon.image && <img src={previewSermon.image} alt="" className="absolute inset-0 h-full w-full object-cover" />}<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" /><button type="button" onClick={() => setPreviewSermon(null)} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-black/30 text-white backdrop-blur"><span className="material-symbols-outlined">close</span></button><div className="absolute inset-x-0 bottom-0 p-7 text-white"><p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/55">{previewSermon.series || 'Sermon preview'}</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">{previewSermon.title}</h2><p className="mt-2 text-xs text-white/65">{previewSermon.speaker} · {previewSermon.scripture || 'No passage listed'}</p></div></div><div className="p-6 md:p-8">{previewSermon.audioUrl ? <audio key={previewSermon.audioUrl} src={previewAudioUrl(previewSermon)} controls autoPlay preload="metadata" className="w-full" /> : previewSermon.videoUrl ? (() => { const video = previewVideoUrl(previewSermon.videoUrl); return video.embed ? <iframe src={video.embed} title={previewSermon.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="aspect-video w-full rounded-2xl" /> : <video src={video.direct} controls autoPlay className="aspect-video w-full rounded-2xl bg-black" /> })() : <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">This sermon does not have playable media yet.</p>}<div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5"><span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${previewSermon.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{previewSermon.status}</span><button type="button" onClick={() => { setPreviewSermon(null); openEditor(previewSermon) }} className="rounded-full bg-midnight-navy px-5 py-2.5 text-xs font-semibold text-white">Edit sermon</button></div></div></section></div>}</>
}
