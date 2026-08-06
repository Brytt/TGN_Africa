import sanitizeHtmlLibrary from 'sanitize-html'

export const ARTICLE_TAGS = [
  'p', 'br', 'h2', 'h3', 'strong', 'b', 'em', 'i', 'u', 's',
  'blockquote', 'ul', 'ol', 'li', 'a', 'figure', 'figcaption', 'img',
  'hr', 'sup', 'sub', 'code', 'pre', 'table', 'thead', 'tbody', 'tfoot',
  'tr', 'th', 'td',
]

export const ARTICLE_ATTRIBUTES = {
  a: ['href', 'title', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
  th: ['colspan', 'rowspan', 'scope'],
  td: ['colspan', 'rowspan'],
  p: ['style'],
  h2: ['style'],
  h3: ['style'],
}

const LEGACY_TGN_HOSTS = new Set([
  'tgnghana.org',
  'www.tgnghana.org',
  'thegospelnetwork.wordpress.com',
  'www.thegospelnetwork.wordpress.com',
  'thegospelnetworkgh.com',
  'www.thegospelnetworkgh.com',
])

export function normalizeArticleHref(value = '') {
  const href = String(value).trim()
  if (!/^https?:\/\//i.test(href)) return href

  try {
    const url = new URL(href)
    if (!LEGACY_TGN_HOSTS.has(url.hostname.toLowerCase())) return href

    const segments = url.pathname.split('/').filter(Boolean)
    if (!segments.length) return '/articles'
    if (segments[0].toLowerCase() === 'wp-content') return href

    const legacySlug = [...segments].reverse().map((segment) => decodeURIComponent(segment)).find((segment) => segment !== ']') || ''
    const slug = legacySlug
      .replace(/[^a-z0-9-]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()

    if (!slug) return '/articles'
    if (slug === 'about') return '/about'
    return `/articles/${slug}`
  } catch {
    return href
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export function plainTextToHtml(value = '') {
  return String(value)
    .replace(/\r\n?/g, '\n')
    .trim()
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll('\n', '<br>')}</p>`)
    .join('')
}

export function sanitizeArticleHtml(value = '', { plain = false } = {}) {
  const source = plain ? plainTextToHtml(value) : String(value)
  return sanitizeHtmlLibrary(source, {
    allowedTags: ARTICLE_TAGS,
    allowedAttributes: ARTICLE_ATTRIBUTES,
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard',
    transformTags: {
      h1: 'h2',
      h4: 'h3',
      h5: 'h3',
      h6: 'h3',
      b: 'strong',
      i: 'em',
      a: (tagName, attribs) => {
        const href = normalizeArticleHref(attribs.href || '')
        const external = /^https?:\/\//i.test(href)
        const safeAttribs = { ...attribs }
        delete safeAttribs.target
        delete safeAttribs.rel
        return {
          tagName,
          attribs: {
            ...safeAttribs,
            href,
            ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
          },
        }
      },
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: attribs.loading || 'lazy' },
      }),
    },
    allowedStyles: {
      p: { 'text-align': [/^(left|center|right|justify)$/] },
      h2: { 'text-align': [/^(left|center|right|justify)$/] },
      h3: { 'text-align': [/^(left|center|right|justify)$/] },
    },
  }).trim()
}

export function articlePlainText(value = '') {
  const spacedHtml = String(value)
    .replace(/<\s*br\s*\/?\s*>/gi, ' ')
    .replace(/<\s*\/\s*(p|div|h[1-6]|blockquote|li|figcaption|pre|tr|td|th)\s*>/gi, ' ')
  return sanitizeHtmlLibrary(spacedHtml, { allowedTags: [], allowedAttributes: {} })
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function articleWordCount(value = '') {
  const text = articlePlainText(value)
  return text ? text.split(/\s+/).length : 0
}
