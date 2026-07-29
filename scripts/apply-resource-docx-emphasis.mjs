import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const downloads = '/Users/odamebrightk/Downloads'
const documentDirectory = path.join(process.cwd(), 'public/resources/documents')
const documents = {
  'Africa Statement on Prosperity Gospel and Word of Faith Theology.docx': 'africa-statement-prosperity-gospel-2025.txt',
  'Apostles’ Creed.docx': 'apostles-creed.txt',
  'Athanasian Creed.docx': 'athanasian-creed.txt',
  'Chicago Statement on Biblical Inerrancy.docx': 'chicago-statement-biblical-inerrancy-1978.txt',
  'Nicene-Constantinopolitan Creed - AD 381.docx': 'niceno-constantinopolitan-creed-381.txt',
  'The Canons of Dort - Selected Articles.docx': 'canons-of-dort-1618-1619.txt',
  'The Chalcedonian Definition - 451 A.D.docx': 'chalcedonian-definition-451.txt',
  'The Heidelberg Catechism - 1563.docx': 'heidelberg-catechism-1563.txt',
  'The Ninety-Five Theses.docx': 'ninety-five-theses-1517.txt',
}

const decodeXml = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&apos;', "'")

for (const [sourceName, targetName] of Object.entries(documents)) {
  const xml = execFileSync('unzip', ['-p', path.join(downloads, sourceName), 'word/document.xml'], { encoding: 'utf8' })
  const paragraphs = []

  for (const paragraph of xml.matchAll(/<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g)) {
    const runs = [...paragraph[1].matchAll(/<w:r(?:\s[^>]*)?>([\s\S]*?)<\/w:r>/g)]
    let plain = ''
    let marked = ''
    let hasBold = false
    let hasPlain = false
    for (const run of runs) {
      const value = decodeXml([...run[1].matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((text) => text[1]).join(''))
      if (!value) continue
      const bold = /<w:b(?:\s[^>]*)?\/>/.test(run[1])
      plain += value
      marked += bold ? `**${value}**` : value
      hasBold ||= bold
      hasPlain ||= !bold && value.trim().length > 0
    }
    if (hasBold && hasPlain && plain.trim()) {
      paragraphs.push({
        plain,
        marked: marked.replaceAll('****', '').replace(/^\*\*Answer\*\*\./, 'Answer.'),
      })
    }
  }

  const targetPath = path.join(documentDirectory, targetName)
  let content = readFileSync(targetPath, 'utf8').replaceAll('**', '')
  let applied = 0
  for (const paragraph of paragraphs.sort((a, b) => b.plain.length - a.plain.length)) {
    if (!content.includes(paragraph.plain)) continue
    content = content.replace(paragraph.plain, paragraph.marked)
    applied += 1
  }

  writeFileSync(targetPath, content)
  process.stdout.write(`${targetName}: restored emphasis in ${applied} paragraphs\n`)
}
