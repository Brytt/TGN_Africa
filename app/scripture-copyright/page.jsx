import Navbar from '../../src/components/Navbar'
import Footer from '../../src/components/Footer'

export const metadata = { title: 'Scripture Copyright | The Gospel Network' }

export default function ScriptureCopyrightPage() {
  return <><Navbar /><main className="min-h-[65vh] bg-[#f7f7f6] pb-20 pt-36 md:pt-44"><article className="page-shell max-w-3xl"><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-heritage-gold">Copyright and permissions</p><h1 className="mt-4 font-display text-4xl text-midnight-navy md:text-5xl">Scripture quotations</h1><div className="mt-8 border-l-4 border-midnight-navy bg-white p-7 text-[15px] leading-8 text-midnight-navy/65 shadow-sm md:p-10"><p>Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. ESV Text Edition: 2025. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated in whole or in part into any other language. Used by permission. All rights reserved.</p><p className="mt-6"><a href="https://www.esv.org/" target="_blank" rel="noreferrer" className="font-semibold text-midnight-navy underline underline-offset-4">Visit ESV.org</a></p></div></article></main><Footer /></>
}
