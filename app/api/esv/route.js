import { NextResponse } from 'next/server'
import { getEsvPassage } from '../../../src/lib/esv'

export async function GET(request) {
  const reference = request.nextUrl.searchParams.get('reference')?.trim() || ''
  if (!reference || reference.length > 120) return NextResponse.json({ error: 'A valid Scripture reference is required.' }, { status: 400 })
  const passage = await getEsvPassage(reference)
  if (!passage) return NextResponse.json({ error: 'Passage unavailable.' }, { status: 404 })
  return NextResponse.json({ passage }, { headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' } })
}
