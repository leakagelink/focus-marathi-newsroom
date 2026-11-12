import { useEffect, useState } from 'react';

const dateFormat = new Intl.DateTimeFormat('mr-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const timeFormat = new Intl.DateTimeFormat('mr-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

export function LiveClock({ className = '' }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return null;

  return (
    <div aria-label="सध्याचो वेल आणी तारख" className={`pointer-events-none rounded-md bg-background/80 px-2 py-1 text-right leading-tight backdrop-blur ${className}`}>
      <div className="text-[10px] font-semibold text-foreground">{dateFormat.format(now)}</div>
      <div className="text-xs font-bold tabular-nums text-neon">{timeFormat.format(now)}</div>
    </div>
  );
}
