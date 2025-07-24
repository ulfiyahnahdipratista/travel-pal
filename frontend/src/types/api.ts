// src/types/api.ts (buat file ini)

import { Destinasi } from "@/pages";

export interface Destination {
  id: number;
  url_maps: string;
  nama: string;
  rating: number;
  jumlah_review: number;
  tipe: string;
  url_gambar: string; // Ini akan menjadi imageUrl
  kabupaten: string; // Ini akan menjadi bagian dari location
  lat: number;
  lon: number;
  kategori: string;
  deskripsi: string;
}

export interface ApiResponse {
  status: string;
  message: string;
  data: Destination;
}

// Interface untuk data kuliner
export interface Kuliner {
  id: number;
  nama: string;
  kabupaten: string;
  deskripsi?: string;
  url_gambar: string;
}
export interface ApiResponseListDestinasi {
  status: string;
  message: string;
  data: Destination[];
  meta: Meta;
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponseListKuliner {
  status: string;
  message: string;
  data: Kuliner[];
  meta: Meta;
}

export interface ApiResponseFavorit<T> {
  status: string; // 'success'
  message: string;
  data: T[]; // Array ID item yang difavoritkan
}

export interface ApiResponseFavoritToggle {
  status: "added" | "removed";
  favorit_id?: number; // ID favorit yang di-toggle
}

export interface ApiResponseSurvey {
  status: string;
  message: string;
  data: string[];
}
