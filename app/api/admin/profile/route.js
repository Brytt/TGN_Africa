import { NextResponse } from 'next/server'
import { failure, requireStaff } from '../../../../src/lib/http'

const wordCount = (value) => String(value || '').trim().split(/\s+/).filter(Boolean).length

export async function PUT(request) {
  const auth = await requireStaff()
  if (auth.error) return auth.error
  const body = await request.json()
  const displayName = String(body.displayName || '').trim()
  if (displayName.length < 2) return failure('Please enter your full name.')
  const biography = String(body.bio || '').trim()
  const shortBiography = String(body.shortBio || '').trim()
  const biographyWords = wordCount(biography)
  const shortBiographyWords = wordCount(shortBiography)
  if (biography && (biographyWords < 250 || biographyWords > 300)) return failure(`The full biography must contain 250–300 words. It currently has ${biographyWords}.`)
  if (shortBiography && (shortBiographyWords < 20 || shortBiographyWords > 25)) return failure(`The article biography must contain 20–25 words. It currently has ${shortBiographyWords}.`)

  const profileUpdate = await auth.supabase
    .from('profiles')
    .update({ display_name: displayName })
    .eq('id', auth.user.id)
  if (profileUpdate.error) return failure(profileUpdate.error)

  const authorValues = {
    name: displayName,
    phone: String(body.phone || '').trim() || null,
    date_of_birth: body.dateOfBirth || null,
    qualification: String(body.qualification || '').trim() || null,
    church: String(body.church || '').trim() || null,
    denomination: String(body.denomination || '').trim() || null,
    city: String(body.city || '').trim() || null,
    country: String(body.country || '').trim() || null,
    bio: biography || null,
    short_bio: shortBiography || null,
    expertise: String(body.expertise || '').trim() || null,
    avatar_path: String(body.image || '').trim() || null,
  }
  const authorUpdate = await auth.supabase.from('authors').update(authorValues).eq('profile_id', auth.user.id)
  if (authorUpdate.error) return failure(authorUpdate.error)
  const socialUpdate = await auth.supabase.from('authors').update({
    linkedin_url: String(body.linkedin || '').trim() || null,
    instagram_url: String(body.instagram || '').trim() || null,
    facebook_url: String(body.facebook || '').trim() || null,
  }).eq('profile_id', auth.user.id)
  const socialSchemaMissing = socialUpdate.error && (
    socialUpdate.error.message?.includes('linkedin_url') ||
    socialUpdate.error.code === 'PGRST204'
  )
  if (socialUpdate.error && !socialSchemaMissing) return failure(socialUpdate.error)

  const { error: authError } = await auth.supabase.auth.updateUser({
    data: {
      ...auth.user.user_metadata,
      display_name: displayName,
      onboarding_required: false,
    },
  })
  if (authError) return failure(authError)

  return NextResponse.json({ success: true, displayName, socialProfilesSaved: !socialUpdate.error })
}
