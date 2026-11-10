import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Clock, Users, MapPin, Radio, XCircle, Send, Zap } from "lucide-react";
import { Glass, GlowButton, Pill, Stat, inputCls } from "@/components/ui/glass";
import { actions, useStore } from "@/lib/store";
import { districtName } from "@/data/maharashtra";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — FOCUS 24 NEWS" },
      { name: "description", content: "FOCUS 24 NEWS संपादकीय मंजुरी, ब्रेकिंग न्यूज आणि नेटवर्क नियंत्रण." },
      { property: "og:title", content: "Admin Dashboard — FOCUS 24 NEWS" },
      { property: "og:description", content: "Editorial approvals and network control." },
    ],
  }),
  component: Admin,
});

function Admin() {
  const news = useStore((s) => s.news);
  const breaking = useStore((s) => s.breaking);
  const [sel, setSel] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [bt, setBt] = useState("");
  const pending = news.filter((n) => n.status === "pending");
  const cur = news.find((n) => n.id === sel) ?? pending[0];
  return (
    <main className="mx-auto max-w-[1400px] space-y-4 px-3 py-4 sm:space-y-5 sm:px-4 sm:py-6">
      <h1 className="text-lg font-bold sm:text-2xl">FOCUS 24 NEWS मराठी · संपूर्ण नियंत्रण पॅनेल</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={<Users className="size-5" />} value="288" label="विधानसभा प्रतिनिधी" sub="Active: 242" />
        <Stat icon={<MapPin className="size-5" />} value="36" label="जिल्हा प्रतिनिधी" sub="Active: 36" />
        <Stat red icon={<Clock className="size-5" />} value={pending.length} label="प्रलंबित बातम्या" />
        <Stat icon={<CheckCircle2 className="size-5" />} value={news.filter((n) => n.status === "approved").length} label="आज मंजूर" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <Glass className="space-y-2 p-4">
          <h2 className="font-bold">News Approvals Queue</h2>
          {pending.length === 0 && <p className="text-sm text-faint">रांग रिकामी आहे</p>}
          {pending.map((n) => (
            <button key={n.id} onClick={() => setSel(n.id)} className={`glass flex w-full gap-3 rounded-xl p-2 text-left ${cur?.id === n.id ? "border-primary" : ""}`}>
              <img src={n.image} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1 text-xs"><div className="text-sm font-semibold">{n.headline}</div>
                <div className="text-faint">{districtName(n.districtId)} · {n.constituency} · {n.id}</div>
                <div className="mt-1 flex flex-wrap gap-1">{Object.entries(n.clips).map(([k, v]) => <Pill key={k} tone={v ? "green" : "red"}>{k}</Pill>)}</div>
              </div>
              {n.urgent && <Pill tone="red" className="h-fit shrink-0">Urgent</Pill>}
            </button>
          ))}
        </Glass>
        {cur && (
          <Glass red className="space-y-3 p-4">
            <h2 className="font-bold">Review Studio</h2>
            <input className={inputCls} value={cur.headline} onChange={(e) => actions.updateNews(cur.id, { headline: e.target.value })} />
            <textarea className={`${inputCls} h-28`} value={cur.script} onChange={(e) => actions.updateNews(cur.id, { script: e.target.value })} />
            <select className={`${inputCls} bg-card`} value={cur.importance} onChange={(e) => actions.updateNews(cur.id, { importance: e.target.value as never })}>
              <option value="normal">Normal</option><option value="trending">Trending</option><option value="breaking">Breaking News</option>
            </select>
            <input className={inputCls} placeholder="नकार / सुधारणेचे कारण" value={reason} onChange={(e) => setReason(e.target.value)} />
            <div className="flex flex-wrap gap-2">
              <GlowButton onClick={() => actions.setStatus(cur.id, "approved")}><CheckCircle2 className="size-4" />Approve & Publish</GlowButton>
              <GlowButton variant="ghost" onClick={() => actions.setStatus(cur.id, "broadcasted")}><Radio className="size-4" />Broadcast Queue</GlowButton>
              <GlowButton variant="ghost" onClick={() => actions.setStatus(cur.id, "revision", reason || "कृपया क्लिप पुन्हा तपासा")}><Send className="size-4" />Revision</GlowButton>
              <GlowButton variant="ghost" onClick={() => actions.setStatus(cur.id, "rejected", reason || "मानकांनुसार नाही")}><XCircle className="size-4" />Reject</GlowButton>
            </div>
          </Glass>
        )}
      </div>
      <Glass className="space-y-3 p-4">
        <h2 className="flex items-center gap-2 font-bold"><Zap className="size-4 text-neon" />Breaking News Controller</h2>
        <div className="flex gap-2">
          <input className={inputCls} placeholder="ब्रेकिंग बातमी मराठीत..." value={bt} onChange={(e) => setBt(e.target.value)} />
          <GlowButton onClick={() => { if (bt.trim()) { actions.addBreaking({ text: bt.trim(), region: "संपूर्ण महाराष्ट्र", minutes: 30 }, true); setBt(""); } }}>Push</GlowButton>
        </div>
        {breaking.map((b) => (
          <div key={b.id} className="flex items-start justify-between gap-2 text-sm"><span>● {b.text} <span className="text-faint">({b.region})</span></span>
            <button className="text-neon" onClick={() => actions.removeBreaking(b.id)}>हटवा</button></div>
        ))}
      </Glass>
    </main>
  );
}
