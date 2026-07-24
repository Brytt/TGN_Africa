import { redirect } from 'next/navigation'
import { signOut } from '../auth/actions'
import { createClient } from '../../src/lib/supabase/server'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/account/login')
  const { data: profile } = await supabase.from('profiles').select('display_name, role').eq('id', user.id).single()
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 font-sans">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Reader account</p>
        <h1 className="mt-2 text-3xl font-semibold text-midnight-navy">{profile?.display_name || user.email}</h1>
        <p className="mt-2 text-sm text-slate-500">{user.email} · {profile?.role}</p>
        <form action={signOut}><button className="mt-7 rounded-full border border-slate-200 px-5 py-2.5 text-sm">Sign out</button></form>
      </div>
    </main>
  )
}
