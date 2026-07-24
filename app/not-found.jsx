export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 text-center text-midnight-navy">
      <div>
        <span className="eyebrow text-midnight-navy/40">404</span>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">Page not found.</h1>
        <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-6 text-midnight-navy/55">
          The page may have moved, or the address may be incorrect.
        </p>
        <a href="/" className="editorial-button mt-8 bg-midnight-navy text-white">Return home</a>
      </div>
    </main>
  )
}
