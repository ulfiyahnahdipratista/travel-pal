// src/components/register-form.tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router"; // Use react-router-dom
import React, { useState, useRef } from "react"; // Import useRef
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"; // Import Dialog Shadcn
import { Slider } from "@/components/ui/slider"; // Optional: for zoom control
import { Minus, Plus } from "lucide-react"; // Icons for zoom

import ReactCrop from 'react-image-crop';
import type { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { DialogDescription } from "@radix-ui/react-dialog"; // Pastikan ini diimpor dengan benar

// Helper function to get a cropped image from a canvas
async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  scaleX: number, // Ini adalah rasio naturalWidth / displayedWidth
  scaleY: number // Ini adalah rasio naturalHeight / displayedHeight
): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // Hitung ulang dimensi crop ke ukuran asli gambar
  const sx = crop.x * scaleX;
  const sy = crop.y * scaleY;
  const sWidth = crop.width * scaleX;
  const sHeight = crop.height * scaleY;

  // Ukuran kanvas sama dengan ukuran crop yang diinginkan
  canvas.width = sWidth;
  canvas.height = sHeight;

  ctx.drawImage(
    image,
    // Parameter source image (x, y, width, height) - ini adalah bagian gambar ASLI yang akan diambil
    sx,
    sy,
    sWidth,
    sHeight,
    // Parameter destination canvas (x, y, width, height) - ini adalah di mana dan seberapa besar digambar di canvas BARU
    0, // Mulai dari pojok kiri atas canvas baru
    0, // Mulai dari pojok kiri atas canvas baru
    sWidth, // Gambar dengan lebar sWidth di canvas baru
    sHeight // Gambar dengan tinggi sHeight di canvas baru
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png'); // Anda bisa memilih 'image/jpeg' atau format lain
  });
}

export function RegisterFormNew({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States for image cropping
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [rotate] = useState(0);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const navigate = useNavigate(); // Pastikan ini diimpor dari 'react-router-dom'

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSrc(URL.createObjectURL(e.target.files[0]));
      setIsCropModalOpen(true);
    }
  };

  const handleImageLoaded = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log(e);

    // Pastikan crop diinisialisasi hanya jika gambar sudah dimuat
    if (imgRef.current) {
      setCrop({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25,
      });
    }
  };

  const handleCropComplete = (crop: PixelCrop) => {
    setCompletedCrop(crop);
  };

  const handleCropConfirm = async () => {
    if (imgRef.current && completedCrop) {
      // Hitung skala berdasarkan ukuran gambar yang dirender vs ukuran asli
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      const croppedBlob = await getCroppedImg(
        imgRef.current,
        completedCrop,
        scaleX,
        scaleY
      );

      if (croppedBlob) {
        const croppedFile = new File([croppedBlob], `avatar-${Date.now()}.png`, { type: 'image/png' });
        setAvatarFile(croppedFile);
      }
    }
    setSrc(null); // Clear the source image URL
    setIsCropModalOpen(false); // Close the modal
  };

  const handleCropCancel = () => {
    setSrc(null);
    setAvatarFile(null); // Clear the selected file if canceled
    setIsCropModalOpen(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      setLoading(false);
      return toast.error(authError.message);
    }

    const user = data.user;

    if (!user) {
      setLoading(false);
      return toast.error("Registrasi berhasil, tetapi gagal mendapatkan info pengguna. Silakan coba login.");
    }

    let avatarUrl = "";
    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, {
          upsert: true,
          cacheControl: "3600",
        });

      console.log("uploadData : ", uploadData);

      if (uploadError) {
        toast.warning(`Upload foto gagal: ${uploadError.message}. Lanjut tanpa foto.`);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        avatarUrl = publicUrlData.publicUrl;
      }
    }

    if (avatarUrl) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: avatarUrl,
        },
      });
      if (updateError) {
        toast.warning(`Gagal menyimpan URL avatar: ${updateError.message}`);
      }
    }

    toast.success("Registrasi berhasil!");
    navigate("/survey");
    window.location.reload(); // akan reload setelah pindah
    setLoading(false);
  };

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
            required
          />
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
            required
          />
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
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {/* Improved File Input with Preview */}
        <div className="grid gap-3">
          <Label htmlFor="avatar">Foto Profil (optional)</Label>
          <div className="flex items-center space-x-4">
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="flex-1"
            />
            {avatarFile && (
              <img
                src={URL.createObjectURL(avatarFile)}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary"
              />
            )}
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
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

      {/* Crop Modal */}
      {src && (
        <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crop Foto Profil</DialogTitle>
              <DialogDescription>
                Posisikan dan potong gambar Anda untuk foto profil.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center">
              <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={handleCropComplete}
                aspect={1}
                minWidth={50}
                minHeight={50}
                circularCrop={true} // Jika ingin lingkaran, pakai true
                disabled={!src}
              >
                <img
                  ref={imgRef}
                  src={src}
                  alt="Source"
                  onLoad={handleImageLoaded}
                  // Penting: Pastikan transformasi ini tidak mempengaruhi perhitungan crop
                  // ReactCrop biasanya menangani ini, tetapi jika ada masalah,
                  // mungkin perlu dipindahkan atau dinonaktifkan sementara untuk debugging
                  style={{
                    transform: `scale(${scale}) rotate(${rotate}deg)`,
                    // Tambahan: Pastikan gambar tidak overscroll atau memiliki padding aneh
                    objectFit: 'contain', // Atau 'cover', tergantung kebutuhan visual Anda
                    maxWidth: '100%',
                    maxHeight: '40vh', // Batasi tinggi agar sesuai di modal
                  }}
                />
              </ReactCrop>
              {/* Optional: Zoom controls */}
              <div className="flex items-center gap-2 mt-4 w-full px-4">
                <Minus size={16} className="text-muted-foreground" />
                <Slider
                  min={1}
                  max={3}
                  step={0.1}
                  value={[scale]}
                  onValueChange={([val]) => setScale(val)}
                  className="flex-1"
                />
                <Plus size={16} className="text-muted-foreground" />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleCropCancel}>
                Batal
              </Button>
              <Button onClick={handleCropConfirm} disabled={!completedCrop}>
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </form>
  );
}