import { NextResponse } from 'next/server'
import { failure, requireStaff } from '../../../../../src/lib/http'

const slugify = (value = '') => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export async function PATCH(request, { params }) {
  const auth = await requireStaff()
  if (auth.error) return auth.error
  const { id } = await params
  const body = await request.json()
  const mediaType = ['audio', 'video', 'both'].includes(body.mediaType) ? body.mediaType : ''
  if (!body.title?.trim() || !body.speaker?.trim() || !body.preachedAt || !mediaType) return failure('Title, speaker, date, and media type are required.')
  if ((mediaType === 'audio' || mediaType === 'both') && !body.audioUrl?.trim()) return failure('Add an audio URL for this media type.')
  if ((mediaType === 'video' || mediaType === 'both') && !body.videoUrl?.trim()) return failure('Add a video URL for this media type.')
  for (const value of [body.audioUrl, body.videoUrl].filter(Boolean)) {
    try {
      new URL(value)
    } catch {
      return failure('Add a valid media URL before saving.')
    }
  }
  const status = ['draft', 'published', 'archived'].includes(body.status?.toLowerCase()) ? body.status.toLowerCase() : 'draft'
  const row = {
    slug: body.slug?.trim() || slugify(body.title), title: body.title.trim(), speaker: body.speaker.trim(),
    scripture: body.scripture?.trim() || null, series: body.series?.trim() || null,
    description: body.description?.trim() || null, media_type: mediaType,
    audio_url: mediaType === 'video' ? null : body.audioUrl.trim(),
    video_url: mediaType === 'audio' ? null : body.videoUrl.trim(), cover_path: mediaType === 'audio' ? null : (body.image?.trim() || null),
    status, preached_at: body.preachedAt,
    published_at: status === 'published' ? (body.publishedAt || new Date().toISOString()) : null,
    updated_by: auth.user.id,
  }
  const { error } = await auth.supabase.from('sermons').update(row).eq('id', id)
  if (error?.code === '23505') return failure('A sermon with this title/link already exists.', 409)
  if (error) return failure(error)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_request, { params }) {
  const auth = await requireStaff(['admin', 'editor'])
  if (auth.error) return auth.error
  const { id } = await params
  const { error } = await auth.supabase.from('sermons').delete().eq('id', id)
  if (error) return failure(error)
  return NextResponse.json({ ok: true })
}
