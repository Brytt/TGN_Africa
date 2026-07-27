import 'server-only'
import { createAdminClient } from './supabase/admin'
/* global process */

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

export async function notifySubscribers(publication) {
  if (!process.env.RESEND_API_KEY || !process.env.NEWSLETTER_FROM_EMAIL) {
    console.info('Newsletter email skipped: RESEND_API_KEY or NEWSLETTER_FROM_EMAIL is not configured.')
    return { skipped: true }
  }
  const admin = createAdminClient()
  const { data, error } = await admin.from('newsletter_subscribers').select('email, display_name, unsubscribe_token').eq('status', 'active')
  if (error) throw error
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tgn-africa-xi.vercel.app'
  const articleUrl = `${siteUrl}/articles/${publication.slug}`
  const sends = (data || []).map(async (subscriber) => {
    const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${subscriber.unsubscribe_token}`
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.NEWSLETTER_FROM_EMAIL,
        to: subscriber.email,
        subject: `New publication: ${publication.title}`,
        html: `<div style="font-family:Georgia,serif;max-width:620px;margin:auto;color:#172033"><p style="font:12px Arial,sans-serif;text-transform:uppercase;letter-spacing:2px;color:#6b7280">The Gospel Network</p><h1 style="font-size:34px;line-height:1.1">${escapeHtml(publication.title)}</h1><p style="font-size:17px;line-height:1.7;color:#4b5563">${escapeHtml(publication.excerpt || '')}</p><p><a href="${articleUrl}" style="display:inline-block;background:#0d2240;color:white;padding:13px 20px;text-decoration:none;font:12px Arial,sans-serif">Read publication →</a></p><hr style="border:0;border-top:1px solid #e5e7eb;margin-top:36px"><p style="font:11px Arial,sans-serif;color:#9ca3af">You subscribed to new-publication emails. <a href="${unsubscribeUrl}">Unsubscribe</a></p></div>`,
      }),
    })
    if (!response.ok) throw new Error(`Newsletter delivery failed for ${subscriber.email}: ${response.status}`)
  })
  const results = await Promise.allSettled(sends)
  const failed = results.filter((result) => result.status === 'rejected')
  failed.forEach((result) => console.error(result.reason))
  return { sent: results.length - failed.length, failed: failed.length }
}
