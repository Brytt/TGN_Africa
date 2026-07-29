export const resourceCollections = [
  {
    id: 'ancient',
    eyebrow: 'The historic faith',
    title: 'Ancient Creeds and Definitions',
    description: 'Foundational summaries through which the early church confessed the Triune God and the person of Jesus Christ.',
    documents: [
      { title: 'The Apostles’ Creed', slug: 'apostles-creed', date: 'Early Church', file: 'apostles-creed.txt', type: 'Creed' },
      { title: 'The Creed of Nicaea', slug: 'creed-of-nicaea-325', date: 'AD 325', type: 'Creed' },
      { title: 'The Niceno-Constantinopolitan Creed', slug: 'niceno-constantinopolitan-creed-381', date: 'AD 381', file: 'niceno-constantinopolitan-creed-381.txt', type: 'Creed' },
      { title: 'The Athanasian Creed', slug: 'athanasian-creed', date: 'Early Medieval Church', file: 'athanasian-creed.txt', type: 'Creed' },
      { title: 'The Chalcedonian Definition', slug: 'chalcedonian-definition-451', date: 'AD 451', file: 'chalcedonian-definition-451.txt', type: 'Definition' },
      { title: 'The Canons of the Council of Carthage', slug: 'canons-council-carthage-418', date: 'AD 418', type: 'Canons' },
    ],
  },
  {
    id: 'protestant',
    eyebrow: 'Reformation and evangelical witness',
    title: 'Selected Protestant Documents',
    description: 'Catechisms, confessions, theses, and declarations that have served Protestant churches across generations.',
    documents: [
      { title: 'The Ninety-Five Theses', slug: 'ninety-five-theses-1517', date: '1517', file: 'ninety-five-theses-1517.txt', type: 'Theses' },
      { title: 'The Heidelberg Catechism', slug: 'heidelberg-catechism-1563', date: '1563', file: 'heidelberg-catechism-1563.txt', type: 'Catechism' },
      { title: 'The Canons of Dort', slug: 'canons-of-dort-1618-1619', date: '1618–1619', file: 'canons-of-dort-1618-1619.txt', type: 'Canons' },
      { title: 'The Westminster Confession of Faith', slug: 'westminster-confession-1646', date: '1646', file: 'westminster-confession-1646.txt', type: 'Confession' },
      { title: 'The Second London Baptist Confession', slug: 'second-london-baptist-confession-1677-1689', date: '1677/1689', file: 'second-london-baptist-confession-1677-1689.txt', type: 'Confession' },
      { title: 'The Chicago Statement on Biblical Inerrancy', slug: 'chicago-statement-biblical-inerrancy-1978', date: '1978', file: 'chicago-statement-biblical-inerrancy-1978.txt', type: 'Statement' },
      { title: 'Africa Statement on Prosperity Gospel and Word of Faith Theology', slug: 'africa-statement-prosperity-gospel-2025', date: '2025', file: 'africa-statement-prosperity-gospel-2025.txt', type: 'Statement' },
    ],
  },
]

export const allResourceDocuments = resourceCollections.flatMap((collection) =>
  collection.documents.map((document) => ({ ...document, collection: collection.title }))
)

export function getResourceDocument(slug) {
  return allResourceDocuments.find((document) => document.slug === slug)
}
