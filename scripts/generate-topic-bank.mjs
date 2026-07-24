/* global process, console */
import fs from 'node:fs'
import path from 'node:path'

const sourceDirectory = process.argv[2]
const outputFile = process.argv[3]

if (!sourceDirectory || !outputFile) {
  throw new Error('Usage: node scripts/generate-topic-bank.mjs <unzipped-xlsx-directory> <output-file>')
}

const decodeXml = (value = '') =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const sharedStringsXml = fs.readFileSync(path.join(sourceDirectory, 'xl/sharedStrings.xml'), 'utf8')
const sharedStrings = [...sharedStringsXml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((match) =>
  [...match[1].matchAll(/<t(?: [^>]*)?>([\s\S]*?)<\/t>/g)]
    .map((textMatch) => decodeXml(textMatch[1]))
    .join(''),
)

const sheetXml = fs.readFileSync(path.join(sourceDirectory, 'xl/worksheets/sheet1.xml'), 'utf8')
const cells = [...sheetXml.matchAll(/<c r="([A-Q])(\d+)"(?: s="(\d+)")?(?: t="s")?>([\s\S]*?)<\/c>/g)]
  .map((match) => {
    const valueMatch = match[4].match(/<v>(\d+)<\/v>/)
    return {
      column: match[1].charCodeAt(0) - 65,
      row: Number(match[2]),
      style: Number(match[3] || 0),
      value: valueMatch ? sharedStrings[Number(valueMatch[1])] : '',
    }
  })
  .filter((cell) => cell.value)

const topicBank = []

for (let column = 0; column < 17; column += 1) {
  const columnCells = cells.filter((cell) => cell.column === column).sort((a, b) => a.row - b.row)
  const title = columnCells.find((cell) => cell.row === 1)?.value
  if (!title) continue

  const topic = { title, slug: slugify(title), subtopics: [] }
  let currentSubtopic = null

  for (const cell of columnCells.filter((item) => item.row > 1)) {
    if (cell.style === 5) {
      currentSubtopic = { title: cell.value, slug: slugify(cell.value), resources: [] }
      topic.subtopics.push(currentSubtopic)
    } else if (currentSubtopic && (cell.style === 6 || cell.style === 7)) {
      currentSubtopic.resources.push(cell.value)
    }
  }

  topicBank.push(topic)
}

const source = `// Generated from the TGN Topic Bank Google Sheet. Do not edit by hand.\nexport const topicBank = ${JSON.stringify(topicBank, null, 2)}\n\nexport const topicBySlug = Object.fromEntries(topicBank.map((topic) => [topic.slug, topic]))\nexport const topicSlugByTitle = Object.fromEntries(topicBank.map((topic) => [topic.title, topic.slug]))\n`
fs.writeFileSync(outputFile, source)

const subtopicCount = topicBank.reduce((total, topic) => total + topic.subtopics.length, 0)
const resourceCount = topicBank.reduce(
  (total, topic) => total + topic.subtopics.reduce((sum, subtopic) => sum + subtopic.resources.length, 0),
  0,
)

console.log(`Generated ${topicBank.length} topics, ${subtopicCount} subtopics, and ${resourceCount} resource titles.`)
