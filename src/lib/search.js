import 'server-only'
import { allResourceDocuments } from '../data/resources'
import { createClient } from './supabase/server'

const cleanQuery = (value) => String(value || '').trim().slice(0, 100)

export async function searchSite(value, { limit = 20, offset = 0 } = {}) {
  const query = cleanQuery(value)
  if (query.length < 2) return { query, articles: [], topics: [], contributors: [], resources: [], total: 0 }

  const supabase = await createClient()
  const pattern = `%${query.replace(/[%_]/g, '')}%`
  const [articleResult, topicResult, authorResult] = await Promise.all([
    supabase.rpc('search_publications', { p_query: query, p_limit: limit, p_offset: offset }),
    supabase.from('topics').select('id,title,slug,level').ilike('title', pattern).order('level').limit(8),
    supabase.from('authors').select('id,name,slug,editorial_role').eq('status', 'active').ilike('name', pattern).limit(8),
  ])

  const resources = allResourceDocuments
    .filter((item) => `${item.title} ${item.type} ${item.collection} ${item.date}`.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8)
    .map((item) => ({ title: item.title, meta: `${item.type} · ${item.date}`, href: `/resources/${item.slug}`, kind: 'Resource' }))

  const articles = (articleResult.data || []).map((item) => ({
    id: item.id,
    title: item.title,
    excerpt: item.excerpt || item.subtitle || '',
    meta: [item.publication_type, item.topic_title, item.author_name].filter(Boolean).join(' · '),
    href: `/articles/${item.slug}`,
    image: item.cover_path === '/images/publications/featured-study.jpg' ? '' : item.cover_path || '',
    kind: item.publication_type || 'Publication',
  }))

  return {
    query,
    articles,
    topics: (topicResult.data || []).map((item) => ({ title: item.title, meta: item.level, href: `/topics/${item.slug}`, kind: 'Topic' })),
    contributors: (authorResult.data || []).map((item) => ({ title: item.name, meta: item.editorial_role, href: `/authors/${item.slug}`, kind: 'Contributor' })),
    resources,
    total: Number(articleResult.data?.[0]?.total_count || 0),
    error: articleResult.error?.message || topicResult.error?.message || authorResult.error?.message || '',
  }
}
