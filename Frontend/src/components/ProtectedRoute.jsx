import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthSession } from "../hooks/useAuthSession"
import { FullPageLoader } from "./ui/Feedback"

export function ProtectedRoute() {
  const location = useLocation()
  const status = useAuthSession()

  if (status === "loading") {
    return <FullPageLoader title="Checking your session" message="Please wait while we verify your login state." />
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export function PublicRoute() {
  const status = useAuthSession()

  if (status === "loading") {
    return <FullPageLoader title="Loading" message="Preparing the authentication flow." />
  }

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}