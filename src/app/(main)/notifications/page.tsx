"use client";

import React, { useState, useEffect } from "react";
import { notifications } from "@/libs/api";
import { UserNotification } from "@/libs/interfaceDTO";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  Inbox,
  ShoppingCart,
  CalendarClock,
  ChefHat,
  Info,
  Bell,
  Trash2,
  GripHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { useNotifications } from "@/libs/NotificationProvider";

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

export default function NotificationsPage() {
  const [items, setItems] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const { unreadCount, notifyChanges, refreshKey } = useNotifications();
  const loadNotifications = async () => {
    try {
      const res = await notifications.getList({ maxResultCount: 100 });
      setItems(res.data.items);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadNotifications();
  }, [refreshKey]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notifications.markRead(id);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isRead: true } : i))
      );
      notifyChanges();
    } catch (error) {
      console.error("Failed to mark as read", error);
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAsUnread = async (id: string) => {
    try {
      await notifications.markUnread(id);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, isRead: false } : i))
      );
      notifyChanges();
    } catch (error) {
      console.error("Failed to mark as unread", error);
      toast.error("Failed to mark as unread");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const itemToDelete = items.find((i) => i.id === id);
      await notifications.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      
      if (itemToDelete && !itemToDelete.isRead) {
        notifyChanges();
      }
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Failed to delete notification", error);
      toast.error("Failed to delete notification");
    }
  };

  // Drag and Drop handlers
  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("notificationId", id);
    setDraggedId(id);
  };

  const onDragEnd = () => {
    setDraggedId(null);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDropToRead = async (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("notificationId");
    if (!id) return;
    const item = items.find((i) => i.id === id);
    if (item && !item.isRead) {
      await handleMarkAsRead(id);
      toast.success("Marked as read");
    }
    setDraggedId(null);
  };

  const onDropToUnread = async (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("notificationId");
    if (!id) return;
    const item = items.find((i) => i.id === id);
    if (item && item.isRead) {
      await handleMarkAsUnread(id);
      toast.success("Moved back to Unread");
    }
    setDraggedId(null);
  };

  const unreadItems = items.filter((i) => !i.isRead);
  const readItems = items.filter((i) => i.isRead);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-6 pt-24 pb-8 h-[calc(100vh-2rem)]">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-zinc-900 dark:text-white">
            <Bell className="h-8 w-8 text-primary" />
            Inbox
          </h1>
          <p className="mt-1 text-zinc-500">
            Drag items back and forth between Unread and Activity to manage them.
          </p>
        </div>
      </div>

      <div className="grid h-full flex-1 grid-cols-1 gap-6 overflow-hidden md:grid-cols-2">
        {/* UNREAD CONTAINER (Drop target for Read items) */}
        <div 
          onDragOver={onDragOver}
          onDrop={onDropToUnread}
          className={cn(
            "flex flex-col overflow-hidden rounded-3xl border transition-all shadow-sm",
            draggedId && items.find(i => i.id === draggedId)?.isRead
              ? "border-primary border-dashed bg-primary/5 ring-4 ring-primary/10"
              : "border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50"
          )}
        >
          <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              Unread
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                {unreadCount}
              </span>
            </h2>
          </div>

          <ScrollArea className="flex-1">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : unreadItems.length === 0 ? (
              <div className="flex h-60 flex-col items-center justify-center p-8 text-center">
                <Inbox className="mb-4 h-12 w-12 text-zinc-200 dark:text-zinc-800" />
                <p className="text-sm font-medium text-zinc-400">All caught up!</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {unreadItems.map((item) => {
                  const cfg = getTypeConfig(item.type);
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, item.id)}
                      onDragEnd={onDragEnd}
                      className="group relative flex cursor-grab items-start gap-4 rounded-2xl p-4 transition-all bg-primary/5 dark:bg-primary/10 border-zinc-100 dark:border-zinc-700 shadow-sm active:cursor-grabbing hover:shadow-md"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center text-zinc-300 group-hover:text-zinc-400">
                        <GripHorizontal className="h-4 w-4" />
                      </div>
                      
                      <div className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        cfg.bg
                      )}>
                        <Icon className={cn("h-5 w-5", cfg.color)} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-400">
                            {item.type}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {formatDistanceToNow(new Date(item.creationTime), { addSuffix: true })}
                          </span>
                        </div>
                        {item.title && (
                          <h4 className="mt-1 text-sm font-bold text-zinc-900 dark:text-white truncate">
                            {item.title}
                          </h4>
                        )}
                        <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                          {item.message}
                        </p>
                      </div>
                      
                      <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary" />
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* READ CONTAINER (Drop target for Unread items) */}
        <div 
          onDragOver={onDragOver}
          onDrop={onDropToRead}
          className={cn(
            "flex flex-col overflow-hidden rounded-3xl border transition-all shadow-sm",
            draggedId && !items.find(i => i.id === draggedId)?.isRead
              ? "border-primary border-dashed bg-primary/5 ring-4 ring-primary/10" 
              : "border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/20"
          )}
        >
          <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
              Recent Activity
            </h2>
            <span className="text-[10px] font-medium text-zinc-400">
              {readItems.length} items
            </span>
          </div>

          <ScrollArea className="flex-1">
            {readItems.length === 0 ? (
              <div className="flex h-60 flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900">
                   <Bell className="h-8 w-8 text-zinc-200 dark:text-zinc-800" />
                </div>
                <p className="max-w-50 text-xs leading-relaxed text-zinc-400 italic">
                  No recent activity to show.
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {readItems.map((item) => {
                  const cfg = getTypeConfig(item.type);
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, item.id)}
                      onDragEnd={onDragEnd}
                      className="group flex cursor-grab items-start gap-4 rounded-2xl p-4 transition-all opacity-80 hover:bg-zinc-50 hover:opacity-100 active:cursor-grabbing dark:hover:bg-zinc-900/50 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700"
                    >
                      <div className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        cfg.bg
                      )}>
                        <Icon className={cn("h-5 w-5", cfg.color)} />
                      </div>

                      <div className="min-w-0 flex-1">
                         <div className="flex items-center justify-between mb-1">
                           <span className="text-[10px] font-medium text-zinc-400">
                             {formatDistanceToNow(new Date(item.creationTime), { addSuffix: true })}
                           </span>
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               handleDelete(item.id);
                             }}
                             className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-zinc-600 dark:hover:bg-red-950/30"
                             aria-label="Delete notification"
                           >
                             <Trash2 className="h-4 w-4" />
                           </button>
                         </div>
                        {item.title && (
                          <h4 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                            {item.title}
                          </h4>
                        )}
                        <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
