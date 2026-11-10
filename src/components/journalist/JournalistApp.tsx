import { useMemo, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, CloudUpload, Loader2, Play, Upload, Wallet, X, FileVideo, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { Glass, GlowButton, Logo, Pill, inputCls } from "@/components/ui/glass";
import { actions, earnings, useStore } from "@/lib/store";
import { CONSTITUENCIES, DISTRICTS, districtName } from "@/data/maharashtra";
import { CATEGORIES, IMAGES, SAMPLE_VIDEOS } from "@/data/mock";
import type { Category, ClipType, NewsStatus } from "@/types";

const CLIPS: { k: ClipType; t: string; d: string; sec: string }[] = [
  { k: "location", t: "Location Visual", d: "10 सेकंद", sec: "0:10" },
  { k: "anchor", t: "Anchoring", d: "20 सेकंद", sec: "0:20" },
  { k: "byte1", t: "First Byte", d: "60 सेकंद", sec: "1:00" },
  { k: "byte2", t: "Second Byte", d: "60 सेकंद", sec: "1:00" },
];
const ME = "j1";
type JTab = "upload" | "list" | "earn";

export function JournalistApp() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<JTab>("upload");
  const [history, setHistory] = useState<JTab[]>([]);
  const me = useStore((s) => s.journalists.find((j) => j.id === ME)!);
  const mine = useStore((s) => s.news.filter((n) => n.reporterId === ME));
  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  // In-app back: previous section first, and the login screen once at the start.
  const go = (k: JTab) => { setHistory((h) => [...h, tab]); setTab(k); };
  const back = () => {
    const prev = history.at(-1);
    setHistory((h) => h.slice(0, -1));
    if (prev) setTab(prev);
    else setAuthed(false);
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
        <img src={me.avatar} alt="" className="size-12 rounded-full" />
        <div className="flex-1 text-xs">
          <div className="text-sm font-bold">{me.name}</div>
          <div className="text-muted-foreground">{me.role}</div>
          <div className="text-faint">{me.code} (कराड दक्षिण) · {districtName(me.districtId)}</div>
        </div>
        <Pill tone="green">सक्रिय</Pill>
      </Glass>
      <div className="grid grid-cols-2 gap-2">
        <Glass className="p-2.5 text-center"><div className="text-xl font-bold">{me.submitted + mine.length - 3}</div><div className="text-[10px] text-muted-foreground">एकूण सबमिट</div></Glass>
        <Glass red className="p-2.5 text-center"><div className="text-xl font-bold">{me.approved + mine.filter((n) => n.status === "approved").length}</div><div className="text-[10px] text-muted-foreground">मंजूर बातम्या</div></Glass>
      </div>
      {tab === "upload" && <UploadForm onDone={() => setTab("list")} />}
      {tab === "list" && <MyUploads />}
      {tab === "earn" && <Earnings />}
      </div>
      <nav className="sticky bottom-0 z-30 flex justify-around border-t border-glass-border bg-card/95 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 text-[10px] backdrop-blur">
        {([["upload", CloudUpload, "अपलोड"], ["list", ListChecks, "माझे अपलोड"], ["earn", Wallet, "कमाई"]] as const).map(([k, I, l]) => (
          <button key={k} onClick={() => go(k)} className={`flex flex-col items-center gap-0.5 ${tab === k ? "text-neon" : "text-muted-foreground"}`}><I className="size-5" />{l}</button>
        ))}
      </nav>
    </div>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [phone, setPhone] = useState("98220 14411");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  return (
    <div className="flex h-full flex-col justify-center gap-4 px-6">
      <div className="text-center"><Logo size="md" /><p className="mt-2 text-xs text-muted-foreground">पत्रकार लॉगिन</p></div>
      <Glass className="space-y-3 p-4">
        <label className="text-xs text-muted-foreground">मोबाइल नंबर</label>
        <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} />
        {sent && <><label className="text-xs text-muted-foreground">OTP (डेमो: 1234)</label>
          <input className={inputCls} value={otp} maxLength={4} onChange={(e) => setOtp(e.target.value)} placeholder="••••" /></>}
        <GlowButton className="w-full" onClick={() => {
          if (!sent) { if (phone.replace(/\D/g, "").length < 10) { toast.error("वैध मोबाइल नंबर टाका"); return; } setSent(true); toast("OTP पाठवला: 1234"); }
          else if (otp === "1234") onDone(); else toast.error("चुकीचा OTP");
        }}>{sent ? "लॉगिन करा" : "OTP पाठवा"}</GlowButton>
      </Glass>
    </div>
  );
}

function UploadForm({ onDone }: { onDone: () => void }) {
  const [prog, setProg] = useState<Record<ClipType, number>>({ location: 0, anchor: 0, byte1: 0, byte2: 0 });
  const [preview, setPreview] = useState<{ k: ClipType; url: string } | null>(null);
  const [urls, setUrls] = useState<Partial<Record<ClipType, string>>>({});
  const [script, setScript] = useState("");
  const [headline, setHeadline] = useState("");
  const [ai, setAi] = useState(true);
  const [district, setDistrict] = useState("satara");
  const seats = useMemo(() => CONSTITUENCIES.filter((c) => c.districtId === district), [district]);
  const [seat, setSeat] = useState("कराड दक्षिण");
  const [cat, setCat] = useState<Category>("शेती");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pending = useRef<ClipType | null>(null);
  const words = script.trim() ? script.trim().split(/\s+/).length : 0;

  const startUpload = (k: ClipType, url: string) => {
    setUrls((u) => ({ ...u, [k]: url }));
    let p = 0;
    const t = setInterval(() => { p += 12 + Math.random() * 18; setProg((s) => ({ ...s, [k]: Math.min(100, p) })); if (p >= 100) clearInterval(t); }, 180);
  };
  const pick = (k: ClipType) => { pending.current = k; fileRef.current?.click(); };

  const submit = () => {
    const missing = CLIPS.filter((c) => prog[c.k] < 100);
    if (missing.length) { toast.error(`अनिवार्य क्लिप बाकी: ${missing.map((m) => m.t).join(", ")}`); return; }
    if (headline.trim().length < 10) { toast.error("कृपया बातमीचे शीर्षक टाका"); return; }
    if (words < 20) { toast.error("स्क्रिप्ट किमान 80 शब्दांची असावी (डेमोसाठी 20+)"); return; }
    setBusy(true);
    setTimeout(() => {
      const id = `F24-${1043 + Math.floor(Math.random() * 900)}`;
      actions.submitNews({ id, headline: headline.trim(), script: script.trim(), category: cat, districtId: district, constituency: seat, reporterId: ME,
        createdAt: new Date().toISOString(), status: "pending", importance: "normal", image: IMAGES.farmer,
        clips: { location: true, anchor: true, byte1: true, byte2: true }, urgent: false, aiVoice: ai, views: 0 });
      setBusy(false); setDone(id);
    }, 1600);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-bold">नवीन बातमी अपलोड करा</h3>
      <input ref={fileRef} type="file" accept="video/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f && pending.current) startUpload(pending.current, URL.createObjectURL(f)); e.target.value = ""; }} />
      {CLIPS.map((c, i) => {
        const p = prog[c.k];
        return (
          <Glass key={c.k} className="flex items-center gap-2.5 p-2">
            <span className="grid size-6 place-items-center rounded-full bg-primary text-xs font-bold">{i + 1}</span>
            <div className="flex-1 text-xs"><div className="font-semibold">{c.t} <span className="text-neon">*</span></div><div className="text-faint">({c.d})</div>
              {p > 0 && p < 100 && <div className="mt-1 h-1 overflow-hidden rounded bg-glass"><div className="h-full bg-primary transition-all" style={{ width: `${p}%` }} /></div>}
            </div>
            {p >= 100 ? (
              <button onClick={() => setPreview({ k: c.k, url: urls[c.k]! })} className="relative">
                <img src={IMAGES.farmer} alt="" className="h-11 w-16 rounded-md object-cover" /><Play className="absolute inset-0 m-auto size-4" />
                <span className="absolute bottom-0 right-0 rounded bg-background/80 px-1 text-[8px]">▶ {c.sec}</span>
              </button>
            ) : (
              <div className="flex gap-1">
                <button onClick={() => pick(c.k)} className="glass rounded-lg px-2 py-1.5 text-[10px]"><Upload className="inline size-3" /> फाइल</button>
                <button onClick={() => startUpload(c.k, SAMPLE_VIDEOS[i] ?? "")} className="rounded-lg bg-primary/20 px-2 py-1.5 text-[10px] text-neon">डेमो</button>
              </div>
            )}
            {p >= 100 && <CheckCircle2 className="size-5 text-success" />}
          </Glass>
        );
      })}
      <input className={inputCls} placeholder="बातमीचे शीर्षक" value={headline} onChange={(e) => setHeadline(e.target.value)} maxLength={120} />
      <div className="grid grid-cols-2 gap-2">
        <select className={`${inputCls} bg-card`} value={district} onChange={(e) => { setDistrict(e.target.value); setSeat(CONSTITUENCIES.find((c) => c.districtId === e.target.value)!.name); }}>
          {DISTRICTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className={`${inputCls} bg-card`} value={seat} onChange={(e) => setSeat(e.target.value)}>
          {seats.map((c) => <option key={c.id}>{c.name}</option>)}
        </select>
      </div>
      <select className={`${inputCls} bg-card`} value={cat} onChange={(e) => setCat(e.target.value as Category)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
      <div>
        <div className="mb-1 text-xs font-semibold">बातमीची स्क्रिप्ट <span className="text-faint">(80 - 100 शब्द)</span></div>
        <textarea className={`${inputCls} h-24 resize-none`} value={script} onChange={(e) => setScript(e.target.value)} placeholder="सातारा जिल्ह्यातील कराड तालुक्यातील..." />
        <div className="flex justify-between text-[10px] text-faint">
          <button className="text-neon" onClick={() => { setHeadline("कराड : अतिवृष्टीग्रस्त शेतकऱ्यांना तातडीची मदत द्या"); setScript("सातारा जिल्ह्यातील कराड तालुक्यातील शेतकऱ्यांनी पिक विमा मिळावा यासाठी तहसील कार्यालयासमोर निवेदन दिले. अतिवृष्टीमुळे सोयाबीन, भात आणि ऊस पिकांचे मोठे नुकसान झाले आहे. शेतकरी संघटनांनी प्रशासनाकडे तातडीने पंचनामे पूर्ण करण्याची मागणी केली आहे. नुकसान भरपाई न मिळाल्यास आंदोलन करण्याचा इशाराही देण्यात आला आहे."); }}>नमुना भरा</button>
          <span className={words > 100 ? "text-neon" : ""}>{words} / 100 शब्द · {script.length} अक्षरे</span>
        </div>
      </div>
      <Glass className="flex items-center justify-between p-3 text-xs">
        <span>🎙️ AI महिला आवाज वापरा (मराठी)</span>
        <button onClick={() => setAi(!ai)} className={`h-6 w-11 rounded-full p-0.5 transition ${ai ? "bg-primary" : "bg-glass"}`}><span className={`block size-5 rounded-full bg-foreground transition ${ai ? "translate-x-5" : ""}`} /></button>
      </Glass>
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
  const mine = useStore((s) => s.news.filter((n) => n.reporterId === ME));
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
  const p = useStore((s) => s.payments.find((x) => x.journalistId === ME)!);
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
