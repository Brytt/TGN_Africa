import 'server-only'
/* global process */

export async function getEsvPassage(reference = '') {
  const query = String(reference).trim()
  if (!query || query.length > 120 || !process.env.ESV_API_KEY) return null

  const parameters = new URLSearchParams({
    q: query,
    'include-passage-references': 'true',
    'include-verse-numbers': 'true',
    'include-footnotes': 'false',
    'include-headings': 'true',
    'include-copyright': 'true',
    'include-short-copyright': 'false',
  })

  try {
    const response = await fetch(`https://api.esv.org/v3/passage/html/?${parameters}`, {
      headers: { Authorization: `Token ${process.env.ESV_API_KEY}` },
      next: { revalidate: 86400 },
    })
    if (!response.ok) return null
    const result = await response.json()
    const html = result.passages?.[0]
    return html ? { reference: result.canonical || query, html } : null
  } catch {
    return null
  }
}

const DAILY_REFERENCES = [
  'Psalm 119:105', 'Proverbs 3:5-6', 'Isaiah 40:31', 'Matthew 6:33',
  'John 3:16', 'Romans 8:1', 'Romans 12:1-2', '1 Corinthians 10:31',
  '2 Corinthians 5:17', 'Galatians 2:20', 'Philippians 4:6-7', 'Colossians 3:16',
  '2 Timothy 3:16-17', 'Hebrews 4:12', 'James 1:22', '1 Peter 5:7',
]

export function getDailyEsvPassage(date = new Date()) {
  const day = Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86400000)
  return getEsvPassage(DAILY_REFERENCES[Math.abs(day) % DAILY_REFERENCES.length])
}
