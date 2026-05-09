/**
 * Talk to the backend on port 5000 using the same hostname as the page (localhost or LAN IP).
 * Relative "/api" + Vite proxy was returning 404 for some setups; direct URL avoids that.
 */
export function getApiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (fromEnv) {
    return String(fromEnv).replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location?.hostname) {
    const { hostname } = window.location;
    return `http://${hostname}:5000/api`;
  }
  return "http://localhost:5000/api";
}
const TOKEN_STORAGE_KEY = "threadline_auth_token";
const API_BASE_URL = "https://thread-shopping-backend-staging.up.railway.app/api";

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

async function request(path, options = {}) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, options);

  if (!response.ok) {
    const data = await parseJsonSafe(response);
    if (response.status === 404) {
      throw new Error(
        data.message || "Products API not found. Is the backend running on port 5000 with the latest code?"
      );
    }
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return response.json();
}

async function authJson(path, options = {}) {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers,
  });

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        data.message ||
          "Auth API not found."
      );
    }
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data;
}

export function fetchProducts(queryString = "") {
  return request(`/products${queryString}`);
}

export function fetchProduct(productId) {
  return request(`/products/${productId}`);
}

export async function loginRequest(email, password) {
  return authJson("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerRequest(email, password, name) {
  return authJson("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}

export async function fetchMe() {
  return authJson("/auth/me", { method: "GET" });
}
