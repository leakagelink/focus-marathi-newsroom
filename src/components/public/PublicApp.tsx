import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Bell, Bookmark, Building2, CalendarDays, Clapperboard, Home, Landmark, MapPin, Megaphone, Mic, Play, Search, Share2, Tv, UserRound, Users, Zap } from "lucide-react";
import { toast } from "sonner";
import { Glass, LiveDot, Logo, Pill } from "@/components/ui/glass";
import { useStore } from "@/lib/store";
import { DISTRICTS, districtName } from "@/data/maharashtra";
import { IMAGES } from "@/data/mock";
import type { NewsArticle } from "@/types";
import { NewsAudio } from './NewsAudio';
import { hasPublishedBulletin, isPublished } from '@/lib/public-news';
import { NewsVideo } from '@/components/NewsVideo';
import { Button } from '@/components/ui/button';
import { BreakingNewsBar } from './BreakingNewsBar';

const tabs = ["Home", "Live TV", "महाराष्ट्र", "जिल्हे", "विधानसभा"] as const;
const tiles = [
  { icon: Landmark, label: "विधानसभा बातम्या", tab: "विधानसभा" }, { icon: MapPin, label: "जिल्हा बातम्या", tab: "जिल्हे" },
  { icon: Zap, label: "सुपरफास्ट 100", tab: "superfast" }, { icon: Clapperboard, label: "Live कार्यक्रम", tab: "Live TV" },
  { icon: Play, label: "व्हिडिओ शॉर्ट न्यूज", tab: "Home" }, { icon: Mic, label: "विशेष मुलाखत", tab: "Home" },
  { icon: Megaphone, label: "जाहिराती", tab: "ad" }, { icon: Users, label: "माझा प्रतिनिधी", tab: "rep" },
];

const timeAgo = (iso: string) => { const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000); return m < 60 ? `${m} मिनिटांपूर्वी` : `${Math.round(m / 60)} तासांपूर्वी`; };

export function PublicApp() {
  const [splash, setSplash] = useState(true);
  const [tab, setTab] = useState<string>("Home");
  const [history, setHistory] = useState<string[]>([]);
  const [open, setOpen] = useState<NewsArticle | null>(null);
  const [district, setDistrict] = useState("all");
  const news = useStore((s) => s.news);
  const content = useStore(s=>s.content.filter(c=>c.active));
  const categories = content.filter(c=>c.kind==='category');
  const districts = content.filter(c=>c.kind==='district');
  const liveUrl = String(content.find(c=>c.kind==='live')?.data['url'] ?? '');
  const bulletinIds = content.filter(c=>c.kind==='bulletin').flatMap(c=>String(c.data['newsIds'] ?? '').split(',').map(id=>id.trim()).filter(Boolean));
  const breaking = useStore((s) => s.breaking);
  const ads = useStore((s) => s.ads.filter((a) => a.active));
  const bulletin = useStore((s) => s.bulletin);
  const published = useStore((s) => s.bulletinPublished);
  const onAir = useStore(s => s.onAir);
  const nowPlaying = useStore((s) => s.news.find((n) => n.id === s.nowPlaying));
  useEffect(() => { const t = setTimeout(() => setSplash(false), 1800); return () => clearTimeout(t); }, []);

  // In-app back stack: every screen opened from another one can be returned from.
  const go = (t: string) => { setHistory((h) => [...h, tab]); setTab(t); };
  const back = () => { const prev = history.at(-1) ?? "Home"; setHistory((h) => h.slice(0, -1)); setTab(prev); };

  const live = useMemo(() => news.filter((n) => isPublished(n.status))
    .filter((n) => district === "all" || n.districtId === district).filter(n=>!tab.startsWith('category:')||n.category===tab.slice(9)), [news, district, tab]);

  if (splash) return (
    <button onClick={() => setSplash(false)} className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden text-center">
      <img src={IMAGES.vidhan} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-linear-to-b from-primary/40 via-background/60 to-background" />
      <div className="relative animate-in fade-in zoom-in-95 duration-700">
        <Logo size="lg" />
        <p className="mt-6 text-[11px] font-semibold tracking-[0.3em] text-muted-foreground">MAHARASHTRA'S<br />DIGITAL NEWS NETWORK</p>
        <p className="mt-10 px-8 text-lg font-semibold leading-relaxed">महाराष्ट्राच्या प्रत्येक विधानसभा क्षेत्राची बातमी, आता एका मंचावर...</p>
      </div>
      <span className="absolute bottom-8 z-10 rounded-full glass px-3 py-1 text-[11px] text-muted-foreground">स्पर्श करून पुढे जा →</span>
    </button>
  );

  if (open && news.some(n=>n.id===open.id && isPublished(n.status))) return <Detail key={open.id} n={news.find(n=>n.id===open.id) ?? open} onBack={() => setOpen(null)} adName={ads[0]?.advertiser} />;

  return (
    <div className="relative flex min-h-full flex-col">
      <div className="flex-1 pb-4">
      <div className="flex items-center justify-between px-4 py-2">
        {tab !== "Home" || history.length > 0 ? (
          <button onClick={back} aria-label="मागें" title="मागें" className="glass grid size-8 shrink-0 place-items-center rounded-xl text-muted-foreground transition hover:border-primary/50 hover:text-foreground active:scale-95"><ArrowLeft className="size-4" /></button>
        ) : (
          <span className="text-lg">☰</span>
        )}
        <Logo size="sm" />
        <div className="flex gap-3"><Search className="size-5" /><Bell className="size-5" onClick={() => toast("🔔 सूचना चालू आहेत")} /></div>
      </div>
      <div className="flex gap-1.5 overflow-x-auto px-3 pb-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => go(t)} className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold ${tab === t ? "bg-primary text-primary-foreground" : "glass text-muted-foreground"}`}>{t}</button>
        ))}
      </div>

      {categories.length>0 && <div className="flex gap-2 overflow-x-auto px-3 pb-2">{categories.map(c=><button key={c.id} className="glass shrink-0 rounded-md px-3 py-1 text-xs" onClick={()=>go(`category:${c.name}`)}>{c.name}</button>)}</div>}
      {tab.startsWith('category:') && <div className="px-3"><List title={tab.slice(9)} items={live} onOpen={setOpen} /></div>}

      {(tab === "Home" || tab === "Live TV" || tab === "महाराष्ट्र") && (
        <div className="space-y-3 px-3">
          <div>
          <div className="relative overflow-hidden rounded-t-lg border border-primary/40">
            {liveUrl && /^https:\/\//.test(liveUrl) ? <video controls playsInline src={liveUrl} poster={IMAGES.studio} className="aspect-video w-full" /> : <img src={IMAGES.studio} alt="FOCUS 24 studio preview" className="aspect-video w-full object-cover" />}
            <div aria-label="व्हिडिओवरील FOCUS 24 लोगो" className="pointer-events-none absolute right-2 top-2 z-10"><Logo size="sm" /></div>
            {!liveUrl && <div className="pointer-events-none absolute bottom-2 left-2"><Pill tone="gray">प्रसारण जोडलेले नाही</Pill></div>}
            <div className="pointer-events-none absolute top-2 left-2 max-w-[calc(100%-4.5rem)] bg-background/80 p-2 text-xs font-semibold break-words">
              {nowPlaying ? nowPlaying.headline : "FOCUS 24 NEWS मराठी"}
            </div>
          </div>
          <BreakingNewsBar items={breaking} />
          </div>
          {tab === "Home" && (
            <div className="grid grid-cols-4 gap-2">
              {tiles.map((t) => (
                <button key={t.label} onClick={() => t.tab === "ad" ? toast(`जाहिरात: ${ads[0]?.advertiser ?? "—"}`) : t.tab === "rep" ? toast("तुमचे प्रतिनिधी: राजेश पाटील (कराड दक्षिण)") : go(t.tab)}
                  className="glass flex flex-col items-center gap-1 rounded-xl p-2 text-center text-[10px] leading-tight transition hover:border-primary/50">
                  <t.icon className="size-5 text-neon" />{t.label}
                </button>
              ))}
            </div>
          )}
          {ads[0] && <Glass className="flex items-center justify-between p-2.5 text-xs"><span><Pill tone="amber">AD</Pill> {ads[0].advertiser}</span><span className="text-faint">प्रायोजित</span></Glass>}
          <List title="ताज्या बातम्या" items={live} onOpen={setOpen} />
        </div>
      )}

      {(tab === "जिल्हे" || tab === "विधानसभा") && (
        <div className="space-y-3 px-3">
          <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full rounded-xl glass bg-card px-3 py-2 text-sm">
            <option value="all">सर्व जिल्हे (36)</option>
            {(districts.length ? districts.map(d=>({id:String(d.data['code']||d.name),name:d.name})) : DISTRICTS).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <List title={tab === "जिल्हे" ? "जिल्हा बातम्या" : "विधानसभा बातम्या"} items={live} onOpen={setOpen} showSeat={tab === "विधानसभा"} />
        </div>
      )}

      {tab === "superfast" && (
        <div className="space-y-2 px-3">
          <Glass red className="p-3"><div className="flex items-center gap-2 font-bold"><Zap className="size-5 text-neon" />सुपरफास्ट 100</div>
            <p className="text-xs text-muted-foreground">{hasPublishedBulletin(bulletinIds.length ? bulletinIds : published ? bulletin : [], news) ? "आजचे बुलेटिन प्रकाशित ✓" : "पुढील बुलेटिन लवकरच..."}</p></Glass>
          {(bulletinIds.length?bulletinIds:bulletin).map((id, i) => { const n = news.find((x) => x.id === id && isPublished(x.status)); return n && (
            <button key={id} onClick={() => setOpen(n)} className="glass flex w-full items-center gap-2 rounded-xl p-2 text-left text-xs">
              <span className="w-6 text-center font-bold text-neon">{i + 1}</span>{n.headline}
            </button>); })}
        </div>
      )}

      </div>
      <nav className="sticky bottom-0 z-30 flex justify-around border-t border-glass-border bg-card/95 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 text-[10px] backdrop-blur">
        {[{ i: Home, l: "Home" }, { i: Tv, l: "Live TV" }, { i: Play, l: "Shorts" }, { i: Building2, l: "जिल्हे" }, { i: UserRound, l: "Profile" }].map(({ i: I, l }) => (
          <button key={l} onClick={() => go(l === "Shorts" ? "superfast" : l === "Profile" ? "Home" : l)} className={`flex flex-col items-center gap-0.5 ${tab === l ? "text-neon" : "text-muted-foreground"}`}><I className="size-5" />{l}</button>
        ))}
      </nav>
    </div>
  );
}

function List({ title, items, onOpen, showSeat }: { title: string; items: NewsArticle[]; onOpen: (n: NewsArticle) => void; showSeat?: boolean }) {
  return (
    <div>
      <div className="mb-2 flex justify-between"><h3 className="font-bold">{title}</h3><span className="text-xs text-muted-foreground">सर्व पहा →</span></div>
      <div className="space-y-2">
        {items.length === 0 && <p className="py-6 text-center text-xs text-faint">या भागात अजून बातम्या नाहीत</p>}
        {items.map((n) => (
          <button key={n.id} onClick={() => onOpen(n)} className="glass flex w-full gap-2.5 rounded-xl p-2 text-left transition hover:border-primary/50 animate-in fade-in slide-in-from-bottom-2">
            {Object.values(n.clips).some(Boolean) ? <NewsVideo src={n.clipUrls?.location} label={`${n.headline} प्रिव्ह्यू`} preview className="h-16 w-24 shrink-0 rounded-lg object-cover" /> : <img src={n.image} alt="" loading="lazy" className="h-16 w-24 shrink-0 rounded-lg object-cover" />}
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-[13px] font-semibold leading-snug">{n.headline}</p>
              <p className="mt-1 text-[10px] text-faint">{districtName(n.districtId)}{showSeat && ` · ${n.constituency}`} | {timeAgo(n.createdAt)}</p>
            </div>
            {n.importance === "breaking" && <Pill tone="red">ब्रेकिंग</Pill>}
          </button>
        ))}
      </div>
    </div>
  );
}

function Detail({ n, onBack, adName }: { n: NewsArticle; onBack: () => void; adName?: string | undefined }) {
  const [clip, setClip] = useState(0);
  const hasVideo = Object.values(n.clips).some(Boolean);
  const labels = ["Location", "Anchoring", "First Byte", "Second Byte"];
  const clipKeys = ['location', 'anchor', 'byte1', 'byte2'] as const;
  return (
    <div className="space-y-3 px-3 pb-6 animate-in fade-in slide-in-from-right-4">
      <div className="sticky -top-px z-20 -mx-3 flex items-center gap-2 bg-background/90 px-3 py-2 backdrop-blur">
        <button onClick={onBack} aria-label="मागें" title="मागें" className="glass grid size-8 shrink-0 place-items-center rounded-xl text-muted-foreground transition hover:border-primary/50 hover:text-foreground active:scale-95"><ArrowLeft className="size-4" /></button>
        <h2 className="flex-1 text-center font-bold">बातमीचा तपशील</h2>
        <span className="w-8" />
      </div>
      {hasVideo && <NewsVideo src={n.clipUrls?.[clipKeys[clip] ?? 'location']} label={`${n.headline} — ${labels[clip]}`} autoPlay className="aspect-video w-full rounded-lg object-contain" />}
      <h1 className="text-lg font-bold leading-snug">{n.headline}</h1>
      {!hasVideo && <NewsAudio key={n.id} headline={n.headline} script={n.script} />}
      <div className="flex flex-wrap gap-1.5 text-[11px]">
        <Pill><MapPin className="size-3" />{districtName(n.districtId)}</Pill><Pill><Landmark className="size-3" />{n.constituency}</Pill>
        <Pill><CalendarDays className="size-3" />{new Date(n.createdAt).toLocaleString("mr-IN", { hour: "2-digit", minute: "2-digit" })}</Pill>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{n.script}</p>
      {hasVideo && <><p className="text-xs font-semibold"><span className="text-neon">●</span> संबंधित व्हिडिओ</p>
      <div className="grid grid-cols-4 gap-1.5">
        {labels.map((l, i) => (
          <Button key={l} variant="ghost" aria-pressed={clip===i} onClick={() => setClip(i)} className={`h-auto min-w-0 flex-col gap-1 p-0 text-[9px] ${clip === i ? "text-neon" : "text-muted-foreground"}`}>
            <div className={`relative w-full overflow-hidden rounded-lg border ${clip === i ? "border-primary" : "border-glass-border"}`}><NewsVideo src={n.clipUrls?.[clipKeys[i] ?? 'location']} label={`${l} प्रिव्ह्यू`} preview className="aspect-square w-full object-cover" /><Play className="pointer-events-none absolute inset-0 m-auto size-5" /></div>{l}
          </Button>
        ))}
      </div></>}
      {adName && <Glass className="p-2 text-center text-xs"><Pill tone="amber">AD</Pill> {adName}</Glass>}
      <div className="flex gap-2">
        <button onClick={() => { navigator.clipboard?.writeText(`${n.headline} — FOCUS 24 NEWS`); toast("लिंक कॉपी केली"); }} className="glass flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-xs"><Share2 className="size-4" />Share</button>
        <button onClick={() => toast.success("बुकमार्क केले")} className="glass flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-xs"><Bookmark className="size-4" />Save</button>
      </div>
      <button onClick={onBack} className="glass flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-muted-foreground transition hover:border-primary/50 hover:text-foreground active:scale-[0.98]"><ArrowLeft className="size-4" />मागें</button>
    </div>
  );
}
