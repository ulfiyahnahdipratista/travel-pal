// src/components/DestinasiDetailContent.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router"; // Gunakan useNavigate dan ari react-router-dom
import { ApiDestinasiDetail } from "../api/destinasi"; // sesuaikan path-nya
import { ApiKuliner } from "@/api/kuliner";
import type { Destination, ApiResponse, Kuliner } from "@/types/api"; // Import tipe data
import { MapPin, Star, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CardKuliner } from "./card-kuliner";
import { useFavorites } from "@/hooks/useFavorites";
// import { KulinerCard } from "@/components/KulinerCard"; // Ganti CardKuliner dengan KulinerCard yang sudah kita buat

interface DestinasiDetailContentProps {
  destinasiId: string; // ID destinasi yang akan diterima dari parent (halaman)
}

export const DestinasiDetailContent: React.FC<DestinasiDetailContentProps> = ({ destinasiId }) => {
  const [data, setData] = useState<Destination | null>(null);
  const [rekomendasiKuliner, setRekomendasiKuliner] = useState<Kuliner[]>([]); // Default ke array kosong
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const { favoriteKulinerIds, toggleFavorite } = useFavorites(); // <-- Gunakan useFavorites hook


  useEffect(() => {
    if (!destinasiId) {
      setError("ID destinasi tidak ditemukan.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result: ApiResponse = await ApiDestinasiDetail(destinasiId);
        if (result.status === "success" && result.data) {
          setData(result.data as Destination); // Pastikan cast ke Destination
        } else {
          setError(result.message || "Data destinasi tidak ditemukan.");
          toast.error(result.message || "Gagal mengambil detail destinasi.");
        }
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          toast.error(`Terjadi kesalahan: ${e.message}`);
        } else {
          setError("Terjadi kesalahan tidak dikenal.");
          toast.error("Terjadi kesalahan tidak dikenal.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [destinasiId]); // Efek ini hanya bergantung pada destinasiId

  useEffect(() => {
    const fetchRekomendasiKuliner = async () => {
      // Pastikan data destinasi sudah ada dan memiliki kabupaten
      if (!data || !data.kabupaten) {
        setRekomendasiKuliner([]); // Reset jika tidak ada data kabupaten
        return;
      }

      setLoading(true); // Atur loading ke true sebelum fetch rekomendasi
      setError(null); // Reset error
      try {
        const response = await ApiKuliner({ kabupaten: data.kabupaten }); // Mengirim string kabupaten, bukan objek {kabupaten: ...}

        if (response.status === "success" && response.data) {
          setRekomendasiKuliner(response.data as Kuliner[]);
        } else {
          toast.error(`Gagal memuat rekomendasi kuliner: ${response.message}`);
          setRekomendasiKuliner([]); // Kosongkan jika gagal
        }
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          toast.error(`Terjadi kesalahan saat memuat rekomendasi kuliner: ${e.message}`);
        } else {
          setError("Terjadi kesalahan tidak dikenal saat memuat rekomendasi kuliner.");
          toast.error("Terjadi kesalahan tidak dikenal saat memuat rekomendasi kuliner.");
        }
      } finally {
        setLoading(false); // Atur loading ke false setelah selesai
      }
    };

    // Panggil fetchRekomendasiKuliner hanya jika data destinasi sudah ada
    if (data) {
      fetchRekomendasiKuliner();
    }
  }, [data]); // Efek ini bergantung pada data destinasi utama

  // // Fungsi untuk toggle favorit
  // const handleToggleFavorite = (id: number) => {
  //   setFavoriteIds(prevIds => {
  //     const newIds = new Set(prevIds);
  //     if (newIds.has(id)) {
  //       newIds.delete(id);
  //       toast.info(`Kuliner dihapus dari favorit: ID ${id}`);
  //     } else {
  //       newIds.add(id);
  //       toast.success(`Kuliner ditambahkan ke favorit: ID ${id}`);
  //     }
  //     return newIds;
  //   });
  //   // TODO: Panggil API untuk menyimpan status favorit ke backend di sini
  // };

  const handleToggleFavoriteKuliner = (id: number) => {
    toggleFavorite('kuliner', id); // <-- Panggil fungsi dari context
  };

  const handleCardClickKuliner = (id: number, title: string) => {
    console.log(`Card clicked: ${title} (ID: ${id})`);
    navigate(`/kuliner/${id}`);
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 pt-16 md:pt-20">
        <div className="w-full max-w-4xl space-y-6">
          <Skeleton className="w-full h-96 rounded-lg" />
          <Skeleton className="h-10 w-3/4 rounded-md" />
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
          <div className="flex justify-between items-center mt-6">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
          <Separator className="my-6" />
          <Skeleton className="h-8 w-1/3 rounded-md" /> {/* Rekomendasi kuliner title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // --- Error & No Data State ---
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 pt-16 md:pt-20 text-center text-red-500">
        <h2 className="text-3xl font-bold mb-4">Ups, ada masalah!</h2>
        <p className="text-lg">{error || "Data destinasi tidak ditemukan."}</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Kembali</Button>
      </div>
    );
  }

  // Bangun URL Google Maps Embed dengan lat dan lon
  // Pastikan data.lat dan data.lon ada dan bertipe number
  const mapEmbedUrl = `https://maps.google.com/maps?q=${data.lat},${data.lon}&z=15&output=embed`;

  // --- Main Content ---
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      {/* Tombol Kembali (Opsional, di luar card) */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mt-14 mb-6 flex items-center text-primary hover:text-primary transition-colors">
        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali
      </Button>

      <div className="bg-white border dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden md:flex">
        {/* Bagian Kiri: Gambar Destinasi & Maps */}
        <div className="md:grid md:grid-rows-2 md:w-1/2 flex flex-col">
          {/* Gambar Destinasi */}
          <div className="flex-1">
            <img
              src={data.url_gambar}
              alt={data.nama}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Maps */}
          <div className="w-[100%] md:mt-0 h-[300px] md:h-auto"> {/* Tambahkan height untuk iframe */}
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Lokasi ${data.nama}`}
              className="shadow-md"
            ></iframe>
          </div>
        </div>

        {/* Bagian Kanan: Detail Deskripsi */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Nama Destinasi */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
              {data.nama}
            </h1>

            {/* Rating & Review */}
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-semibold">{data.rating}</span>
              <span className="ml-1 mr-2">•</span>
              <span>{data.jumlah_review} reviews</span>
            </div>

            {/* Lokasi & Kategori/Tipe */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <MapPin className="w-3 h-3 mr-1" /> {data.kabupaten}
              </Badge>
              {/* <Badge variant="outline" className="text-gray-700 dark:text-gray-300">
                <Tag className="w-3 h-3 mr-1" /> {data.kategori.replace(/_/g, ' ')}
              </Badge> */}
              <Badge variant="outline" className="text-gray-700 dark:text-gray-300">
                <Globe className="w-3 h-3 mr-1" /> {data.tipe}
              </Badge>
            </div>

            <Separator className="my-6" />

            {/* Deskripsi */}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {data.deskripsi}
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {/* <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-white">
              <Link to={data.url_maps} target="_blank" rel="noopener noreferrer" aria-label="Lihat di Google Maps">
                Lihat di Maps
              </Link>
            </Button> */}
            {/* <Button
              type="button" // Ubah dari submit ke button
              variant={"ghost"}
              onClick={() => handleToggleFavorite(Number(destinasiId))} // Gunakan destinasiId dari props
              className={`flex-1 flex items-center justify-center gap-2 font-medium transition-colors ${favoriteIds.has(Number(destinasiId))
                ? "bg-green-500 text-white hover:bg-green-500"
                : "border border-primary hover:bg-primary/5"}
              `}
            >
              <Bookmark className="w-4 h-4" />
              {favoriteIds.has(Number(destinasiId)) ? "Favorit" : "Tambah ke Favorit"}
            </Button> */}
          </div>
        </div>
      </div>

      {/* Rekomendasi Kuliner */}
      <section className="mt-12">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">Rekomendasi Kuliner</h1>
        {rekomendasiKuliner.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {rekomendasiKuliner.map((kuliner: Kuliner) => (
              <CardKuliner
                kuliner={kuliner}
                key={kuliner.id}
                onClick={() => handleCardClickKuliner(kuliner.id, kuliner.nama)}
                isFavorite={favoriteKulinerIds.has(kuliner.id)}
                onToggleFavorite={() => handleToggleFavoriteKuliner(kuliner.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Tidak ada rekomendasi kuliner untuk destinasi ini.</p>
        )}
      </section>
    </div >
  );
};