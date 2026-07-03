// Use the local proxy so all requests go through Next.js rewrites (avoids CORS).
const BASE_URL = "/proxy";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
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
  get:    <T>(path: string, init?: RequestOptions)              => request<T>(path, { method: "GET",    ...init }),
  post:   <T>(path: string, body: unknown, init?: RequestOptions) => request<T>(path, { method: "POST",   body, ...init }),
  put:    <T>(path: string, body: unknown, init?: RequestOptions) => request<T>(path, { method: "PUT",    body, ...init }),
  patch:  <T>(path: string, body: unknown, init?: RequestOptions) => request<T>(path, { method: "PATCH",  body, ...init }),
  delete: <T>(path: string, init?: RequestOptions)              => request<T>(path, { method: "DELETE", ...init }),
};
