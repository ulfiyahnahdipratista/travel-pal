// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-800 text-gray-300 py-8 dark:bg-gray-950">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Travel Pal</h3>
        <p className="text-sm">
          Menemani setiap langkah petualangan Anda.
        </p>

        <div className="mt-6 text-sm border-t border-gray-700 pt-6">
          <p className="mb-2">
            &copy; {new Date().getFullYear()} Travel Pal. All rights reserved.
          </p>
          <div className='flex items-center justify-center gap-4'>
            <p>
              Developed by: <span className="font-semibold text-white">Ulfiyah Nahdipratista</span>
            </p>
            <p>
              Email: <a href="mailto:ulfiyahnahdipratista@gmail.com" className="text-blue-400 hover:underline">ulfiyahnahdipratista@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;