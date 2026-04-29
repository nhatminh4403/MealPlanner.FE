"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState, useRef, useEffect, useTransition } from "react";
import { NotificationDropdown } from "./NotificationDropdown";
import { logout, isAuthenticated } from "@/libs/axios";
import { userProfiles } from "@/libs/api";
import { UserProfile } from "@/libs/interfaceDTO";
import { useTheme } from "@/libs/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { useLocalization } from "@/libs/LocalizationProvider";

const NAV_LINK_DEFS = [
  { href: "/", labelKey: "Menu:Home" },
  { href: "/recipe", labelKey: "Menu:Recipes" },
  { href: "/meal-plans", labelKey: "Menu:MealPlans", requiresAuth: true },
  {
    href: "/shopping-lists",
    labelKey: "Menu:ShoppingLists",
    requiresAuth: true,
  },
];

export default function Header() {
  const pathname = usePathname();
  const { L } = useLocalization();

  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [, startTransition] = useTransition();

  const [isMounted, setIsMounted] = useState(false);

  // Initial mount state
  useEffect(() => {
    startTransition(() => {
      setIsMounted(true);
    });
  }, [startTransition]);

  const isLoggedIn = isMounted && isAuthenticated();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      userProfiles
        .getMe()
        .then((res) => {
          if (res.data) setUserProfile(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch user profile:", err);
          // Don't set state to avoid "Null?" UI if possible,
          // or handle it as a fallback
        });
    }
  }, [isLoggedIn]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset navigation and close mobile menu on route change
  useEffect(() => {
    startTransition(() => {
      setIsNavigating(false);
      setIsMobileMenuOpen(false);
    });
  }, [pathname, startTransition]);

  return (
    <>
      {/* Top Loading Progress Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-100 h-0.75 overflow-hidden">
          <div className="h-full w-full bg-linear-to-r from-primary to-secondary animate-progress-bar shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
        </div>
      )}
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
            {NAV_LINK_DEFS.filter(
              (link) => !link.requiresAuth || isLoggedIn,
            ).map((link) => {
              const isActive =
                pathname === link.href ||
                (pathname?.startsWith(link.href) && link.href !== "/");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    if (pathname !== link.href) setIsNavigating(true);
                  }}
                  className={`group relative flex h-full items-center px-4 text-sm
                     font-semibold transition-all duration-300 ${
                       isActive
                         ? "text-zinc-900 bg-active-gradient dark:text-white"
                         : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900/40"
                     }`}
                >
                  {!isActive && (
                    <div className="gradient-border-persistent group-hover:opacity-10" />
                  )}
                  <span className="relative z-10">
                    {L("MealPlannerAPI", link.labelKey)}
                  </span>
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
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            {isLoggedIn && <NotificationDropdown />}

            {/* User Avatar Dropdown */}
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="gradient-border flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-zinc-200 transition-colors hover:ring-2 hover:ring-primary/50 focus:outline-none dark:bg-zinc-800 dark:hover:ring-primary/50"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                {isLoggedIn ? (
                  userProfile?.avatarUrl ? (
                    <Image
                      src={userProfile.avatarUrl}
                      alt={userProfile.name || "User"}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                      {userProfile?.name?.charAt(0).toUpperCase() ||
                        userProfile?.userName?.charAt(0).toUpperCase() ||
                        "U"}
                    </span>
                  )
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-zinc-500"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-zinc-200 bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950">
                  {isLoggedIn ? (
                    <>
                      <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                          {userProfile?.name ||
                            userProfile?.userName ||
                            "Null?"}
                        </p>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {userProfile?.email || ""}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href={
                            userProfile
                              ? `/profile/${userProfile.id}/settings`
                              : "/settings"
                          }
                          className="block px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          {L("MealPlannerAPI", "User:Settings")}
                        </Link>
                      </div>
                      <div className="border-t border-zinc-100 py-1 dark:border-zinc-800">
                        <button
                          className="block w-full px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            logout();
                            window.location.href = "/";
                          }}
                        >
                          {L("MealPlannerAPI", "User:SignOut")}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-1">
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {L("MealPlannerAPI", "User:SignIn")}
                      </Link>
                      <Link
                        href="/register"
                        className="block px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {L("MealPlannerAPI", "User:Register")}
                      </Link>
                    </div>
                  )}
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                /* Hamburger icon */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
              {NAV_LINK_DEFS.filter(
                (link) => !link.requiresAuth || isLoggedIn,
              ).map((link) => {
                const isActive =
                  pathname === link.href ||
                  (pathname?.startsWith(link.href) && link.href !== "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      if (pathname !== link.href) setIsNavigating(true);
                      setIsMobileMenuOpen(false);
                    }}
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
                    <span className="pl-2">
                      {L("MealPlannerAPI", link.labelKey)}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="mx-4 border-t border-zinc-100 dark:border-zinc-800" />

            {/* User section */}
            {isLoggedIn ? (
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="gradient-border flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    {userProfile?.avatarUrl ? (
                      <Image
                        src={userProfile.avatarUrl}
                        alt={userProfile.name || "User"}
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                        {userProfile?.name?.charAt(0).toUpperCase() ||
                          userProfile?.userName?.charAt(0).toUpperCase() ||
                          "U"}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {userProfile?.name || userProfile?.userName || "User"}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {userProfile?.email || ""}
                    </p>
                  </div>
                </div>
                <Link
                  href={
                    userProfile
                      ? `/profile/${userProfile.id}/settings`
                      : "/settings"
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Settings
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4 px-8 py-6">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 rounded-xl bg-zinc-100 py-2.5 text-center text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                >
                  {L("MealPlannerAPI", "User:SignIn")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 rounded-xl bg-linear-to-r from-primary to-secondary py-2.5 text-center text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  {L("MealPlannerAPI", "User:Register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
