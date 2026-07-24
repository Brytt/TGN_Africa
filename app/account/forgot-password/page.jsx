import { requestPasswordReset } from '../../auth/actions'

export default function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 font-sans">
      <form action={requestPasswordReset} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-midnight-navy">Reset password</h1>
        <p className="mt-2 text-sm text-slate-500">We will email you a secure recovery link.</p>
        <input required type="email" name="email" placeholder="Email address" className="mt-7 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
        <button className="mt-6 w-full rounded-full bg-midnight-navy px-5 py-3 text-sm font-semibold text-white">Send reset link</button>
      </form>
    </main>
  )
}
