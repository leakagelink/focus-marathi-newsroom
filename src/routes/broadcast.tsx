import { createFileRoute } from "@tanstack/react-router";
import { BackButton } from "@/components/BackButton";
import { Glass, GlowButton, LiveDot, Logo, Ticker } from "@/components/ui/glass";
import { actions, useStore, type Source } from "@/lib/store";
import { SAMPLE_VIDEOS } from "@/data/mock";
import { AccountForm } from '@/components/AccountForm';

export const Route = createFileRoute("/broadcast")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Broadcast Studio — FOCUS 24 NEWS" },
      { name: "description", content: "FOCUS 24 NEWS लाईव्ह प्रसारण नियंत्रण कक्ष." },
      { property: "og:title", content: "Broadcast Studio — FOCUS 24 NEWS" },
      { property: "og:description", content: "Live broadcast master control." },
    ],
  }),
  component: Broadcast,
});

const sources: [Source, string][] = [["studio", "Studio Anchor"], ["field", "Field OB / Mobile"], ["superfast", "Superfast 100"], ["ads", "Commercial Break"], ["standby", "Emergency Slate"]];

function Broadcast() {
  const s = useStore((x) => x);
  const now = s.news.find((n) => n.id === s.nowPlaying);
  const idx = sources.findIndex(([k]) => k === s.source);
  if (!s.ready) return <main className="p-6">कृपया थांबा…</main>;
  if (!s.userId) return <main><BackButton /><AccountForm /></main>;
  if (s.role !== 'admin' && s.role !== 'editor') return <main className="space-y-4 p-6"><BackButton /><p>संपादकीय प्रवेश आवश्यक</p></main>;
  return (
    <main className="mx-auto grid max-w-[1400px] gap-4 px-3 py-4 sm:px-4 sm:py-6 lg:grid-cols-[2fr_1fr]">
      <Glass red className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2"><BackButton /><h1 className="truncate font-bold">Master Control</h1></div>
          {s.onAir && <LiveDot label="ON AIR" />}
        </div>
        <p className="text-xs text-warning">प्रसारण प्रिव्ह्यू · YouTube / Facebook लाईव्ह जोडलेले नाही.</p>
        <div className="relative overflow-hidden rounded-xl">
          {s.source === "standby" ? <div className="grid aspect-video place-items-center bg-card"><Logo size="lg" /></div>
            : <video key={s.source} src={SAMPLE_VIDEOS[idx % 4]} autoPlay muted loop playsInline className="aspect-video w-full object-cover" />}
          {s.overlays.logo && <div className="absolute right-3 top-3"><Logo size="sm" /></div>}
          {s.overlays.headline && now && <div className="absolute inset-x-6 bottom-20 rounded bg-background/80 p-2 text-lg font-bold">{now.headline}</div>}
          {s.overlays.breaking && <div className="absolute inset-x-0 bottom-0"><Ticker items={s.breaking.map((b) => b.text)} /></div>}
        </div>
        <p className="text-sm text-muted-foreground">आता: {now?.headline ?? "FOCUS 24 बातमीपत्र"} · Viewers {s.liveViewers.toLocaleString("en-IN")}</p>
        <div className="flex flex-wrap gap-2">
          {sources.map(([k, l]) => <GlowButton key={k} variant={s.source === k ? "primary" : "ghost"} onClick={() => actions.setSource(k)}>{l}</GlowButton>)}
        </div>
      </Glass>
      <div className="space-y-4">
        <Glass className="space-y-2 p-4">
          <h2 className="font-bold">Overlays</h2>
          {(Object.keys(s.overlays) as (keyof typeof s.overlays)[]).map((k) => (
            <GlowButton key={k} className="w-full" variant={s.overlays[k] ? "primary" : "ghost"} onClick={() => actions.toggleOverlay(k)}>{k}</GlowButton>
          ))}
        </Glass>
        <Glass className="space-y-2 p-4">
          <h2 className="font-bold">Restreaming</h2>
          {(Object.keys(s.platforms) as (keyof typeof s.platforms)[]).map((k) => (
            <GlowButton key={k} className="w-full" variant={s.platforms[k] ? "success" : "ghost"} onClick={() => actions.togglePlatform(k)}>{k} {s.platforms[k] ? "● LIVE" : "OFF"}</GlowButton>
          ))}
          <GlowButton className="w-full" onClick={() => actions.setOnAir(!s.onAir)}>{s.onAir ? "Go Off Air" : "Go On Air"}</GlowButton>
        </Glass>
      </div>
    </main>
  );
}
