import { NextResponse } from 'next/server'
import { failure, requireStaff } from '../../../../../src/lib/http'
import { notifySubscribers } from '../../../../../src/lib/newsletter'
import { articleWordCount, sanitizeArticleHtml } from '../../../../../src/lib/article-html'

const statusValue = (value) => value.toLowerCase().replaceAll(' ', '_')

export async function PATCH(request, { params }) {
  const auth = await requireStaff()
  if (auth.error) return auth.error
  const { id } = await params
  const body = await request.json()
  const { data: existing } = await auth.supabase.from('publications').select('status, slug, title, excerpt, published_at, created_at, import_metadata').eq('id', id).maybeSingle()
  const row = {}
  const fields = {
    title: 'title', subtitle: 'subtitle', excerpt: 'excerpt', body: 'body',
    type: 'publication_type', topicId: 'topic_id',
    scripture: 'scripture', image: 'cover_path', scheduledAt: 'scheduled_at',
  }
  Object.entries(fields).forEach(([input, column]) => {
    if (Object.hasOwn(body, input)) row[column] = body[input] || null
  })
  if (Object.hasOwn(body, 'body')) {
    row.body = sanitizeArticleHtml(body.body || '', { plain: body.bodyFormat === 'plain' })
    row.body_format = 'html'
  }
  if (body.status) {
    row.status = statusValue(body.status)
    if (body.status === 'Published' && existing?.status !== 'published') {
      row.published_at = existing?.published_at
        || (existing?.import_metadata?.source === 'wordpress' ? existing.created_at : new Date().toISOString())
    }
    if (body.status === 'Archived') row.archived_at = new Date().toISOString()
  }
  if (Object.hasOwn(body, 'body')) row.reading_time_minutes = Math.max(1, Math.ceil(articleWordCount(row.body) / 220))
  row.updated_by = auth.user.id
  const { data, error } = await auth.supabase.from('publications').update(row).eq('id', id).select('status, published_at').single()
  if (error) return failure(error)
  if (body.status === 'Published' && existing?.status !== 'published') {
    try {
      await notifySubscribers({
        slug: body.slug || existing.slug,
        title: body.title || existing.title,
        excerpt: body.excerpt || existing.excerpt,
      })
    } catch (notificationError) {
      console.error('Newsletter notification failed:', notificationError)
    }
  }
  return NextResponse.json({ success: true, data })
}

export async function DELETE(_request, { params }) {
  const auth = await requireStaff(['admin', 'editor'])
  if (auth.error) return auth.error
  const { id } = await params
  const { error } = await auth.supabase.from('publications').delete().eq('id', id)
  if (error) return failure(error)
  return NextResponse.json({ success: true })
}
