// // src/components/AnimatedGradientBackground.tsx
// import React from 'react';
// import type { ReactNode } from 'react';

// interface AnimatedGradientBackgroundProps {
//   children: ReactNode;
// }

// const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({ children }) => {
//   return (
//     <div className="relative min-h-screen w-full overflow-hidden">
//       {/* Background Gradient Animasi */}
//       <div className="absolute inset-0 z-0 animate-gradient-xy">
//         <div className="
//           w-full h-full
//           bg-gradient-to-br
//           from-blue-400 via-purple-500 to-pink-500
//           dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
//           opacity-70 dark:opacity-50
//         "></div>
//       </div>

//       {/* Konten Aplikasi di atas background */}
//       <div className="relative z-10 w-full flex flex-col items-center justify-center">
//         {children}
//       </div>
//     </div>
//   );
// };

// export default AnimatedGradientBackground;


// src/components/AnimatedGradientBackground.tsx
import React, { useEffect } from 'react';
import type { ReactNode } from 'react';

interface AnimatedGradientBackgroundProps {
  children: ReactNode;
}

const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({ children }) => {
  useEffect(() => {
    // Definisi CSS untuk keyframes dan kelas animasi
    const styleContent = `
      @keyframes gradient-xy {
        0%, 100% {
          background-size: 400% 400%;
          background-position: left center;
        }
        50% {
          background-size: 200% 200%;
          background-position: right center;
        }
      }

      .animate-gradient-xy {
        animation: gradient-xy 5s ease infinite;
      }
    `;

    // Buat elemen style baru
    const styleElement = document.createElement('style');
    styleElement.id = 'animated-gradient-styles'; // Beri ID agar bisa dicek/dihapus
    styleElement.textContent = styleContent;

    // Tambahkan elemen style ke head dokumen jika belum ada
    if (!document.getElementById(styleElement.id)) {
      document.head.appendChild(styleElement);
    }

    // Cleanup function: hapus style saat komponen unmount
    return () => {
      const existingStyle = document.getElementById(styleElement.id);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []); // [] agar efek hanya dijalankan sekali saat komponen mount

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Gradient Animasi */}
      <div className="absolute inset-0 z-0">
        <div className="
          animate-gradient-xy
          w-full h-full
          bg-gradient-to-br
          from-white via-blue-300  to-white
          dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
          opacity-70 dark:opacity-50
        "></div>
      </div>

      {/* Konten Aplikasi di atas background */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default AnimatedGradientBackground;