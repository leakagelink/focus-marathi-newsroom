import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import logoAsset from '@/assets/focus-24-current-logo.png.asset.json';

export function Glass({ className, red, ...p }: HTMLAttributes<HTMLDivElement> & { red?: boolean | undefined }) {
  return <div className={cn(red ? "glass-red" : "glass", "rounded-2xl", className)} {...p} />;
}

export function GlowButton({ className, variant = "primary", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "success" }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
        variant === "primary" && "bg-brand-gradient text-primary-foreground hover:glow hover:brightness-110",
        variant === "ghost" && "glass text-foreground hover:border-primary/50 hover:text-primary-foreground",
        variant === "success" && "bg-success/20 text-success border border-success/40 hover:bg-success/30",
        className,
      )}
      {...p}
    />
  );
}

const tones = {
  red: "bg-primary/15 text-neon border-primary/40",
  green: "bg-success/15 text-success border-success/40",
  amber: "bg-warning/15 text-warning border-warning/40",
  gray: "bg-glass text-muted-foreground border-glass-border",
};
export function Pill({ tone = "gray", className, children }: { tone?: keyof typeof tones; className?: string; children: ReactNode }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", tones[tone], className)}>{children}</span>;
}

export function LiveDot({ label = "LIVE" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary-foreground">
      <span className="size-1.5 rounded-full bg-primary-foreground animate-live" />
      {label}
    </span>
  );
}

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return <img src={logoAsset.url} alt="FOCUS 24 NEWS मराठी" width={256} height={256} className={cn('inline-block shrink-0 object-contain select-none', { sm: 'size-12', md: 'size-16', lg: 'size-36' }[size])} />;
}

export function Ticker({ items, label = "BREAKING NEWS" }: { items: string[]; label?: string }) {
  const list = items.length ? items : ["FOCUS 24 NEWS — महाराष्ट्राचे डिजिटल न्यूज नेटवर्क"];
  return (
    <div className="flex items-stretch overflow-hidden rounded-lg glass">
      <div className="shrink-0 bg-primary px-2.5 py-1.5 text-[11px] font-extrabold text-primary-foreground">{label}</div>
      <div className="relative flex-1 overflow-hidden">
        <div className="flex w-max animate-ticker whitespace-nowrap py-1.5 text-xs">
          {[...list, ...list].map((t, i) => (
            <span key={i} className="px-6">● {t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Stat({ icon, value, label, sub, red }: { icon: ReactNode; value: ReactNode; label: string; sub?: string; red?: boolean }) {
  return (
    <Glass red={red} className="p-4 transition-transform hover:-translate-y-0.5">
      <div className="mb-3 inline-grid size-9 place-items-center rounded-xl bg-primary/15 text-neon">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      {sub && <div className="mt-1 text-xs text-success">{sub}</div>}
    </Glass>
  );
}

export const inputCls = "w-full rounded-xl glass bg-transparent px-3 py-2 text-sm outline-hidden placeholder:text-faint focus:border-primary/60";
