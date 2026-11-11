import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RecordManager } from './Management';
import { actions, refreshCloud, useStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import { statusMeta } from '@/components/journalist/JournalistApp';
import { toast } from 'sonner';
import { inputCls } from '@/components/ui/glass';

export function NewsManager() {
  const news = useStore(s=>s.news);
  const reporters = useStore(s=>s.journalists);
  const userId = useStore(s=>s.userId);
  const [filter,setFilter] = useState('pending');
  const [reporter,setReporter] = useState('');
  const [selected,setSelected] = useState('');
  const [busy,setBusy] = useState(false);
  const [reason,setReason] = useState('');
  const current = news.find(n=>n.id===selected);
  async function moderate(status:'approved'|'pending'|'rejected'|'revision') {
    if(!current) return;
    setBusy(true);
    try { const {error}=await supabase.from('news').update({status,feedback:reason || null}).eq('id',current.id).select('id').single(); if(error) throw new Error(error.message); await refreshCloud(); toast.success('स्थिती जतन झाली'); } catch(e) {toast.error(e instanceof Error ? e.message : 'जतन झाले नाही');} finally {setBusy(false);}
  }
  return <section className="space-y-3">
    <div className="grid gap-2 sm:grid-cols-2"><select aria-label="बातमी स्थिती" className={`${inputCls} bg-card`} value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">सर्व बातम्या</option>{Object.entries(statusMeta).map(([v,m])=><option key={v} value={v}>{m.l}</option>)}</select>
    <select aria-label="पत्रकार फिल्टर" className={`${inputCls} bg-card`} value={reporter} onChange={e=>setReporter(e.target.value)}><option value="">सर्व पत्रकार</option>{reporters.map(p=><option key={p.id} value={p.id}>{p.name || p.id}</option>)}</select></div>
    <div className="flex flex-wrap gap-2">{news.filter(n=>(filter==='all'||n.status===filter)&&(!reporter||n.reporterId===reporter)).map(n=><Button key={n.id} variant={selected===n.id?'default':'outline'} className="h-auto max-w-full whitespace-normal text-left" onClick={()=>{setSelected(n.id);setReason(n.feedback ?? '');}}>{n.headline}</Button>)}</div>
    {current && <section className="space-y-3 border-y border-glass-border py-4">
      <h2 className="font-bold">{current.headline}</h2>
      <p className="break-words text-xs text-muted-foreground">पत्रकार: {reporters.find(p=>p.id===current.reporterId)?.name || current.reporterId} · {statusMeta[current.status].l} · {new Date(current.createdAt).toLocaleString('mr-IN')}</p>
      <p className="whitespace-pre-wrap text-sm">{current.script}</p>
      <div className="grid gap-2 sm:grid-cols-2">{Object.entries(current.clipUrls ?? {}).map(([key,url])=><div key={key}><span className="text-xs">{key}</span><video controls playsInline src={url} className="aspect-video w-full" /></div>)}</div>
      <input className={inputCls} aria-label="संपादकाची टिप्पणी" placeholder="नकार / सुधारणेचे कारण" value={reason} onChange={e=>setReason(e.target.value)} />
      <div className="flex flex-wrap gap-2"><Button disabled={busy} onClick={()=>void moderate('approved')}>मंजूर व प्रकाशित</Button><Button disabled={busy} variant="outline" onClick={()=>void moderate('revision')}>सुधारणा मागवा</Button><Button disabled={busy} variant="outline" onClick={()=>void moderate('rejected')}>नकार</Button><Button disabled={busy} variant="outline" onClick={()=>void moderate('pending')}>प्रकाशन मागे घ्या</Button></div>
    </section>}
    <RecordManager title="बातम्या" rows={news.filter(n=>(filter==='all'||n.status===filter)&&(!reporter||n.reporterId===reporter)).map(n=>({...n,reporterName:reporters.find(p=>p.id===n.reporterId)?.name ?? n.reporterId}))} fields={[{key:'headline',label:'शीर्षक'},{key:'script',label:'बातमी',type:'textarea'},{key:'category',label:'Category'},{key:'districtId',label:'जिल्हा ID'},{key:'constituency',label:'विधानसभा'},{key:'importance',label:'महत्त्व: normal / trending / breaking'},{key:'image',label:'फोटो URL',type:'url'}]} save={async(d,id)=>{
      if(id) { const {error}=await supabase.from('news').update({headline:d['headline'] ?? '',script:d['script'] ?? '',category:d['category'] ?? '',district_id:d['districtId'] ?? '',constituency:d['constituency'] ?? '',importance:d['importance'] || 'normal',image:d['image'] ?? ''}).eq('id',id).select('id').single(); if(error) throw new Error(error.message); await refreshCloud(); }
      else { await actions.submitNews({id:'',headline:d['headline'] ?? '',script:d['script'] ?? '',category:d['category'] ?? '',districtId:d['districtId'] ?? '',constituency:d['constituency'] ?? '',reporterId:userId ?? '',createdAt:new Date().toISOString(),status:'pending',importance:'normal',image:'',clips:{location:false,anchor:false,byte1:false,byte2:false},clipPaths:{},aiVoice:false,urgent:false,views:0}); }
    }} remove={async id=>{ const {error}=await supabase.from('news').delete().eq('id',id).select('id').single(); if(error) throw new Error(error.message); if(selected===id)setSelected(''); await refreshCloud(); }} />
  </section>;
}