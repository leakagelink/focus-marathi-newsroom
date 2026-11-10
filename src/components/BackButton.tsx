import { ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Position of the current screen inside this tab's browsing history.
 * TanStack Router keeps it in the history entry state, so it also follows the
 * phone's hardware / swipe back gesture.
 */
function historyIndex(): number {
  if (typeof window === "undefined") return 0;
  const state = window.history.state as { __TSR_index?: number } | null;
  return typeof state?.__TSR_index === "number" ? state.__TSR_index : 0;
}

/** Is there a previous screen to return to? */
export function canGoBack(): boolean {
  return historyIndex() > 0;
}

/** Return to the screen the visitor came from; falls back to the home screen. */
export function useGoBack() {
  const router = useRouter();
  return () => {
    if (canGoBack()) router.history.back();
    else void router.navigate({ to: "/" });
  };
}

export function BackButton({
  label = "मागें",
  iconOnly = false,
  className,
  ...p
}: ButtonHTMLAttributes<HTMLButtonElement> & { label?: string; iconOnly?: boolean }) {
  const goBack = useGoBack();
  return (
    <button
      type="button"
      onClick={goBack}
      aria-label={label}
      title={label}
      className={cn(
        "glass inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/50 hover:text-foreground active:scale-95",
        iconOnly && "size-8 px-0",
        className,
      )}
      {...p}
    >
      <ArrowLeft className="size-4 shrink-0" />
      {!iconOnly && <span>{label}</span>}
    </button>
  );
}
