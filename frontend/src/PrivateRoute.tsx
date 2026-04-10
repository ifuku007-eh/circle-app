import { Outlet, Navigate } from "react-router-dom"
import { useAppSelector } from "./store/hooks"

export default function PrivateRoute() {
  const { isAuthenticated } = useAppSelector((s) => s.auth)

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}