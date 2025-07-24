import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router"
// import Cookies from "js-cookie"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    const accessToken = data.session?.access_token

    console.log("User data:", data);

    if (!accessToken) {
      setLoading(false)
      return toast.error("Login failed: No access token received, Retry again.")
    }

    if (error) {
      setError(error.message)
      return toast.error(error.message)
    } else {
      toast.success("Login successful")
      navigate("/") // Navigate to home page after successful login
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleLogin} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="m@example.com"
            required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            required />
        </div>
        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="underline underline-offset-4">
          Register
        </Link>
      </div>
    </form>
  )
}
