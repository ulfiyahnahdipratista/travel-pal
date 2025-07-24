// src/components/ListFavorit.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ApiFavorit } from '@/api/favorit'; // Sesuaikan path ke API Anda
import { CardDestinasi } from '@/components/card-destinasi'; // Sesuaikan path ke komponen Anda
import type { Destination, Kuliner, ApiResponseFavorit } from '@/types/api';
import { useFavorites } from '@/hooks/useFavorites'; // Menggunakan useFavorites untuk toggle favorit
import { CardKuliner } from './card-kuliner';
import { useNavigate } from 'react-router';

const ListFavorit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'destinasi' | 'kuliner'>('destinasi');
  const [destinasiFavorit, setDestinasiFavorit] = useState<Destination[]>([]);
  const [kulinerFavorit, setKulinerFavorit] = useState<Kuliner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Mengambil state dan fungsi toggle dari FavoritesContext
  const { favoriteDestinasiIds, favoriteKulinerIds, toggleFavorite, refetchFavorites } = useFavorites();

  const fetchData = useCallback(async (tipe: 'destinasi' | 'kuliner') => {
    setLoading(true);
    setError(null);
    try {
      if (tipe === 'destinasi') {
        const response: ApiResponseFavorit<Destination> = await ApiFavorit('destinasi');
        if (response.status === 'success' && response.data) {
          setDestinasiFavorit(response.data);
        } else {
          setDestinasiFavorit([]);
          setError(response.message || 'Gagal mengambil destinasi favorit.');
          toast.error(response.message || 'Gagal mengambil destinasi favorit.');
        }
      } else { // tipe === 'kuliner'
        const response: ApiResponseFavorit<Kuliner> = await ApiFavorit('kuliner');
        if (response.status === 'success' && response.data) {
          setKulinerFavorit(response.data);
        } else {
          setKulinerFavorit([]);
          setError(response.message || 'Gagal mengambil kuliner favorit.');
          toast.error(response.message || 'Gagal mengambil kuliner favorit.');
        }
      }
    } catch (e) {
      console.error(`Error fetching ${tipe} favorites:`, e);
      if (e instanceof Error) {
        setError(e.message);
        toast.error(`Terjadi kesalahan: ${e.message}`);
      } else {
        setError(`Terjadi kesalahan tidak dikenal saat mengambil ${tipe} favorit.`);
        toast.error(`Terjadi kesalahan tidak dikenal saat mengambil ${tipe} favorit.`);
      }
      if (tipe === 'destinasi') setDestinasiFavorit([]);
      else setKulinerFavorit([]);
    } finally {
      setLoading(false);
    }
  }, []); // Dependensi kosong, karena fetchData dipanggil ulang saat activeTab berubah

  // Efek untuk memuat data saat tab berubah atau saat komponen dimuat pertama kali
  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, fetchData]);

  // Handler untuk toggle favorit (akan memanggil toggleFavorite dari useFavorites hook)
  const handleToggleFavorite = (tipe: 'destinasi' | 'kuliner', id: number) => {
    toggleFavorite(tipe, id);
    // Setelah toggle, mungkin perlu sedikit delay atau refetch ulang data favorit
    // agar UI tetap sinkron, terutama jika toggleFavorite di context tidak segera
    // memperbarui list data lengkap yang ditampilkan di sini.
    // Opsi: Panggil refetchFavorites() setelah delay
    setTimeout(() => refetchFavorites(), 500);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="bg-white/50  h-[300px] w-full rounded-xl" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 text-lg py-8">
          {error}
          <Button onClick={() => fetchData(activeTab)} className="mt-4">Coba Lagi</Button>
        </div>
      );
    }

    if (activeTab === 'destinasi') {
      if (destinasiFavorit.length === 0) {
        return <p className="text-center text-gray-600 dark:text-gray-400 mt-8">Anda belum menambahkan destinasi favorit.</p>;
      }
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {destinasiFavorit.map((dest) => (
            <CardDestinasi
              key={dest.id}
              imageUrl={dest.url_gambar}
              title={dest.nama}
              location={dest.kabupaten}
              onClick={() => navigate(`/destinasi/${dest.id}`)} // Ganti dengan navigate jika perlu
              isFavorite={favoriteDestinasiIds.has(dest.id)} // Status dari context
              onToggleFavorite={() => handleToggleFavorite('destinasi', dest.id)}
            />
          ))}
        </div>
      );
    } else { // activeTab === 'kuliner'
      if (kulinerFavorit.length === 0) {
        return <p className="text-center text-gray-600 dark:text-gray-400 mt-8">Anda belum menambahkan kuliner favorit.</p>;
      }
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {kulinerFavorit.map((kul) => (
            <CardKuliner
              key={kul.id}
              kuliner={kul}
              onClick={() => console.log(`Navigasi ke detail kuliner: ${kul.id}`)} // Ganti dengan navigate jika perlu
              isFavorite={favoriteKulinerIds.has(kul.id)} // Status dari context
              onToggleFavorite={() => handleToggleFavorite('kuliner', kul.id)}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="w-full py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-8">
        Item Favorit Anda
      </h1>

      <Tabs defaultValue="destinasi" className="w-full container mx-auto" onValueChange={(value) => setActiveTab(value as 'destinasi' | 'kuliner')}>
        <TabsList className="w-full">
          <div className='flex justify-center'>
            <TabsTrigger value="destinasi">Destinasi Favorit</TabsTrigger>
            <TabsTrigger value="kuliner">Kuliner Favorit</TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="destinasi">
          {renderContent()}
        </TabsContent>
        <TabsContent value="kuliner">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ListFavorit;