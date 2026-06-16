import { request } from "../lib/api"

export async function verifyAuthSession() {
  try {
    await request("/user/me")
    return true
  } catch {
    return false
  }
}