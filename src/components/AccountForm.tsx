import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Glass, GlowButton, Logo, inputCls } from '@/components/ui/glass';
import '@lovable.dev/cloud-auth-js/styles.css';

export function AccountForm() {
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      const result = signup ? await supabase.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: window.location.origin } }) : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (signup && !result.data.session) setMessage('ईमेलमधील लिंक उघडून खाते सत्यापित करा.');
    } catch (e) { setMessage(e instanceof Error ? e.message : 'लॉगिन अयशस्वी'); }
    finally { setBusy(false); }
  }
  async function social(provider: 'google' | 'lovable') {
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (result.error) toast.error(result.error.message);
  }
  return <div className="mx-auto w-full max-w-sm space-y-4 p-4">
    <div className="text-center"><Logo /><h1 className="mt-3 font-bold">{signup ? 'नवीन खाते' : 'लॉगिन'}</h1></div>
    <Glass className="space-y-3 p-4"><form onSubmit={submit} className="space-y-3">
      {signup && <label className="block text-xs">नाव<input required className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></label>}
      <label className="block text-xs">ईमेल<input type="email" required autoComplete="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label className="block text-xs">पासवर्ड<input type="password" minLength={8} required autoComplete={signup ? 'new-password' : 'current-password'} className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      {message && <p role="status" className="text-sm text-warning">{message}</p>}
      <GlowButton type="submit" className="w-full" disabled={busy}>{busy ? 'कृपया थांबा…' : signup ? 'खाते तयार करा' : 'लॉगिन करा'}</GlowButton>
    </form>
    <GlowButton variant="ghost" className="w-full" onClick={() => setSignup(!signup)}>{signup ? 'आधीच खाते आहे? लॉगिन' : 'नवीन खाते तयार करा'}</GlowButton>
    <GlowButton variant="ghost" className="w-full" onClick={() => social('google')}><svg aria-hidden="true" className="size-[18px]" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>Continue with Google</GlowButton>
    <GlowButton className="lovable-auth-button w-full" onClick={() => social('lovable')}>Continue with Lovable</GlowButton>
    </Glass>
  </div>;
}