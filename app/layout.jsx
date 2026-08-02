import '../src/index.css'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tgn-africa-xi.vercel.app'),
  title: {
    default: 'TGN',
    template: '%s | TGN',
  },
  description: 'The Gospel Network Africa — gospel-centered theological writing for the African church.',
  icons: {
    icon: '/images/brand/the-gospel-network-logo.jpeg',
    shortcut: '/images/brand/the-gospel-network-logo.jpeg',
    apple: '/images/brand/the-gospel-network-logo.jpeg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{document.documentElement.dataset.theme=localStorage.getItem('tgn-theme')||'light'}catch(e){}" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Hanken+Grotesk:wght@300;400;500;600;700;800&family=Source+Sans+3:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
