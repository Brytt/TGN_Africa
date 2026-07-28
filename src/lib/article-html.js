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
        const external = /^https?:\/\//i.test(attribs.href || '')
        return {
          tagName,
          attribs: {
            ...attribs,
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
