import { Buffer } from 'node:buffer'
import sharp from 'sharp'
import { getPublicationBySlug } from '../../../../../src/lib/data'

export const runtime = 'nodejs'

export async function GET(request, { params }) {
  const { id } = await params
  const article = await getPublicationBySlug(id)
  if (!article?.image) return new Response('Article image not found.', { status: 404 })

  try {
    const sourceUrl = new URL(article.image, new URL(request.url).origin)
    const source = await fetch(sourceUrl, { next: { revalidate: 86400 } })
    if (!source.ok) throw new Error(`Image request failed with ${source.status}`)

    const image = await sharp(Buffer.from(await source.arrayBuffer()))
      .resize(1280, 720, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 78, progressive: true, mozjpeg: true })
      .toBuffer()

    return new Response(image, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': String(image.length),
        'Content-Disposition': `inline; filename="${article.slug}-share.jpg"`,
        'Cache-Control': 'public, max-age=1209600, s-maxage=2592000, stale-while-revalidate=900',
      },
    })
  } catch (error) {
    console.error('Unable to create article share image:', error)
    return Response.redirect(article.image, 307)
  }
}
