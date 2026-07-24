import { signIn } from '../../auth/actions'

export default async function ReaderLoginPage({ searchParams }) {
  const params = await searchParams
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 font-sans">
      <form action={signIn} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-midnight-navy">Reader sign in</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to comment, like, and save publications.</p>
        {params?.message && <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{params.message}</p>}
        {params?.error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">{params.error}</p>}
        <input type="hidden" name="next" value="/account" />
        <input required type="email" name="email" placeholder="Email address" className="mt-7 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
        <input required type="password" name="password" minLength={8} placeholder="Password" className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
        <button className="mt-6 w-full rounded-full bg-midnight-navy px-5 py-3 text-sm font-semibold text-white">Sign in</button>
        <div className="mt-5 flex justify-between text-xs"><a href="/account/register" className="text-midnight-navy">Create account</a><a href="/account/forgot-password" className="text-slate-500">Forgot password?</a></div>
      </form>
    </main>
  )
}
