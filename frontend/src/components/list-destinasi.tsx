// src/components/ListDestinasi.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router'; // Ensure correct import from 'react-router-dom'
import { ApiListDestinasi } from '@/api/destinasi'; // Adjust path to your API
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import type { Destination, ApiResponseListDestinasi } from '@/types/api';
import { CardDestinasi } from './card-destinasi'; // Adjust path if necessary
import { useFavorites } from '@/hooks/useFavorites';

const ListDestinasi: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]); // New state for filtered data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12); // Items per page
  const [totalItems, setTotalItems] = useState<number>(0);
  // const [favoriteDestinasiIds, setFavoriteDestinasiIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>(''); // New state for search term

  const { favoriteDestinasiIds, toggleFavorite } = useFavorites(); // <-- Gunakan useFavorites hook

  const navigate = useNavigate();

  // Function to fetch destination data
  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponseListDestinasi = await ApiListDestinasi(currentPage, limit);
      if (response.status === "success" && response.data) {
        setDestinations(response.data);
        setTotalPages(response.meta.totalPages);
        setTotalItems(response.meta.total);
      } else {
        setDestinations([]);
        setError(response.message || "Failed to fetch destination data.");
        toast.error(response.message || "Failed to fetch destination data.");
      }
    } catch (e) {
      console.error("Error fetching destinations:", e);
      if (e instanceof Error) {
        setError(e.message);
        toast.error(`An error occurred: ${e.message}`);
      } else {
        setError("An unknown error occurred while fetching destination data.");
        toast.error("An unknown error occurred while fetching destination data.");
      }
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  // Effect for client-side filtering
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredDestinations(destinations);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = destinations.filter(
        dest =>
          dest.nama.toLowerCase().includes(lowercasedSearchTerm) ||
          dest.kabupaten.toLowerCase().includes(lowercasedSearchTerm) ||
          dest.deskripsi.toLowerCase().includes(lowercasedSearchTerm) ||
          dest.kategori.toLowerCase().includes(lowercasedSearchTerm) ||
          dest.tipe.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredDestinations(filtered);
    }
  }, [destinations, searchTerm]); // Re-filter when destinations or searchTerm changes

  // Handler for page change without scrolling to top
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Removed window.scrollTo(0, 0); here
    }
  };

  const handleCardClick = (id: number) => {
    navigate(`/destinasi/${id}`);
  };

  // Ubah handleToggleFavorite untuk memanggil toggleFavorite dari context
  const handleToggleFavorite = (id: number) => {
    toggleFavorite('destinasi', id); // <-- Panggil fungsi dari context
  };

  // Function to generate pagination page numbers
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
        Explore Interesting Destinations
      </h1>

      {/* Search Section */}
      <div className="flex w-full max-w-md items-center space-x-2 mx-auto mb-8">
        <Input
          type="text"
          placeholder="Search destinations by name, city, category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* The search button will simply trigger the onChange for the input */}
        <Button onClick={() => { /* No direct action needed here as filtering is reactive */ }}>Search</Button>
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
          <Button onClick={fetchDestinations} className="mt-4">Try Again</Button>
        </div>
      ) : filteredDestinations.length === 0 ? ( // Check filteredDestinations for display
        <div className="text-center text-gray-600 text-lg py-12">
          No destinations found matching your criteria.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDestinations.map((destinasi) => ( // Render filtered data
              <CardDestinasi
                key={destinasi.id}
                imageUrl={destinasi.url_gambar}
                title={destinasi.nama}
                location={destinasi.kabupaten}
                onClick={() => handleCardClick(destinasi.id)}
                isFavorite={favoriteDestinasiIds.has(destinasi.id)}
                onToggleFavorite={() => handleToggleFavorite(destinasi.id)}
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

export default ListDestinasi;