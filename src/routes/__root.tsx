import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ProgressProvider } from "../context/ProgressContext";
import PhoneFrame from "../components/PhoneFrame";
// @ts-ignore js module
import Splash from "../components/Splash";
// @ts-ignore js module
import TabBar from "../components/TabBar";
import { useState } from "react";

const TAB_ROUTES = ["/home", "/wallet", "/league", "/profile", "/news"];

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
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
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// Reads the current route and shows the tab bar only on tab routes. Kept as
// its own component so route changes re-render only this subtree, never the
// splash-owning RootComponent (a re-render there would restart the splash
// entrance animation).
function RouteTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return TAB_ROUTES.includes(pathname) ? <TabBar /> : null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  // Splash is client-only: rendering it in the SSR HTML makes it a victim of
  // this template's hydration mismatch, which recreates the subtree and pins
  // the CSS entrance animations at frame 0 (opacity 0 → invisible). Mounting
  // it from an effect, after hydration settles, lets it animate cleanly.
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("iinvest-splash-seen")) {
      setShowSplash(true);
    }
  }, []);

  function handleSplashDone() {
    try {
      sessionStorage.setItem("iinvest-splash-seen", "1");
    } catch {}
    setShowSplash(false);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ProgressProvider>
        <PhoneFrame noPadding bottomBar={showSplash ? null : <RouteTabBar />}>
          {showSplash && <Splash onDone={handleSplashDone} />}
          <Outlet />
        </PhoneFrame>
      </ProgressProvider>
    </QueryClientProvider>
  );
}
