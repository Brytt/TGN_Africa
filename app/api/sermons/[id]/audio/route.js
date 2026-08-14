import { NextResponse } from 'next/server'
import { createClient } from '../../../../../src/lib/supabase/server'

export const dynamic = 'force-dynamic'

const proxiedAudioHosts = new Set(['cpmfiles1.com'])

export async function GET(request, { params }) {
  const { id } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return NextResponse.json({ error: 'Invalid sermon.' }, { status: 400 })
  const { data: sermon, error } = await (await createClient())
    .from('sermons')
    .select('audio_url')
    .eq('id', id)
    .maybeSingle()
  if (error || !sermon?.audio_url) return NextResponse.json({ error: 'Audio not found.' }, { status: 404 })

  let source
  try {
    source = new URL(sermon.audio_url)
  } catch {
    return NextResponse.json({ error: 'Invalid audio source.' }, { status: 422 })
  }
  if (source.protocol !== 'https:' || !proxiedAudioHosts.has(source.hostname)) return NextResponse.json({ error: 'This audio source does not require proxy playback.' }, { status: 422 })

  const range = request.headers.get('range')
  const upstream = await fetch(source, {
    headers: range ? { Range: range } : {},
    cache: 'no-store',
  })
  if (!upstream.ok && upstream.status !== 206) return NextResponse.json({ error: 'The external audio host could not serve this recording.' }, { status: 502 })

  const headers = new Headers({
    'Content-Type': 'audio/mpeg',
    'Accept-Ranges': upstream.headers.get('accept-ranges') || 'bytes',
    'Cache-Control': 'public, max-age=3600',
  })
  for (const name of ['content-length', 'content-range', 'etag', 'last-modified']) {
    const value = upstream.headers.get(name)
    if (value) headers.set(name, value)
  }
  return new Response(upstream.body, { status: upstream.status, headers })
}
