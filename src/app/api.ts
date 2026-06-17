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

const rawApiBaseUrl = (import.meta.env.VITE_API_URL || "").trim();

function normalizeBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/+$/, "");
  if (!trimmed) {
    return "";
  }

  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

const apiBaseUrl = normalizeBaseUrl(rawApiBaseUrl);

function buildApiUrl(endpoint: string): string {
  if (endpoint.startsWith("http")) {
    return endpoint;
  }

  const normalizedEndpoint = endpoint.replace(/^\/+/, "");

  if (!apiBaseUrl) {
    const localBasePath = endpoint.startsWith("/") ? "" : "/api";
    return `${localBasePath}/${normalizedEndpoint}`.replace(/\/{2,}/g, "/");
  }

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

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Required to send session cookies
    });
  } catch (err: any) {
    if (url.startsWith("http") && !apiBaseUrl) {
      console.warn(`Direct fetch to ${url} failed. Retrying via relative proxy...`);
      const fallbackUrl = endpoint.startsWith("/") ? endpoint : `/api/${endpoint.replace(/^\/+/, "")}`;
      response = await fetch(fallbackUrl, {
        ...options,
        headers,
        credentials: "same-origin",
      });
    } else {
      throw err;
    }
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: "An unexpected error occurred" };
    }
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
