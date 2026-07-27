import 'server-only'
import { createAdminClient } from './supabase/admin'
/* global process */

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

function emailConfiguration() {
  if (!process.env.RESEND_API_KEY || !process.env.NEWSLETTER_FROM_EMAIL) return null
  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.NEWSLETTER_FROM_EMAIL,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://tgn-africa-xi.vercel.app',
  }
}

async function sendEmail({ to, subject, html }) {
  const configuration = emailConfiguration()
  if (!configuration) {
    console.info('Newsletter email skipped: RESEND_API_KEY or NEWSLETTER_FROM_EMAIL is not configured.')
    return { skipped: true }
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${configuration.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: configuration.from, to, subject, html }),
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Newsletter delivery failed (${response.status}): ${detail.slice(0, 300)}`)
  }
  return { sent: true }
}

function emailFrame(content, unsubscribeUrl) {
  return `<div style="margin:0;background:#f4f5f7;padding:36px 16px"><div style="max-width:620px;margin:auto;background:#ffffff;border-top:5px solid #0d2240;padding:38px 34px;color:#172033"><p style="margin:0 0 28px;font:700 11px Arial,sans-serif;text-transform:uppercase;letter-spacing:2.2px;color:#0d2240">The Gospel Network</p>${content}<hr style="border:0;border-top:1px solid #e5e7eb;margin:36px 0 20px"><p style="margin:0;font:11px/1.6 Arial,sans-serif;color:#8a919d">Declaring the Whole Counsel of God for the Saints of Africa.</p>${unsubscribeUrl ? `<p style="margin:8px 0 0;font:11px/1.6 Arial,sans-serif;color:#8a919d">You subscribed to publication emails. <a href="${unsubscribeUrl}" style="color:#0d2240">Unsubscribe</a></p>` : ''}</div></div>`
}

export async function sendWelcomeEmail({ email, displayName, unsubscribeToken }) {
  const configuration = emailConfiguration()
  if (!configuration) return { skipped: true }
  const unsubscribeUrl = `${configuration.siteUrl}/api/unsubscribe?token=${unsubscribeToken}`
  const greeting = displayName ? `Dear ${escapeHtml(displayName)},` : 'Welcome,'
  return sendEmail({
    to: email,
    subject: 'Thank you for subscribing to The Gospel Network',
    html: emailFrame(`<p style="margin:0 0 18px;font:18px/1.7 Georgia,serif;color:#4b5563">${greeting}</p><h1 style="margin:0;font:600 36px/1.12 Georgia,serif;color:#0d2240">Thank you for subscribing.</h1><p style="margin:22px 0 0;font:17px/1.75 Georgia,serif;color:#4b5563">You are now part of The Gospel Network’s reader community. We will send you an email whenever a new article, sermon, devotional, Bible study, or poem is published.</p><p style="margin:28px 0 0"><a href="${configuration.siteUrl}/articles" style="display:inline-block;background:#0d2240;color:#ffffff;padding:14px 22px;text-decoration:none;font:700 11px Arial,sans-serif;text-transform:uppercase;letter-spacing:1.2px">Explore publications →</a></p>`, unsubscribeUrl),
  })
}

export async function notifySubscribers(publication) {
  const configuration = emailConfiguration()
  if (!configuration) return { skipped: true }
  const admin = createAdminClient()
  const { data, error } = await admin.from('newsletter_subscribers').select('email, display_name, unsubscribe_token').eq('status', 'active')
  if (error) throw error
  const articleUrl = `${configuration.siteUrl}/articles/${publication.slug}`
  const sends = (data || []).map(async (subscriber) => {
    const unsubscribeUrl = `${configuration.siteUrl}/api/unsubscribe?token=${subscriber.unsubscribe_token}`
    return sendEmail({
      to: subscriber.email,
      subject: `New publication: ${publication.title}`,
      html: emailFrame(`<p style="margin:0 0 8px;font:700 11px Arial,sans-serif;text-transform:uppercase;letter-spacing:1.8px;color:#c5a059">New publication</p><h1 style="margin:0;font:600 36px/1.12 Georgia,serif;color:#0d2240">${escapeHtml(publication.title)}</h1><p style="margin:22px 0 0;font:17px/1.75 Georgia,serif;color:#4b5563">${escapeHtml(publication.excerpt || 'A new publication from The Gospel Network is ready to read.')}</p><p style="margin:28px 0 0"><a href="${articleUrl}" style="display:inline-block;background:#0d2240;color:#ffffff;padding:14px 22px;text-decoration:none;font:700 11px Arial,sans-serif;text-transform:uppercase;letter-spacing:1.2px">Read publication →</a></p>`, unsubscribeUrl),
    })
  })
  const results = await Promise.allSettled(sends)
  const failed = results.filter((result) => result.status === 'rejected')
  failed.forEach((result) => console.error(result.reason))
  return { sent: results.length - failed.length, failed: failed.length }
}
