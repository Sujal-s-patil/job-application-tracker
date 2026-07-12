const apiBase = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "")

function apiUrl(path) {
  if (!path) {
    return apiBase
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${apiBase}${normalizedPath}`
}

export async function request(path, options = {}) {
  const { body, headers, ...rest } = options
  const response = await fetch(apiUrl(path), {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    ...rest,
  })

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get("content-type") ?? ""
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text()

if (!response.ok) {
  console.log(payload);

  let message =
    (typeof payload === "string" && payload.trim()) ||
    (payload &&
      typeof payload === "object" &&
      typeof payload.message === "string" &&
      payload.message) ||
    (payload &&
      typeof payload === "object" &&
      payload.message &&
      typeof payload.message === "object" &&
      typeof payload.message.message === "string" &&
      payload.message.message) ||
    response.statusText ||
    "Request failed";

  const error = new Error(message);
  error.status = response.status;
  error.payload = payload;

  throw error;
}

  return payload
}

export function sanitizePayload(values) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== "" && value !== null && value !== undefined),
  )
}
