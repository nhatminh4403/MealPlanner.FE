"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { notifications } from "@/libs/api";
import { isAuthenticated } from "@/libs/axios";
import { useHub } from "@/libs/useHub";
import { UserNotification } from "@/libs/interfaceDTO";

interface NotificationContextType {
  unreadCount: number;
  recentItems: UserNotification[];
  setCount: (count: number) => void;
  decrementCount: () => void;
  // Signals the dropdown to re-render after local mutations
  markItemRead: (id: string) => void;
  markAllItemsRead: () => void;
  prependItem: (item: UserNotification) => void;
  refreshKey: number;
  notifyChanges: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// SignalR sends UserNotificationDto (number type), REST returns UserNotification (string type).
// Normalize so both work in the same list.
function normalize(dto: UserNotification): UserNotification {
  const typeMap: Record<number, string> = {
    0: "Default",
    1: "MealReminder",
    2: "RecipeUpdate",
    3: "ShoppingListAlert",
  };
  return {
    ...dto,
    type: typeMap[dto.type as unknown as number] ?? "Default",
  };
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentItems, setRecentItems] = useState<UserNotification[]>([]);

  // ── Initial load ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated()) return;

    const init = async () => {
      try {
        const [listRes] = await Promise.all([
          notifications.getList({ maxResultCount: 20 }),
        ]);
        setUnreadCount(listRes.data.totalCount);
        setRecentItems(listRes.data.items);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    init();
  }, []);

  // ── SignalR ─────────────────────────────────────────────────────────────────
  useHub({
    onNotificationReceived: useCallback((dto: UserNotification) => {
      const item = normalize(dto);
      setRecentItems((prev) => {
        // Avoid duplicates if server pushes something already fetched
        if (prev.some((n) => n.id === item.id)) return prev;
        return [item, ...prev].slice(0, 20);
      });
    }, []),

    onUnreadCountChanged: useCallback((count: number) => {
      setUnreadCount(count);
    }, []),
  });

  // ── Mutation helpers (called by dropdown after REST mutations) ──────────────
  const markItemRead = useCallback((id: string) => {
    setRecentItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    // Count will update via SignalR; decrement optimistically in case of lag
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllItemsRead = useCallback(() => {
    setRecentItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, []);

  const prependItem = useCallback((item: UserNotification) => {
    setRecentItems((prev) => [item, ...prev].slice(0, 20));
  }, []);

  const decrementCount = useCallback(
    () => setUnreadCount((prev) => Math.max(0, prev - 1)),
    []
  );

  const [refreshKey, setRefreshKey] = useState(0);

  const notifyChanges = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        recentItems,
        setCount: setUnreadCount,
        decrementCount,
        markItemRead,
        markAllItemsRead,
        prependItem,
        refreshKey,
        notifyChanges,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotifications must be used within a NotificationProvider");
  return ctx;
}