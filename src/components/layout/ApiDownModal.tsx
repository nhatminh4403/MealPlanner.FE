"use client";

import React, { useEffect, useState } from "react";
import { getApiInstance } from "@/libs/axios";
import { WifiOff, RefreshCw, ServerCrash } from "lucide-react";
import { cn } from "@/lib/utils"; 

/**
 * ApiDownModal
 *
 * - Pings /api/abp/application-configuration on mount (5 s timeout)
 * - If the API responds → renders nothing (stays invisible forever)
 * - If the API is unreachable → shows a centered glassmorphism modal
 * - "Try again" button re-pings and closes the modal if API comes back
 *
 * Usage: drop <ApiDownModal /> once in your root layout or _app, e.g.:
 *   app/layout.tsx  →  <ApiDownModal />
 */
export function ApiDownModal() {
  const [visible, setVisible] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  async function ping() {
    try {
      await getApiInstance().get("/abp/application-configuration", {
        params: { IncludeLocalizationResources: false },
        timeout: 5000,
      });
      // API is up — hide (or keep hidden)
      setVisible(false);
    } catch {
      // API is down — show the modal
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

  if (!visible) return null;

  return (
    <>
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
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/15 blur-[120px] opacity-60 dark:opacity-40" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-red-500/10 blur-[100px] opacity-50 dark:opacity-30" />
      </div>

      {/* ── Modal card ────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="api-down-title"
        aria-describedby="api-down-desc"
      >
        <div
          className={cn(
            "relative w-full max-w-md rounded-2xl overflow-hidden",
            // Glassmorphism
            "border border-white/12 dark:border-white/6",
            "bg-white/70 dark:bg-zinc-900/70",
            "backdrop-blur-2xl",
            "shadow-2xl shadow-black/20 dark:shadow-black/60",
            "animate-fade-in-up",
          )}
          style={{ animationDuration: "0.35s" }}
        >
          {/* Gradient top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-red-500" />

          {/* Inner highlight border */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none">
            <div className="absolute inset-px rounded-2xl border border-white/20 dark:border-white/8" />
          </div>

          <div className="px-8 py-8 flex flex-col items-center text-center gap-5">

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
                className="text-xl font-bold tracking-tight text-[var(--foreground)]"
              >
                Service Unavailable
              </h2>
              <p
                id="api-down-desc"
                className="text-sm text-[var(--muted-fg)] leading-relaxed"
              >
                The backend API could not be reached. This means I haven&apos;t
                published backend to Azure yet if you are accessing the public demo using Vercel link.
                Please check out the Master Repo at {" "}
                <a href="https://github.com/nhatminh4403/MealPlanner" 
                target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  https://github.com/nhatminh4403/MealPlanner
                </a>
                {" "} 
                for instructions on how to run the backend locally. 
                If you are the developer, please ensure the backend server is running and accessible.
              </p>
            </div>

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

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--input-border)] to-transparent" />

            {/* What to do */}
            <ul className="w-full flex flex-col gap-2 text-left">
              {[
                "If you cloned the repository, check that the backend server (ABP Framework) is running",
                "Verify carefully the NEXT_PUBLIC_API_URL environment variable",
                "Ensure the API port is accessible and not blocked",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2.5 text-xs text-[var(--muted-fg)]">
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

            <p className="text-[11px] text-[var(--muted-fg)]/60">
              The page will automatically continue once the API responds.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}