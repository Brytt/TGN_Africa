import { signUp } from '../../auth/actions'

export default async function RegisterPage({ searchParams }) {
  const params = await searchParams
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 font-sans">
      <form action={signUp} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-midnight-navy">Create reader account</h1>
        <p className="mt-2 text-sm text-slate-500">Join the conversation and save publications.</p>
        {params?.error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">{params.error}</p>}
        <input required name="displayName" placeholder="Full name" className="mt-7 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
        <input required type="email" name="email" placeholder="Email address" className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
        <input required type="password" name="password" minLength={8} placeholder="Password (8+ characters)" className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
        <button className="mt-6 w-full rounded-full bg-midnight-navy px-5 py-3 text-sm font-semibold text-white">Create account</button>
        <a href="/account/login" className="mt-5 block text-center text-xs text-midnight-navy">Already have an account?</a>
      </form>
    </main>
  )
}
