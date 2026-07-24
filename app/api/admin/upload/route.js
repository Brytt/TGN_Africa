import { NextResponse } from 'next/server'
import { failure, requireStaff } from '../../../../src/lib/http'

export async function POST(request) {
  const auth = await requireStaff()
  if (auth.error) return auth.error
  const form = await request.formData()
  const file = form.get('file')
  const bucket = form.get('bucket')
  if (!(file instanceof File)) return failure('File is required')
  if (!['author-avatars', 'publication-media'].includes(bucket)) return failure('Invalid storage bucket')
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return failure('Only JPG, PNG, and WebP images are supported')
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${auth.user.id}/${crypto.randomUUID()}.${extension}`
  const { error } = await auth.supabase.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false })
  if (error) return failure(error)
  const { data } = auth.supabase.storage.from(bucket).getPublicUrl(path)
  return NextResponse.json({ path: data.publicUrl })
}
