import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// ── instance ──────────────────────────────────────────────────────────────────
export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// ── token helpers (safe for SSR) ──────────────────────────────────────────────
const isBrowser = typeof window !== "undefined";

export const tokenStore = {
  getAccess:  () => (isBrowser ? localStorage.getItem("san_access_token")  : null),
  getRefresh: () => (isBrowser ? localStorage.getItem("san_refresh_token") : null),
  set: (access: string, refresh: string) => {
    localStorage.setItem("san_access_token",  access);
    localStorage.setItem("san_refresh_token", refresh);
  },
  clear: () => {
    localStorage.removeItem("san_access_token");
    localStorage.removeItem("san_refresh_token");
    localStorage.removeItem("san_user");
  },
};

// ── request interceptor — attach Bearer token ─────────────────────────────────
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── response interceptor — silent token refresh on 401 ───────────────────────
let isRefreshing = false;
type Waiter = { resolve: (t: string) => void; reject: (e: unknown) => void };
let waiters: Waiter[] = [];

const flush = (err: unknown, token: string | null = null) => {
  waiters.forEach((w) => (err ? w.reject(err) : w.resolve(token!)));
  waiters = [];
};

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // only handle 401 once per request
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // queue concurrent requests while refreshing
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        waiters.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return http(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    const refreshToken = tokenStore.getRefresh();
    if (!refreshToken) {
      tokenStore.clear();
      if (isBrowser) window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
        { refreshToken },
      );
      tokenStore.set(data.accessToken, data.refreshToken ?? refreshToken);
      flush(null, data.accessToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return http(original);
    } catch (refreshError) {
      flush(refreshError);
      tokenStore.clear();
      if (isBrowser) window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
