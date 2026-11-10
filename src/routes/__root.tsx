import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts, type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Smartphone, UserRound, Monitor, Radio } from "lucide-react";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { Logo } from "@/components/ui/glass";
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
      { name: "viewport", content: "width=device-width, initial-scale=1" },
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
  return (
    <QueryClientProvider client={queryClient}>
      <header className="sticky top-0 z-50 border-b border-glass-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-2.5">
          <Link to="/"><Logo size="sm" /></Link>
          <nav className="flex flex-1 flex-wrap justify-center gap-1.5">
            {views.map((v) => (
              <Link key={v.to} to={v.to} activeOptions={{ exact: true }}
                className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                activeProps={{ className: "glass-red !text-foreground" }}>
                <v.icon className="size-4" />
                <span className="font-semibold">{v.label}</span>
                <span className="hidden text-faint lg:inline">({v.sub})</span>
              </Link>
            ))}
          </nav>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Demo Role
            <select value={role} onChange={(e) => actions.setRole(e.target.value as Role)}
              className="rounded-lg glass bg-card px-2 py-1 text-xs text-foreground">
              {roles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </label>
        </div>
      </header>
      <Outlet />
      <Toaster theme="dark" position="top-right" richColors />
    </QueryClientProvider>
  );
}
