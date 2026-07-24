import { NextResponse } from 'next/server'
import { failure, requireStaff } from '../../../../src/lib/http'

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const statusValue = (value) => value.toLowerCase().replaceAll(' ', '_')

export async function POST(request) {
  const auth = await requireStaff()
  if (auth.error) return auth.error
  const body = await request.json()
  const row = {
    slug: body.slug || `${slugify(body.title)}-${Date.now().toString(36)}`,
    title: body.title,
    subtitle: body.subtitle || null,
    excerpt: body.excerpt || null,
    body: body.body || '',
    publication_type: body.type,
    author_id: body.authorId,
    topic_id: body.topicId || null,
    scripture: body.scripture || null,
    cover_path: body.image || null,
    status: statusValue(body.status || 'Draft'),
    reading_time_minutes: Math.max(1, Math.ceil((body.body || '').trim().split(/\s+/).filter(Boolean).length / 220)),
    published_at: body.status === 'Published' ? new Date().toISOString() : null,
    scheduled_at: body.scheduledAt || null,
    created_by: auth.user.id,
    updated_by: auth.user.id,
  }
  const { data, error } = await auth.supabase.from('publications').insert(row).select('id').single()
  if (error) return failure(error)
  return NextResponse.json({ data }, { status: 201 })
}
