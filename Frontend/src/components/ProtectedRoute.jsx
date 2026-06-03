import { useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { verifyAuthSession } from "../utils/auth"

export function ProtectedRoute() {
  const location = useLocation()
  const [status, setStatus] = useState("loading")

  useEffect(() => {
    let isMounted = true

    async function checkAuth() {
      try {
        const authenticated = await verifyAuthSession()

        if (isMounted) {
          setStatus(authenticated ? "authenticated" : "unauthenticated")
        }
      } catch {
        if (isMounted) {
          setStatus("unauthenticated")
        }
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [])

  if (status === "loading") {
    return null
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export function PublicRoute() {
  return <Outlet />
}