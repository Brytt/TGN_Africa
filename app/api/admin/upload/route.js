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
  const maximumSize = bucket === 'author-avatars' ? 5 * 1024 * 1024 : 10 * 1024 * 1024
  if (file.size <= 0 || file.size > maximumSize) return failure(`Image must be smaller than ${bucket === 'author-avatars' ? '5 MB' : '10 MB'}.`, 413)
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${auth.user.id}/${crypto.randomUUID()}.${extension}`
  const { error } = await auth.supabase.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false })
  if (error) return failure(error)
  const { data } = auth.supabase.storage.from(bucket).getPublicUrl(path)
  return NextResponse.json({ path: data.publicUrl })
}
