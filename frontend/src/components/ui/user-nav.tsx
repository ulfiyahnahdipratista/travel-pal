// src/components/ui/user-nav.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext"; // Import hook untuk context
import { toast } from "sonner";


export function UserNav() {
  const { user, logout } = useAuth(); // Ambil user dan fungsi logout dari context

  // Tampilkan placeholder jika tidak ada user
  if (!user) {
    return (
      <Avatar className="h-9 w-9">
        <AvatarFallback>UN</AvatarFallback> {/* User Not Logged In */}
      </Avatar>
    );
  }

  const handleLogout = () => {
    logout(); // Panggil fungsi logout dari context
    toast.success("Logout successful"); // Tampilkan toast sukses
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button

          variant="ghost"
          className="relative cursor-pointer h-8 w-8 rounded-full"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage className="bg-contain" src={user.avatarUrl} alt={user.name} /> {/* Ganti dengan path avatar Anda */}
            <AvatarFallback>{user.initials}</AvatarFallback> {/* Inisial atau placeholder */}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p> {/* Ganti dengan nama pengguna */}
            <p className="text-xs leading-none text-muted-foreground">
              {user.email} {/* Ganti dengan email pengguna */}
            </p>
          </div>
        </DropdownMenuLabel>
        {/* <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profil</DropdownMenuItem>
          <DropdownMenuItem>Pengaturan</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}