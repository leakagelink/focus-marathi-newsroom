import type { ReactNode } from "react";

// On real phones the app fills the screen; on tablets/desktop it is shown inside a phone frame.
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-[calc(100dvh-3.25rem)] w-full shrink-0 md:mx-auto md:h-[800px] md:w-[390px] md:rounded-[3rem] md:border md:border-glass-border md:bg-card md:p-2.5 md:shadow-[0_30px_80px_-20px_oklch(0_0_0/70%)] md:glow">
      <div className="absolute left-1/2 top-3.5 z-30 hidden h-6 w-28 -translate-x-1/2 rounded-full bg-background md:block" />
      <div className="relative h-full w-full overflow-hidden bg-background [transform:translateZ(0)] md:rounded-[2.4rem]">
        <div className="hidden h-10 items-center justify-between px-7 pt-1 text-xs font-semibold md:flex">
          <span>9:41</span><span>5G ▮▮▮</span>
        </div>
        <div className="h-full overflow-y-auto overscroll-contain md:h-[calc(100%-2.5rem)]">{children}</div>
      </div>
    </div>
  );
}
