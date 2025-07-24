
// src/hooks/useFavorites.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { ApiFavorit, ApiFavoritToggle } from '@/api/favorit'; // Sesuaikan path ke API favorit Anda
import type { Destination, Kuliner, ApiResponseFavorit } from '@/types/api';
// ✅ Import useAuth hook dari AuthContext Anda
import { useAuth } from '@/context/AuthContext'; // SESUAIKAN PATH INI KE AUTHCONTEXT ANDA
import { useLocation } from 'react-router';

// Tipe untuk item favorit yang disimpan dalam state
type FavoriteType = 'destinasi' | 'kuliner';

// Tipe context value
interface FavoritesContextType {
  favoriteDestinasiIds: Set<number>;
  favoriteKulinerIds: Set<number>;
  toggleFavorite: (tipe: FavoriteType, id: number) => Promise<void>;
  isLoadingFavorites: boolean; // Menunjukkan apakah data favorit sedang dimuat
  errorLoadingFavorites: string | null; // Pesan error jika gagal memuat favorit
  refetchFavorites: () => Promise<void>; // Untuk manual refetch
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favoriteDestinasiIds, setFavoriteDestinasiIds] = useState<Set<number>>(new Set());
  const [favoriteKulinerIds, setFavoriteKulinerIds] = useState<Set<number>>(new Set());
  const [isLoadingFavorites, setIsLoadingFavorites] = useState<boolean>(true); // Default true saat inisialisasi
  const [errorLoadingFavorites, setErrorLoadingFavorites] = useState<string | null>(null);
  const location = useLocation();
  const currentPath = location.pathname;

  // ✅ Dapatkan 'user' dan 'loading' dari AuthContext Anda
  const { user, loading: authLoading } = useAuth(); // 'loading' diganti nama jadi 'authLoading' untuk menghindari konflik nama

  const fetchFavorites = useCallback(async () => {
    // ✅ Tambahkan kondisi ini: Hanya fetch jika user ada DAN authLoading sudah selesai
    if (authLoading) {
      // Jika autentikasi masih dalam proses loading, jangan fetch dulu.
      // Set loading favorites ke true dan return. Ini penting agar tidak memanggil API sebelum status auth final.
      setIsLoadingFavorites(true);
      return;
    }

    if (!user) { // ✅ Jika tidak ada user (belum login)
      console.log("No user logged in. Skipping favorite fetch.");
      setIsLoadingFavorites(false); // Selesai loading, tapi tidak ada data favorit
      setFavoriteDestinasiIds(new Set()); // Pastikan Set kosong
      setFavoriteKulinerIds(new Set());
      setErrorLoadingFavorites(null); // Bersihkan error sebelumnya
      return; // Hentikan fungsi
    }

    // Jika user ada, baru lakukan fetching favorit
    setIsLoadingFavorites(true);
    setErrorLoadingFavorites(null);


    // ✅ Skip fetch jika di halaman login, register, atau survey
    if (
      currentPath === "/login" ||
      currentPath === "/register"
    ) {
      return;
    }

    try {
      // jika routesnya masih di (/login, /register, /survey)

      const destinasiResponse: ApiResponseFavorit<Destination> = await ApiFavorit('destinasi');
      if (destinasiResponse.status === 'success' && destinasiResponse.data) {
        const ids = new Set(destinasiResponse.data.map(item => item.id));
        setFavoriteDestinasiIds(ids);
      } else {
        setErrorLoadingFavorites(destinasiResponse.message || 'Gagal memuat destinasi favorit.');
      }

      const kulinerResponse: ApiResponseFavorit<Kuliner> = await ApiFavorit('kuliner');
      if (kulinerResponse.status === 'success' && kulinerResponse.data) {
        const ids = new Set(kulinerResponse.data.map(item => item.id));
        setFavoriteKulinerIds(ids);
      } else {
        setErrorLoadingFavorites(kulinerResponse.message || 'Gagal memuat kuliner favorit.');
      }
    } catch (err: any) { // Tangani error dengan tipe any atau AxiosError
      console.error("Error fetching initial favorites:", err);
      // Tangani error berdasarkan status HTTP jika ada (misal 401 Unauthorized)
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setErrorLoadingFavorites('Sesi Anda berakhir atau tidak valid. Silakan login kembali.');
        toast.error('Sesi Anda berakhir. Mohon login kembali.');
        setFavoriteDestinasiIds(new Set());
        setFavoriteKulinerIds(new Set());
      } else {
        setErrorLoadingFavorites('Terjadi kesalahan saat memuat daftar favorit.');
        toast.error('Gagal memuat daftar favorit.');
      }
    } finally {
      setIsLoadingFavorites(false);
    }
  }, [user, authLoading]); // ✅ Tambahkan `user` dan `authLoading` ke dependency array

  useEffect(() => {
    // Efek ini akan dipicu setiap kali fetchFavorites berubah (karena user/authLoading berubah)
    fetchFavorites();
  }, [fetchFavorites]);

  // Fungsi untuk toggle favorit
  const toggleFavorite = useCallback(async (tipe: FavoriteType, id: number) => {
    // ✅ Tambahkan kondisi ini: Tidak bisa toggle jika user tidak ada
    if (!user) {
      toast.error('Anda harus login untuk menambahkan favorit.');
      return; // Hentikan fungsi jika tidak ada user
    }

    try {
      // Pastikan ID dikirim sebagai string jika API Anda mengharapkannya
      const payload = { tipe, id: id };
      const response = await ApiFavoritToggle(payload);

      const itemName = tipe === 'destinasi' ? 'Destinasi' : 'Kuliner';

      if (response.status === 'added') {
        if (tipe === 'destinasi') {
          setFavoriteDestinasiIds(prev => new Set(prev).add(id));
        } else {
          setFavoriteKulinerIds(prev => new Set(prev).add(id));
        }
        toast.success(
          `Berhasil ditambahkan ke favorit!`,
          {
            description: `${itemName} Anda kini tersimpan.`,
            action: {
              label: "Lihat Favorit",
              onClick: () => window.location.href = '/favorit',
            },
            duration: 3000,
            id: `favorite-added-${tipe}-${id}`,
          }
        );
      } else if (response.status === 'removed') {
        if (tipe === 'destinasi') {
          setFavoriteDestinasiIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        } else {
          setFavoriteKulinerIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }
        toast.info(
          `Berhasil dihapus dari favorit.`,
          {
            description: `${itemName} telah dikeluarkan dari daftar Anda.`,
            duration: 3000,
            id: `favorite-removed-${tipe}-${id}`,
          }
        );
      } else {
        toast.error(
          `Gagal mengubah status favorit.`,
          {
            description: `Terjadi masalah: ${response.message || 'Status tidak diketahui.'}`,
            duration: 4000,
            id: `favorite-error-unknown-${tipe}-${id}`,
          }
        );
      }
    } catch (err: any) { // Tangani error dengan tipe any atau AxiosError
      console.error(`Error toggling ${tipe} favorite for ID ${id}:`, err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        toast.error('Sesi Anda berakhir. Silakan login kembali.');
      } else {
        toast.error('Gagal mengubah status favorit. Mohon coba lagi nanti.');
      }
    }
  }, [user]); // ✅ Tambahkan `user` ke dependency array `toggleFavorite` juga

  const contextValue = {
    favoriteDestinasiIds,
    favoriteKulinerIds,
    toggleFavorite,
    isLoadingFavorites,
    errorLoadingFavorites,
    refetchFavorites: fetchFavorites,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};