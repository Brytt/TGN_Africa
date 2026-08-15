import process from 'node:process'
import { createClient } from '@supabase/supabase-js'
/* global console */
import { adminPublications, editorialTasks } from '../supabase/seed-data/admin-content.js'
import { topicBank } from '../supabase/seed-data/topic-bank.js'

process.loadEnvFile?.('.env.local')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const authors = [
  ['Daniel Adebayo', 'daniel@tgnafrica.org', '1983-08-02', 'Pastor & Author', 'M.Div., Theological College of Northern Nigeria', 'Grace Bible Church, Lagos', 'Lagos', 'Nigeria', 'Writes on the local church, gospel ministry, and Christian doctrine.'],
  ['Nomsa Dlamini', 'nomsa@tgnafrica.org', '1990-08-17', 'Bible Teacher', 'B.Th., South African Theological Seminary', 'Christ Church Johannesburg', 'Johannesburg', 'South Africa', 'Serves women through Bible teaching and writes on discipleship and Christian living.'],
  ['Kwame Mensah', 'kwame@tgnafrica.org', '1978-09-04', 'Theologian', 'Ph.D. Biblical Theology, University of Ghana', 'Redeemer Presbyterian Church', 'Accra', 'Ghana', 'Pastor-theologian focused on biblical theology and faithful public witness.'],
  ['Miriam Okafor', 'miriam@tgnafrica.org', '1987-10-11', 'Senior Author', 'M.A. Christian Studies, ECWA Theological Seminary', 'New Covenant Baptist Church', 'Abuja', 'Nigeria', 'Writes about discernment, Christian life, and the gospel in African contexts.'],
  ['Samuel K. Boateng', 'samuel@tgnafrica.org', '1981-12-08', 'Contributing Author', 'M.Div., Akrofi-Christaller Institute', 'Trinity Baptist Church', 'Kumasi', 'Ghana', 'Pastor and occasional contributor on culture, preaching, and church ministry.'],
  ['Lerato Molefe', 'lerato@tgnafrica.org', '1993-03-21', 'Author', 'B.A. Theology and English Literature', 'Central Community Church', 'Pretoria', 'South Africa', 'Poet and devotional writer exploring prayer, suffering, and eternal hope.'],
  ['Samuel K. Owusu', 'samuel.owusu@tgnafrica.org', '1985-05-14', 'Author', 'M.Div., Ghana Baptist University College', 'Living Word Baptist Church', 'Accra', 'Ghana', 'Writes on public theology, work, and faithful Christian witness.'],
].map(([name, email, date_of_birth, editorial_role, qualification, church, city, country, bio]) => ({
  slug: slugify(name), name, email, date_of_birth, editorial_role, qualification, church, city, country, bio, status: 'active',
}))

async function assert(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

await assert(await supabase.from('authors').upsert(authors, { onConflict: 'slug' }), 'authors')
const authorRows = await assert(await supabase.from('authors').select('id, name'), 'read authors')
const authorIds = new Map(authorRows.map((author) => [author.name, author.id]))

const topicIds = new Map()
for (const [mainIndex, topic] of topicBank.entries()) {
  const main = await assert(await supabase.from('topics').upsert({
    title: topic.title, slug: topic.slug, level: 'main', parent_id: null, sort_order: mainIndex,
  }, { onConflict: 'slug' }).select('id').single(), `main topic ${topic.title}`)
  topicIds.set(topic.title, main.id)
  for (const [subIndex, subtopic] of topic.subtopics.entries()) {
    const sub = await assert(await supabase.from('topics').upsert({
      title: subtopic.title, slug: `${topic.slug}--${subtopic.slug}`, level: 'subtopic', parent_id: main.id, sort_order: subIndex,
    }, { onConflict: 'slug' }).select('id').single(), `subtopic ${subtopic.title}`)
    topicIds.set(subtopic.title, sub.id)
    const resources = subtopic.resources.map((resource, resourceIndex) => ({
      title: resource,
      slug: `${topic.slug}--${subtopic.slug}--${slugify(resource)}`,
      level: 'subsection',
      parent_id: sub.id,
      sort_order: resourceIndex,
    }))
    if (resources.length) await assert(await supabase.from('topics').upsert(resources, { onConflict: 'slug' }), `subsections for ${subtopic.title}`)
  }
}

const fallbackAuthorId = authorRows[0]?.id
const publicSeed = [
  ['The Solas of the Reformation in the African Context', 'Ancient convictions for the church today', 'How the bedrock principles of the Reformation speak with clarity and urgency to churches across modern Africa.', 'Daniel Adebayo', 'Article', 'Theology', 'Romans 1:16–17', '2026-07-21', 8, '/images/publications/featured-study.jpg'],
  ['The Local Church Is More Than a Sunday Gathering', 'Recovering the household of God', 'The church is not an event we attend but a covenant people through whom Christ displays his wisdom.', 'Kwame Mensah', 'Article', 'Church', 'Ephesians 2:19–22', '2026-07-18', 6, '/images/publications/church-teaching.jpg'],
  ['Exodus and the God Who Keeps Covenant', 'Reading deliverance through the whole Bible', 'Israel’s rescue reveals the character of the God who remembers his promises and redeems a people for himself.', 'Nomsa Dlamini', 'Bible Study', 'Scripture', 'Exodus 6:6–8', '2026-07-15', 10, '/images/publications/scripture-notes.jpg'],
  ['When the Prosperity Gospel Meets the Cross', 'Why suffering cannot be edited out of discipleship', 'The cross confronts every message that treats God as a path to comfort, status, or material success.', 'Samuel K. Owusu', 'Article', 'Discernment', '1 Corinthians 1:18', '2026-07-12', 7, '/images/publications/family-scripture.jpg'],
  ['Morning Grace: The Shepherd Who Stays Near', 'A meditation on Psalm 23', 'The comfort of Psalm 23 is not the absence of valleys but the presence of the Shepherd within them.', 'Nomsa Dlamini', 'Devotional', 'Christian Life', 'Psalm 23:1–6', '2026-07-08', 4, '/images/publications/morning-devotional.jpg'],
  ['Christian Faithfulness in the African Public Square', 'Truth, courage, and neighbor love', 'Public witness begins with churches formed by Scripture and Christians committed to costly integrity.', 'Kwame Mensah', 'Article', 'Culture', 'Matthew 5:13–16', '2026-07-04', 9, '/images/publications/church-teaching.jpg'],
  ['Why Ordinary Faithfulness Still Matters', 'Serving Christ without needing a platform', 'The kingdom often advances through quiet obedience that will never become visible or impressive.', 'Daniel Adebayo', 'Article', 'Discipleship', '1 Corinthians 15:58', '2026-07-01', 6, '/images/publications/featured-study.jpg'],
  ['Learning to Pray with the Psalms', 'When our own words are not enough', 'God has given his people a vocabulary for praise, lament, confession, and hope.', 'Nomsa Dlamini', 'Bible Study', 'Prayer', 'Psalm 86:1–7', '2026-06-28', 8, '/images/publications/scripture-notes.jpg'],
  ['A Theology of Work for African Cities', 'Vocation, dignity, and neighbor love', 'Daily work becomes an arena for worship when it is received as service before the Lord.', 'Samuel K. Owusu', 'Article', 'Work', 'Colossians 3:23–24', '2026-06-24', 7, '/images/publications/family-scripture.jpg'],
  ['New Mercies for an Uncertain Morning', 'Hope from Lamentations 3', 'Christian hope does not deny grief; it remembers the steadfast love of God in the middle of it.', 'Kwame Mensah', 'Devotional', 'Hope', 'Lamentations 3:22–23', '2026-06-20', 4, '/images/publications/morning-devotional.jpg'],
].map(([title, subtitle, excerpt, author, type, topic, scripture, date, readingTime, image], index) => ({
  legacy_id: `PUBLIC-${index + 1}`,
  slug: slugify(title),
  title,
  subtitle,
  excerpt,
  body: excerpt,
  publication_type: type,
  author_id: authorIds.get(author) || fallbackAuthorId,
  topic_id: topicIds.get(topic) || null,
  scripture,
  cover_path: image,
  status: 'published',
  reading_time_minutes: readingTime,
  published_at: new Date(date).toISOString(),
}))

const adminSeed = adminPublications.map((item) => {
  const published = item.status === 'Published'
  const parsedDate = new Date(item.publishedAt)
  return {
    legacy_id: item.id,
    slug: slugify(item.title),
    title: item.title,
    excerpt: '',
    body: '',
    publication_type: item.type,
    author_id: authorIds.get(item.author) || fallbackAuthorId,
    topic_id: topicIds.get(item.topic) || null,
    cover_path: item.image,
    status: item.status.toLowerCase().replaceAll(' ', '_'),
    reading_time_minutes: 5,
    published_at: published && !Number.isNaN(parsedDate.valueOf()) ? parsedDate.toISOString() : null,
    scheduled_at: item.status === 'Scheduled' && !Number.isNaN(parsedDate.valueOf()) ? parsedDate.toISOString() : null,
  }
})
const mergedBySlug = new Map(publicSeed.map((item) => [item.slug, item]))
for (const item of adminSeed) {
  const existing = mergedBySlug.get(item.slug)
  mergedBySlug.set(item.slug, { ...existing, ...item, subtitle: existing?.subtitle || null, excerpt: existing?.excerpt || '', body: existing?.body || '' })
}
const publicationRows = [...mergedBySlug.values()]
await assert(await supabase.from('publications').upsert(publicationRows, { onConflict: 'legacy_id' }), 'publications')

const publicationRowsDb = await assert(await supabase.from('publications').select('id, title'), 'read publications')
const publicationIds = new Map(publicationRowsDb.map((publication) => [publication.title, publication.id]))
const tasks = editorialTasks.map((task) => ({
  publication_id: publicationIds.get(task.title) || null,
  label: task.label,
  notes: task.meta,
  due_at: new Date(Date.now() + (task.id - 1) * 86400000).toISOString(),
}))
await assert(await supabase.from('editorial_tasks').delete().is('assignee_id', null), 'clear seed tasks')
await assert(await supabase.from('editorial_tasks').insert(tasks), 'editorial tasks')

await assert(await supabase.from('site_settings').upsert([
  { key: 'siteName', value: 'The Gospel Network Africa' },
  { key: 'siteDescription', value: 'Theological resources for the African church.' },
  { key: 'contactEmail', value: 'info@tgnafrica.com' },
  { key: 'timezone', value: 'Africa/Lagos' },
  { key: 'defaultStatus', value: 'Draft' },
  { key: 'reviewRequired', value: true },
  { key: 'emailNotifications', value: true },
  { key: 'publishingNotifications', value: true },
  { key: 'weeklyReport', value: true },
]), 'settings')

console.log(JSON.stringify({
  authors: authorRows.length,
  topics: topicBank.length,
  publications: publicationRows.length,
  tasks: tasks.length,
}, null, 2))
