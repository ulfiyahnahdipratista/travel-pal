// src/components/PrivateRoute.tsx
import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router"


export default function Middleware() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setLoading(false)
    }
    checkAuth()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
