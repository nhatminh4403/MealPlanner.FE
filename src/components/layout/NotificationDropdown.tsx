"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { notifications } from "@/libs/api";
import { UserNotification } from "@/libs/interfaceDTO";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/libs/NotificationProvider";
import {
  Bell,
  CheckCheck,
  Inbox,
  ShoppingCart,
  CalendarClock,
  ChefHat,
  Info,
} from "lucide-react";

// Map notification types to icons + accent colors
const TYPE_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  MealReminder: {
    icon: CalendarClock,
    color: "text-violet-500",
    bg: "bg-violet-100 dark:bg-violet-950",
  },
  ShoppingListAlert: {
    icon: ShoppingCart,
    color: "text-emerald-500",
    bg: "bg-emerald-100 dark:bg-emerald-950",
  },
  RecipeUpdate: {
    icon: ChefHat,
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-950",
  },
  Default: {
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-950",
  },
};

function getTypeConfig(type?: string) {
  return TYPE_CONFIG[type ?? ""] ?? TYPE_CONFIG.Default;
}

export function NotificationDropdown() {
  const [items, setItems] = useState<UserNotification[]>([]);
  const { unreadCount, refreshCount, refreshKey, notifyChanges } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await notifications.getList({ maxResultCount: 20 });
        if (isMounted && res.data) {
          setItems(res.data.items);
          refreshCount();
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };
    load();
    const timer = setInterval(load, 30000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [refreshCount, refreshKey]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notifications.markRead(id);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isRead: true } : i))
      );
      notifyChanges();
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notifications.markAllRead();
      setItems((prev) => prev.map((i) => ({ ...i, isRead: true })));
      notifyChanges();
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-full 
          bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200
          dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center 
            justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-90 p-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-2xl"
        align="end"
        sideOffset={8}
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('[aria-label="Toggle dark mode"]')) {
            e.preventDefault();
          }
        }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3 border-b
         border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="inline-flex items-center rounded-full
               bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-primary transition-colors"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* ── List ───────────────────────────────────────────── */}
        <ScrollArea className="max-h-100">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
              <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                <Inbox className="h-5 w-5 text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                All caught up!
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                No notifications right now.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
              {items.map((item) => {
                const cfg = getTypeConfig(item.type);
                const Icon = cfg.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!item.isRead) handleMarkAsRead(item.id);
                    }}
                    className={cn(
                      "group flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800",
                      !item.isRead && "bg-primary/5 dark:bg-primary/10"
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        cfg.bg
                      )}
                    >
                      <Icon className={cn("h-4 w-4", cfg.color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {item.title && (
                        <p className="text-xs font-semibold text-zinc-500
                         dark:text-zinc-400 mb-0.5 uppercase tracking-wide">
                          {item.title}
                        </p>
                      )}
                      <p
                        className={cn(
                          "text-sm leading-snug",
                          !item.isRead
                            ? "font-medium text-zinc-900 dark:text-zinc-100"
                            : "text-zinc-500 dark:text-zinc-400"
                        )}
                      >
                        {item.message}
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-400">
                        {formatDistanceToNow(new Date(item.creationTime), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {!item.isRead && (
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 px-4 py-2.5">
          <Link
            href="/notifications"
            onClick={() => setIsOpen(false)}
            className="block text-center text-[11px] font-semibold text-zinc-400 hover:text-primary transition-colors"
          >
            View all notifications →
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}