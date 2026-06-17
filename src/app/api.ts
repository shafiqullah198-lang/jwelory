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

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  let url;
  if (endpoint.startsWith("http")) {
    url = endpoint;
  } else if (endpoint.startsWith("/")) {
    const isLocalhost = window.location.hostname === "localhost";
    const base = isLocalhost ? "http://localhost:8000" : "http://127.0.0.1:8000";
    url = `${base}${endpoint}`;
  } else {
    const isLocalhost = window.location.hostname === "localhost";
    const base = isLocalhost ? "http://localhost:8000/api" : "http://127.0.0.1:8000/api";
    url = `${base}/${endpoint}`;
  }

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
    if (url.startsWith("http")) {
      console.warn(`Direct fetch to ${url} failed. Retrying via relative proxy...`);
      const fallbackUrl = endpoint.startsWith("/") ? endpoint : `/api/${endpoint}`;
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
