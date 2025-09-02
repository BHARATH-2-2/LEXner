export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type ApiOptions = {
  method?: string;
  body?: any;
  token?: string | null;
  headers?: Record<string, string>;
  formData?: boolean;
};

export class ApiError extends Error {
  status: number;
  info?: any;
  constructor(message: string, status: number, info?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.info = info;
  }
}

function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000;
    return payload.exp && payload.exp < now;
  } catch {
    return true; // if parsing fails, treat as expired
  }
}

function getToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (token && isTokenExpired(token)) {
    localStorage.removeItem("token"); // clear expired token
    return null;
  }
  return token;
}

async function request<T = any>(path: string, opts: ApiOptions = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const headers: Record<string, string> = opts.headers || {};

  if (!opts.formData && opts.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const token = opts.token ?? getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    method: opts.method || "GET",
    headers,
    body: opts.formData
      ? opts.body
      : opts.body
      ? JSON.stringify(opts.body)
      : undefined,
  });

  const raw = await res.text();
  let data: any;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  if (!res.ok) {
    throw new ApiError(data?.detail || res.statusText, res.status, data);
  }

  return data as T;
}

export const api = {
  auth: {
    signup: (username: string, password: string) =>
      request("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password }),
      }),

    login: async (username: string, password: string) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
      }
      return data;
    },

    logout: () => localStorage.removeItem("token"),
    getToken,
  },

  webhook: (payload: any) =>
    request<{ fulfillmentText: string }>("/webhook", {
      method: "POST",
      body: payload,
    }),
};
