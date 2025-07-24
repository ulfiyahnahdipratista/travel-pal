// src/components/ListKuliner.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router'; // Pastikan impor dari 'react-router-dom'
import { ApiListKuliner } from '@/api/kuliner'; // Sesuaikan path ke API Anda
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Import komponen Pagination dari shadcn/ui
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

// Import tipe data yang sudah Anda definisikan
import type { Kuliner, ApiResponseListKuliner } from '@/types/api';
import { CardKuliner } from './card-kuliner';
import { useFavorites } from '@/hooks/useFavorites';

const ListKuliner: React.FC = () => {
  const [kulinerData, setKulinerData] = useState<Kuliner[]>([]);
  const [filteredKulinerData, setFilteredKulinerData] = useState<Kuliner[]>([]); // Data yang sudah difilter
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12); // Jumlah item per halaman
  const [totalItems, setTotalItems] = useState<number>(0);
  // const [favoriteKulinerIds, setFavoriteKulinerIds] = useState<Set<number>>(new Set()); // Untuk status favorit
  const [searchTerm, setSearchTerm] = useState<string>(''); // State untuk pencarian

  const { favoriteKulinerIds, toggleFavorite } = useFavorites(); // <-- Gunakan useFavorites hook


  const navigate = useNavigate();

  // Fungsi untuk mengambil data kuliner
  const fetchKuliner = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponseListKuliner = await ApiListKuliner(currentPage, limit);
      if (response.status === "success" && response.data) {
        setKulinerData(response.data);
        setTotalPages(response.meta.totalPages);
        setTotalItems(response.meta.total);
      } else {
        setKulinerData([]);
        setError(response.message || "Gagal mengambil data kuliner.");
        toast.error(response.message || "Gagal mengambil data kuliner.");
      }
    } catch (e) {
      console.error("Error fetching kuliner:", e);
      if (e instanceof Error) {
        setError(e.message);
        toast.error(`Terjadi kesalahan: ${e.message}`);
      } else {
        setError("Terjadi kesalahan tidak dikenal saat mengambil data kuliner.");
        toast.error("Terjadi kesalahan tidak dikenal saat mengambil data kuliner.");
      }
      setKulinerData([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]); // Dipanggil ulang jika currentPage atau limit berubah

  useEffect(() => {
    fetchKuliner();
  }, [fetchKuliner]); // Dipanggil saat fetchKuliner berubah (karena dependensi currentPage/limit)

  // Effect untuk filtering sisi klien
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredKulinerData(kulinerData);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = kulinerData.filter(
        kuliner =>
          kuliner.nama.toLowerCase().includes(lowercasedSearchTerm) ||
          kuliner.kabupaten.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredKulinerData(filtered);
    }
  }, [kulinerData, searchTerm]); // Filter ulang saat kulinerData atau searchTerm berubah

  // Handler untuk perubahan halaman
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Tidak ada window.scrollTo(0,0) di sini untuk menjaga posisi scroll
    }
  };

  // Handler saat KulinerCard diklik
  const handleCardClick = (id: number) => {
    navigate(`/kuliner/${id}`); // Navigasi ke halaman detail kuliner
  };

  // Handler untuk toggle favorit (opsional)
  const handleToggleFavorite = (id: number) => {
    toggleFavorite('kuliner', id); // <-- Panggil fungsi dari context
  };


  // Fungsi untuk membuat array nomor halaman untuk pagination
  const getPaginationPages = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-8">
        Temukan Kuliner Lezat Nusantara
      </h1>

      {/* Bagian Pencarian */}
      <div className="flex w-full max-w-md items-center space-x-2 mx-auto mb-8">
        <Input
          type="text"
          placeholder="Cari kuliner berdasarkan nama, kabupaten..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Tombol Cari tidak perlu aksi langsung karena filtering reaktif */}
        <Button>Cari</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <Skeleton key={index} className="h-[300px] w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 text-lg py-12">
          {error}
          <Button onClick={fetchKuliner} className="mt-4">Coba Lagi</Button>
        </div>
      ) : filteredKulinerData.length === 0 ? ( // Cek filteredKulinerData untuk ditampilkan
        <div className="text-center text-gray-600 text-lg py-12">
          Tidak ada kuliner ditemukan yang cocok dengan kriteria Anda.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredKulinerData.map((kuliner) => ( // Render data yang sudah difilter
              <CardKuliner
                key={kuliner.id}
                kuliner={kuliner}
                onClick={() => handleCardClick(kuliner.id)}
                isFavorite={favoriteKulinerIds.has(kuliner.id)}
                onToggleFavorite={() => handleToggleFavorite(kuliner.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-12">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {getPaginationPages().map((pageNumber, index) => (
                  <PaginationItem key={index}>
                    {pageNumber === '...' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(Number(pageNumber));
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default ListKuliner;