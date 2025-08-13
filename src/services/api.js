import { API_BASE } from "@/config";

let accessToken = null;
let refreshToken = null;

export function setTokens(at, rt) {
  accessToken = at;
  refreshToken = rt;
  localStorage.setItem("access_token", at);
  localStorage.setItem("refresh_token", rt);
}

export function loadTokens() {
  accessToken = localStorage.getItem("access_token");
  refreshToken = localStorage.getItem("refresh_token");
}

async function refreshAccessToken() {
  if (!refreshToken) return null;
  const res = await fetch(`${API_BASE}/api/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  accessToken = data.access;
  localStorage.setItem("access_token", accessToken);
  return accessToken;
}

export async function api(path, method = "GET", body) {
  loadTokens();
  const doFetch = async () =>
    fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });

  let res = await doFetch();
  if (res.status === 401) {
    const newAT = await refreshAccessToken();
    if (newAT) res = await doFetch();
  }
  if (!res.ok) throw new Error(await res.text());
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res;
}
