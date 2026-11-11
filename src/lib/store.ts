import { useRef, useSyncExternalStore } from "react";
import { toast } from "sonner";

import type { Advertisement, BreakingNews, Journalist, NewsArticle, NewsStatus, Payment, Role } from "@/types";
import { supabase } from '@/integrations/supabase/client';
import { submissionSchema } from './news-validation';
import { IMAGES } from '@/data/mock';
import type { Tables } from '@/integrations/supabase/types';

export type Source = "studio" | "field" | "superfast" | "ads" | "standby";
export interface State {
  content: {id:string;kind:string;name:string;active:boolean;data:Record<string,unknown>}[];
  userId: string | null;
  ready: boolean;
  ownProfile: Tables<'profiles'> | null;
  profileError: boolean;
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
  content: [],
  userId: null, ready: false,
  ownProfile: null, profileError: false,
  role: "public",
  news: [], breaking: [], ads: [], journalists: [], payments: [],
  bulletin: [],
  bulletinPublished: false, onAir: false, source: "standby",
  overlays: { breaking: true, reporter: true, headline: false, helpline: false, logo: true },
  platforms: { app: true, youtube: true, facebook: false, ott: true },
  liveViewers: 0, notifications: [],
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

let refreshVersion = 0;
export async function refreshCloud() {
  const version = ++refreshVersion;
  const { data: { user } } = await supabase.auth.getUser();
  if (version !== refreshVersion) return;
  if (state.userId !== (user?.id ?? null)) {
    set(() => ({ userId: user?.id ?? null, role: 'public', ready: false, ownProfile: null, profileError: false, journalists: [], news: [], payments: [], content: [], ads: [], breaking: [], bulletin: [], bulletinPublished: false, onAir: false }));
  }
  // Account readiness must not wait for unrelated feeds or video URL signing.
  const account = Promise.all([
    user ? supabase.from('user_roles').select('role').eq('user_id', user.id) : Promise.resolve({ data: [], error: null }),
    user ? supabase.from('profiles').select('*') : Promise.resolve({ data: [], error: null }),
  ]).then(([roles, profiles]) => {
    const assigned = roles.data ?? [];
    const role: Role = assigned.some(r => r.role === 'admin') ? 'admin' : assigned.some(r => r.role === 'editor') ? 'editor' : user ? 'journalist' : 'public';
    if (version === refreshVersion) {
      set(() => ({ userId: user?.id ?? null, ready: true, role,
        ownProfile: profiles.data?.find(p => p.id === user?.id) ?? null,
        profileError: !!user && (!!profiles.error || !profiles.data?.some(p => p.id === user.id)),
        journalists: (profiles.data ?? []).map(p => ({ id:p.id,name:p.name,role:'पत्रकार',districtId:p.district_id,constituencyId:p.constituency,avatar:p.avatar,code:'',phone:p.phone,email:p.contact_email,rating:0,submitted:state.news.filter(n=>n.reporterId===p.id).length,approved:state.news.filter(n=>n.reporterId===p.id && ['approved','broadcasted'].includes(n.status)).length,status:'verified' as const })),
      }));
    }
    return { roles, profiles, role };
  });
  const [news, breaking, settings, { profiles, role }, content, payments] = await Promise.all([
    supabase.from('news').select('*').order('created_at', { ascending: false }).limit(500),
    supabase.from('breaking_news').select('*').order('created_at', { ascending: false }),
    user ? supabase.from('broadcast_settings').select('*').eq('id', 'main').maybeSingle() : Promise.resolve({data:null,error:null}),
    account,
    supabase.from('app_content').select('*'),
    user ? supabase.from('payment_records').select('*') : Promise.resolve({data:[]}),
  ]);
  if (version !== refreshVersion) return;
  if (news.error || breaking.error || settings.error) { toast.error('डेटा लोड झाला नाही. पुन्हा प्रयत्न करा.'); return; }
  const mapped: NewsArticle[] = await Promise.all((news.data ?? []).map(async (n) => {
    const paths = n.clip_paths as Partial<Record<import('@/types').ClipType, string>>;
    const clipUrls: Partial<Record<import('@/types').ClipType, string>> = {};
    await Promise.all(Object.entries(paths).map(async ([key, path]) => {
      if (!path) return;
      const { data } = await supabase.storage.from('news-clips').createSignedUrl(path, 3600);
      if (data) clipUrls[key as import('@/types').ClipType] = data.signedUrl;
    }));
    return { id:n.id, headline:n.headline, script:n.script, category:n.category as NewsArticle['category'], districtId:n.district_id, constituency:n.constituency, reporterId:n.reporter_id, createdAt:n.created_at, status:n.status as NewsStatus, importance:n.importance as NewsArticle['importance'], image:n.image || IMAGES.farmer, clips:{location:!!paths.location,anchor:!!paths.anchor,byte1:!!paths.byte1,byte2:!!paths.byte2}, clipPaths:paths, clipUrls, urgent:n.urgent, aiVoice:n.ai_voice, views:n.views, feedback:n.feedback ?? undefined };
  }));
  if (version !== refreshVersion) return;
  set(() => ({ userId:user?.id ?? null, ready:true, role, news:mapped,
    breaking:(breaking.data ?? []).map((b) => ({id:b.id,text:b.text,region:b.region,minutes:b.minutes,createdAt:b.created_at})),
    journalists:(profiles.data ?? []).map((p) => ({id:p.id,name:p.name,role:'पत्रकार',districtId:p.district_id,constituencyId:p.constituency,avatar:p.avatar,code:'',phone:p.phone,email:p.contact_email,rating:0,submitted:mapped.filter(n=>n.reporterId===p.id).length,approved:mapped.filter(n=>n.reporterId===p.id && ['approved','broadcasted'].includes(n.status)).length,status:'verified' as const})),
    content:(content.data ?? []).map(c=>({...c,data:c.data as Record<string,unknown>})),
    payments:(payments.data ?? []).map(p=>({id:p.id,journalistId:p.journalist_id,month:p.month,base:Number(p.amount),stories:0,exclusives:0,status:p.status==='paid'?'paid':'processing'})),
    ads:(content.data ?? []).filter(c=>c.kind==='advertisement'&&c.active).map(c=>({id:c.id,advertiser:c.name,contact:'',type:'display',target:'',start:'',end:'',impressions:0,clicks:0,budget:0,paid:false,active:c.active,url:String((c.data as Record<string,unknown>)['url'] ?? '')})),
    ...(settings.data?.data as Partial<Pick<State,'onAir'|'source'|'overlays'|'platforms'|'nowPlaying'|'bulletin'|'bulletinPublished'>> ?? {}),
  }));
}

const checked = async (request: PromiseLike<{error: {message:string} | null}>) => {
  const result = await request;
  if (result.error) { toast.error(result.error.message); throw new Error(result.error.message); }
};
const saveBroadcast = async (patch: Partial<State>) => {
  try {
    const next = {...state, ...patch};
    await checked(supabase.from('broadcast_settings').upsert({id:'main',data:{onAir:next.onAir,source:next.source,overlays:next.overlays,platforms:next.platforms,nowPlaying:next.nowPlaying ?? null,bulletin:next.bulletin,bulletinPublished:next.bulletinPublished}}));
    set(() => patch);
  } catch { /* Error shown by checked; do not pretend the setting saved. */ }
};

export const actions = {
  setRole: (_role: Role) => {},
  submitNews: async (n: NewsArticle) => {
    if (!state.userId) throw new Error('लॉगिन करा');
    const input = submissionSchema.parse({ ...n, clipPaths:n.clipPaths });
    if (Object.values(input.clipPaths).some(p => !p?.startsWith(`${state.userId}/`))) throw new Error('अवैध क्लिप');
    const {data,error} = await supabase.from('news').insert({reporter_id:state.userId,headline:input.headline,script:input.script,category:input.category,district_id:input.districtId,constituency:input.constituency,clip_paths:input.clipPaths,ai_voice:input.aiVoice}).select('id').single();
    if(error) throw error;
    await refreshCloud(); return data.id;
  },
  updateNews: async (id: string, patch: Partial<NewsArticle>) => {
    const values = { ...(patch.headline !== undefined ? {headline:patch.headline}:{}), ...(patch.script !== undefined ? {script:patch.script}:{}), ...(patch.importance !== undefined ? {importance:patch.importance}:{}) };
    try { await checked(supabase.from('news').update(values).eq('id',id).select('id').single()); set(s=>({news:s.news.map(n=>n.id===id?{...n,...patch}:n)})); } catch {}
  },
  setStatus: async (id: string, status: NewsStatus, feedback?: string) => {
    try { await checked(supabase.from('news').update({status,feedback:feedback ?? null}).eq('id',id).select('id').single()); await refreshCloud(); toast.success('बातमीची स्थिती जतन झाली'); } catch {} return;

  },
  addBreaking: async (b: Omit<BreakingNews, "id" | "createdAt">, push: boolean) => {
    try { await checked(supabase.from('breaking_news').insert(b)); await refreshCloud(); toast.success('ब्रेकिंग बातमी जतन झाली'); } catch {} return;

  },
  removeBreaking: async (id: string) => { try { await checked(supabase.from('breaking_news').delete().eq('id',id).select('id').single()); await refreshCloud(); } catch {} },
  editBreaking: async (id: string, text: string) => { try { await checked(supabase.from('breaking_news').update({text}).eq('id',id).select('id').single()); await refreshCloud(); } catch {} },
  setBulletin: (ids: string[]) => saveBroadcast({ bulletin: ids, bulletinPublished: false }),
  publishBulletin: () => saveBroadcast({ bulletinPublished: true }),
  setOnAir: (onAir: boolean) => saveBroadcast({ onAir }),
  setSource: (source: Source) => saveBroadcast({ source }),
  toggleOverlay: (k: keyof State["overlays"]) => saveBroadcast({ overlays: { ...state.overlays, [k]: !state.overlays[k] } }),
  togglePlatform: (k: keyof State["platforms"]) => saveBroadcast({ platforms: { ...state.platforms, [k]: !state.platforms[k] } }),
  setNowPlaying: (id?: string) => saveBroadcast({ nowPlaying: id }),
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
