import { NextResponse } from 'next/server'
import { failure, requireStaff } from '../../../../src/lib/http'

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function authorRow(body) {
  return {
    slug: body.slug || slugify(body.name),
    name: body.name,
    email: body.email,
    phone: body.phone || null,
    date_of_birth: body.dateOfBirth || null,
    editorial_role: body.role,
    qualification: body.qualification || null,
    church: body.church || null,
    denomination: body.denomination || null,
    city: body.location || null,
    country: body.country || null,
    bio: body.bio || null,
    expertise: body.expertise || null,
    website: body.website || null,
    avatar_path: body.image || null,
    status: (body.status || 'Active').toLowerCase(),
  }
}

export async function POST(request) {
  const auth = await requireStaff(['admin', 'editor'])
  if (auth.error) return auth.error
  const body = await request.json()
  const { data, error } = await auth.supabase.from('authors').insert(authorRow(body)).select('id').single()
  if (error) return failure(error)
  return NextResponse.json({ data }, { status: 201 })
}

export { authorRow }
