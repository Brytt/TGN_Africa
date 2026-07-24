'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '../../src/lib/supabase/server'

export async function signIn(formData) {
  const supabase = await createClient()
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  const next = String(formData.get('next') || '/admin')
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect(`/admin/login?error=${encodeURIComponent(error.message)}`)
  redirect(next.startsWith('/') ? next : '/admin')
}

export async function signUp(formData) {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  const displayName = String(formData.get('displayName') || '')
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName }, emailRedirectTo: `${origin}/auth/callback` },
  })
  if (error) redirect(`/account/register?error=${encodeURIComponent(error.message)}`)
  redirect('/account/login?message=Check your email to confirm your account.')
}

export async function requestPasswordReset(formData) {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')
  const email = String(formData.get('email') || '')
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/account/reset-password` })
  if (error) redirect(`/account/forgot-password?error=${encodeURIComponent(error.message)}`)
  redirect('/account/login?message=Password reset instructions have been sent.')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
