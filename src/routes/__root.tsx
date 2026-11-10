import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, useRouterState, HeadContent, Scripts, type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Smartphone, UserRound, Monitor, Radio } from "lucide-react";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { Logo } from "@/components/ui/glass";
import { BackButton, canGoBack } from "@/components/BackButton";
import { actions, useStore } from "@/lib/store";
import type { Role } from "@/types";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">हे पान सापडले नाही.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#08090D" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "FOCUS 24" },
      { title: "FOCUS 24 NEWS मराठी" },
      { name: "description", content: "Maharashtra's Digital News Network" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="mr" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

const views = [
  { to: "/", label: "Public App", sub: "मोबाइल", icon: Smartphone },
  { to: "/journalist", label: "Journalist App", sub: "पत्रकार", icon: UserRound },
  { to: "/admin", label: "Admin Panel", sub: "संपूर्ण नियंत्रण", icon: Monitor },
  { to: "/broadcast", label: "Broadcast Studio", sub: "लाईव्ह", icon: Radio },
] as const;

const roles: { id: Role; label: string }[] = [
  { id: "public", label: "Public" }, { id: "journalist", label: "Journalist" }, { id: "editor", label: "Editor" }, { id: "admin", label: "Chief Editor / Admin" },
];

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const role = useStore((s) => s.role);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Nothing sits behind the home screen on a fresh open, so no back button there.
  // The history check only runs in the browser, so the first render matches the server.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Share the real top-bar height (it grows with the phone's notch area) so the app screen below fits exactly.
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const apply = () => document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const showBack = pathname !== "/" || (mounted && canGoBack());
  return (
    <QueryClientProvider client={queryClient}>
      <header ref={headerRef} className="sticky top-0 z-50 border-b border-glass-border bg-background/90 pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-13 max-w-[1600px] items-center gap-1.5 px-2 py-1.5 sm:gap-3 sm:px-4">
          {showBack && <BackButton iconOnly className="size-8 shrink-0" />}
          <Link to="/" className="hidden shrink-0 sm:block"><Logo size="sm" /></Link>
          <nav className="grid min-w-0 flex-1 grid-cols-4 gap-1 sm:flex sm:justify-center sm:gap-1.5">
            {views.map((v) => (
              <Link key={v.to} to={v.to} activeOptions={{ exact: true }}
                className="flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[10px] leading-tight sm:shrink-0 sm:flex-row sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs text-muted-foreground transition hover:text-foreground"
                activeProps={{ className: "glass-red !text-foreground" }}>
                <v.icon className="size-4 shrink-0" />
                <span className="max-w-full truncate font-semibold">{v.label.split(" ")[0] === "Broadcast" ? <><span className="sm:hidden">Live</span><span className="hidden sm:inline">Broadcast</span></> : v.label.split(" ")[0]}<span className="hidden sm:inline"> {v.label.split(" ").slice(1).join(" ")}</span></span>
                <span className="hidden text-faint lg:inline">({v.sub})</span>
              </Link>
            ))}
          </nav>
          <label className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden md:inline">Demo Role</span>
            <select value={role} onChange={(e) => actions.setRole(e.target.value as Role)}
              aria-label="Demo Role" className="w-16 rounded-lg glass bg-card px-1 py-1 text-[11px] sm:w-auto sm:px-1.5 sm:text-xs text-foreground sm:w-auto">
              {roles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </label>
        </div>
      </header>
      <Outlet />
      <Toaster theme="dark" position="top-center" richColors />
    </QueryClientProvider>
  );
}
