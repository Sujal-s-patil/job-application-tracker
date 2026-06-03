export const AUTH_TOKEN_COOKIE_NAME = "token"

export async function verifyAuthSession() {
  const response = await fetch("http://localhost:8000/user/verify", {
    method: "GET",
    credentials: "include",
  })

  return response.ok
}