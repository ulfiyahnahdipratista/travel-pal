// src/components/travel-card.tsx
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MapPin } from "lucide-react"; // Import ikon dari lucide-react
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Pastikan Anda memiliki utility cn
import GlareHover from './ui/GlareHover/GlareHover';

interface CardDestinasiProps {
  imageUrl: string;
  title: string;
  location: string;
  isFavorite?: boolean; // Optional prop untuk status favorit
  onToggleFavorite?: () => void; // Optional handler untuk toggle favorit
  onClick?: () => void; // Optional handler saat card diklik
  className?: string; // Untuk custom styling tambahan
}

export const CardDestinasi: React.FC<CardDestinasiProps> = ({
  imageUrl,
  title,
  location,
  isFavorite = false, // Default ke false
  onToggleFavorite,
  onClick,
  className,
}) => {
  return (
    <Card
      className={cn(
        "w-full md:w-[300px] xl:w-full p-0 rounded-2xl shadow-lg gap-4 transition-all duration-300 hover:shadow-xl cursor-pointer group",
        className
      )}
      onClick={onClick}
    >
      <GlareHover
        borderRadius='20px'
        className='p-4 rounded-2xl'
        background='#ffffff'
        glareColor="#142441"
        glareOpacity={0.1}
        width='100%'
        height='100%'
        glareAngle={-30}
        borderColor='#ffffff'
        glareSize={300}
        transitionDuration={800}
        playOnce={false}>
        {/* Image Container */}
        <div className="relative w-full h-48 md:h-56 overflow-hidden rounded-2xl">
          <img
            src={imageUrl}
            alt={title}
            // Hapus group-hover:rounded-xl dari sini, karena sudah di handled oleh parentnya
            // object-fill bisa mendistorsi gambar, lebih baik object-cover
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Favorite Button */}
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
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
            {title}
          </h3>
          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-1 text-primary" />
            <span>{location}</span>
          </div>
        </CardContent>
      </GlareHover >

    </Card >
  );
};