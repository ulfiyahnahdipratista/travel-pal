// src/components/ListRekomendasiDestinasi.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router'; // Pastikan import dari react-router-dom
import { ApiDestinasi } from '@/api/destinasi'; // Sesuaikan path ke API Anda
import { CardDestinasi } from '@/components/card-destinasi'; // Sesuaikan path ke CardDestinasi Anda
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites'; // ✅ Import useFavorites hook
import type { Destination } from '@/types/api';
import { ApiGetRekomendasi } from '@/api/rekomendasi';


export const ListRekomendasiDestinasi: React.FC<{}> = ({
}) => {
  const [destinasi, setDestinasi] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Gunakan useFavorites hook untuk mengambil state dan fungsi favorit
  const { favoriteDestinasiIds, toggleFavorite, isLoadingFavorites: favoritesLoading } = useFavorites();

  const navigate = useNavigate();

  // Efek samping untuk fetching data destinasi
  const fetchDestinations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await ApiGetRekomendasi();

      // console.log("get_rekomendasi: ", data);

      // Panggil fungsi ApiDestinasi Anda
      const response = await ApiDestinasi({
        tipe: data, // ✅ Gunakan filter tipe sesuai kebutuhan Home Anda
      });

      if (response.status === "success" && response.data) {
        setDestinasi(response.data as Destination[]);
      } else {
        setError(response.message || "Gagal memuat destinasi rekomendasi.");
        toast.error(response.message || "Gagal memuat destinasi rekomendasi.");
      }
    } catch (e) {
      console.error("Error fetching recommended destinations:", e);
      if (e instanceof Error) {
        setError(e.message);
        toast.error(`Terjadi kesalahan: ${e.message}`);
      } else {
        setError("Terjadi kesalahan tidak dikenal.");
        toast.error("Terjadi kesalahan tidak dikenal.");
      }
      setDestinasi([]);
    } finally {
      setLoading(false);
    }
  }, []); // [] agar hanya dijalankan sekali saat komponen mount, atau tambahkan dependensi prop jika ada

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  // Fungsi untuk menangani klik pada card destinasi
  const handleCardClick = (id: number) => { // Hanya perlu ID karena title akan diambil dari data destinasi
    navigate(`/destinasi/${id}`);
  };

  // ✅ Handler untuk toggle favorit, memanggil fungsi dari useFavorites hook
  const handleToggleFavorite = (id: number) => {
    toggleFavorite('destinasi', id); // 'destinasi' adalah tipe item yang di-toggle
  };

  // Render kondisi loading
  if (loading || favoritesLoading) { // ✅ Tambahkan favoritesLoading ke kondisi loading
    return (
      <div className="mt-4 flex flex-col items-center justify-center p-4">
        {/* Loading Indicator and Message */}
        <div className="flex items-center justify-center space-x-3 mb-8 animate-pulse">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 tracking-tight">
            Menyiapkan Rekomendasi Destinasi...
          </h2>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center w-full max-w-6xl">
          {/* ✅ Jumlah skeleton disesuaikan dengan limit Anda, misal 8 */}
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="w-full max-w-sm">
              <Skeleton className="w-full h-48 rounded-lg mb-4" /> {/* Gambar skeleton */}
              <Skeleton className="w-3/4 h-6 rounded-md mb-2" />    {/* Judul skeleton */}
              <Skeleton className="w-1/2 h-4 rounded-md" />      {/* Lokasi skeleton */}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render kondisi error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-red-500 p-4">
        <h2 className="text-xl font-bold mb-4">Terjadi Kesalahan!</h2>
        <p className="text-lg">{error}</p>
        <Button onClick={fetchDestinations} className="mt-4">Coba Lagi</Button>
      </div>
    );
  }

  // Render kondisi tidak ada data
  if (destinasi.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-4">
        <h2 className="text-xl font-bold mb-4">Tidak ada rekomendasi destinasi ditemukan.</h2>
        <p className="text-lg">Mohon maaf, kami tidak dapat menemukan destinasi rekomendasi saat ini.</p>
        <p className="text-lg">atau jika anda belum melakukan survey silahkan klik link berikut <Link className='text-primary font-bold underline' to="/survey">Isi Survey Sekarang!</Link></p>
        <Button onClick={() => window.location.reload()} className="mt-4">Muat Halaman</Button>
      </div>
    );
  }

  return (
    <section className="container mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">
        Rekomendasi Destinasi
      </h2>
      <div className="grid grid-cols-1 w-full gap-6 md:grid-cols-2 md:w-full lg:grid-cols-3 xl:grid-cols-4">
        {destinasi.map((dest) => (
          <CardDestinasi
            key={dest.id}
            imageUrl={dest.url_gambar}
            title={dest.nama}
            location={dest.kabupaten}
            isFavorite={favoriteDestinasiIds.has(dest.id)} // ✅ Ambil status favorit dari context
            onToggleFavorite={() => handleToggleFavorite(dest.id)} // ✅ Panggil handler toggle dari context
            onClick={() => handleCardClick(dest.id)} // Hanya perlu ID di sini
          />
        ))}
      </div>
      {/* Jika Anda ingin tombol "Lihat Semua" ke halaman destinasi lengkap */}
      <div className="text-center mt-12">
        <Button onClick={() => navigate('/destinasi')} className="bg-primary cursor-pointer hover:bg-primary/90 text-white">
          Lihat Semua Destinasi
        </Button>
      </div>
    </section>
  );
};