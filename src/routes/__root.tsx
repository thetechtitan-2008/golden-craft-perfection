import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackToTop } from "@/components/BackToTop";
import { CustomCursor } from "@/components/CustomCursor";
import { GlobalSound } from "@/components/GlobalSound";
import { AutoReveal } from "@/components/AutoReveal";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="relative max-w-md text-center">
        <div className="text-[10px] tracking-[0.5em] uppercase text-gold-bright/60 mb-4">
          Protocol Not Found
        </div>
        <h1 className="font-display text-7xl gold-gradient-text">404</h1>
        <p className="mt-6 text-sm text-foreground/60">
          The path you sought does not exist in this manuscript.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex pusher-btn rounded-full px-6 py-3 text-[10px] tracking-[0.4em] uppercase text-gold-bright hover:text-white transition-colors"
        >
          Return Home
        </Link>
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
        <h1 className="font-display text-xl gold-gradient-text">This page didn't load</h1>
        <p className="mt-2 text-sm text-foreground/60">
          A mechanism jammed. Reset and try again.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="pusher-btn rounded-full px-5 py-2.5 text-[10px] tracking-[0.4em] uppercase text-gold-bright"
          >
            Try again
          </button>
          <a
            href="/"
            className="text-[10px] tracking-[0.4em] uppercase text-foreground/60 hover:text-gold-bright px-4 py-2.5"
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
      { name: "theme-color", content: "#040404" },
      { title: "The Supreme Kinetic Protocol · Omega Edition" },
      {
        name: "description",
        content:
          "A biomechanical masterclass. Six days of extreme mechanical exposure. One day of parasympathetic supercompensation. Every rep, every tempo, mathematically precise.",
      },
      { property: "og:title", content: "The Supreme Kinetic Protocol · Omega Edition" },
      {
        property: "og:description",
        content:
          "A luxury operating system for elite athletes. Forged in discipline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "The Supreme Kinetic Protocol · Omega Edition" },
      {
        name: "twitter:description",
        content: "Forged in discipline. A biomechanical masterclass.",
      },
      { name: "description", content: "A biomechanical masterclass. Six days of extreme mechanical exposure. One day of parasympathetic supercompensation. Every rep, every tempo, mathematically precise." },
      { property: "og:description", content: "A biomechanical masterclass. Six days of extreme mechanical exposure. One day of parasympathetic supercompensation. Every rep, every tempo, mathematically precise." },
      { name: "twitter:description", content: "A biomechanical masterclass. Six days of extreme mechanical exposure. One day of parasympathetic supercompensation. Every rep, every tempo, mathematically precise." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/db6ee42b-a9d3-404a-bfb2-03cd74be6a4d/id-preview-e11b810f--6797b146-b8b1-4b40-bb35-e127aac47cad.lovable.app-1783327135517.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/db6ee42b-a9d3-404a-bfb2-03cd74be6a4d/id-preview-e11b810f--6797b146-b8b1-4b40-bb35-e127aac47cad.lovable.app-1783327135517.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  // Boot theme early to avoid FOUC.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("sr:theme");
    const theme = stored === "light" ? "light" : "dark";
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ScrollProgress />
      <CustomCursor />
      <GlobalSound />
      <AutoReveal />
      <Outlet />
      <BackToTop />
    </QueryClientProvider>
  );
}
