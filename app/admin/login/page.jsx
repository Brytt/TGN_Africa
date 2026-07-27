import { signIn } from '../../auth/actions'

export const metadata = { title: 'Admin Login' }

export default async function AdminLoginPage({ searchParams }) {
  const params = await searchParams
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 py-12 font-sans">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-7 shadow-xl md:p-9">
        <a href="/" className="inline-flex items-center gap-3 text-midnight-navy">
          <span className="relative block h-20 w-16 shrink-0">
            <img src="/images/brand/the-gospel-network-logo.jpeg" alt="" className="absolute inset-0 h-full w-full object-contain" />
          </span>
          <span><span className="block font-bold">TGN Africa</span><span className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Editorial platform</span></span>
        </a>
        <h1 className="mt-8 text-3xl font-semibold text-midnight-navy">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in with your invited staff account.</p>
        {params?.error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">{params.error}</p>}
        <form action={signIn} className="mt-7 space-y-5">
          <input type="hidden" name="next" value={params?.next || '/admin'} />
          <label className="block text-xs font-semibold text-slate-500">Email address<input required type="email" name="email" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-midnight-navy/30 focus:ring-2 focus:ring-midnight-navy/10" /></label>
          <label className="block text-xs font-semibold text-slate-500">Password<input required type="password" name="password" minLength={8} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-midnight-navy/30 focus:ring-2 focus:ring-midnight-navy/10" /></label>
          <button className="w-full rounded-full bg-midnight-navy px-5 py-3 text-sm font-semibold text-white">Sign in</button>
        </form>
        <a href="/account/forgot-password" className="mt-5 block text-center text-xs font-medium text-midnight-navy">Forgot your password?</a>
      </div>
    </main>
  )
}
