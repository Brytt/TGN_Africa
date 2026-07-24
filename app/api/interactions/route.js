import { NextResponse } from 'next/server'
import { createClient } from '../../../src/lib/supabase/server'

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Sign in to continue.' }, { status: 401 })
  const { action, publicationId, body } = await request.json()

  if (action === 'comment') {
    const text = String(body || '').trim()
    if (!text || text.length > 4000) return NextResponse.json({ error: 'Comment must be between 1 and 4,000 characters.' }, { status: 400 })
    const { data: profile } = await supabase.from('profiles').select('display_name').eq('id', user.id).single()
    const { error } = await supabase.from('comments').insert({ publication_id: publicationId, user_id: user.id, author_name: profile?.display_name || 'TGN Reader', body: text, status: 'pending' })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ pending: true })
  }

  const table = action === 'like' ? 'likes' : action === 'bookmark' ? 'bookmarks' : null
  if (!table) return NextResponse.json({ error: 'Unsupported interaction.' }, { status: 400 })
  const key = { publication_id: publicationId, user_id: user.id }
  const { data: existing } = await supabase.from(table).select('publication_id').match(key).maybeSingle()
  const result = existing ? await supabase.from(table).delete().match(key) : await supabase.from(table).insert(key)
  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 })
  return NextResponse.json({ active: !existing })
}
