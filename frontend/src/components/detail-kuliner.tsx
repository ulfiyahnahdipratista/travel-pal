// components/KulinerDetailContent.tsx
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, UtensilsCrossed } from 'lucide-react';

// Import fungsi API Anda yang sudah ada
// Sesuaikan path import ini dengan lokasi file ApiKulinerDetail Anda
import { ApiKulinerDetail } from '@/api/kuliner'; // Contoh path, sesuaikan dengan struktur proyek Anda

// Definisi interface untuk data kuliner detail
interface KulinerDetailData {
  id: number; // ID di data respons Anda tetap number, meski di API params string
  nama: string;
  kabupaten: string;
  deskripsi: string;
  url_gambar: string;
}

interface KulinerDetailContentProps {
  kulinerId: string; // Ubah tipe prop menjadi string, sesuai dengan ApiKulinerDetail Anda
}

export const KulinerDetailContent: React.FC<KulinerDetailContentProps> = ({ kulinerId }) => {
  const [kuliner, setKuliner] = useState<KulinerDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKuliner = async () => {
      setLoading(true);
      setError(null);
      try {
        // Panggil ApiKulinerDetail Anda yang sudah ada
        const response = await ApiKulinerDetail(kulinerId);

        // Pastikan response.data ada dan sesuai format
        if (response && response.status === 'success' && response.data) {
          setKuliner(response.data);
        } else {
          setKuliner(null);
          setError(response?.message || "Kuliner tidak ditemukan.");
        }
      } catch (err) {
        console.error("Error fetching kuliner detail:", err);
        setError("Terjadi kesalahan saat mengambil detail kuliner. Mohon coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    if (kulinerId) { // Pastikan ID valid (tidak kosong) sebelum fetch
      fetchKuliner();
    } else {
      setLoading(false);
      setError("ID kuliner tidak ditemukan di URL.");
    }
  }, [kulinerId]); // Dependency array: fetch ulang jika kulinerId berubah

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="space-y-4">
          <Skeleton className="w-full h-[300px] md:h-[450px] rounded-xl" />
          <Skeleton className="h-10 w-3/4 mx-auto mt-6" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-4xl text-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  if (!kuliner) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-4xl text-center text-gray-600 text-lg">
        Data kuliner tidak tersedia.
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <Card className="overflow-hidden gap-4 shadow-xl m-0 p-0 rounded-xl">
        {/* Gambar Kuliner */}
        <div className="w-full h-[300px] md:h-[450px] overflow-hidden">
          <img
            src={kuliner.url_gambar}
            alt={kuliner.nama}
            className="w-full h-full object-cover rounded-t-xl"
          />
        </div>

        <CardContent className="space-y-4 pt-0 pb-4 px-4">
          {/* Nama Kuliner */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 text-center">
            {kuliner.nama}
          </h1>

          {/* Lokasi (Kabupaten) */}
          <div className="flex items-center justify-center text-lg text-gray-600 dark:text-gray-400">
            <MapPin className="w-5 h-5 mr-2 text-primary" />
            <span>{kuliner.kabupaten}</span>
          </div>

          {/* Tipe Kuliner (Opsional) */}
          <div className="flex items-center justify-center text-md text-gray-500 dark:text-gray-300">
            <UtensilsCrossed className="w-5 h-5 mr-2 text-blue-500" />
            <span>Kuliner Khas Daerah</span>
          </div>

          {/* Deskripsi Kuliner */}
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base md:text-lg text-justify pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            {kuliner.deskripsi}
          </p>

        </CardContent>
      </Card>
    </div>
  );
};