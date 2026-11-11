import { useMemo, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, CloudUpload, Loader2, Play, Upload, Wallet, X, FileVideo, ListChecks, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Glass, GlowButton, Logo, Pill, inputCls } from "@/components/ui/glass";
import { actions, earnings, refreshCloud, useStore } from "@/lib/store";
import { CONSTITUENCIES, DISTRICTS, districtName } from "@/data/maharashtra";
import { CATEGORIES, IMAGES, SAMPLE_VIDEOS } from "@/data/mock";
import type { Category, ClipType, NewsStatus } from "@/types";
import { AccountForm } from '@/components/AccountForm';
import { supabase } from '@/integrations/supabase/client';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { ProfileEditor } from './ProfileEditor';
import { sampleNews } from '@/lib/sample-news';

const CLIPS: { k: ClipType; t: string; d: string; sec: string }[] = [
  { k: "location", t: "Location Visual", d: "10 सेकंद", sec: "0:10" },
  { k: "anchor", t: "Anchoring", d: "20 सेकंद", sec: "0:20" },
  { k: "byte1", t: "First Byte", d: "60 सेकंद", sec: "1:00" },
  { k: "byte2", t: "Second Byte", d: "60 सेकंद", sec: "1:00" },
];
const ME = "j1";
type JTab = "upload" | "list" | "earn" | "profile";

export function JournalistApp() {
  const userId = useStore(s => s.userId);
  const ready = useStore(s => s.ready);
  const profileError = useStore(s => s.profileError);
  const [tab, setTab] = useState<JTab>("upload");
  const [history, setHistory] = useState<JTab[]>([]);
  const me = useStore((s) => s.journalists.find((j) => j.id === userId));
  const mine = useStore((s) => s.news.filter((n) => n.reporterId === userId));
  if (!ready) return <p className="p-4">कृपया थांबा…</p>;
  if (!userId) return <AccountForm />;
  if (!me) return profileError ? <div className="space-y-3 p-4" role="alert"><p>प्रोफाइल लोड झाली नाही.</p><Button onClick={() => void refreshCloud()}>पुन्हा प्रयत्न करा</Button></div> : <p className="p-4">प्रोफाइल लोड होत आहे…</p>;
  // In-app back: previous section first, and the login screen once at the start.
  const go = (k: JTab) => { setHistory((h) => [...h, tab]); setTab(k); };
  const back = () => {
    const prev = history.at(-1);
    setHistory((h) => h.slice(0, -1));
    if (prev) setTab(prev);
    else setTab('upload');
  };
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 space-y-3 px-3 pb-4">
      <div className="flex items-center gap-2 py-1">
        <button onClick={back} aria-label="मागें" title="मागें" className="glass grid size-8 shrink-0 place-items-center rounded-xl text-muted-foreground transition hover:border-primary/50 hover:text-foreground active:scale-95"><ArrowLeft className="size-4" /></button>
        <h2 className="flex-1 text-center font-bold">पत्रकार पोर्टल</h2>
        <span className="w-8" />
      </div>
      <Glass className="flex items-center gap-3 p-3">
        <UserRound className="size-10 text-neon" />
        <div className="flex-1 text-xs">
          <div className="text-sm font-bold">{me.name}</div>
          <div className="text-muted-foreground">{me.role}</div>
          <div className="text-faint">{me.districtId ? districtName(me.districtId) : 'जिल्हा निवडलेला नाही'}</div>
        </div>
        <Pill tone="green">सक्रिय</Pill>
      </Glass>
      <div className="grid grid-cols-2 gap-2">
        <Glass className="p-2.5 text-center"><div className="text-xl font-bold">{mine.length}</div><div className="text-[10px] text-muted-foreground">एकूण सबमिट</div></Glass>
        <Glass red className="p-2.5 text-center"><div className="text-xl font-bold">{mine.filter((n) => ['approved','broadcasted'].includes(n.status)).length}</div><div className="text-[10px] text-muted-foreground">मंजूर बातम्या</div></Glass>
      </div>
      {tab === "upload" && <UploadForm onDone={() => setTab("list")} />}
      {tab === "list" && <MyUploads />}
      {tab === "earn" && <Earnings />}
      {tab === "profile" && <ProfileEditor />}
      </div>
      <nav className="sticky bottom-0 z-30 flex justify-around border-t border-glass-border bg-card/95 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 text-[10px] backdrop-blur">
        {([["upload", CloudUpload, "अपलोड"], ["list", ListChecks, "माझे अपलोड"], ["earn", Wallet, "कमाई"], ["profile", UserRound, "प्रोफाइल"]] as const).map(([k, I, l]) => (
          <button key={k} onClick={() => go(k)} className={`flex flex-col items-center gap-0.5 ${tab === k ? "text-neon" : "text-muted-foreground"}`}><I className="size-5" />{l}</button>
        ))}
      </nav>
    </div>
  );
}

function UploadForm({ onDone }: { onDone: () => void }) {
  const userId = useStore(s => s.userId);
  const paths = useRef<Partial<Record<ClipType,string>>>({});
  const content = useStore(s=>s.content.filter(c=>c.active));
  const availableCategories = content.filter(c=>c.kind==='category').map(c=>c.name);
  const availableDistricts = content.filter(c=>c.kind==='district').map(c=>({id:String(c.data['code']||c.name),name:c.name}));
  const [prog, setProg] = useState<Record<ClipType, number>>({ location: 0, anchor: 0, byte1: 0, byte2: 0 });
  const [preview, setPreview] = useState<{ k: ClipType; url: string } | null>(null);
  const [urls, setUrls] = useState<Partial<Record<ClipType, string>>>({});
  const [script, setScript] = useState("");
  const [headline, setHeadline] = useState("");
  const [textOnly, setTextOnly] = useState(false);
  const [district, setDistrict] = useState("satara");
  const seats = useMemo(() => CONSTITUENCIES.filter((c) => c.districtId === district), [district]);
  const [seat, setSeat] = useState("कराड दक्षिण");
  const [cat, setCat] = useState<Category>("शेती");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pending = useRef<ClipType | null>(null);
  const words = script.trim() ? script.trim().split(/\s+/).length : 0;

  const startUpload = async (k: ClipType, file: File) => {
    if (!userId) return;
    if (!file.type.startsWith('video/')) { toast.error('व्हिडिओ फाइल निवडा'); return; }
    setProg(s => ({...s,[k]:1}));
    const path = `${userId}/${crypto.randomUUID()}/${k}.${file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g,'') || 'mp4'}`;
    const {error} = await supabase.storage.from('news-clips').upload(path,file,{contentType:file.type});
    if(error) { setProg(s=>({...s,[k]:0})); toast.error(error.message); return; }
    paths.current[k]=path;
    const {data} = await supabase.storage.from('news-clips').createSignedUrl(path,3600);
    setUrls(u=>({...u,[k]:data?.signedUrl})); setProg(s=>({...s,[k]:100}));
  };
  const pick = (k: ClipType) => { pending.current = k; fileRef.current?.click(); };

  const submit = async () => {
    const missing = CLIPS.filter((c) => prog[c.k] < 100);
    if (!textOnly && missing.length) { toast.error(`अनिवार्य क्लिप बाकी: ${missing.map((m) => m.t).join(", ")}`); return; }
    if (headline.trim().length < 10) { toast.error("कृपया बातमीचे शीर्षक टाका"); return; }
    if (words < 80 || words > 100) { toast.error("स्क्रिप्ट 80 ते 100 शब्दांची असावी"); return; }
    setBusy(true);
    try {
      const id = await actions.submitNews({ id:'', headline: headline.trim(), script: script.trim(), category: cat, districtId: district, constituency: seat, reporterId: userId ?? '', clipPaths:textOnly ? {} : paths.current,
        createdAt: new Date().toISOString(), status: "pending", importance: "normal", image: IMAGES.farmer,
        clips: { location: !textOnly, anchor: !textOnly, byte1: !textOnly, byte2: !textOnly }, urgent: false, aiVoice: false, views: 0 });
      setDone(id);
    } catch(e) { toast.error(e instanceof Error ? e.message : 'अपलोड अयशस्वी'); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-bold">नवीन बातमी अपलोड करा</h3>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="बातमी प्रकार">
        <Button variant={textOnly ? 'outline' : 'default'} aria-pressed={!textOnly} disabled={busy} onClick={() => setTextOnly(false)}><FileVideo />व्हिडिओ बातमी</Button>
        <Button variant={textOnly ? 'default' : 'outline'} aria-pressed={textOnly} disabled={busy || Object.values(prog).some(p => p > 0 && p < 100)} onClick={() => setTextOnly(true)}><ListChecks />मजकूर बातमी</Button>
      </div>
      <input ref={fileRef} type="file" accept="video/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f && pending.current) void startUpload(pending.current, f); e.target.value = ""; }} />
      {!textOnly && CLIPS.map((c, i) => {
        const p = prog[c.k];
        return (
          <Glass key={c.k} className="flex items-center gap-2.5 p-2">
            <span className="grid size-6 place-items-center rounded-full bg-primary text-xs font-bold">{i + 1}</span>
            <div className="flex-1 text-xs"><div className="font-semibold">{c.t} <span className="text-neon">*</span></div><div className="text-faint">({c.d})</div>
              {p > 0 && p < 100 && <div className="mt-1 h-1 overflow-hidden rounded bg-glass"><div className="h-full bg-primary transition-all" style={{ width: `${p}%` }} /></div>}
            </div>
            {p >= 100 ? (
              <button onClick={() => { const url=urls[c.k]; if(url) setPreview({ k:c.k,url }); }} className="relative">
                <img src={IMAGES.farmer} alt="" className="h-11 w-16 rounded-md object-cover" /><Play className="absolute inset-0 m-auto size-4" />
                <span className="absolute bottom-0 right-0 rounded bg-background/80 px-1 text-[8px]">▶ {c.sec}</span>
              </button>
            ) : (
              <div className="flex gap-1">
                <button onClick={() => pick(c.k)} className="glass rounded-lg px-2 py-1.5 text-[10px]"><Upload className="inline size-3" /> फाइल</button>
              </div>
            )}
            {p >= 100 && <CheckCircle2 className="size-5 text-success" />}
          </Glass>
        );
      })}
      <input className={inputCls} placeholder="बातमीचे शीर्षक" value={headline} onChange={(e) => setHeadline(e.target.value)} maxLength={120} />
      <div className="grid grid-cols-2 gap-2">
        <select className={`${inputCls} bg-card`} value={district} onChange={(e) => { setDistrict(e.target.value); setSeat(CONSTITUENCIES.find((c) => c.districtId === e.target.value)?.name ?? ''); }}>
          {(availableDistricts.length?availableDistricts:DISTRICTS).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className={`${inputCls} bg-card`} value={seat} onChange={(e) => setSeat(e.target.value)}>
          {seats.map((c) => <option key={c.id}>{c.name}</option>)}
        </select>
      </div>
      <select className={`${inputCls} bg-card`} value={cat} onChange={(e) => setCat(e.target.value as Category)}>{(availableCategories.length?availableCategories:CATEGORIES).map((c) => <option key={c}>{c}</option>)}</select>
      <div>
        <div className="mb-1 text-xs font-semibold">बातमीची स्क्रिप्ट <span className="text-faint">(80 - 100 शब्द)</span></div>
        <textarea className={`${inputCls} h-24 resize-none`} value={script} onChange={(e) => setScript(e.target.value)} placeholder="सातारा जिल्ह्यातील कराड तालुक्यातील..." />
        <div className="flex justify-between text-[10px] text-faint">
          <button className="text-neon" onClick={() => { setHeadline(sampleNews.headline); setScript(sampleNews.script); }}>नमुना भरा</button>
          <span className={words > 100 ? "text-neon" : ""}>{words} / 100 शब्द · {script.length} अक्षरे</span>
        </div>
      </div>
      <GlowButton className="w-full py-3 text-base" onClick={submit} disabled={busy}>
        {busy ? <Loader2 className="size-5 animate-spin" /> : <CloudUpload className="size-5" />}{busy ? "अपलोड होत आहे..." : "बातमी अपलोड करा"}
      </GlowButton>

      {preview && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-background/80 p-4 backdrop-blur" onClick={() => setPreview(null)}>
          <Glass className="w-full p-2" onClick={(e) => e.stopPropagation()}>
            <div className="mb-1 flex justify-between px-1 text-xs"><span>प्रिव्ह्यू</span><X className="size-4 cursor-pointer" onClick={() => setPreview(null)} /></div>
            <video src={preview.url} controls autoPlay muted className="w-full rounded-lg" />
          </Glass>
        </div>
      )}
      {done && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-background/80 p-6 backdrop-blur">
          <Glass red className="w-full p-5 text-center animate-in zoom-in-95">
            <CheckCircle2 className="mx-auto size-14 text-success" />
            <h3 className="mt-3 text-lg font-bold">बातमी यशस्वीरीत्या अपलोड झाली!</h3>
            <p className="mt-1 text-xs text-muted-foreground">ट्रॅकिंग आयडी</p>
            <p className="font-mono text-xl font-bold text-neon">{done}</p>
            <p className="mt-2 text-xs text-muted-foreground">संपादकीय मंजुरीसाठी पाठवली. Admin Panel → News Approvals मध्ये पहा.</p>
            <GlowButton className="mt-4 w-full" onClick={() => { setDone(null); onDone(); }}>माझे अपलोड पहा</GlowButton>
          </Glass>
        </div>
      )}
    </div>
  );
}

const statusMeta: Record<NewsStatus, { l: string; tone: "amber" | "green" | "red" | "gray" }> = {
  pending: { l: "प्रलंबित", tone: "amber" }, approved: { l: "मंजूर", tone: "green" }, rejected: { l: "नाकारली", tone: "red" },
  revision: { l: "सुधारणा हवी", tone: "amber" }, broadcasted: { l: "प्रसारित", tone: "red" },
};
export { statusMeta };

function MyUploads() {
  const [f, setF] = useState<NewsStatus | "all">("all");
  const mine = useStore((s) => s.news.filter((n) => n.reporterId === s.userId));
  const list = mine.filter((n) => f === "all" || n.status === f || (f === "rejected" && n.status === "revision"));
  return (
    <div className="space-y-2">
      <div className="flex gap-1 overflow-x-auto">
        {(["all", "pending", "approved", "rejected", "broadcasted"] as const).map((k) => (
          <button key={k} onClick={() => setF(k)} className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] ${f === k ? "bg-primary" : "glass text-muted-foreground"}`}>{k === "all" ? "सर्व" : statusMeta[k].l}</button>
        ))}
      </div>
      {list.map((n) => (
        <Glass key={n.id} className="p-2.5 text-xs">
          <div className="flex items-start gap-2"><FileVideo className="mt-0.5 size-4 text-neon" /><div className="flex-1 font-semibold">{n.headline}</div><Pill tone={statusMeta[n.status].tone}>{statusMeta[n.status].l}</Pill></div>
          <div className="mt-1 text-faint">{n.id} · {n.constituency}</div>
          {n.feedback && <div className="mt-1.5 rounded-lg bg-primary/10 p-2 text-neon">संपादक: {n.feedback}</div>}
        </Glass>
      ))}
      {!list.length && <p className="py-6 text-center text-xs text-faint">काहीही नाही</p>}
    </div>
  );
}

function Earnings() {
  const p = useStore((s) => s.payments.find((x) => x.journalistId === s.userId));
  if (!p) return <Glass className="p-4 text-sm">मानधन नोंद उपलब्ध नाही. पेमेंट सेवा अद्याप जोडलेली नाही.</Glass>;
  return (
    <Glass red className="space-y-2 p-4 text-sm">
      <div className="font-bold">मासिक कमाई · {p.month}</div>
      {[["निश्चित मानधन", p.base], [`मंजूर बातम्या (${p.stories} × ₹200)`, p.stories * 200], [`एक्सक्लुझिव्ह (${p.exclusives} × ₹500)`, p.exclusives * 500]].map(([l, v]) => (
        <div key={l as string} className="flex justify-between text-xs"><span className="text-muted-foreground">{l}</span><span>₹{(v as number).toLocaleString("en-IN")}</span></div>
      ))}
      <div className="flex justify-between border-t border-glass-border pt-2 font-bold"><span>एकूण</span><span className="text-neon">₹{earnings(p).toLocaleString("en-IN")}</span></div>
      <Pill tone={p.status === "paid" ? "green" : "amber"}>{p.status === "paid" ? "Paid" : "Processing"}</Pill>
    </Glass>
  );
}
