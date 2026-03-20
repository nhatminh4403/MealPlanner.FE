"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Footer() {
  const pathname = usePathname();

  // Hide the footer on full-screen dashboard-style pages to prevent layout shifts and flashing.
  // The recipe page is a full-screen (h-screen) experience with its own internal scrolling.
  if (pathname === "/recipe") {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto max-w-6xl px-6 py-8 md:flex md:items-center md:justify-between">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link
            href="#"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            About
          </Link>
          <Link
            href="#"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Terms
          </Link>
        </div>
        <div className="mt-6 md:order-1 md:mt-0">
          <p className="text-center text-sm leading-5 text-zinc-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} MealPlanner. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}