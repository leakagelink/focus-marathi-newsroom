import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { inputCls } from '@/components/ui/glass';
import { supabase } from '@/integrations/supabase/client';
import { refreshCloud } from '@/lib/store';
import { toast } from 'sonner';
import { AD_PLACEMENTS, AD_SIZES } from '@/lib/ads';

type Field = { key: string; label: string; type?: string; options?: {value:string;label:string}[]; readonly?:boolean };
type Row = { id: string; [key: string]: unknown };
export function RecordManager({ title, rows, fields, save, remove, create = true }: { title: string; rows: Row[]; fields: Field[]; save: (draft: Record<string,string>, id?: string) => Promise<void>; remove?: (id:string) => Promise<void>; create?: boolean }) {
  const [draft, setDraft] = useState<Record<string,string> | null>(null);
  const [id, setId] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState('');
  const edit = (row?: Row) => { setId(row?.id); setDraft(Object.fromEntries(fields.map(f => [f.key, String(row?.[f.key] ?? (f.type==='boolean' ? (f.key==='active' ? 'true' : 'false') : f.options?.[0]?.value ?? ''))]))); };
  async function run(task:()=>Promise<void>) { setBusy(true); try { await task(); setDraft(null); toast.success('जतन झाले'); } catch(e) { toast.error(e instanceof Error ? e.message : 'जतन झाले नाही'); } finally { setBusy(false); } }
  return <section className="space-y-3 border-t border-glass-border pt-4">
    <div className="flex items-center justify-between gap-2"><h2 className="font-bold">{title}</h2>{create && <Button size="sm" disabled={busy} onClick={() => edit()}><Plus />नवीन</Button>}</div>
    <input aria-label={`${title} शोधा`} placeholder="शोधा" className={inputCls} value={search} onChange={e => setSearch(e.target.value)} />
    {draft && <form className="grid gap-3 sm:grid-cols-2" onSubmit={e => {e.preventDefault(); void run(() => save(draft,id));}}>
      {fields.map(f => <label key={f.key} className="min-w-0 text-xs">{f.label}{f.type==='image' ? <ImageUpload value={draft[f.key] ?? ''} onChange={v=>setDraft(d=>d?{...d,[f.key]:v}:d)} /> : f.options ? <select className={`${inputCls} bg-card`} value={draft[f.key] || f.options[0]?.value} onChange={e=>setDraft({...draft,[f.key]:e.target.value})}>{f.options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select> : f.type==='boolean' ? <input type="checkbox" checked={draft[f.key]==='true'} onChange={e=>setDraft({...draft,[f.key]:String(e.target.checked)})} className="ml-2" /> : f.type === 'textarea' ? <textarea className={`${inputCls} min-h-24`} value={draft[f.key]} onChange={e => setDraft({...draft,[f.key]:e.target.value})} /> : <input readOnly={f.readonly} type={f.type ?? 'text'} className={inputCls} value={draft[f.key]} onChange={e => setDraft({...draft,[f.key]:e.target.value})} />}</label>)}
      <div className="flex gap-2 sm:col-span-2"><Button disabled={busy} type="submit"><Save />जतन करा</Button><Button disabled={busy} variant="outline" type="button" onClick={() => setDraft(null)}><X />रद्द</Button></div>
    </form>}
    <div className="divide-y divide-glass-border">
      {rows.filter(r => JSON.stringify(r).toLowerCase().includes(search.toLowerCase())).map(row => <div key={row['id']} className="flex items-start gap-2 py-3">
        <dl className="grid min-w-0 flex-1 gap-1 text-xs sm:grid-cols-2">{fields.map(f => <div key={f.key} className="min-w-0 break-words"><dt className="text-faint">{f.label}</dt><dd className="whitespace-pre-wrap">{f.type==='image' ? (row[f.key] ? 'फोटो जोडला आहे' : '—') : String(row[f.key] ?? '—')}</dd></div>)}</dl>
        <Button variant="ghost" size="icon" disabled={busy} title="संपादन" aria-label="संपादन" onClick={() => edit(row)}><Pencil /></Button>
        {remove && <Button variant="ghost" size="icon" disabled={busy} title="हटवा" aria-label="हटवा" onClick={() => {if(window.confirm('ही नोंद कायमची हटवायची?')) void run(() => remove(row['id']));}}><Trash2 /></Button>}
      </div>)}
      {!rows.length && <p className="py-4 text-sm text-faint">नोंदी नाहीत</p>}
    </div>
  </section>;
}

function ImageUpload({ value, onChange }: { value: string; onChange: (path: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState('');
  useEffect(() => {
    if (!value) { setPreview(''); return; }
    if (/^https?:\/\//.test(value)) { setPreview(value); return; }
    void supabase.storage.from('ad-images').createSignedUrl(value, 3600).then(({ data }) => setPreview(data?.signedUrl ?? ''));
  }, [value]);
  async function upload(file: File) {
    if (!file.type.startsWith('image/')) { toast.error('फक्त फोटो निवडा'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('फोटो 5MB पेक्षा लहान असावा'); return; }
    setBusy(true);
    const path = `${crypto.randomUUID()}.${file.name.split('.').pop()?.toLowerCase() || 'jpg'}`;
    const { error } = await supabase.storage.from('ad-images').upload(path, file, { contentType: file.type });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    onChange(path); toast.success('फोटो अपलोड झाला');
  }
  return <div className="mt-1 space-y-2">
    {preview && <img src={preview} alt="जाहिरात फोटो" className="h-24 w-full rounded-md object-cover" />}
    <div className="flex gap-2">
      <label className="inline-flex cursor-pointer items-center rounded-md border border-glass-border px-3 py-1.5 text-xs font-semibold">
        {busy ? 'अपलोड होत आहे…' : value ? 'फोटो बदला' : 'फोटो अपलोड करा'}
        <input type="file" accept="image/*" className="sr-only" disabled={busy} onChange={e => { const f = e.target.files?.[0]; if (f) void upload(f); e.target.value=''; }} />
      </label>
      {value && <Button type="button" size="sm" variant="outline" onClick={() => onChange('')}>फोटो काढा</Button>}
    </div>
  </div>;
}

const assert = (error: {message:string} | null) => { if(error) throw new Error(error.message); };
export function AdminManagement({ admin }: {admin:boolean}) {
  const [profiles,setProfiles] = useState<Row[]>([]);
  const [content,setContent] = useState<Row[]>([]);
  const [payments,setPayments] = useState<Row[]>([]);
  const [access,setAccess] = useState<Row[]>([]);
  const [tab,setTab] = useState('profiles');
  async function load() {
    const [p,c,m,a] = await Promise.all([supabase.from('profiles').select('*'),supabase.from('app_content').select('*').order('created_at',{ascending:false}),supabase.from('payment_records').select('*'),supabase.from('account_access').select('*')]);
    assert(p.error); assert(c.error); assert(m.error); assert(a.error);
    setProfiles(p.data ?? []); setContent((c.data ?? []).map(r => ({...r,...(r['data'] as Record<string,unknown>)}))); setPayments(m.data ?? []); setAccess((a.data ?? []).map(r => ({...r,id:r['user_id']})));
  }
  useEffect(() => { void load().catch(e => toast.error(e.message)); }, []);
  const finish = async (error:{message:string}|null) => {assert(error); await load(); await refreshCloud();};
  const profileFields = [{key:'name',label:'नाव'},{key:'phone',label:'मोबाईल'},{key:'contact_email',label:'संपर्क ईमेल',type:'email'},{key:'district_id',label:'जिल्हा ID'},{key:'constituency',label:'विधानसभा'},{key:'address',label:'पत्ता'},{key:'bio',label:'परिचय',type:'textarea'},{key:'avatar',label:'फोटो URL',type:'url'},{key:'id',label:'पत्रकार ID',readonly:true},{key:'created_at',label:'खाते तयार झाले',readonly:true}];
  return <div className="space-y-3">
    <div className="flex flex-wrap gap-2">{[['profiles','पत्रकार'],['category','Categories'],['district','जिल्हे'],['advertisement','जाहिराती'],['live','Live'],['bulletin','बुलेटिन'],...(admin ? [['payments','मानधन'],['access','खाते प्रवेश']] : [])].map(([key,label]) => <Button key={key} size="sm" variant={tab===key?'default':'outline'} onClick={() => setTab(key ?? 'profiles')}>{label}</Button>)}</div>
    {tab==='profiles' && <RecordManager title="पत्रकारांची संपूर्ण माहिती" rows={profiles} fields={profileFields} create={false} save={async(d,id)=>{ if(!admin) throw new Error('Admin परवानगी आवश्यक'); const {error}=await supabase.from('profiles').update({name:d['name'] ?? '',phone:d['phone'] ?? '',contact_email:d['contact_email'] ?? '',district_id:d['district_id'] ?? '',constituency:d['constituency'] ?? '',address:d['address'] ?? '',bio:d['bio'] ?? '',avatar:d['avatar'] ?? ''}).eq('id',id ?? '').select('id').single(); await finish(error); }} />}
    {tab==='advertisement' && <RecordManager key="ads" title="जाहिराती (AD)" rows={content.filter(r=>r['kind']==='advertisement')} fields={[{key:'name',label:'जाहिरातदार / शीर्षक'},{key:'text',label:'जाहिरात मजकूर',type:'textarea'},{key:'image',label:'जाहिरात फोटो',type:'image'},{key:'url',label:'क्लिक लिंक',type:'url'},{key:'placement',label:'जागा (Placement)',options:AD_PLACEMENTS.map(o=>({...o}))},{key:'size',label:'आकार (Size)',options:AD_SIZES.map(o=>({...o}))},{key:'active',label:'चालू',type:'boolean'}]} save={async(d,id)=>{const {error}=await supabase.from('app_content').upsert({...(id?{id}:{}),kind:'advertisement',name:d['name'] ?? '',active:d['active']!=='false',data:{text:d['text'] ?? '',image:d['image'] ?? '',url:d['url'] ?? '',placement:d['placement'] || 'home_feed',size:d['size'] || 'small'}}).select('id').single(); await finish(error);}} remove={async id=>{const {error}=await supabase.from('app_content').delete().eq('id',id).select('id').single();await finish(error);}} />}
    {tab==='category' && <RecordManager key="cats" title="Categories व उप-वर्ग" rows={content.filter(r=>r['kind']==='category').map(r=>({...r,parent:String(r['parent'] ?? '')}))} fields={[{key:'name',label:'वर्गाचे नाव'},{key:'parent',label:'मुख्य वर्ग (उप-वर्गासाठी निवडा)',options:[{value:'',label:'— हा मुख्य वर्ग आहे —'},...content.filter(r=>r['kind']==='category'&&!r['parent']).map(r=>({value:String(r['name']),label:String(r['name'])}))]},{key:'text',label:'वर्णन',type:'textarea'},{key:'active',label:'चालू',type:'boolean'}]} save={async(d,id)=>{const name=(d['name'] ?? '').trim(); if(!name) throw new Error('वर्गाचे नाव आवश्यक आहे'); if(d['parent']===name) throw new Error('वर्ग स्वतःचा उप-वर्ग असू शकत नाही'); const old=id?content.find(r=>r['id']===id):undefined; const {error}=await supabase.from('app_content').upsert({...(id?{id}:{}),kind:'category',name,active:d['active']!=='false',data:{parent:d['parent'] ?? '',text:d['text'] ?? ''}}).select('id').single(); assert(error); if(old && old['name']!==name){ for(const r of content.filter(r=>r['kind']==='category'&&r['parent']===old['name'])){ const {error:e}=await supabase.from('app_content').update({data:{...(r['data'] as Record<string,unknown>),parent:name}}).eq('id',r['id']); assert(e);} } await finish(null);}} remove={async id=>{const row=content.find(r=>r['id']===id); if(row && content.some(r=>r['kind']==='category'&&r['parent']===row['name'])) throw new Error('आधी या वर्गाचे उप-वर्ग हटवा'); const {error}=await supabase.from('app_content').delete().eq('id',id).select('id').single();await finish(error);}} />}
    {['district','live','bulletin'].includes(tab) && <RecordManager key={tab} title={tab} rows={content.filter(r=>r['kind']===tab)} fields={[{key:'name',label:'नाव / शीर्षक'},{key:'text',label:'मजकूर',type:'textarea'},{key:'url',label:'व्हिडिओ / जाहिरात लिंक',type:'url'},{key:'code',label:'Category / जिल्हा ID'},{key:'newsIds',label:'बुलेटिन बातमी ID (स्वल्पविरामाने)'},{key:'active',label:'चालू',type:'boolean'}]} save={async(d,id)=>{const {error}=await supabase.from('app_content').upsert({...(id?{id}:{}),kind:tab,name:d['name'] ?? '',active:d['active']!=='false',data:{text:d['text'] ?? '',url:d['url'] ?? '',code:d['code'] ?? '',newsIds:d['newsIds'] ?? ''}}).select('id').single(); await finish(error);}} remove={async id=>{const {error}=await supabase.from('app_content').delete().eq('id',id).select('id').single();await finish(error);}} />}
    {admin && tab==='payments' && <RecordManager title="मानधन नोंदी" rows={payments} fields={[{key:'journalist_id',label:'पत्रकार',options:profiles.map(p=>({value:p.id,label:String(p['name'] || p.id)}))},{key:'month',label:'महिना'},{key:'amount',label:'रक्कम ₹',type:'number'},{key:'status',label:'स्थिती',options:[{value:'processing',label:'प्रलंबित'},{value:'paid',label:'दिलेली'}]},{key:'note',label:'टिप्पणी'}]} save={async(d,id)=>{if(!Number.isFinite(Number(d['amount'])) || Number(d['amount'])<0) throw new Error('योग्य रक्कम द्या'); const {error}=await supabase.from('payment_records').upsert({...(id?{id}:{}),journalist_id:d['journalist_id'] ?? '',month:d['month'] ?? '',amount:Number(d['amount']),status:d['status']==='paid'?'paid':'processing',note:d['note'] ?? ''}).select('id').single();await finish(error);}} remove={async id=>{const {error}=await supabase.from('payment_records').delete().eq('id',id).select('id').single();await finish(error);}} />}
    {admin && tab==='access' && <RecordManager title="खाते प्रवेश" rows={access} fields={[{key:'user_id',label:'पत्रकार',options:profiles.map(p=>({value:p.id,label:String(p['name'] || p.id)}))},{key:'suspended',label:'प्रकाशन प्रवेश बंद',type:'boolean'}]} save={async d=>{const {error}=await supabase.from('account_access').upsert({user_id:d['user_id'] ?? '',suspended:d['suspended']==='true'}).select('user_id').single();await finish(error);}} remove={async id=>{const {error}=await supabase.from('account_access').delete().eq('user_id',id).select('user_id').single();await finish(error);}} />}
  </div>;
}