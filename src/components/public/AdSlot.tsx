import type { Advertisement } from '@/types';
import { AD_SIZE_CLASS, adsFor, isAdSize, type AdPlacement } from '@/lib/ads';

export function AdSlot({ ads, placement }: { ads: Advertisement[]; placement: AdPlacement }) {
  const list = adsFor(ads, placement);
  if (!list.length) return null;
  return <div className="space-y-2">{list.map(ad => {
    const size = isAdSize(ad.size) ? ad.size : 'small';
    const body = <div className={`relative flex w-full items-center gap-2 overflow-hidden rounded-lg border border-warning/50 bg-card ${AD_SIZE_CLASS[size]}`}>
      {ad.image ? <img src={ad.image} alt={ad.advertiser} loading="lazy" className="absolute inset-0 size-full object-cover" /> : null}
      <div className={`relative z-[1] min-w-0 flex-1 px-3 ${ad.image ? 'self-end bg-background/75 py-1' : ''}`}>
        <p className="truncate text-sm font-bold">{ad.advertiser}</p>
        {ad.text && <p className={`text-xs text-muted-foreground ${size === 'small' ? 'truncate' : 'line-clamp-3'}`}>{ad.text}</p>}
      </div>
      <span className="absolute left-1.5 top-1.5 z-[2] rounded bg-warning px-1.5 py-0.5 text-[10px] font-extrabold text-background">AD · जाहिरात</span>
    </div>;
    return /^https?:\/\//.test(ad.url)
      ? <a key={ad.id} href={ad.url} target="_blank" rel="noopener noreferrer sponsored" aria-label={`जाहिरात: ${ad.advertiser}`}>{body}</a>
      : <div key={ad.id} aria-label={`जाहिरात: ${ad.advertiser}`}>{body}</div>;
  })}</div>;
}
