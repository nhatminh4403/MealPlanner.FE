"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useRef, useEffect, useTransition } from "react";
import { useTheme } from "@/libs/ThemeProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/recipe", label: "Recipes" },
  { href: "/meal-plans", label: "Meal Plans" },
  { href: "/shopping-lists", label: "Shopping Lists" },
];

export default function Header() {
  const pathname = usePathname();
  const { toggleTheme } = useTheme();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    startTransition(() => {
      setIsMobileMenuOpen(false);
    });
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Brand / Logo */}
          <Link
            href="/"
            className="bg-linear-to-r from-primary to-secondary bg-clip-text text-xl font-bold tracking-tight text-transparent"
          >
            MealPlanner
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden h-full items-center space-x-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (pathname?.startsWith(link.href) && link.href !== "/");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex h-full items-center px-4 text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "text-zinc-900 bg-active-gradient dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900/40"
                  }`}
                >
                  {!isActive && <div className="gradient-border-persistent group-hover:opacity-10" />}
                  <span className="relative z-10">{link.label}</span>
                  {/* Active Indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-linear-to-r from-primary to-secondary shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="gradient-border flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Toggle dark mode"
            >
              {/* Moon icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="dark:hidden" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              {/* Sun icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute hidden dark:block" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </button>

            {/* User Avatar Dropdown */}
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="gradient-border flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-zinc-200 transition-colors hover:ring-2 hover:ring-primary/50 focus:outline-none dark:bg-zinc-800 dark:hover:ring-primary/50"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                {/* Stub for User Avatar */}
                <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">U</span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-zinc-200 bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">User Name</p>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">user@example.com</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-zinc-100 py-1 dark:border-zinc-800">
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                /* X icon */
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                /* Hamburger icon */
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-16 left-0 right-0 border-b border-zinc-200 bg-white/95 backdrop-blur-md shadow-xl transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950/95">
            {/* Nav Links */}
            <nav className="flex flex-col px-4 py-3">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (pathname?.startsWith(link.href) && link.href !== "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-active-gradient text-zinc-900 dark:text-white"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                    }`}
                  >
                    {/* Active left bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-linear-to-b from-primary to-secondary" />
                    )}
                    <span className="pl-2">{link.label}</span>

                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="mx-4 border-t border-zinc-100 dark:border-zinc-800" />

            {/* User section */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="gradient-border flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">U</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">User Name</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">user@example.com</p>
                </div>
              </div>
              <Link
                href="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
