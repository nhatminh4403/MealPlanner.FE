"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { notifications } from "@/libs/api";
import { UserNotification } from "@/libs/interfaceDTO";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, Inbox } from "lucide-react";

export function NotificationDropdown() {
  const [items, setItems] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);



  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const res = await notifications.getList({ maxResultCount: 20 });
        if (isMounted) {
          setItems(res.data.items);
          setUnreadCount(res.data.items.filter(i => !i.isRead).length);
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
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notifications.markRead(id);
      setItems(prev => prev.map(i => i.id === id ? { ...i, isRead: true } : i));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notifications.markAllRead();
      setItems(prev => prev.map(i => ({ ...i, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="gradient-border relative flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="View notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden" align="end">
        <PopoverHeader className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <PopoverTitle className="text-sm font-semibold flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="h-4.5 px-1.5 text-[10px] bg-primary/10 text-primary border-none">
                {unreadCount} new
              </Badge>
            )}
          </PopoverTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-[10px] h-7 px-2 hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-1"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="h-3 w-3" />
              Mark all as read
            </Button>
          )}
        </PopoverHeader>
        <ScrollArea className="h-87.5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-3">
                <Inbox className="h-6 w-6 text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">No notifications yet</p>
              <p className="text-xs text-zinc-500 mt-1">We&apos;ll let you know when something happens</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex flex-col gap-1 p-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors relative group",
                    !item.isRead && "bg-primary/2 dark:bg-primary/5"
                  )}
                  onClick={() => {
                    if (!item.isRead) handleMarkAsRead(item.id);
                    // Add redirection logic if notification has a link/target
                  }}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className={cn(
                      "text-sm leading-relaxed", 
                      !item.isRead ? "font-semibold text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"
                    )}>
                      {item.message}
                    </p>
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-zinc-400 font-medium">
                      {formatDistanceToNow(new Date(item.creationTime), { addSuffix: true })}
                    </span>
                    {!item.isRead && (
                      <span className="text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        Mark as read
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 text-center">
          <Link 
            href="/notifications" 
            className="text-[11px] font-semibold text-zinc-500 hover:text-primary transition-colors py-1 block w-full"
            onClick={() => setIsOpen(false)}
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
