export async function verifyAuthSession() {
  const api = import.meta.env.VITE_API_URL;
  const response = await fetch(`${api}/user/verify`, {
    method: "GET",
    credentials: "include",
  })

  return response.ok
}