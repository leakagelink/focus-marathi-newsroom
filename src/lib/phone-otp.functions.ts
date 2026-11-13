import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { normalizePhone } from '@/lib/phone-auth';

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
function randomDigits(n: number) {
  const a = new Uint32Array(n); crypto.getRandomValues(a);
  return Array.from(a, (x) => String(x % 10)).join('');
}
function randomSecret() {
  const a = new Uint8Array(32); crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, '0')).join('');
}
const phoneEmail = (phone: string) => `${phone.replace(/\D/g, '')}@phone.focus24.app`;

type SendInput = { phone: string; signup: boolean };
export const sendPhoneOtp = createServerFn({ method: 'POST' })
  .inputValidator((i: SendInput) => ({ phone: String(i.phone ?? ''), signup: Boolean(i.signup) }))
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    if (!phone || !phone.startsWith('+91')) return { ok: false as const, error: 'योग्य 10 अंकी भारतीय मोबाईल क्रमांक टाका.' };
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: account } = await supabaseAdmin.from('phone_accounts').select('user_id').eq('phone', phone).maybeSingle();
    if (!data.signup && !account) return { ok: false as const, error: 'या क्रमांकावर खाते नाही. आधी नवीन खाते तयार करा.' };
    if (data.signup && account) return { ok: false as const, error: 'या क्रमांकावर आधीच खाते आहे. लॉगिन करा.' };
    const { data: prev } = await supabaseAdmin.from('phone_otps').select('sent_at').eq('phone', phone).maybeSingle();
    if (prev && Date.now() - new Date(prev.sent_at).getTime() < RESEND_MS) return { ok: false as const, error: 'OTP पुन्हा पाठवण्यासाठी एक मिनिट थांबा.' };
    const key = process.env['COMNEXA_API_KEY'];
    if (!key) return { ok: false as const, error: 'मोबाईल OTP सेवा अजून सुरू नाही.' };
    const code = randomDigits(6);
    await supabaseAdmin.from('phone_otps').upsert({ phone, code_hash: await sha256(`${phone}:${code}`), expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(), attempts: 0, sent_at: new Date().toISOString() });
    const res = await fetch('https://comnexaapi.com/api/v1/otp/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: phone.slice(3), otp: code, channel: 'sms' }),
    });
    if (!res.ok) {
      console.error('Comnexa OTP send failed', res.status, await res.text().catch(() => ''));
      await supabaseAdmin.from('phone_otps').delete().eq('phone', phone);
      return { ok: false as const, error: 'OTP पाठवता आला नाही. थोड्या वेळाने पुन्हा प्रयत्न करा.' };
    }
    return { ok: true as const, phone };
  });

type VerifyInput = { phone: string; code: string; signup: boolean; name?: string };
export const verifyPhoneOtp = createServerFn({ method: 'POST' })
  .inputValidator((i: VerifyInput) => ({ phone: String(i.phone ?? ''), code: String(i.code ?? ''), signup: Boolean(i.signup), name: String(i.name ?? '').trim().slice(0, 80) }))
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    if (!phone || !/^\d{6}$/.test(data.code)) return { ok: false as const, error: '6 अंकी OTP टाका.' };
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: row } = await supabaseAdmin.from('phone_otps').select('*').eq('phone', phone).maybeSingle();
    const bad = { ok: false as const, error: 'OTP चुकीचा किंवा कालबाह्य आहे. पुन्हा प्रयत्न करा.' };
    if (!row || new Date(row.expires_at).getTime() < Date.now() || row.attempts >= MAX_ATTEMPTS) return bad;
    if (row.code_hash !== await sha256(`${phone}:${data.code}`)) {
      await supabaseAdmin.from('phone_otps').update({ attempts: row.attempts + 1 }).eq('phone', phone);
      return bad;
    }
    await supabaseAdmin.from('phone_otps').delete().eq('phone', phone);
    const email = phoneEmail(phone);
    const password = randomSecret();
    const { data: account } = await supabaseAdmin.from('phone_accounts').select('user_id').eq('phone', phone).maybeSingle();
    let userId = account?.user_id;
    if (!userId) {
      if (!data.signup) return { ok: false as const, error: 'या क्रमांकावर खाते नाही.' };
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({ email, password, phone, email_confirm: true, phone_confirm: true, user_metadata: { name: data.name || 'पत्रकार' } });
      if (error || !created.user) { console.error(error); return { ok: false as const, error: 'खाते तयार करता आले नाही.' }; }
      userId = created.user.id;
      await supabaseAdmin.from('phone_accounts').insert({ phone, user_id: userId });
    } else {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password });
      if (error) { console.error(error); return { ok: false as const, error: 'लॉगिन अयशस्वी.' }; }
    }
    const pk = process.env['SUPABASE_PUBLISHABLE_KEY']!;
    const client = createClient(process.env['SUPABASE_URL']!, pk, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => { const h = new Headers(init?.headers); if (pk.startsWith('sb_') && h.get('Authorization') === `Bearer ${pk}`) h.delete('Authorization'); h.set('apikey', pk); return fetch(input, { ...init, headers: h }); } },
    });
    const { data: signed, error } = await client.auth.signInWithPassword({ email, password });
    if (error || !signed.session) { console.error(error); return { ok: false as const, error: 'लॉगिन अयशस्वी.' }; }
    return { ok: true as const, access_token: signed.session.access_token, refresh_token: signed.session.refresh_token };
  });
