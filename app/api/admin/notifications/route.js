import { NextResponse } from 'next/server'
import { requireStaff } from '../../../../src/lib/http'

export async function GET() {
  const auth = await requireStaff()
  if (auth.error) return auth.error

  const [publications, comments, subscribers] = await Promise.all([
    auth.supabase.from('publications').select('id, slug, title, status, created_at, updated_at, published_at').order('updated_at', { ascending: false }).limit(8),
    auth.supabase.from('comments').select('id, author_name, created_at, publication:publications(title)').order('created_at', { ascending: false }).limit(8),
    auth.supabase.from('newsletter_subscribers').select('id, email, display_name, created_at').eq('status', 'active').order('created_at', { ascending: false }).limit(8),
  ])

  const publicationItems = (publications.data || []).map((item) => ({
    id: `publication-${item.id}-${item.updated_at}`,
    type: item.status === 'published' ? 'publication' : 'draft',
    icon: item.status === 'published' ? 'publish' : 'draft',
    title: item.status === 'published' ? 'Publication published' : 'Draft activity',
    description: item.title,
    createdAt: item.status === 'published' ? item.published_at || item.updated_at : item.updated_at,
    href: `/admin/content?q=${encodeURIComponent(item.title)}`,
  }))
  const commentItems = (comments.data || []).map((item) => ({
    id: `comment-${item.id}`,
    type: 'comment',
    icon: 'chat_bubble',
    title: 'New comment',
    description: `${item.author_name || 'A reader'} commented on ${item.publication?.title || 'a publication'}`,
    createdAt: item.created_at,
    href: '/admin/comments',
  }))
  const subscriberItems = (subscribers.data || []).map((item) => ({
    id: `subscriber-${item.id}`,
    type: 'subscriber',
    icon: 'person_add',
    title: 'New subscriber',
    description: item.display_name || item.email,
    createdAt: item.created_at,
    href: '/admin/subscribers',
  }))

  const data = [...publicationItems, ...commentItems, ...subscriberItems]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 15)

  return NextResponse.json({ data })
}
