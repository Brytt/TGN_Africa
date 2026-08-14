import { NextResponse } from 'next/server'
import { requireStaff } from '../../../../src/lib/http'

async function loadActivity(auth) {
  const [publications, comments, subscribers] = await Promise.all([
    auth.supabase.from('publications').select('id, slug, title, status, created_at, updated_at, published_at').order('updated_at', { ascending: false }).limit(8),
    auth.supabase.from('comments').select('id, author_name, body, created_at, publication:publications(title)').order('created_at', { ascending: false }).limit(8),
    auth.supabase.from('newsletter_subscribers').select('id, email, display_name, created_at').eq('status', 'active').order('created_at', { ascending: false }).limit(8),
  ])

  const publicationItems = (publications.data || []).map((item) => {
    const published = item.status === 'published'
    const eventTime = published ? item.published_at || item.created_at : item.updated_at
    return {
      id: `publication-${item.id}`,
      type: published ? 'publication' : 'draft',
      icon: published ? 'publish' : 'draft',
      title: published ? 'Publication published' : 'Draft activity',
      description: item.title,
      detail: published ? `“${item.title}” is now available on the public website.` : `“${item.title}” was created or updated as ${item.status.replaceAll('_', ' ')}.`,
      createdAt: eventTime,
      href: `/admin/content?q=${encodeURIComponent(item.title)}`,
    }
  })
  const commentItems = (comments.data || []).map((item) => ({
    id: `comment-${item.id}`,
    type: 'comment',
    icon: 'chat_bubble',
    title: 'New comment',
    description: `${item.author_name || 'A reader'} commented on ${item.publication?.title || 'a publication'}`,
    detail: item.body || 'Open comment moderation to review this response.',
    createdAt: item.created_at,
    href: '/admin/comments',
  }))
  const subscriberItems = (subscribers.data || []).map((item) => ({
    id: `subscriber-${item.id}`,
    type: 'subscriber',
    icon: 'person_add',
    title: 'New subscriber',
    description: item.display_name || item.email,
    detail: `${item.display_name || 'A new reader'} subscribed with ${item.email}.`,
    createdAt: item.created_at,
    href: '/admin/subscribers',
  }))

  return [...publicationItems, ...commentItems, ...subscriberItems]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 15)
}

export async function GET() {
  const auth = await requireStaff()
  if (auth.error) return auth.error
  const [activity, statesResult] = await Promise.all([
    loadActivity(auth),
    auth.supabase.from('admin_notification_states').select('notification_id, read_at, cleared_at').eq('user_id', auth.user.id),
  ])
  const stateRows = statesResult.data || []
  const states = new Map(stateRows.map((state) => [state.notification_id, state]))
  const stateFor = (item) => states.get(item.id) || (item.type === 'publication' || item.type === 'draft'
    ? stateRows.find((state) => state.notification_id.startsWith(`${item.id}-`))
    : null)
  const data = activity
    .filter((item) => !stateFor(item)?.cleared_at)
    .map((item) => ({ ...item, read: Boolean(stateFor(item)?.read_at) }))
  return NextResponse.json({ data })
}

export async function PATCH(request) {
  const auth = await requireStaff()
  if (auth.error) return auth.error
  const body = await request.json()
  const notificationId = String(body.notificationId || '').slice(0, 500)
  if (!notificationId) return NextResponse.json({ error: 'A notification is required.' }, { status: 400 })
  const now = new Date().toISOString()
  const row = {
    user_id: auth.user.id,
    notification_id: notificationId,
    read_at: now,
  }
  if (body.action === 'clear') row.cleared_at = now
  const { error } = await auth.supabase.from('admin_notification_states').upsert(row, { onConflict: 'user_id,notification_id' })
  if (error) return NextResponse.json({ error: 'Unable to update this notification.' }, { status: 400 })
  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const auth = await requireStaff()
  if (auth.error) return auth.error
  const activity = await loadActivity(auth)
  const now = new Date().toISOString()
  const rows = activity.map((item) => ({
    user_id: auth.user.id,
    notification_id: item.id,
    read_at: now,
    cleared_at: now,
  }))
  if (rows.length) {
    const { error } = await auth.supabase.from('admin_notification_states').upsert(rows, { onConflict: 'user_id,notification_id' })
    if (error) return NextResponse.json({ error: 'Unable to clear notifications.' }, { status: 400 })
  }
  return NextResponse.json({ success: true })
}
