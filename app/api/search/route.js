import { NextResponse } from 'next/server'
import { searchSite } from '../../../src/lib/search'

export async function GET(request) {
  const url = new URL(request.url)
  const query = url.searchParams.get('q') || ''
  const limit = Math.min(20, Math.max(1, Number(url.searchParams.get('limit')) || 8))
  const results = await searchSite(query, { limit })
  return NextResponse.json({ data: results }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
