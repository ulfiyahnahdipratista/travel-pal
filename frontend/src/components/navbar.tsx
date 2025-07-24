// src/components/navbar.tsx
import * as React from "react";
import { Link, useLocation } from "react-router";
import { Menu } from "lucide-react"; // Import ikon burger menu

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button"; // Pastikan Anda sudah menginstal komponen Button
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; // Pastikan Anda sudah menginstal komponen Sheet
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext"; // Import hook untuk context
import { UserNav } from "./ui/user-nav";

export function MainNav() {
  const [isOpen, setIsOpen] = React.useState(false); // State untuk mengontrol sheet
  const [scrolled, setScrolled] = React.useState(false); // State baru untuk melacak scroll
  const location = useLocation(); // Gunakan useLocation hook
  const { user } = useAuth(); // Ambil user dan fungsi logout dari context


  // Fungsi untuk menentukan apakah link aktif
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  React.useEffect(() => {
    const handleScroll = () => {
      // Set 'scrolled' menjadi true jika scrollY > 0, selain itu false
      setScrolled(window.scrollY > 0);
    };

    // Tambahkan event listener saat komponen di-mount
    window.addEventListener("scroll", handleScroll);

    // Bersihkan event listener saat komponen di-unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Array dependensi kosong agar hanya berjalan sekali saat mount/unmount


  const closeSheet = () => setIsOpen(false); // Fungsi untuk menutup sheet

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300", // Fixed positioning untuk navbar
      scrolled
        ? "bg-white/20 backdrop-blur-xs shadow-sm border-b" // Kelas jika discroll
        : "bg-transparent border-b-transparent" // Kelas jika di atas
    )}>
      {/* <div className="border-b"> */}
      <div className="flex md:px-20 h-16 justify-between items-center px-4">
        {/* Logo Text - Selalu Terlihat */}
        <div className="flex items-center"> {/* mr-auto untuk mendorong konten lain ke kanan di mobile */}
          <Link to="/" className="text-2xl font-bold">
            Travel Pal
          </Link>
        </div>

        {/* Menu Navigasi Tengah - Hanya Terlihat di Desktop */}
        <NavigationMenu className="hidden md:flex flex-1 justify-center"> {/* Hidden di mobile, flex di desktop */}
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/" className={cn(
                  "px-4 py-2 text-sm transition-colors hover:text-primary ",
                  isActive("/") ? "font-bold" : "" // Tambahkan kelas aktif jika link ini aktif
                )}>
                  Beranda
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/destinasi" className={cn(
                  "px-4 py-2 text-sm  transition-colors hover:text-primary ",
                  isActive("/destinasi") ? "font-bold" : "" // Tambahkan kelas aktif jika link ini aktif
                )}>
                  Destinasi
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/kuliner" className={cn(
                  "px-4 py-2 text-sm transition-colors hover:text-primary ",
                  isActive("/kuliner") ? "font-bold" : "" // Tambahkan kelas aktif jika link ini aktif
                )}>
                  Kuliner
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/favorit" className={cn(
                  "px-4 py-2 text-sm transition-colors hover:text-primary ",
                  isActive("/favorit") ? "font-bold" : "" // Tambahkan kelas aktif jika link ini aktif
                )}>
                  Favorit
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4"> {/* Flex untuk mengatur profil pengguna dan burger menu */}
          {/* Profil Pengguna - Selalu Terlihat (didorong ke kanan oleh mr-auto di logo pada mobile) */}
          <div className="flex items-center gap-4 "> {/* ml-auto di desktop jika tidak ada menu tengah */}
            <p>{!user ? "User Not Logged In" : user.name}</p>
            <UserNav />
          </div>

          {/* Burger Menu untuk Mobile */}
          <div className="md:hidden"> {/* Hanya tampil di ukuran layar kecil (mobile) */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="w-full">
                <SheetHeader className="">
                  <SheetTitle>Travel Pal</SheetTitle>
                  <SheetDescription>
                    Navigasi Utama
                  </SheetDescription>
                </SheetHeader>
                <nav className="flex p-4 flex-col gap-4 *:p-4 text-center">
                  <Link to="/" className={cn(
                    "text-lg hover:text-primary hover:bg-secondary p-2 rounded-lg border border-white hover:border",
                    isActive("/") ? "font-bold text-primary border rounded-xl bg-secondary" : "" // Tambahkan kelas aktif jika link ini aktif
                  )} onClick={closeSheet}>
                    Beranda
                  </Link>
                  <Link to="/destinasi" className={cn(
                    "text-lg hover:text-primary hover:bg-secondary p-2 rounded-lg border border-white hover:border",
                    isActive("/destinasi") ? "font-bold text-primary border rounded-xl bg-secondary" : "" // Tambahkan kelas aktif jika link ini aktif
                  )} onClick={closeSheet}>
                    Destinasi
                  </Link>
                  <Link to="/kuliner" className={cn(
                    "text-lg hover:text-primary hover:bg-secondary p-2 rounded-lg border border-white hover:border",
                    isActive("/kuliner") ? "font-bold text-primary border rounded-xl bg-secondary" : "" // Tambahkan kelas aktif jika link ini aktif
                  )} onClick={closeSheet}>
                    Kuliner
                  </Link>
                  <Link to="/favorit" className={cn(
                    "text-lg hover:text-primary hover:bg-secondary p-2 rounded-lg border border-white hover:border",
                    isActive("/favorit") ? "font-bold text-primary border rounded-xl bg-secondary" : "" // Tambahkan kelas aktif jika link ini aktif
                  )} onClick={closeSheet}>
                    Favorit
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}