import { NextResponse } from 'next/server'
import { failure, requireStaff } from '../../../../../src/lib/http'

const statusValue = (value) => value.toLowerCase().replaceAll(' ', '_')

export async function PATCH(request, { params }) {
  const auth = await requireStaff()
  if (auth.error) return auth.error
  const { id } = await params
  const body = await request.json()
  const row = {}
  const fields = {
    title: 'title', subtitle: 'subtitle', excerpt: 'excerpt', body: 'body',
    type: 'publication_type', authorId: 'author_id', topicId: 'topic_id',
    scripture: 'scripture', image: 'cover_path', scheduledAt: 'scheduled_at',
  }
  Object.entries(fields).forEach(([input, column]) => {
    if (Object.hasOwn(body, input)) row[column] = body[input] || null
  })
  if (body.status) {
    row.status = statusValue(body.status)
    if (body.status === 'Published') row.published_at = new Date().toISOString()
    if (body.status === 'Archived') row.archived_at = new Date().toISOString()
  }
  if (Object.hasOwn(body, 'body')) row.reading_time_minutes = Math.max(1, Math.ceil((body.body || '').trim().split(/\s+/).filter(Boolean).length / 220))
  row.updated_by = auth.user.id
  const { error } = await auth.supabase.from('publications').update(row).eq('id', id)
  if (error) return failure(error)
  return NextResponse.json({ success: true })
}

export async function DELETE(_request, { params }) {
  const auth = await requireStaff(['admin', 'editor'])
  if (auth.error) return auth.error
  const { id } = await params
  const { error } = await auth.supabase.from('publications').delete().eq('id', id)
  if (error) return failure(error)
  return NextResponse.json({ success: true })
}
