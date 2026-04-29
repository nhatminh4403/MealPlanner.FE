"use client";

import React, { useEffect, useState } from "react";
import { getApiInstance, isDemoMode, setDemoMode } from "@/libs/axios";
import {
  WifiOff,
  RefreshCw,
  ServerCrash,
  Construction,
  Github,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/libs/utils";
import { abpDefaultApis } from "@/libs/api";
export function ApiDownModal() {
  const [visible, setVisible] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [demoEnabled, setDemoEnabled] = useState(() => isDemoMode());

  const SHOW_DEVELOPMENT_REASON = true;

  async function ping() {
    try {
      await getApiInstance().get("/abp/application-configuration", {
        params: { IncludeLocalizationResources: false },
        timeout: 5000,
      });
      setVisible(false);
    } catch {
      setVisible(true);
    }
  }

  // Initial check on mount
  useEffect(() => {
    const checkApi = async () => {
      await ping();
    };
    checkApi();
  }, []);

  const handleRetry = async () => {
    setRetrying(true);
    setAttemptCount((n) => n + 1);
    await ping();
    setRetrying(false);
  };

  const handleToggleDemo = (enabled: boolean) => {
    setDemoMode(enabled);
    setDemoEnabled(enabled);
    // Reload to apply the mock interceptor
    window.location.reload();
  };

  if (!visible || demoEnabled) return null;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />

      {/* ── Backdrop ──────────────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-[9999]",
          "bg-black/40 dark:bg-black/60 backdrop-blur-sm",
          "animate-fade-in-up",
        )}
        style={{ animationDuration: "0.2s" }}
      />

      {/* ── Ambient blobs behind the card ─────────────────────────────── */}
      <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-primary/15 blur-[80px] md:blur-[120px] opacity-60 dark:opacity-40" />
        <div className="absolute bottom-1/4 right-1/3 w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full bg-red-500/10 blur-[60px] md:blur-[100px] opacity-50 dark:opacity-30" />
      </div>

      {/* ── Modal card ────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="api-down-title"
        aria-describedby="api-down-desc"
      >
        <div
          className={cn(
            "relative w-full rounded-2xl transition-all duration-500 shadow-2xl shadow-black/20 dark:shadow-black/60",
            SHOW_DEVELOPMENT_REASON ? "max-w-4xl" : "max-w-md",
            "max-h-[min(850px,90vh)] flex flex-col",
            // Glassmorphism
            "border border-white/12 dark:border-white/6",
            "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl",
            "animate-fade-in-up",
          )}
          style={{ animationDuration: "0.4s" }}
        >
          {/* Gradient top accent bar - Keep fixed at top */}
          <div className="sticky top-0 z-10 h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-red-500 shrink-0" />

          {/* Inner highlight border */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none">
            <div className="absolute inset-px rounded-2xl border border-white/20 dark:border-white/8" />
          </div>

          <div
            className={cn(
              "flex flex-col flex-1 overflow-y-auto scrollbar-none",
              SHOW_DEVELOPMENT_REASON && "md:flex-row",
            )}
          >
            {/* ── Left Part: Service Status ──────────────────────────────── */}
            <div
              className={cn(
                "px-5 py-8 md:px-8 md:py-10 flex flex-col items-center text-center gap-4 md:gap-5",
                SHOW_DEVELOPMENT_REASON &&
                  "md:w-1/2 border-b border-[var(--input-border)]/40 md:border-b-0 md:border-r",
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "flex size-16 items-center justify-center rounded-2xl",
                  "bg-gradient-to-br from-red-500/15 to-red-500/5",
                  "border border-red-500/20",
                )}
              >
                <ServerCrash className="size-8 text-red-500" />
              </div>

              {/* Headline */}
              <div className="flex flex-col gap-1.5">
                <h2
                  id="api-down-title"
                  className="text-xl md:text-2xl font-bold tracking-tight text-[var(--foreground)]"
                >
                  Service Unavailable
                </h2>

                <p
                  id="api-down-desc"
                  className="text-sm text-[var(--muted-fg)] leading-relaxed max-w-[320px] sm:max-w-none"
                >
                  The backend API could not be reached. If you are accessing the
                  public demo, the backend may not be published yet. Check the
                  repository for setup instructions. If you are the developer,
                  ensure the server is running.
                </p>
              </div>

              {/* Master Repo Button */}
              <a
                href="https://github.com/nhatminh4403/MealPlanner"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-full flex items-center justify-center gap-2",
                  "rounded-xl px-5 py-2.5 text-sm font-semibold",
                  "bg-white/5 dark:bg-zinc-800/50",
                  "hover:bg-white/10 dark:hover:bg-zinc-700/50",
                  "text-[var(--foreground)] border border-[var(--input-border)]/50",
                  "transition-all duration-200",
                )}
              >
                <Github className="size-4" />
                Master Repo
              </a>

              {/* Status pill */}
              <div
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-1.5",
                  "border border-red-500/20 bg-red-500/8 dark:bg-red-500/12",
                  "text-xs font-medium text-red-500",
                )}
              >
                <WifiOff className="size-3" />
                API unreachable
                {attemptCount > 0 && (
                  <span className="text-red-400/70 font-normal">
                    · {attemptCount} {attemptCount === 1 ? "retry" : "retries"}
                  </span>
                )}
              </div>

              {/* What to do */}
              <ul className="w-full flex flex-col gap-2 text-left">
                {[
                  "If you cloned the repository, check that the backend server (ABP Framework) is running",
                  "Verify carefully the NEXT_PUBLIC_API_URL environment variable",
                  "Ensure the API port is accessible and not blocked",
                ].map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2.5 text-xs text-[var(--muted-fg)]"
                  >
                    <span className="mt-0.5 size-1.5 rounded-full bg-primary/50 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--input-border)] to-transparent" />

              {/* Retry button */}
              <button
                type="button"
                onClick={handleRetry}
                disabled={retrying}
                className={cn(
                  "w-full flex items-center justify-center gap-2",
                  "rounded-xl px-5 py-2.5 text-sm font-semibold",
                  "bg-gradient-to-r from-primary to-primary/80",
                  "hover:from-primary/90 hover:to-primary/70",
                  "text-white shadow-lg shadow-primary/25",
                  "border border-primary/20",
                  "transition-all duration-200",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                )}
              >
                <RefreshCw
                  className={cn("size-4", retrying && "animate-spin")}
                />
                {retrying ? "Checking…" : "Try Again"}
              </button>

              {/* ── Demo Mode Section ────────────────────────────────────── */}
              <div className="w-full mt-2">
                <button
                  type="button"
                  onClick={() => handleToggleDemo(true)}
                  className={cn(
                    "w-full flex items-center justify-center gap-2",
                    "rounded-xl px-5 py-2.5 text-sm font-semibold",
                    "bg-linear-to-r from-emerald-500/10 to-teal-500/10",
                    "hover:from-emerald-500/20 hover:to-teal-500/20",
                    "text-emerald-600 dark:text-emerald-400",
                    "border border-emerald-500/20",
                    "transition-all duration-200 group",
                  )}
                >
                  <PlayCircle className="size-4 group-hover:scale-110 transition-transform" />
                  Enter Demo Mode
                </button>
                <p className="mt-2 text-[10px] text-(--muted-fg)/60 text-center">
                  Use mock data to explore the UI without a live connection.
                </p>
              </div>

              <p className="text-[11px] text-[var(--muted-fg)]/60">
                The page will automatically continue once the API responds.
              </p>
            </div>

            {/* ── Right Part: Development Status ──────────────────────────── */}
            {SHOW_DEVELOPMENT_REASON && (
              <div className="px-5 py-8 md:px-8 md:py-10 flex flex-col items-center text-center gap-5 md:gap-6 md:w-1/2 bg-zinc-500/5 dark:bg-white/5">
                {/* Icon */}
                <div
                  className={cn(
                    "flex size-16 items-center justify-center rounded-2xl",
                    "bg-gradient-to-br from-orange-500/15 to-orange-500/5",
                    "border border-orange-500/20",
                  )}
                >
                  <Construction className="size-8 text-orange-500" />
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--foreground)]">
                    Project Status
                  </h2>

                  <p className="text-sm text-[var(--muted-fg)] leading-relaxed">
                    Development of this full-stack project is currently on
                    pause. While the UI and frontend logic remain as a
                    demonstration of my current skill set, the backend hosting
                    has been suspended to optimize resources.
                  </p>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--input-border)] to-transparent" />

                <div className="text-left w-full space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-fg)] opacity-70">
                    Reason for Pause
                  </h3>
                  <p className="text-sm text-[var(--muted-fg)] italic leading-relaxed">
                    &ldquo;My back is so damn painful! I&apos;m waiting for the
                    new replacement for my current swivel chair base &rdquo;
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-[var(--input-border)]/40 w-full">
                  <p className="text-xs font-medium text-orange-500/80">
                    The code is still open source for exploration.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
