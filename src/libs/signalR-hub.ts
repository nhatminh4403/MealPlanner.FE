import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "./axios";

const HUB_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:44338") +
  "/signalr-hubs/meal-planner";

let connection: signalR.HubConnection | null = null;

export const getHubConnection = (): signalR.HubConnection => {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => getAccessToken() ?? "",
      })
      .withAutomaticReconnect()
      .configureLogging(
        process.env.NODE_ENV === "development"
          ? signalR.LogLevel.Information
          : signalR.LogLevel.Error
      )
      .build();

  }
  return connection;
};

export const startHub = async (): Promise<void> => {
  const hub = getHubConnection();
  if (hub.state === signalR.HubConnectionState.Disconnected) {
    await hub.start();
  }
};

export const stopHub = async (): Promise<void> => {
  if (connection?.state === signalR.HubConnectionState.Connected) {
    await connection.stop();
    connection = null;
  }
};

export const subscribeShoppingList = (
  shoppingListId: string,
  subscribe: boolean = true
): Promise<void> => {
  const hub = getHubConnection();
  return hub.invoke("SubscribeShoppingList", shoppingListId, subscribe);
};

// ── Hub event names (keep in sync with IMealPlannerAPIHubClient) ──────────────

export const HubEvents = {
  TrendingUpdated: "TrendingUpdated",
  StatsUpdated: "StatsUpdated",
  MealPlanUpdated: "MealPlanUpdated",
  ShoppingListUpdated: "ShoppingListUpdated",
  ShoppingItemToggled: "ShoppingItemToggled",
  NotificationReceived: "NotificationReceived",
  UnreadCountChanged: "UnreadCountChanged",
} as const;
export type HubEventName = (typeof HubEvents)[keyof typeof HubEvents];