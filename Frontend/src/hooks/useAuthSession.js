import { useEffect, useState } from "react"
import { verifyAuthSession } from "../utils/auth"

export function useAuthSession() {
  const [status, setStatus] = useState("loading")

  useEffect(() => {
    let active = true

    async function checkSession() {
      try {
        const authenticated = await verifyAuthSession()
        if (active) {
          setStatus(authenticated ? "authenticated" : "unauthenticated")
        }
      } catch {
        if (active) {
          setStatus("unauthenticated")
        }
      }
    }

    checkSession()

    return () => {
      active = false
    }
  }, [])

  return status
}
