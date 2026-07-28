'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ArticleBody from '../ArticleBody'
import AdminSelect from './AdminSelect'
import RichTextEditor from './RichTextEditor'
import TopicPicker from './TopicPicker'
import { articleWordCount } from '../../lib/article-html'

const types = ['All types', 'Article', 'Devotional', 'Bible Study', 'Sermon', 'Poem']
const statuses = ['All statuses', 'Published', 'Draft', 'In review', 'Scheduled', 'Archived']
const publicationTypes = types.filter((item) => item !== 'All types')
const emptyPublication = {
  title: '',
  subtitle: '',
  type: '',
  author: '',
  authorId: '',
  topic: '',
  topicId: '',
  excerpt: '',
  body: '',
  status: 'Draft',
  scheduledAt: '',
  image: '',
}
const statusStyles = {
  Published: 'bg-emerald-50 text-emerald-600',
  Draft: 'bg-amber-50 text-amber-600',
  'In review': 'bg-indigo-50 text-indigo-600',
  Scheduled: 'bg-sky-50 text-sky-600',
  Archived: 'bg-slate-100 text-slate-500',
}

function plainText(value = '') {
  if (typeof document === 'undefined') return value.replace(/<[^>]*>/g, ' ')
  const parser = new DOMParser()
  return (parser.parseFromString(value, 'text/html').body.textContent || '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function formatPublishedDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function paginationItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
  const pages = new Set([1, total, current - 1, current, current + 1])
  if (current <= 3) [2, 3, 4, 5].forEach((page) => pages.add(page))
  if (current >= total - 2) [total - 4, total - 3, total - 2, total - 1].forEach((page) => pages.add(page))
  const sorted = [...pages].filter((page) => page > 0 && page <= total).sort((a, b) => a - b)
  return sorted.flatMap((page, index) => index && page - sorted[index - 1] > 1 ? ['…', page] : [page])
}

function SelectControl({ label, value, onChange, options }) {
  return <AdminSelect label={label} value={value} onChange={onChange} options={options} />
}

function PublicationEditor({ draft, onChange, onCancel, onSave, editing = false, topics = [], authorRole = 'Author' }) {
  const [uploading, setUploading] = useState(false)
  const fieldClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-midnight-navy/40 focus:ring-2 focus:ring-midnight-navy/10'

  const update = (field) => (event) => onChange((current) => ({ ...current, [field]: event.target.value }))
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
    onChange((current) => ({ ...current, image: result.path }))
  }

  return (
    <form onSubmit={onSave} className="mx-auto max-w-[1180px]">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
        <div>
          <button type="button" onClick={onCancel} className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-midnight-navy">
            <span className="material-symbols-outlined text-[17px]">arrow_back</span>Back to content
          </button>
          <h2 className="text-2xl font-semibold tracking-tight text-midnight-navy">{editing ? 'Edit publication' : 'Create publication'}</h2>
          <p className="mt-1 text-sm text-slate-500">{editing ? 'Update this publication and its editorial details.' : 'Write and prepare a new piece for TGN Africa.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onCancel} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-midnight-navy px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">
            <span className="material-symbols-outlined text-[18px]">save</span>{editing ? 'Save changes' : 'Save publication'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-7">
          <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Publication title
            <input required value={draft.title} onChange={update('title')} className={`${fieldClass} text-lg font-semibold`} placeholder="Enter a clear, compelling title" />
          </label>

          <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Subtitle <span className="font-normal normal-case tracking-normal text-slate-400">(optional)</span>
            <textarea value={draft.subtitle || ''} onChange={update('subtitle')} rows={2} className={`${fieldClass} resize-y text-base leading-7`} placeholder="Clarify the article’s central question or burden without repeating the title." />
          </label>

          <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Short introduction
            <textarea value={draft.excerpt} onChange={update('excerpt')} rows={3} className={`${fieldClass} resize-y leading-6`} placeholder="A short summary readers will see in publication cards..." />
          </label>

          <div className="mt-6">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <label htmlFor="publication-body" className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Publication body</label>
              <span className="text-xs text-slate-400">Paste cleanly from Microsoft Word or Google Docs</span>
            </div>
            <RichTextEditor value={draft.body} bodyFormat={draft.bodyFormat} onChange={(body) => onChange((current) => ({ ...current, body, bodyFormat: 'html' }))} />
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-midnight-navy">Publication details</h3>
            <div className="mt-5 text-xs font-semibold text-slate-500">
              <p>Type</p>
              <AdminSelect required label="Publication type" value={draft.type} onChange={(value) => onChange((current) => ({ ...current, type: value }))} options={publicationTypes} placeholder="Select publication type" variant="field" />
            </div>
            <div className="mt-4 text-xs font-semibold text-slate-500">
              <p>Status</p>
              <AdminSelect label="Publication status" value={draft.status} onChange={(value) => onChange((current) => ({ ...current, status: value }))} options={['Draft', 'In review', 'Scheduled', 'Published']} variant="field" />
            </div>
            {draft.status === 'Scheduled' && <label className="mt-4 block text-xs font-semibold text-slate-500">Publish date and time<input required type="datetime-local" value={draft.scheduledAt || ''} onChange={update('scheduledAt')} className={fieldClass} /></label>}
            <label className="mt-4 block text-xs font-semibold text-slate-500">
              Author
              <div className="relative mt-2">
                <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">person</span>
                <input readOnly value={draft.author} className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none" aria-describedby="author-help" />
              </div>
              <span id="author-help" className="mt-2 block text-[11px] font-normal leading-4 text-slate-400">Automatically assigned from the signed-in account · {authorRole}</span>
            </label>
            <div className="mt-4 text-xs font-semibold text-slate-500">
              <p>Topic</p>
              <TopicPicker topics={topics} value={draft.topicId} onChange={(item) => onChange((current) => ({ ...current, topicId: item.value, topic: item.label }))} />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-midnight-navy">Cover image</h3>
            <p className="mt-1 text-xs leading-5 text-slate-400">Upload a JPG, PNG, or WebP cover image.</p>
            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-midnight-navy">
              <span className="material-symbols-outlined text-[17px]">upload</span>{uploading ? 'Uploading…' : 'Upload cover'}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadCover} disabled={uploading} className="hidden" />
            </label>
            <div className="mt-4 grid aspect-[16/9] place-items-center overflow-hidden rounded-2xl bg-midnight-navy/5">
              {draft.image ? <img src={draft.image} alt="Cover preview" className="h-full w-full object-cover" /> : (
                <span className="text-center text-slate-400">
                  <span className="material-symbols-outlined block text-3xl">image</span>
                  <span className="mt-1 block text-xs">Cover preview</span>
                </span>
              )}
            </div>
          </section>
        </aside>
      </div>
    </form>
  )
}

export default function ContentManager({ initialPublications = [], topics = [], currentAuthor }) {
  const searchParams = useSearchParams()
  const menuRef = useRef(null)
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [type, setType] = useState('All types')
  const [status, setStatus] = useState('All statuses')
  const [sort, setSort] = useState('Newest first')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState([])
  const [activeMenu, setActiveMenu] = useState(null)
  const [notice, setNotice] = useState('')
  const [editorOpen, setEditorOpen] = useState(false)
  const newDraft = { ...emptyPublication, author: currentAuthor?.name || '', authorId: currentAuthor?.id || '' }
  const [draft, setDraft] = useState(newDraft)
  const [publications, setPublications] = useState(initialPublications)
  const [editingId, setEditingId] = useState(null)
  const [previewPublication, setPreviewPublication] = useState(null)
  const pageSize = 6

  useEffect(() => {
    const closeMenu = (event) => {
      if (event.key === 'Escape' || (menuRef.current && !menuRef.current.contains(event.target))) setActiveMenu(null)
    }
    document.addEventListener('pointerdown', closeMenu)
    document.addEventListener('keydown', closeMenu)
    return () => {
      document.removeEventListener('pointerdown', closeMenu)
      document.removeEventListener('keydown', closeMenu)
    }
  }, [])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const result = publications.filter((item) => {
      const matchesSearch = !normalized || [item.title, item.author, item.id, item.topic, item.type].some((value) => value.toLowerCase().includes(normalized))
      return matchesSearch && (type === 'All types' || item.type === type) && (status === 'All statuses' || item.status === status)
    })
    return [...result].sort((a, b) => {
      if (sort === 'Title A–Z') return a.title.localeCompare(b.title)
      if (sort === 'Most viewed') return b.views - a.views
      return new Date(b.publishedAt) - new Date(a.publishedAt)
    })
  }, [publications, query, sort, status, type])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  useEffect(() => {
    setPage(1)
  }, [query, sort, status, type])

  const announce = (message) => {
    setNotice(message)
    setActiveMenu(null)
    window.setTimeout(() => setNotice(''), 2800)
  }

  const toggleAll = () => {
    const visibleIds = visible.map((item) => item.id)
    const allSelected = visibleIds.every((id) => selected.includes(id))
    setSelected((current) => allSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])])
  }

  const resetFilters = () => {
    setQuery('')
    setType('All types')
    setStatus('All statuses')
    setSort('Newest first')
  }

  const savePublication = async (event) => {
    event.preventDefault()
    if (!articleWordCount(draft.body)) return announce('Add the publication body before saving.')
    const existing = publications.find((item) => item.id === editingId)
    const response = await fetch(existing ? `/api/admin/publications/${editingId}` : '/api/admin/publications', {
      method: existing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    })
    const result = await response.json()
    if (!response.ok) return announce(result.error || 'Unable to save publication.')
    const publication = existing ? {
      ...existing,
      ...draft,
      image: draft.image || existing.image,
    } : {
      ...draft,
      id: result.data.id,
      publishedAt: new Date().toISOString(),
      views: 0,
      image: draft.image || '/images/publications/featured-study.jpg',
    }
    setPublications((current) => existing ? current.map((item) => item.id === editingId ? publication : item) : [publication, ...current])
    setDraft(newDraft)
    setEditingId(null)
    setEditorOpen(false)
    setQuery('')
    setType('All types')
    setStatus('All statuses')
    announce(existing ? `“${publication.title}” was updated.` : `“${publication.title}” was saved as ${publication.status.toLowerCase()}.`)
  }

  const editPublication = (publication) => {
    setDraft({ ...emptyPublication, ...publication })
    setEditingId(publication.id)
    setActiveMenu(null)
    setEditorOpen(true)
  }

  const duplicatePublication = async (publication) => {
    const payload = {
      ...publication,
      title: `${publication.title} — Copy`,
      status: 'Draft',
    }
    const response = await fetch('/api/admin/publications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const result = await response.json()
    if (!response.ok) return announce(result.error || 'Unable to duplicate publication.')
    const copy = { ...payload, id: result.data.id, views: 0, publishedAt: new Date().toISOString() }
    setPublications((current) => [copy, ...current])
    announce(`A draft copy of “${publication.title}” was created.`)
  }

  const archivePublication = async (publication) => {
    const response = await fetch(`/api/admin/publications/${publication.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Archived' }) })
    if (!response.ok) return announce((await response.json()).error || 'Unable to archive publication.')
    setPublications((current) => current.map((item) => item.id === publication.id ? { ...item, status: 'Archived' } : item))
    announce(`“${publication.title}” was archived.`)
  }

  const publishPublication = async (publication) => {
    if (!window.confirm(`Publish “${publication.title}” now? Subscribers will be notified when email delivery is configured.`)) return
    const response = await fetch(`/api/admin/publications/${publication.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Published' }) })
    const result = await response.json()
    if (!response.ok) return announce(result.error || 'Unable to publish this publication.')
    setPublications((current) => current.map((item) => item.id === publication.id ? {
      ...item,
      status: 'Published',
      publishedAt: result.data?.published_at || item.publishedAt,
    } : item))
    announce(`“${publication.title}” is now published.`)
  }

  const deletePublication = async (publication) => {
    if (!window.confirm(`Delete “${publication.title}”? This will remove it from the content list.`)) return
    const response = await fetch(`/api/admin/publications/${publication.id}`, { method: 'DELETE' })
    if (!response.ok) return announce((await response.json()).error || 'Unable to delete publication.')
    setPublications((current) => current.filter((item) => item.id !== publication.id))
    announce(`“${publication.title}” was deleted.`)
  }

  const bulkAction = async (action) => {
    const targets = publications.filter((item) => selected.includes(item.id))
    if (action === 'Delete' && !window.confirm(`Delete ${targets.length} selected publications?`)) return
    const responses = await Promise.all(targets.map((item) => fetch(`/api/admin/publications/${item.id}`, {
      method: action === 'Delete' ? 'DELETE' : 'PATCH',
      headers: action === 'Delete' ? undefined : { 'Content-Type': 'application/json' },
      body: action === 'Delete' ? undefined : JSON.stringify({ status: 'Archived' }),
    })))
    if (responses.some((response) => !response.ok)) return announce(`Some publications could not be ${action.toLowerCase()}d.`)
    setPublications((current) => action === 'Delete'
      ? current.filter((item) => !selected.includes(item.id))
      : current.map((item) => selected.includes(item.id) ? { ...item, status: 'Archived' } : item))
    setSelected([])
    announce(`${targets.length} publications ${action === 'Delete' ? 'deleted' : 'archived'}.`)
  }

  if (editorOpen) {
    return (
      <main className="admin-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-6 xl:px-10">
        <PublicationEditor draft={draft} onChange={setDraft} editing={Boolean(editingId)} topics={topics} authorRole={currentAuthor?.role} onCancel={() => { setEditorOpen(false); setEditingId(null); setDraft(newDraft) }} onSave={savePublication} />
      </main>
    )
  }

  return (
    <main className="admin-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-6 xl:px-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-midnight-navy">Publishing library</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">All content</h2>
            <p className="mt-1 text-sm text-slate-500">Review and organize every TGN Africa publication.</p>
          </div>
          <button type="button" disabled={!currentAuthor} onClick={() => { setEditingId(null); setDraft(newDraft); setEditorOpen(true) }} className="inline-flex items-center justify-center gap-2 rounded-full bg-midnight-navy px-5 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40">
            <span className="material-symbols-outlined text-[19px]">add</span>New publication
          </button>
        </div>

        {notice && <div role="status" className="mb-5 flex items-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700"><span className="material-symbols-outlined text-[19px]">info</span>{notice}</div>}

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Search content</span>
                <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[19px] text-slate-400">search</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-full border border-slate-200 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600/20" placeholder="Search title, author, ID, topic..." />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <SelectControl label="Content type" value={type} onChange={setType} options={types} />
                <SelectControl label="Publication status" value={status} onChange={setStatus} options={statuses} />
                <SelectControl label="Sort content" value={sort} onChange={setSort} options={['Newest first', 'Title A–Z', 'Most viewed']} />
              </div>
            </div>
            <div className="flex min-h-8 flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-400">
                Showing {filtered.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length} publications
              </p>
              {(query || type !== 'All types' || status !== 'All statuses' || sort !== 'Newest first') && (
                <button type="button" onClick={resetFilters} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800">
                  <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>Clear filters
                </button>
              )}
            </div>
          </div>

          {selected.length > 0 && (
            <div className="mb-4 flex flex-col justify-between gap-3 rounded-2xl bg-indigo-50 px-4 py-3 sm:flex-row sm:items-center">
              <p className="text-sm font-medium text-indigo-700">{selected.length} publication{selected.length === 1 ? '' : 's'} selected</p>
              <div className="flex flex-wrap gap-2">
                {['Archive', 'Delete'].map((action) => (
                  <button key={action} type="button" onClick={() => bulkAction(action)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${action === 'Delete' ? 'bg-white text-red-600' : 'bg-white text-slate-600'}`}>{action}</button>
                ))}
                <button type="button" onClick={() => setSelected([])} className="rounded-full px-3 py-1.5 text-xs font-medium text-indigo-600">Clear</button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-900">
                  <th className="pb-4 pr-3">
                    <input type="checkbox" checked={visible.length > 0 && visible.every((item) => selected.includes(item.id))} onChange={toggleAll} className="h-4 w-4 rounded accent-indigo-600" aria-label="Select all visible content" />
                  </th>
                  <th className="pb-4 pr-4 font-semibold">Publication</th>
                  <th className="pb-4 pr-4 font-semibold">Author</th>
                  <th className="pb-4 pr-4 font-semibold">Topic</th>
                  <th className="pb-4 pr-4 font-semibold">Status</th>
                  <th className="pb-4 pr-4 font-semibold">Published</th>
                  <th className="pb-4 pr-4 text-right font-semibold">Views</th>
                  <th className="pb-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-500">
                {visible.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="py-3.5 pr-3">
                      <input type="checkbox" checked={selected.includes(item.id)} onChange={() => setSelected((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} className="h-4 w-4 rounded accent-indigo-600" aria-label={`Select ${item.title}`} />
                    </td>
                    <td className="max-w-[300px] py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-slate-900">{item.title}</span>
                          <span className="block text-[11px] text-slate-400">{item.id} · {item.type}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">{item.author}</td>
                    <td className="py-3.5 pr-4"><span className="inline-block max-w-[140px] truncate align-bottom">{item.topic}</span></td>
                    <td className="py-3.5 pr-4"><span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${statusStyles[item.status]}`}>{item.status}</span></td>
                    <td className="whitespace-nowrap py-3.5 pr-4 tabular-nums" title={item.publishedAt || undefined}>{formatPublishedDate(item.publishedAt)}</td>
                    <td className="py-3.5 pr-4 text-right tabular-nums">{item.views ? item.views.toLocaleString() : '—'}</td>
                    <td className="relative py-3.5 text-center">
                      <button type="button" onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)} className="grid h-8 w-8 place-items-center rounded-full border border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600" aria-label={`Actions for ${item.title}`} aria-expanded={activeMenu === item.id}>
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                      {activeMenu === item.id && (
                        <div ref={menuRef} className="absolute right-8 top-12 z-20 w-40 rounded-2xl border border-slate-100 bg-white p-2 text-left shadow-xl">
                          <button type="button" onClick={() => { setPreviewPublication(item); setActiveMenu(null) }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"><span className="material-symbols-outlined text-[17px]">visibility</span>Preview</button>
                          <button type="button" onClick={() => editPublication(item)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"><span className="material-symbols-outlined text-[17px]">edit</span>Edit</button>
                          {item.status !== 'Published' && <button type="button" onClick={() => publishPublication(item)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"><span className="material-symbols-outlined text-[17px]">publish</span>Publish</button>}
                          <button type="button" onClick={() => duplicatePublication(item)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"><span className="material-symbols-outlined text-[17px]">content_copy</span>Duplicate</button>
                          <button type="button" disabled={item.status === 'Archived'} onClick={() => archivePublication(item)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"><span className="material-symbols-outlined text-[17px]">archive</span>Archive</button>
                          <div className="my-1 border-t border-slate-100" />
                          <button type="button" onClick={() => deletePublication(item)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50"><span className="material-symbols-outlined text-[17px]">delete</span>Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!visible.length && (
            <div className="py-16 text-center">
              <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
              <h3 className="mt-3 font-semibold text-slate-900">No publications found</h3>
              <p className="mt-1 text-sm text-slate-400">Try a different search or clear the current filters.</p>
              <button type="button" onClick={resetFilters} className="mt-5 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">Clear filters</button>
            </div>
          )}

          {filtered.length > pageSize && (
            <nav className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5" aria-label="Content pagination">
              <button type="button" disabled={safePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="flex items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">
                <span className="material-symbols-outlined text-[17px]">arrow_back</span>Previous
              </button>
              <div className="flex items-center gap-1" aria-label={`Page ${safePage} of ${pageCount}`}>
                {paginationItems(safePage, pageCount).map((number, index) => number === '…'
                  ? <span key={`ellipsis-${index}`} className="grid h-9 w-7 place-items-center text-sm text-slate-400">…</span>
                  : <button key={number} type="button" onClick={() => setPage(number)} className={`h-9 min-w-9 rounded-full px-2 text-sm ${safePage === number ? 'bg-indigo-600 font-medium text-white' : 'text-slate-500 hover:bg-slate-50'}`} aria-label={`Page ${number}`} aria-current={safePage === number ? 'page' : undefined}>{number}</button>)}
              </div>
              <button type="button" disabled={safePage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="flex items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">
                Next<span className="material-symbols-outlined text-[17px]">arrow_forward</span>
              </button>
            </nav>
          )}
        </section>
      </div>
      {previewPublication && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-midnight-navy/65 p-2 backdrop-blur-sm md:p-5" role="dialog" aria-modal="true" aria-labelledby="publication-preview-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewPublication(null) }}>
          <article className="admin-scroll max-h-[96vh] w-full max-w-6xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-3 backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Published-page preview</span>
                <span className={`rounded-full px-3 py-1 text-[10px] font-semibold ${statusStyles[previewPublication.status]}`}>{previewPublication.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => { setPreviewPublication(null); editPublication(previewPublication) }} className="inline-flex items-center gap-2 bg-midnight-navy px-4 py-2 text-xs font-medium text-white"><span className="material-symbols-outlined text-[16px]">edit</span>Edit</button>
                <button type="button" onClick={() => setPreviewPublication(null)} className="grid size-9 place-items-center border border-slate-200 text-slate-600" aria-label="Close preview"><span className="material-symbols-outlined">close</span></button>
              </div>
            </div>

            <div className="px-5 pb-16 pt-10 sm:px-8 md:pt-14">
              <header className="mx-auto max-w-[900px]">
                <p className="tgn-article-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-midnight-navy">{previewPublication.topic || 'Uncategorized'}</p>
                <h2 id="publication-preview-title" className="tgn-article-serif mt-5 text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-midnight-navy">{plainText(previewPublication.title)}</h2>
                {previewPublication.subtitle && <p className="tgn-article-serif mt-5 max-w-[760px] text-[clamp(1.2rem,2.5vw,1.55rem)] leading-[1.4] text-slate-600">{plainText(previewPublication.subtitle)}</p>}
                <div className="tgn-article-sans mt-8 flex items-center gap-4">
                  {previewPublication.authorImage
                    ? <img src={previewPublication.authorImage} alt="" className="size-12 rounded-full object-cover" />
                    : <span className="grid size-12 place-items-center rounded-full bg-midnight-navy text-sm font-bold text-white">{previewPublication.author?.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>}
                  <div><p className="text-[15px] font-semibold text-midnight-navy">{previewPublication.author}</p><p className="mt-0.5 text-sm text-slate-500">{formatPublishedDate(previewPublication.publishedAt)} · {String(previewPublication.readingTime || '').replace(' min read', '-minute read')}</p></div>
                </div>
              </header>

              {previewPublication.image && <figure className="mx-auto mt-10 max-w-[1050px]"><img src={previewPublication.image} alt={`Featured image for ${plainText(previewPublication.title)}`} className="aspect-video w-full object-cover" /></figure>}

              <div className="mx-auto mt-12 max-w-[720px]">
                {previewPublication.excerpt && <p className="tgn-article-serif mb-9 border-b border-midnight-navy/10 pb-9 text-[21px] leading-[1.55] text-midnight-navy/75">{plainText(previewPublication.excerpt)}</p>}
                <ArticleBody body={previewPublication.body} bodyFormat={previewPublication.bodyFormat} emptyMessage="This publication does not have article body content yet. Select Edit to add the full text." />

                <section className="mt-16 border-y border-midnight-navy/15 py-8">
                  <div className="grid gap-5 sm:grid-cols-[80px_1fr]">
                    {previewPublication.authorImage
                      ? <img src={previewPublication.authorImage} alt="" className="size-20 rounded-full object-cover" />
                      : <span className="grid size-20 place-items-center rounded-full bg-midnight-navy text-xl font-semibold text-white">{previewPublication.author?.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>}
                    <div><p className="tgn-article-sans text-[10px] font-bold uppercase tracking-[0.16em] text-heritage-gold">About the contributor</p><h3 className="tgn-article-serif mt-2 text-2xl font-semibold text-midnight-navy">{previewPublication.author}</h3><p className="tgn-article-serif mt-3 text-base leading-7 text-slate-600">{previewPublication.authorBio || 'The contributor biography will appear here when it has been added to the profile.'}</p></div>
                  </div>
                </section>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <div className="border border-slate-200 p-5"><p className="tgn-article-sans text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Related articles</p><p className="tgn-article-serif mt-3 text-xl text-midnight-navy">Related publications will appear here.</p></div>
                  <div className="border border-slate-200 p-5"><p className="tgn-article-sans text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Reader response</p><p className="tgn-article-serif mt-3 text-xl text-midnight-navy">Comments and responses will appear last.</p></div>
                </div>
              </div>
            </div>
          </article>
        </div>
      )}
    </main>
  )
}
