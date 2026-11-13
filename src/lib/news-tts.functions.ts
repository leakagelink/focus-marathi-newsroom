import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

/** ElevenLabs Marathi narration for a published story only (text is read server-side, never trusted from the browser). */
export const narrateNews = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }): Promise<{ audio: string } | { error: string }> => {
    const apiKey = process.env['ELEVENLABS_API_KEY'];
    const url = process.env['SUPABASE_URL']; const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    if (!apiKey || !url || !key) return { error: 'not_configured' };
    const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: n } = await sb.from('news').select('headline,script').eq('id', data.id).in('status', ['approved', 'broadcasted']).maybeSingle();
    if (!n) return { error: 'not_found' };
    const text = `${n.headline}. ${n.script}`.slice(0, 4500);
    const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb?output_format=mp3_44100_128', {
      method: 'POST', headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model_id: 'eleven_v3' }),
    });
    if (!res.ok) { console.error(`ElevenLabs TTS failed [${res.status}]: ${await res.text()}`); return { error: 'tts_failed' }; }
    const bytes = new Uint8Array(await res.arrayBuffer());
    let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return { audio: btoa(bin) };
  });
