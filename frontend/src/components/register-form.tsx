import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)


  const navigate = useNavigate()

  console.log(avatarFile);


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    //TODO : register user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName,
        },
      },
    })

    if (error) {
      toast.error(error.message)
    }

    console.log(avatarFile);


    const user = data.user
    // Step 2: Upload avatar (optional)
    let avatarUrl = "";
    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const filePath = `${user?.id}.${fileExt}`;

      console.log("filePath : ", filePath);

      const { data, error: uploadError } = await supabase.storage
        .from("avatars") // Pastikan bucket bernama "avatars" sudah ada
        .upload(filePath, avatarFile, {
          upsert: true,
          cacheControl: "3600",
        });

      console.log("Upload data:", data);
      console.log("Upload error:", uploadError);

      if (uploadError) {
        toast.warning("Upload foto gagal, lanjut tanpa foto.");
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        avatarUrl = publicUrlData.publicUrl;
      }
    }

    // Step 3: Update user metadata (add avatar url)
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        name: fullName,
        avatar_url: avatarUrl,
      },
    });

    if (updateError) {
      toast.warning("Gagal menyimpan metadata tambahan.");
    } else {
      // Refresh session supaya metadata terbaru ikut ke context
      const { data: refreshedSession } = await supabase.auth.getSession();
      console.log("REFRESHED SESSION", refreshedSession);
    }

    // if (data) {
    // console.log("Registration data:", data) // Debugging log;
    // }

    toast.success("Registration successful!")
    navigate("/survey")
    setLoading(false)
  }

  return (
    <form onSubmit={handleRegister} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to register to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nama Lengkap"
            required />
        </div>
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
            autoComplete="new-password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            required />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="avatar">Foto Profil (optional)</Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setAvatarFile(e.target.files[0]);
              }
            }}
          />
        </div>

        <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Do you have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  )
}
