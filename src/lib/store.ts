import { useRef, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { ADS, BREAKING, JOURNALISTS, NEWS, PAYMENTS } from "@/data/mock";
import type { Advertisement, BreakingNews, Journalist, NewsArticle, NewsStatus, Payment, Role } from "@/types";

export type Source = "studio" | "field" | "superfast" | "ads" | "standby";
export interface State {
  role: Role;
  news: NewsArticle[];
  breaking: BreakingNews[];
  ads: Advertisement[];
  journalists: Journalist[];
  payments: Payment[];
  bulletin: string[];
  bulletinPublished: boolean;
  onAir: boolean;
  source: Source;
  overlays: Record<"breaking" | "reporter" | "headline" | "helpline" | "logo", boolean>;
  platforms: Record<"app" | "youtube" | "facebook" | "ott", boolean>;
  nowPlaying?: string | undefined;
  liveViewers: number;
  notifications: { id: string; text: string; kind: "push" | "whatsapp" | "summary"; at: string }[];
}

let state: State = {
  role: "admin",
  news: NEWS, breaking: BREAKING, ads: ADS, journalists: JOURNALISTS, payments: PAYMENTS,
  bulletin: NEWS.filter((n) => n.status === "approved" || n.status === "broadcasted").map((n) => n.id),
  bulletinPublished: false, onAir: true, source: "studio",
  overlays: { breaking: true, reporter: true, headline: false, helpline: false, logo: true },
  platforms: { app: true, youtube: true, facebook: false, ott: true },
  liveViewers: 18432, notifications: [],
};
const subs = new Set<() => void>();
const set = (fn: (s: State) => Partial<State>) => { state = { ...state, ...fn(state) }; subs.forEach((f) => f()); };
export const getState = () => state;
const subscribe = (cb: () => void) => { subs.add(cb); return () => { subs.delete(cb); }; };
export function useStore<T>(sel: (s: State) => T): T {
  // Cache per state snapshot: selectors like filter() return new arrays, which would loop forever.
  const cache = useRef<{ s: State; v: T } | null>(null);
  const get = () => {
    if (!cache.current || cache.current.s !== state) cache.current = { s: state, v: sel(state) };
    return cache.current.v;
  };
  return useSyncExternalStore(subscribe, get, get);
}

const notify = (kind: State["notifications"][number]["kind"], text: string) =>
  set((s) => ({ notifications: [{ id: crypto.randomUUID(), kind, text, at: new Date().toISOString() }, ...s.notifications].slice(0, 30) }));

export const actions = {
  setRole: (role: Role) => set(() => ({ role })),
  submitNews: (n: NewsArticle) => {
    set((s) => ({ news: [n, ...s.news] }));
  },
  updateNews: (id: string, patch: Partial<NewsArticle>) =>
    set((s) => ({ news: s.news.map((n) => (n.id === id ? { ...n, ...patch } : n)) })),
  setStatus: (id: string, status: NewsStatus, feedback?: string) => {
    const n = state.news.find((x) => x.id === id);
    set((s) => ({
      news: s.news.map((x) => (x.id === id ? { ...x, status, feedback, views: status === "approved" ? 1200 : x.views } : x)),
      bulletin: status === "approved" && !s.bulletin.includes(id) ? [...s.bulletin, id] : s.bulletin,
    }));
    const rep = state.journalists.find((j) => j.id === n?.reporterId);
    if (status === "approved") {
      notify("whatsapp", `WhatsApp → ${rep?.name}: तुमची बातमी "${n?.headline}" मंजूर झाली ✅`);
      toast.success("बातमी मंजूर व प्रकाशित", { description: `WhatsApp सूचना ${rep?.name} यांना पाठवली` });
    } else if (status === "broadcasted") {
      set(() => ({ nowPlaying: id }));
      toast.success("प्रसारण रांगेत पाठवली", { description: "Broadcast Studio मध्ये ON AIR" });
    } else if (status === "rejected") toast.error("बातमी नाकारली", { description: feedback });
    else if (status === "revision") toast.warning("पुनर्लेखन विनंती पाठवली", { description: feedback });
  },
  addBreaking: (b: Omit<BreakingNews, "id" | "createdAt">, push: boolean) => {
    set((s) => ({ breaking: [{ ...b, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...s.breaking] }));
    if (push) { notify("push", `🔴 ${b.text}`); toast("🔴 Push notification पाठवली", { description: `${b.region} · 2.4 लाख डिव्हाइस` }); }
  },
  removeBreaking: (id: string) => set((s) => ({ breaking: s.breaking.filter((b) => b.id !== id) })),
  editBreaking: (id: string, text: string) => set((s) => ({ breaking: s.breaking.map((b) => (b.id === id ? { ...b, text } : b)) })),
  setBulletin: (ids: string[]) => set(() => ({ bulletin: ids, bulletinPublished: false })),
  publishBulletin: () => { set(() => ({ bulletinPublished: true })); toast.success("सुपरफास्ट 100 प्रकाशित", { description: "Public App + YouTube export रांगेत" }); },
  setOnAir: (onAir: boolean) => set(() => ({ onAir })),
  setSource: (source: Source) => set(() => ({ source })),
  toggleOverlay: (k: keyof State["overlays"]) => set((s) => ({ overlays: { ...s.overlays, [k]: !s.overlays[k] } })),
  togglePlatform: (k: keyof State["platforms"]) => set((s) => ({ platforms: { ...s.platforms, [k]: !s.platforms[k] } })),
  setNowPlaying: (id?: string) => set(() => ({ nowPlaying: id })),
  tickViewers: () => set((s) => ({ liveViewers: Math.max(9000, s.liveViewers + Math.round((Math.random() - 0.45) * 220)) })),
  addAd: (a: Advertisement) => { set((s) => ({ ads: [a, ...s.ads] })); toast.success("मोहीम तयार झाली"); },
  updateAd: (id: string, p: Partial<Advertisement>) => set((s) => ({ ads: s.ads.map((a) => (a.id === id ? { ...a, ...p } : a)) })),
  addJournalist: (j: Journalist) => { set((s) => ({ journalists: [...s.journalists, j] })); toast.success("नोंदणी अर्ज प्राप्त", { description: "पडताळणीसाठी रांगेत" }); },
  updateJournalist: (id: string, p: Partial<Journalist>) => set((s) => ({ journalists: s.journalists.map((j) => (j.id === id ? { ...j, ...p } : j)) })),
  markPaid: (id: string) => { set((s) => ({ payments: s.payments.map((p) => (p.id === id ? { ...p, status: "paid" } : p)) })); toast.success("पेमेंट पूर्ण म्हणून नोंदवले"); },
  dailySummary: () => {
    const s = state;
    const t = `आजचा संपादकीय सारांश: ${s.news.filter((n) => n.status === "pending").length} प्रलंबित, ${s.news.filter((n) => n.status === "approved").length} मंजूर, ${s.breaking.length} ब्रेकिंग`;
    notify("summary", t); toast(t);
  },
};

export const earnings = (p: Payment) => p.base + p.stories * 200 + p.exclusives * 500;
