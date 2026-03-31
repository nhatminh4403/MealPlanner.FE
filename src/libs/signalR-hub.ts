import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "./axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:44338";
const DOCKER_API_URL =
  process.env.NEXT_PUBLIC_DOCKER_API_URL || "http://localhost:44339";

const HUB_URL = `${API_URL}/signalr-hubs/meal-planner`;
const DOCKER_HUB_URL = `${DOCKER_API_URL}/signalr-hubs/meal-planner`;

let connection: signalR.HubConnection | null = null;
let dockerConnection: signalR.HubConnection | null = null;

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
          : signalR.LogLevel.Error,
      )
      .build();
  }
  return connection;
};

export const getDockerHubConnection = (): signalR.HubConnection => {
  if (!dockerConnection) {
    dockerConnection = new signalR.HubConnectionBuilder()
      .withUrl(DOCKER_HUB_URL, {
        accessTokenFactory: () => getAccessToken() ?? "",
      })
      .withAutomaticReconnect()
      .configureLogging(
        process.env.NODE_ENV === "development"
          ? signalR.LogLevel.Information
          : signalR.LogLevel.Error,
      )
      .build();
  }
  return dockerConnection;
};

let startPromise: Promise<void> | null = null;
let startDockerPromise: Promise<void> | null = null;

export const startHub = async (): Promise<void> => {
  const token = getAccessToken();
  if (!token) return;
  const hub = getHubConnection();
  if (hub.state === signalR.HubConnectionState.Disconnected) {
    if (!startPromise) {
      startPromise = hub.start().finally(() => {
        startPromise = null;
      });
    }
    return startPromise;
  }
  if (startPromise) {
    return startPromise;
  }
};

export const startDockerHub = async (): Promise<void> => {
  const hub = getDockerHubConnection();
  if (hub.state === signalR.HubConnectionState.Disconnected) {
    if (!startDockerPromise) {
      startDockerPromise = hub.start().finally(() => {
        startDockerPromise = null;
      });
    }
    return startDockerPromise;
  }
  if (startDockerPromise) {
    return startDockerPromise;
  }
};

export const stopHub = async (): Promise<void> => {
  if (connection?.state === signalR.HubConnectionState.Connected) {
    await connection.stop();
    connection = null;
  }
};

export const stopDockerHub = async (): Promise<void> => {
  if (dockerConnection?.state === signalR.HubConnectionState.Connected) {
    await dockerConnection.stop();
    dockerConnection = null;
  }
};

export const subscribeShoppingList = (
  shoppingListId: string,
  subscribe: boolean = true,
): Promise<void> => {
  const hub = getHubConnection();
  return hub.invoke("SubscribeShoppingList", shoppingListId, subscribe);
};

export const subscribeDockerShoppingList = (
  shoppingListId: string,
  subscribe: boolean = true,
): Promise<void> => {
  const hub = getDockerHubConnection();
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
