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
    <section aria-label="ब्रेकिंग न्यूज" className="overflow-hidden rounded-b-lg border border-primary/40 bg-brand-deep text-primary-foreground">
      <div className="flex min-h-9 items-stretch border-b border-primary-foreground/20">
        {current?.region && <span className="flex min-w-0 flex-1 items-center break-words px-3 py-1 text-xs font-bold">{current.region}</span>}
        <h2 className="flex shrink-0 items-center bg-warning px-3 py-1 text-sm font-extrabold text-background">BREAKING NEWS</h2>
        {items.length > 1 && <div className="ml-auto flex shrink-0 items-center">
          <Button variant="ghost" size="icon" className="size-9 text-primary-foreground" aria-label="मागील ब्रेकिंग बातमी" onClick={() => setIndex(value => (value - 1 + items.length) % items.length)}><ChevronLeft className="size-4" /></Button>
          <Button variant="ghost" size="icon" className="size-9 text-primary-foreground" aria-label="पुढील ब्रेकिंग बातमी" onClick={() => setIndex(value => (value + 1) % items.length)}><ChevronRight className="size-4" /></Button>
        </div>}
      </div>
      <p aria-live="polite" aria-atomic="true" className="min-h-16 break-words px-3 py-3 text-center text-base font-bold leading-relaxed">{current?.text ?? 'सध्या ब्रेकिंग बातमी नाही'}</p>
    </section>
  );
}