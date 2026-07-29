import 'server-only'
import { createClient } from './supabase/server'

function isSchemaNotReady(error) {
  return error?.code === 'PGRST205' || error?.code === '42P01'
}

function schemaFallback(error, fallback) {
  console.error(
    isSchemaNotReady(error)
      ? 'Supabase schema is not installed. Apply the migrations in supabase/migrations before loading database content.'
      : 'A Supabase read failed; rendering the safe fallback instead.',
    error?.message || error,
  )
  return fallback
}

const PUBLICATION_SELECT = `
  id, legacy_id, slug, title, subtitle, excerpt, body, publication_type,
  body_format, import_metadata, scripture, cover_path, status, reading_time_minutes, scheduled_at,
  published_at, created_at, updated_at,
  author:authors(id, name, slug, avatar_path, bio, short_bio, editorial_role),
  topic:topics(id, title, slug, level)
`

const PUBLICATION_SUMMARY_SELECT = `
  id, legacy_id, slug, title, subtitle, excerpt, publication_type,
  scripture, cover_path, status, reading_time_minutes, scheduled_at,
  published_at, created_at, updated_at,
  author:authors(id, name, slug, avatar_path),
  topic:topics(id, title, slug, level)
`

export function mapPublication(row) {
  return {
    id: row.id,
    legacyId: row.legacy_id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || '',
    excerpt: row.excerpt || '',
    body: row.body || '',
    bodyFormat: row.body_format || 'plain',
    type: row.publication_type,
    authorId: row.author?.id,
    author: row.author?.name || 'TGN Africa',
    authorSlug: row.author?.slug,
    authorImage: row.author?.avatar_path,
    authorBio: row.author?.bio || '',
    authorShortBio: row.author?.short_bio || '',
    authorRole: row.author?.editorial_role || 'Contributor',
    authorSocials: {
      linkedin: row.author?.linkedin_url || '',
      instagram: row.author?.instagram_url || '',
      facebook: row.author?.facebook_url || '',
    },
    topicId: row.topic?.id,
    topic: row.topic?.title || 'Uncategorized',
    topicSlug: row.topic?.slug,
    scripture: row.scripture || '',
    image: row.cover_path || '/images/publications/featured-study.jpg',
    status: row.status.replaceAll('_', ' ').replace(/^\w/, (letter) => letter.toUpperCase()),
    readingTime: `${row.reading_time_minutes} min read`,
    readingTimeMinutes: row.reading_time_minutes,
    publishedAt: row.published_at || row.scheduled_at || row.created_at,
    date: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(row.published_at || row.created_at)),
    views: Number(row.metrics?.views || 0),
  }
}

export function mapAuthor(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    dateOfBirth: row.date_of_birth || '',
    role: row.editorial_role,
    isStaff: Boolean(row.is_staff),
    menuAccess: Array.isArray(row.admin_menu_access) ? row.admin_menu_access : [],
    qualification: row.qualification || '',
    church: row.church || '',
    denomination: row.denomination || '',
    location: row.city || '',
    country: row.country || '',
    bio: row.bio || '',
    shortBio: row.short_bio || '',
    expertise: row.expertise || '',
    linkedin: row.linkedin_url || '',
    instagram: row.instagram_url || '',
    facebook: row.facebook_url || '',
    image: row.avatar_path || '',
    status: row.status === 'active' ? 'Active' : 'Inactive',
    publications: Number(row.publications?.[0]?.count || 0),
  }
}

export async function getPublications({ admin = false, limit, summary = false } = {}) {
  const supabase = await createClient()
  // Keep public reads to one database round trip. Publishing scheduled work is
  // handled when staff load the editorial workspace.
  if (admin) await supabase.rpc('publish_due_publications')
  let query = supabase
    .from('publications')
    .select(summary ? PUBLICATION_SUMMARY_SELECT : PUBLICATION_SELECT)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
  if (!admin) query = query.eq('status', 'published')
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) return schemaFallback(error, [])
  if (!admin) return (data || []).map(mapPublication)
  const ids = (data || []).map((row) => row.id)
  const metrics = ids.length
    ? await supabase.from('publication_metrics').select('id, views, likes, comments').in('id', ids)
    : { data: [] }
  const metricsById = new Map((metrics.data || []).map((row) => [row.id, row]))
  return (data || []).map((row) => mapPublication({ ...row, metrics: metricsById.get(row.id) }))
}

export async function getPublicationBySlug(slug) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('publications')
    .select(PUBLICATION_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  if (error) return schemaFallback(error, null)
  if (!data) return null
  const { data: social } = data.author?.id
    ? await supabase.from('authors').select('linkedin_url, instagram_url, facebook_url').eq('id', data.author.id).maybeSingle()
    : { data: null }
  return mapPublication({
    ...data,
    author: social ? { ...data.author, ...social } : data.author,
  })
}

export async function getArticleInteractions(publicationId) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let [comments, likes, liked, bookmarked] = await Promise.all([
    supabase.from('comments').select('id, body, author_name, created_at, parent_id, parent:comments!parent_id(id, author_name), comment_likes(user_id)').eq('publication_id', publicationId).eq('status', 'approved').order('created_at'),
    supabase.from('likes').select('*', { count: 'exact', head: true }).eq('publication_id', publicationId),
    user ? supabase.from('likes').select('publication_id').eq('publication_id', publicationId).eq('user_id', user.id).maybeSingle() : Promise.resolve({ data: null }),
    user ? supabase.from('bookmarks').select('publication_id').eq('publication_id', publicationId).eq('user_id', user.id).maybeSingle() : Promise.resolve({ data: null }),
  ])
  if (comments.error && (comments.error.message?.includes('parent_id') || comments.error.message?.includes('comment_likes'))) {
    comments = await supabase.from('comments').select('id, body, author_name, created_at').eq('publication_id', publicationId).eq('status', 'approved').order('created_at')
  }
  return {
    userId: user?.id || null,
    comments: (comments.data || []).map((comment) => ({
      id: comment.id,
      body: comment.body,
      name: comment.author_name || 'TGN Reader',
      parentId: comment.parent_id || null,
      replyingTo: comment.parent?.author_name || '',
      likeCount: comment.comment_likes?.length || 0,
      liked: Boolean(user && comment.comment_likes?.some((like) => like.user_id === user.id)),
    })),
    likeCount: likes.count || 0,
    liked: Boolean(liked.data),
    bookmarked: Boolean(bookmarked.data),
  }
}

export async function getAuthors({ admin = false } = {}) {
  const supabase = await createClient()
  let query = supabase
    .from('authors')
    .select('*, publications:publications(count)')
    .order('name')
  if (!admin) query = query.eq('status', 'active')
  const { data, error } = await query
  if (error) return schemaFallback(error, [])
  const authors = (data || []).map(mapAuthor)
  return admin ? authors : authors.filter((author) => !/\bodame\s+bright\b|\bbright\s+odame\b/i.test(author.name))
}

export async function getTopicTree() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('topics')
    .select('id, title, slug, level, parent_id, sort_order')
    .order('sort_order')
    .order('title')
  if (error) return schemaFallback(error, [])
  const rows = data || []
  const children = new Map()
  rows.forEach((row) => {
    const key = row.parent_id || 'root'
    children.set(key, [...(children.get(key) || []), row])
  })
  return (children.get('root') || []).map((topic) => ({
    id: topic.id,
    title: topic.title,
    slug: topic.slug,
    subtopics: (children.get(topic.id) || []).map((subtopic) => ({
      id: subtopic.id,
      title: subtopic.title,
      slug: subtopic.slug,
      resources: (children.get(subtopic.id) || []).map((resource) => ({
        id: resource.id,
        title: resource.title,
        slug: resource.slug,
      })),
    })),
  }))
}

export async function getEditorialTasks() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('editorial_tasks')
    .select('id, label, notes, due_at, completed_at, publication:publications(title, publication_type, author:authors(name))')
    .is('completed_at', null)
    .order('due_at')
    .limit(8)
  if (error) return schemaFallback(error, [])
  return (data || []).map((task) => ({
    id: task.id,
    label: task.label,
    title: task.publication?.title || task.notes || 'Editorial task',
    meta: [task.publication?.author?.name, task.publication?.publication_type].filter(Boolean).join(' · '),
    due: task.due_at ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(task.due_at)) : 'No due date',
    tone: 'lavender',
  }))
}

export async function getAnalyticsEvents() {
  const supabase = await createClient()
  const start = new Date(new Date().getFullYear(), 0, 1).toISOString()
  const { data, error } = await supabase
    .from('analytics_events')
    .select('publication_id, event_type, created_at')
    .gte('created_at', start)
    .order('created_at')
  if (error) return schemaFallback(error, [])
  return data || []
}

export async function getSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_settings').select('key, value')
  if (error) return schemaFallback(error, {})
  return Object.fromEntries((data || []).map((row) => [row.key, row.value]))
}

export async function getModerationComments() {
  const supabase = await createClient()
  let { data, error } = await supabase
    .from('comments')
    .select('id, body, author_name, status, created_at, parent:comments!parent_id(id, author_name, body), comment_likes(user_id), publication:publications(id, title, slug)')
    .order('created_at', { ascending: false })
  if (error && (error.message?.includes('parent_id') || error.message?.includes('comment_likes'))) {
    const fallback = await supabase
      .from('comments')
      .select('id, body, author_name, status, created_at, publication:publications(id, title, slug)')
      .order('created_at', { ascending: false })
    data = fallback.data
    error = fallback.error
  }
  if (error) return schemaFallback(error, [])
  return data || []
}

export async function getNewsletterSubscribers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, display_name, status, consented_at, unsubscribed_at, source, created_at')
    .order('created_at', { ascending: false })
  if (error) return schemaFallback(error, [])
  return data || []
}

export async function getCurrentProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  return data
}

export async function getCurrentAuthor() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data, error } = await supabase.from('authors').select('*, publications:publications(count)').eq('profile_id', user.id).maybeSingle()
  if (error) return schemaFallback(error, null)
  return data ? mapAuthor(data) : null
}
