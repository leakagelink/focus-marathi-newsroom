import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const pathList = z.array(z.string().min(1).max(300)).max(200);

/** Signs thumbnails of published stories and images of active ads; storage itself stays private. */
export const signPublicMedia = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => z.object({ thumbs: pathList, ads: pathList }).parse(d))
  .handler(async ({ data }): Promise<Record<string, string>> => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const out: Record<string, string> = {};
    const thumbs = [...new Set(data.thumbs)]; const ads = [...new Set(data.ads)];
    if (thumbs.length) {
      const { data: rows } = await supabaseAdmin.from('news').select('image').in('image', thumbs).in('status', ['approved', 'broadcasted']);
      const ok = (rows ?? []).map(r => r.image);
      if (ok.length) {
        const { data: s } = await supabaseAdmin.storage.from('news-thumbs').createSignedUrls(ok, 60 * 60 * 24 * 7);
        for (const x of s ?? []) if (x.path && x.signedUrl) out[`t:${x.path}`] = x.signedUrl;
      }
    }
    if (ads.length) {
      const { data: rows } = await supabaseAdmin.from('app_content').select('data').eq('kind', 'advertisement').eq('active', true);
      const ok = (rows ?? []).map(r => String((r.data as Record<string, unknown>)?.['image'] ?? '')).filter(p => ads.includes(p));
      if (ok.length) {
        const { data: s } = await supabaseAdmin.storage.from('ad-images').createSignedUrls(ok, 60 * 60 * 24 * 7);
        for (const x of s ?? []) if (x.path && x.signedUrl) out[`a:${x.path}`] = x.signedUrl;
      }
    }
    return out;
  });
