import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Square, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Browser speech only: no gateway, API credentials, or generated audio requests.
export function NewsAudio({ headline, script }: { headline: string; script: string }) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [error, setError] = useState('');
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const voice = voices.find(v => /^mr([_-]|$)/i.test(v.lang)) ?? voices.find(v => /^hi([_-]|$)/i.test(v.lang));

  useEffect(() => {
    const available = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    setSupported(available);
    if (!available) return;
    const engine = window.speechSynthesis;
    const load = () => setVoices(engine.getVoices());
    const stopHidden = () => { if (document.hidden) { engine.cancel(); setStatus('idle'); } };
    load();
    engine.addEventListener('voiceschanged', load);
    document.addEventListener('visibilitychange', stopHidden);
    return () => {
      if (utterance.current) { utterance.current.onend = null; utterance.current.onerror = null; }
      engine.cancel();
      engine.removeEventListener('voiceschanged', load);
      document.removeEventListener('visibilitychange', stopHidden);
    };
  }, [headline, script]);

  const play = () => {
    if (!voice || !supported) return;
    const engine = window.speechSynthesis;
    setError('');
    if (status === 'paused') { engine.resume(); setStatus('playing'); return; }
    engine.cancel();
    const next = new SpeechSynthesisUtterance(`${headline}. ${script}`);
    next.voice = voice;
    next.lang = voice.lang;
    next.rate = 0.9;
    next.onend = () => setStatus('idle');
    next.onerror = (event) => {
      setStatus('idle');
      if (event.error !== 'canceled' && event.error !== 'interrupted') setError('आवाज सुरू झाला नाही. फोनची भाषा व आवाज सेटिंग तपासा आणि पुन्हा प्रयत्न करा.');
    };
    utterance.current = next;
    setStatus('playing');
    engine.speak(next);
  };

  return <section className="space-y-2 border-y border-glass-border py-3" aria-label="बातमी ऐका">
    <div className="flex flex-wrap items-center gap-2">
      <Volume2 className="size-4 shrink-0 text-neon" />
      <Button size="sm" disabled={!supported || !voice} onClick={status === 'playing' ? () => { window.speechSynthesis.pause(); setStatus('paused'); } : play}>
        {status === 'playing' ? <Pause /> : <Play />}
        {status === 'playing' ? 'विराम' : status === 'paused' ? 'पुढे ऐका' : 'बातमी ऐका'}
      </Button>
      <Button variant="outline" size="icon" title="थांबवा" aria-label="थांबवा" disabled={status === 'idle'} onClick={() => { window.speechSynthesis.cancel(); setStatus('idle'); }}><Square /></Button>
      {voice && <span className="text-xs text-muted-foreground">{voice.lang.toLowerCase().startsWith('mr') ? 'मराठी' : 'हिंदी आवाज'}</span>}
    </div>
    <p role="status" className="text-xs text-muted-foreground">
      {error || (supported === false ? 'या उपकरणावर आवाज उपलब्ध नाही.' : supported && !voice ? 'मराठी किंवा हिंदी आवाज उपलब्ध नाही. फोनच्या Text-to-speech सेटिंगमध्ये भाषा जोडा.' : '')}
    </p>
  </section>;
}