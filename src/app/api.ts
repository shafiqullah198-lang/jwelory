// API wrapper helper for Django Backend

function getCookie(name: string): string | null {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const DEFAULT_API_BASE_URL = "https://jewelery1.pythonanywhere.com";
const rawApiBaseUrl = (
  import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL
).trim();

function normalizeBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/+$/, "");
  if (!trimmed) {
    return "";
  }

  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

const apiBaseUrl = normalizeBaseUrl(rawApiBaseUrl);
const apiOrigin = rawApiBaseUrl ? new URL(rawApiBaseUrl, window.location.origin).origin : window.location.origin;

export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("//")) {
    return trimmed;
  }
  return new URL(trimmed, `${apiOrigin}/`).toString();
}

export class ApiError extends Error {
  data: any;
  status: number;

  constructor(message: string, data: any, status: number) {
    super(message);
    this.name = "ApiError";
    this.data = data;
    this.status = status;
  }
}

function buildApiUrl(endpoint: string): string {
  if (endpoint.startsWith("http")) {
    return endpoint;
  }

  const normalizedEndpoint = endpoint.replace(/^\/+/, "");
  return `${apiBaseUrl}/${normalizedEndpoint}`;
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = buildApiUrl(endpoint);

  // Build headers
  const headers = new Headers(options.headers || {});
  
  // Set content type to JSON by default if sending a body
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Handle CSRF for write requests (POST, PUT, DELETE, PATCH)
  const method = (options.method || "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS", "TRACE"].includes(method)) {
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
      headers.set("X-CSRFToken", csrfToken);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Required to send session cookies
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: "An unexpected error occurred" };
    }
    const validationMessage = errorData.errors
      ? Object.values(errorData.errors).join(" ")
      : "";
    throw new ApiError(
      errorData.message || validationMessage || `HTTP error! status: ${response.status}`,
      errorData,
      response.status
    );
  }

  // For logout or clean delete responses, it might be 204 or empty
  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

// Fetch CSRF token from backend to initialize
export async function initCsrf(): Promise<void> {
  try {
    await apiFetch("auth/csrf/");
  } catch (err) {
    console.error("Failed to initialize CSRF token:", err);
  }
}
