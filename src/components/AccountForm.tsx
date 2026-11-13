import { useState, type FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Glass, GlowButton, Logo, inputCls } from '@/components/ui/glass';
import { Button } from '@/components/ui/button';
import { Mail, Smartphone } from 'lucide-react';
import { normalizePhone } from '@/lib/phone-auth';
import { sendPhoneOtp, verifyPhoneOtp } from '@/lib/phone-otp.functions';

export function AccountForm() {
  const [signup, setSignup] = useState(false);
  const [method, setMethod] = useState<'email'|'phone'>('email');
  const [phone, setPhone] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [resendAt, setResendAt] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      if (method === 'phone') {
        if (sentTo) {
          if (!/^\d{6}$/.test(otp)) throw new Error('6 अंकी OTP टाका.');
          const r = await verifyPhoneOtp({ data: { phone: sentTo, code: otp, signup, name: name.trim() } });
          if (!r.ok) throw new Error(r.error);
          const { error } = await supabase.auth.setSession({ access_token: r.access_token, refresh_token: r.refresh_token });
          if (error) throw new Error('लॉगिन अयशस्वी');
        } else {
          const normalized = normalizePhone(phone);
          if (!normalized) throw new Error('योग्य मोबाईल क्रमांक टाका. भारतासाठी 10 अंक; इतर देशांसाठी +देशकोड वापरा.');
          const r = await sendPhoneOtp({ data: { phone: normalized, signup } });
          if (!r.ok) throw new Error(r.error);
          setSentTo(normalized); setResendAt(Date.now()+60000); setMessage('मोबाईलवर पाठवलेला OTP टाका.');
        }
        return;
      }
      const result = signup ? await supabase.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: window.location.origin } }) : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (signup && !result.data.session) setMessage('ईमेलमधील लिंक उघडून खाते सत्यापित करा.');
    } catch (e) { setMessage(e instanceof Error ? e.message : 'लॉगिन अयशस्वी'); }
    finally { setBusy(false); }
  }
  function resetPhone() { setSentTo(null); setOtp(''); setMessage(''); }
  async function resend() {
    if (!sentTo || busy) return;
    if(Date.now()<resendAt) {setMessage('OTP पुन्हा पाठवण्यासाठी एक मिनिट थांबा.');return;}
    setBusy(true);
    try {
      const r=await sendPhoneOtp({data:{phone:sentTo,signup}});
      if(!r.ok) throw new Error(r.error);
      setResendAt(Date.now()+60000);setMessage('नवीन OTP पाठवला.');
    } catch(e) {setMessage(e instanceof Error?e.message:'OTP पाठवता आला नाही.');}
    finally {setBusy(false);}
  }
  return <div className="mx-auto w-full max-w-sm space-y-4 p-4">
    <div className="text-center"><Logo /><h1 className="mt-3 font-bold">{signup ? 'नवीन खाते' : 'लॉगिन'}</h1></div>
    <Glass className="space-y-3 p-4">
    <div className="grid grid-cols-2 gap-2" role="group" aria-label="लॉगिन पद्धत">
      <Button disabled={busy} variant={method==='email'?'default':'outline'} aria-pressed={method==='email'} onClick={()=>{setMethod('email');resetPhone();}}><Mail />ईमेल</Button>
      <Button disabled={busy} variant={method==='phone'?'default':'outline'} aria-pressed={method==='phone'} onClick={()=>{setMethod('phone');resetPhone();}}><Smartphone />मोबाईल</Button>
    </div>
    <form onSubmit={submit} className="space-y-3">
      {signup && !sentTo && <label className="block text-xs">नाव<input required autoComplete="name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></label>}
      {method==='email' ? <>
        <label className="block text-xs">ईमेल<input type="email" required autoComplete="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="block text-xs">पासवर्ड<input type="password" minLength={8} required autoComplete={signup ? 'new-password' : 'current-password'} className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      </> : sentTo ? <>
        <p className="text-xs text-muted-foreground">OTP पाठवला: {sentTo}</p>
        <label className="block text-xs">OTP<input required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} className={inputCls} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,''))} /></label>
        <div className="flex flex-wrap gap-2"><Button variant="ghost" size="sm" type="button" disabled={busy} onClick={resetPhone}>क्रमांक बदला</Button><Button variant="ghost" size="sm" type="button" disabled={busy} onClick={()=>void resend()}>OTP पुन्हा पाठवा</Button></div>
      </> : <label className="block text-xs">मोबाईल क्रमांक<input type="tel" required autoComplete="tel" placeholder="9876543210 किंवा +91…" className={inputCls} value={phone} onChange={e=>setPhone(e.target.value)} /></label>}
      {message && <p role="status" className="text-sm text-warning">{message}</p>}
      <GlowButton type="submit" className="w-full" disabled={busy}>{busy ? 'कृपया थांबा…' : method==='phone' ? sentTo ? 'OTP सत्यापित करा' : 'OTP पाठवा' : signup ? 'खाते तयार करा' : 'लॉगिन करा'}</GlowButton>
    </form>
    <GlowButton variant="ghost" className="w-full" disabled={busy} onClick={() => {setSignup(!signup);resetPhone();}}>{signup ? 'आधीच खाते आहे? लॉगिन' : 'नवीन खाते तयार करा'}</GlowButton>
    </Glass>
  </div>;
}