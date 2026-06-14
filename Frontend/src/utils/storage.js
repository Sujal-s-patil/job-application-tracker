export function readUserInfo() {
  try {
    const raw = localStorage.getItem("userInfo")
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveUserInfo(userInfo) {
  localStorage.setItem("userInfo", JSON.stringify(userInfo))
}

export function clearUserInfo() {
  localStorage.removeItem("userInfo")
}