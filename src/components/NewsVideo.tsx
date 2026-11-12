import { useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/glass';

export function NewsVideo({ src, label, className = 'aspect-video w-full', preview = false, autoPlay = false }: {
  src: string | undefined; label: string; className?: string; preview?: boolean; autoPlay?: boolean;
}) {
  if (preview) return <VideoSource key={src ?? 'missing'} src={src} label={label} className={className} preview autoPlay={autoPlay} />;
  return <div className={`relative overflow-hidden ${className}`}>
    <VideoSource key={src ?? 'missing'} src={src} label={label} className="block h-full w-full object-contain" preview={false} autoPlay={autoPlay} />
    <div aria-label="व्हिडिओवरील FOCUS 24 लोगो" className="pointer-events-none absolute right-2 top-2 z-10"><Logo size="sm" /></div>
  </div>;
}

function VideoSource({ src, label, className, preview, autoPlay }: {
  src: string | undefined; label: string; className: string; preview: boolean; autoPlay: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  if (!src || failed) return <div role={preview ? undefined : 'alert'} className={`${className} flex flex-col items-center justify-center gap-2 bg-card p-2 text-center text-xs text-muted-foreground`}>
    <AlertCircle className="size-5" />
    <span>{src ? 'व्हिडिओ चालला नाही' : 'व्हिडिओ उपलब्ध नाही'}</span>
    {!preview && src && <><p>इंटरनेट तपासा. फाइल या उपकरणावर चालत नसेल तर MP4 (H.264/AAC) वापरा.</p><Button size="sm" variant="outline" onClick={() => { setFailed(false); setAttempt(n => n + 1); }}><RefreshCw className="size-4" />पुन्हा प्रयत्न करा</Button></>}
  </div>;
  return <video key={attempt} aria-label={label} src={src} controls={!preview} autoPlay={autoPlay} muted playsInline preload={preview ? 'metadata' : 'auto'} onError={() => setFailed(true)} className={className} />;
}