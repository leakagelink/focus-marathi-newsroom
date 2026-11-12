import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BreakingNews } from '@/types';

export function BreakingNewsBar({ items }: { items: BreakingNews[] }) {
  const [index, setIndex] = useState(0);
  const current = items[index % Math.max(items.length, 1)];

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => setIndex(value => (value + 1) % items.length), 8000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <section aria-label="ब्रेकिंग न्यूज" className="relative overflow-hidden rounded-b-lg border border-primary/40 bg-brand-deep text-primary-foreground">
      <div className="flex min-h-7 items-stretch">
        <h2 className="relative flex shrink-0 items-center gap-1 overflow-hidden bg-warning px-2 py-0.5 text-[11px] font-extrabold text-background">
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-destructive animate-breaking-dot" />
          BREAKING
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-primary-foreground/45 animate-breaking-shine" />
        </h2>
        <p key={current?.id ?? index} aria-live="polite" aria-atomic="true" className="flex min-w-0 flex-1 items-center break-words px-2 py-1 text-xs font-bold leading-snug animate-news-in">
          {current?.region && <span className="mr-1.5 shrink-0 text-primary-foreground/80">{current.region}:</span>}
          {current?.text ?? 'सध्या ब्रेकिंग बातमी नाही'}
        </p>
        {items.length > 1 && <div className="flex shrink-0 items-center">
          <Button variant="ghost" size="icon" className="size-7 text-primary-foreground" aria-label="मागील ब्रेकिंग बातमी" onClick={() => setIndex(value => (value - 1 + items.length) % items.length)}><ChevronLeft className="size-3.5" /></Button>
          <Button variant="ghost" size="icon" className="size-7 text-primary-foreground" aria-label="पुढील ब्रेकिंग बातमी" onClick={() => setIndex(value => (value + 1) % items.length)}><ChevronRight className="size-3.5" /></Button>
        </div>}
      </div>
      {items.length > 1 && <span key={`line-${index}`} aria-hidden className="block h-0.5 bg-primary-foreground/35 animate-breaking-line" />}
    </section>
  );
}