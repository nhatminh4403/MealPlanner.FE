"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { getHubConnection, startHub, stopHub, HubEvents } from "./signalR-hub";
import { UserNotification } from "./interfaceDTO";

type HubEventHandlers = Partial<{
  onTrendingUpdated: () => void;
  onStatsUpdated: (stats: unknown) => void;
  onMealPlanUpdated: (mealPlan: unknown) => void;
  onShoppingListUpdated: (shoppingList: unknown) => void;
  onShoppingItemToggled: (shoppingListId: string, item: unknown) => void;
  onNotificationReceived: (notification: UserNotification) => void;
  onUnreadCountChanged: (count: number) => void;
}>;

export const useHub = (handlers: HubEventHandlers = {}) => {
  const handlersRef = useRef(handlers);
  useLayoutEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const hub = getHubConnection();

    const wrap =
      <T extends unknown[]>(key: keyof HubEventHandlers) =>
      (...args: T) => {
        const fn = handlersRef.current[key] as ((...a: T) => void) | undefined;
        fn?.(...args);
      };

    const onTrending = wrap("onTrendingUpdated");
    const onStats = wrap("onStatsUpdated");
    const onMealPlan = wrap("onMealPlanUpdated");
    const onShoppingList = wrap("onShoppingListUpdated");
    const onShoppingItem = wrap("onShoppingItemToggled");
    const onNotification = wrap("onNotificationReceived");
    const onUnreadCount = wrap("onUnreadCountChanged");
    hub.on(HubEvents.TrendingUpdated, onTrending);
    hub.on(HubEvents.StatsUpdated, onStats);
    hub.on(HubEvents.MealPlanUpdated, onMealPlan);
    hub.on(HubEvents.ShoppingListUpdated, onShoppingList);
    hub.on(HubEvents.ShoppingItemToggled, onShoppingItem);
    hub.on(HubEvents.NotificationReceived, onNotification);
    hub.on(HubEvents.UnreadCountChanged, onUnreadCount);
    startHub().catch(console.error);

    return () => {
      hub.off(HubEvents.TrendingUpdated, onTrending);
      hub.off(HubEvents.StatsUpdated, onStats);
      hub.off(HubEvents.MealPlanUpdated, onMealPlan);
      hub.off(HubEvents.ShoppingListUpdated, onShoppingList);
      hub.off(HubEvents.ShoppingItemToggled, onShoppingItem);
      hub.off(HubEvents.NotificationReceived, onNotification);
      hub.off(HubEvents.UnreadCountChanged, onUnreadCount);
      if (hub.state === HubConnectionState.Connected) {
        const hasListeners = Object.values(HubEvents).some(
          (event) => (hub as unknown as { _closedCallbacks?: unknown[] })
            ?? event
        );
        if (!hasListeners) stopHub().catch(console.error);
      }
    };
  }, []);
};