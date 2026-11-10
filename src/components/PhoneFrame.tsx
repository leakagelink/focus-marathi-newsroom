import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto h-[800px] w-[390px] shrink-0 rounded-[3rem] border border-glass-border bg-card p-2.5 shadow-[0_30px_80px_-20px_oklch(0_0_0/70%)] glow">
      <div className="absolute left-1/2 top-3.5 z-30 h-6 w-28 -translate-x-1/2 rounded-full bg-background" />
      <div className="relative h-full w-full overflow-hidden rounded-[2.4rem] bg-background [transform:translateZ(0)]">
        <div className="flex h-10 items-center justify-between px-7 pt-1 text-xs font-semibold">
          <span>9:41</span><span>5G ▮▮▮</span>
        </div>
        <div className="h-[calc(100%-2.5rem)] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
