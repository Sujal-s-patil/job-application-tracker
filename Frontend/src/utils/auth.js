import { request } from "../lib/api"

export async function verifyAuthSession() {
  try {
    await request("/user/verify")
    return true
  } catch {
    return false
  }
}