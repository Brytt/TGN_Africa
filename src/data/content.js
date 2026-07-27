export const navItems = [
  { label: 'Articles', href: '/articles' },
  { label: 'Categories', href: '/topics' },
  { label: 'Contributors', href: '/authors' },
  { label: 'About Us', href: '/about' },
]

export const topicGroups = [
  {
    label: 'Bible & Doctrine',
    topics: [
      'Scripture, Bible Reading, and Biblical Interpretation',
      'Theology Proper: The Doctrine of God',
      'Christ, the Gospel, and Christology',
      'Humanity, Sin, and Salvation',
      'The Holy Spirit and the Christian Life',
    ],
  },
  {
    label: 'Church & Christian Life',
    topics: [
      'Church, Worship, and Ministry',
      'Discipleship, Spiritual Disciplines, and Christian Growth',
      'Pastoral Care, Suffering, and the Inner Life',
      'Family, Work, Money, and Ordinary Life',
    ],
  },
  {
    label: 'Africa, History & Hope',
    topics: [
      'African Pastoral and Cultural Issues',
      'Church History and Historical Theology',
      'Eschatology, Judgment, and Eternal Hope',
      'Apologetics, Error, and Discernment',
    ],
  },
  {
    label: 'Editorial & Conversation',
    topics: [
      'Poetry, Devotional Writing, and Creative Reflection',
      'Book and Resource Reviews',
      'Interviews and Pastoral Conversations',
      'Seasonal and Occasional Articles',
    ],
  },
]

export const images = {
  hero: 'https://lh3.googleusercontent.com/aida/AP1WRLvDZoYJA6WKxyU7k-unK_uHWvsyoKEQDTP_ZAU6fmJ7McYVrovHRqjTrvPpvtgWwWxlE7MgUNFuXe54-TT2xEHSTtokm-oMyD90lPCVl4-zIZy2rapCxYT-Bh48rdikGCiaAzL68rZ547LpLPXDSjWPYu-VzjNq1pmWkWKqcSv6P19Gsm0JU4d-VnkYKk7wHOdeyAEWeoH15K8EzydYhFNV1xJe5npL_LnOlU4DTJ8W7exQpuzgZVlsqoON',
  featured: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  featuredCrossImage: '/featured-cross.jpg',
  doctrine: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEta6U2uejDv8gQ2Lyq-1R0p0_XuxcKNq1ywAN19w9rnfbhgQGdrEFrGJb2qs1UbToZXNQqPIMw6HyEHtetp-ldAUkatRnLAzkvSIaaL7ELSQmvf2BLaBwP-bdEluYK0oAJdS2HCU-Xl8HupmeKlup4bHbzBJSfYhZelAFetF-bOJxjfD5dewWyguHFchIe93cvKysvR7GEmJQNETJEjlXs74kacHCJsRog9nKqvyjH1zYNRegEY1ipA',
  culture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaVLQ7pgqU7Ewu8vw8LEA1PUMT77WcVUYAKYV-i3GryUimHfKzE0cXHGvBDvTjSqLnrRFqr1xvAUwQr3SVbgEvfIhV0tzPepE-i9T356GUTAzT90ryeR3ELvCCTcBdWNXI3N-r5bJ539W7o1rVC9ko7CWY45zj67Itj2qepKNedC8Uqyrz83OIEcujb3llbNpqUauV7MiCRN0e42BITVOwAAAGQvCgejA-IEIztbzZ4Oh6vcPrDldFFOA',
  latest: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYchdDjxsklV6s3ciwsve4_FtjHPlutB3zQ75w7U5KZRoz3MbeX0hOgrvBJPjAjU3NhmRfLmJVYclts6gS1WT3W7e6pMxwCvvMdRkzcpj9quiEW512WRb6OTTpUfI5r55NX9AH7n3ZJ3VG6b95-z-HyFSG5lQ8MwQ9D3Qj_kF0kg4u1z6UfdUILby3EnWRsl9oujPB_uHQclz4r0MizGUNDwflN6H3Nn8xnNkD0iFzbJVTHBbowCeFtg',
  devotional: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHXd_-1dWnMDrN67OhcWwtRgGf3qJD58MYZo-n7-mvamaPe1McaQNDHeNt99SRPNCMH7eKnoie4HxV1B7J2J2zPde2EEP-nwS-NB-j4ywqou_5ZyLZ0ESeGgHp9K8ANICORB_XGSnjSpY7IQSrI5fmL-B33-Kp2RMwMeLblR3B6yXOyR1mRFaB8uKSDOglCyr9LykF6ZbES66BqexD2pFy6dYslX1xpwmNN_XNJEa4rRe8P9S2OkazPg',
}

export const supportingArticles = [
  {
    category: 'Doctrine',
    title: 'Ordo Salutis: The Golden Chain of Salvation',
    excerpt: 'A deep dive into the sovereign work of God in the redemption of man.',
    image: images.crossCard,
  },
  {
    category: 'Culture',
    title: "Faith in the Public Square: Africa's Voice",
    excerpt: 'Navigating religious influence in modern African governance.',
    image: images.crossCard2,
  },
]

export const stats = [
  { value: '12', label: 'Regional Hubs' },
  { value: '300+', label: 'Articles Published' },
  { value: '5', label: 'Years of Impact' },
]

export const categories = [
  {
    icon: 'church',
    title: 'Gospel & Salvation',
    description: "Understanding the fundamental nature of Christ's redemptive work for Africa.",
    count: '42 articles',
  },
  {
    icon: 'menu_book',
    title: 'Christian Doctrine',
    description: 'Building a systematic and robust foundation for life through the Word of God.',
    count: '128 articles',
    featured: true,
  },
  {
    icon: 'auto_stories',
    title: 'Bible Study',
    description: 'In-depth exegetical examinations of the Old and New Testament scriptures.',
    count: '56 studies',
  },
  {
    icon: 'public',
    title: 'Culture & Society',
    description: 'Analyzing modern African life and trends through the lens of biblical truth.',
    count: '31 analyses',
  },
]

export const publicationFilters = ['All', 'Articles', 'Devotionals', 'Bible Study', 'Poems']

export const pathways = [
  {
    number: '01',
    title: 'New to Christianity',
    description: 'Start here to understand the fundamental truths of the faith and the person of Jesus Christ.',
    action: 'Begin the Journey',
  },
  {
    number: '02',
    title: 'Understanding the Gospel',
    description: "Deepen your grasp of God's redemptive plan through the life, death, and resurrection of Christ.",
    action: 'Continue Exploring',
  },
  {
    number: '03',
    title: 'Growing in Doctrine',
    description: 'Systematic study for those ready to build a firm theological foundation for their life.',
    action: 'Take Next Step',
    dark: true,
  },
]

export const gospelPoints = [
  {
    title: 'God the Holy Creator',
    text: 'The sovereign Lord of all creation, infinite in holiness and justice, who made us for His glory.',
  },
  {
    title: 'Man the Fallen Creature',
    text: 'Our rebellion separated us from the source of life, leaving us in a state of spiritual death and judgment.',
  },
  {
    title: 'Christ the Only Savior',
    text: 'God in flesh, who lived perfectly, died sacrificially, and rose triumphantly to reconcile us to the Father.',
  },
]
