import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:44338";
const DOCKER_API_URL =
  process.env.NEXT_PUBLIC_DOCKER_API_URL || "https://localhost:44339";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

export const dockerApi = axios.create({
  baseURL: `${DOCKER_API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

// ── Interceptor Helpers ──────────────────────────────────────────────────────
export const getApiInstance = () => {
  return process.env.NEXT_PUBLIC_USE_DOCKER_API === "true" ? dockerApi : api;
};

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  if (typeof window === "undefined") return config;
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

const responseInterceptorError = async (error: AxiosError) => {
  const original = error.config as typeof error.config & { _retry?: boolean };

  if (error.response?.status === 401 && !original?._retry) {
    original._retry = true;
    try {
      const token = await refreshAccessToken();
      if (token && original) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${token}`;
        return axios(original);
      }
    } catch {
      clearTokens();
      window.location.href = "/login";
    }
  }

  return Promise.reject(error);
};

// Apply interceptors
api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use((res) => res, responseInterceptorError);

dockerApi.interceptors.request.use(requestInterceptor);
dockerApi.interceptors.response.use((res) => res, responseInterceptorError);

// ── Token helpers ─────────────────────────────────────────────────────────────

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;

export const isAuthenticated = () => !!getAccessToken();

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID ?? "MealPlannerAPI_App",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) throw new Error("Refresh failed");

  const data = await res.json();
  setTokens(data.access_token, data.refresh_token);
  return data.access_token;
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface LoginResult {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export const login = async (
  username: string,
  password: string,
): Promise<LoginResult> => {
  const res = await fetch(`${API_URL}/connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "password",
      client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID ?? "MealPlannerAPI_App",
      username,
      password,
      scope: "MealPlannerAPI offline_access",
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description ?? "Login failed");

  setTokens(data.access_token, data.refresh_token);
  return data;
};

export const logout = () => {
  clearTokens();
  window.location.href = "/login";
};

export const register = async (data: Record<string, unknown>) => {
  const res = await api.post("/account/register", data);
  return res.data;
};
