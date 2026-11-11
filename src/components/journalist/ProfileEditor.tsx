import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { inputCls } from '@/components/ui/glass';
import { supabase } from '@/integrations/supabase/client';
import { refreshCloud, useStore } from '@/lib/store';
import { toast } from 'sonner';

export function ProfileEditor() {
  const userId=useStore(s=>s.userId);
  const [draft,setDraft]=useState({name:'',phone:'',contact_email:'',district_id:'',constituency:'',address:'',bio:'',avatar:''});
  const [busy,setBusy]=useState(false);
  useEffect(()=>{ if(!userId)return; void supabase.from('profiles').select('*').eq('id',userId).single().then(({data,error})=>{if(error)toast.error(error.message);if(data)setDraft({name:data.name,phone:data.phone,contact_email:data.contact_email,district_id:data.district_id,constituency:data.constituency,address:data.address,bio:data.bio,avatar:data.avatar});});},[userId]);
  return <form className="space-y-3" onSubmit={async e=>{e.preventDefault();if(!userId)return;setBusy(true);try{const {error}=await supabase.from('profiles').update(draft).eq('id',userId).select('id').single();if(error)throw new Error(error.message);await refreshCloud();toast.success('प्रोफाइल जतन झाली');}catch(e){toast.error(e instanceof Error?e.message:'जतन झाले नाही');}finally{setBusy(false);}}}>
    <h3 className="font-bold">माझी संपूर्ण माहिती</h3>
    {([['name','नाव'],['phone','मोबाईल'],['contact_email','संपर्क ईमेल'],['district_id','जिल्हा ID'],['constituency','विधानसभा'],['address','पत्ता'],['bio','परिचय'],['avatar','फोटो URL']] as const).map(([key,label])=><label key={key} className="block text-xs">{label}<input className={inputCls} type={key==='contact_email'?'email':key==='phone'?'tel':key==='avatar'?'url':'text'} value={draft[key]} onChange={e=>setDraft({...draft,[key]:e.target.value})} /></label>)}
    <Button type="submit" disabled={busy}>माहिती जतन करा</Button>
  </form>;
}