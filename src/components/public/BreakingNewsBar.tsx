import type { BreakingNews } from '@/types';

export function BreakingNewsBar({ items }: { items: BreakingNews[] }) {
  return (
    <section aria-label="ब्रेकिंग न्यूज" className="relative overflow-hidden rounded-b-lg border border-primary/40 bg-brand-deep text-primary-foreground">
      <div className="flex min-h-7 items-stretch">
        <h2 className="relative flex shrink-0 items-center gap-1 overflow-hidden bg-warning px-2 py-0.5 text-[11px] font-extrabold text-background">
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-destructive animate-breaking-dot" />
          BREAKING
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-primary-foreground/45 animate-breaking-shine" />
        </h2>
        <div className="relative flex min-w-0 flex-1 items-center overflow-hidden">
          <div key={items.map(item => item.id).join('|') || 'empty'} aria-live="polite" className="flex w-max shrink-0 items-center whitespace-nowrap animate-breaking-marquee hover:[animation-play-state:paused]">
            {[0, 1].map(copy => (
              <span key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center px-2 py-1 text-xs font-bold">
                {(items.length ? items : [{ id: 'empty', region: '', text: 'सध्या ब्रेकिंग बातमी नाही' } as BreakingNews]).map(item => (
                  <span key={item.id} className="flex items-center pr-8">
                    <span aria-hidden className="mr-2 size-1.5 rounded-full bg-warning" />
                    {item.region && <span className="mr-1.5 text-primary-foreground/80">{item.region}:</span>}
                    {item.text}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}