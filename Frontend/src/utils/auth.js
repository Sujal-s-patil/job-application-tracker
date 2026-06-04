export async function verifyAuthSession() {
  const response = await fetch("http://localhost:8000/user/verify", {
    method: "GET",
    credentials: "include",
  })

  return response.ok
}