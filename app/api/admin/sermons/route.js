import { NextResponse } from 'next/server'
import { failure, requireStaff } from '../../../../src/lib/http'

const slugify = (value = '') => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function sermonRow(body, userId) {
  const mediaType = ['audio', 'video', 'both'].includes(body.mediaType) ? body.mediaType : ''
  if (!body.title?.trim() || !body.speaker?.trim() || !body.preachedAt || !mediaType) return { error: 'Title, speaker, date, and media type are required.' }
  if ((mediaType === 'audio' || mediaType === 'both') && !body.audioUrl?.trim()) return { error: 'Add an audio URL for this media type.' }
  if ((mediaType === 'video' || mediaType === 'both') && !body.videoUrl?.trim()) return { error: 'Add a video URL for this media type.' }
  for (const value of [body.audioUrl, body.videoUrl].filter(Boolean)) {
    try {
      new URL(value)
    } catch {
      return { error: 'Add a valid media URL before saving.' }
    }
  }
  if (body.audioUrl && !/\.(mp3|m4a|wav|ogg|oga|webm)(\?.*)?$/i.test(body.audioUrl)) return { error: 'Audio must use a direct MP3, M4A, WAV, OGG, or WebM link.' }
  if (body.videoUrl && !/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(body.videoUrl) && !/(youtube\.com|youtu\.be|vimeo\.com)/i.test(body.videoUrl)) return { error: 'Video must use a direct MP4/WebM, YouTube, or Vimeo link.' }
  return {
    slug: body.slug?.trim() || slugify(body.title),
    title: body.title.trim(),
    speaker: body.speaker.trim(),
    scripture: body.scripture?.trim() || null,
    series: body.series?.trim() || null,
    description: body.description?.trim() || null,
    media_type: mediaType,
    audio_url: mediaType === 'video' ? null : body.audioUrl.trim(),
    video_url: mediaType === 'audio' ? null : body.videoUrl.trim(),
    cover_path: body.image?.trim() || null,
    status: ['draft', 'published', 'archived'].includes(body.status?.toLowerCase()) ? body.status.toLowerCase() : 'draft',
    preached_at: body.preachedAt,
    published_at: body.status?.toLowerCase() === 'published' ? (body.publishedAt || new Date().toISOString()) : null,
    created_by: userId,
    updated_by: userId,
  }
}

export async function POST(request) {
  const auth = await requireStaff()
  if (auth.error) return auth.error
  const row = sermonRow(await request.json(), auth.user.id)
  if (row.error) return failure(row.error)
  const { data, error } = await auth.supabase.from('sermons').insert(row).select('id').single()
  if (error?.code === '23505') return failure('A sermon with this title/link already exists.', 409)
  if (error) return failure(error)
  return NextResponse.json({ data }, { status: 201 })
}
