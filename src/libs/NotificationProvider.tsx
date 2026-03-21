"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { notifications } from "@/libs/api";

interface NotificationContextType {
  unreadCount: number;
  refreshCount: () => Promise<void>;
  decrementCount: () => void;
  incrementCount: () => void;
  setCount: (count: number) => void;
  // New: Broadcast mechanism to trigger re-fetches in lists
  refreshKey: number;
  notifyChanges: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshCount = useCallback(async () => {
    try {
      const res = await notifications.getUnreadNotificationCount();
      setUnreadCount(res.data);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  }, []);

  const notifyChanges = useCallback(() => {
    refreshCount();
  }, [refreshCount]);

  useEffect(() => {
    (async () => {
      await refreshCount();
    })();

    const interval = setInterval(() => {
      refreshCount();
    }, 60000);

    return () => clearInterval(interval);
  }, [refreshCount]);

  const decrementCount = () => setUnreadCount(prev => Math.max(0, prev - 1));
  const incrementCount = () => setUnreadCount(prev => prev + 1);
  const setCount = (count: number) => setUnreadCount(count);

  return (
    <NotificationContext.Provider value={{ 
      unreadCount, 
      refreshCount, 
      decrementCount, 
      incrementCount, 
      setCount,
      refreshKey,
      notifyChanges
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
