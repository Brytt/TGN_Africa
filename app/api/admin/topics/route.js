import { NextResponse } from 'next/server'
import { failure, requireStaff } from '../../../../src/lib/http'

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export async function POST(request) {
  const auth = await requireStaff(['admin', 'editor'])
  if (auth.error) return auth.error
  const body = await request.json()
  const { data, error } = await auth.supabase.from('topics').insert({
    title: body.title,
    slug: body.slug || `${slugify(body.title)}-${Date.now().toString(36)}`,
    level: body.level,
    parent_id: body.parentId || null,
  }).select('*').single()
  if (error) return failure(error)
  return NextResponse.json({ data }, { status: 201 })
}
