import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

export type SharedNews = { id: string; headline: string; description: string; image: string } | null;

/** Public read of an approved story for link previews (WhatsApp/Facebook thumbnails). */
export const getSharedNews = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }): Promise<SharedNews> => {
    const url = process.env['SUPABASE_URL']; const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    if (!url || !key) return null;
    const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: n } = await sb.from('news').select('id,headline,script,image,status').eq('id', data.id).in('status', ['approved', 'broadcasted']).maybeSingle();
    if (!n) return null;
    let image = n.image ?? '';
    if (image && !/^https?:/.test(image)) {
      const { data: s } = await sb.storage.from('news-thumbs').createSignedUrl(image, 60 * 60 * 24 * 365);
      image = s?.signedUrl ?? '';
    }
    return { id: n.id, headline: n.headline, description: n.script.split(/\s+/).slice(0, 30).join(' ') + '…', image };
  });
