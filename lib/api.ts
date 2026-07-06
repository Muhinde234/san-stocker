// Use the local proxy so all requests go through Next.js rewrites (avoids CORS).
const BASE_URL = "/proxy";

const isBrowser = typeof window !== "undefined";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue | QueryValue[]>;

function buildUrl(path: string, query?: QueryParams) {
  if (!query) return `${BASE_URL}${path}`;

  const url = new URL(`${BASE_URL}${path}`, "http://localhost");

  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== null && item !== undefined) url.searchParams.append(key, String(item));
      }
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

async function request<T>(path: string, options: RequestOptions & { query?: QueryParams } = {}): Promise<T> {
  const { body, headers, query, ...rest } = options;
  const token = isBrowser
    ? (localStorage.getItem("san_access_token") ?? localStorage.getItem("accessToken"))
    : null;

  const res = await fetch(buildUrl(path, query), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data.message ?? data.error ?? JSON.stringify(data);
    } catch {
      message = await res.text().catch(() => message);
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(path: string, init?: RequestOptions & { query?: QueryParams })              => request<T>(path, { method: "GET",    ...init }),
  post:   <T>(path: string, body: unknown, init?: RequestOptions) => request<T>(path, { method: "POST",   body, ...init }),
  put:    <T>(path: string, body: unknown, init?: RequestOptions) => request<T>(path, { method: "PUT",    body, ...init }),
  patch:  <T>(path: string, body: unknown, init?: RequestOptions) => request<T>(path, { method: "PATCH",  body, ...init }),
  delete: <T>(path: string, init?: RequestOptions)              => request<T>(path, { method: "DELETE", ...init }),
};
