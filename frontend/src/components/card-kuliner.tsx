// components/KulinerCard.tsx
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Heart } from "lucide-react"; // Tambah ikon UtensilsCrossed atau yang sesuai
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Pastikan Anda memiliki utility cn
import GlareHover from './ui/GlareHover/GlareHover'; // Pastikan path ke GlareHover benar
import type { Kuliner } from '@/types/api';

// Props untuk komponen KulinerCard
export interface KulinerCardProps {
  kuliner: Kuliner;
  isFavorite?: boolean; // Optional prop untuk status favorit
  onToggleFavorite?: () => void; // Optional handler untuk toggle favorit, menerima id kuliner
  onClick?: () => void; // Optional handler saat card diklik, menerima id kuliner
  className?: string; // Untuk custom styling tambahan
}

export const CardKuliner: React.FC<KulinerCardProps> = ({
  kuliner,
  isFavorite = false,
  onToggleFavorite,
  onClick,
  className,
}) => {
  // const handleCardClick = () => {
  //   onClick?.(kuliner.id);
  // };

  // const handleToggleFavorite = (e: React.MouseEvent) => {
  //   e.stopPropagation(); // Mencegah onClick card terpicu
  //   onToggleFavorite?.(kuliner.id);
  // };

  return (
    <Card
      className={cn(
        "w-full md:w-[300px] xl:w-full p-0 rounded-xl shadow-lg gap-4 transition-all duration-300 hover:shadow-xl cursor-pointer group",
        className
      )}
      onClick={onClick}
    >
      <GlareHover
        borderRadius='20px'
        className='p-4'
        background='#ffffff'
        glareColor="#142441"
        glareOpacity={0.1}
        width='100%'
        height='100%'
        glareAngle={-30}
        borderColor='#ffffff'
        glareSize={300}
        transitionDuration={800}
        playOnce={false}
      >
        {/* Image Container */}
        <div className="relative w-full h-48 md:h-56 overflow-hidden rounded-xl">
          <img
            src={kuliner.url_gambar}
            alt={kuliner.nama}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Favorite Button (Opsional) */}
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer absolute top-3 right-3 rounded-full bg-white/70 backdrop-blur-sm z-10 hover:bg-white/90 transition-colors"
            onClick={(e) => {
              e.stopPropagation(); // Mencegah onClick card terpicu
              onToggleFavorite?.(); // Panggil handler toggle favorit
            }}
          >
            <Heart
              className={cn(
                "w-5 h-5",
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-500 group-hover:text-red-500"
              )}
            />
          </Button>
        </div>

        <CardContent className='p-0 w-full'>
          {/* Title Kuliner */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mt-2">
            {kuliner.nama}
          </h3>
          {/* Kabupaten */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
            <MapPin className="w-4 h-4 mr-1 text-primary" /> {/* Menggunakan MapPin untuk lokasi */}
            <span>{kuliner.kabupaten}</span>
          </div>
        </CardContent>
      </GlareHover>
    </Card>
  );
};