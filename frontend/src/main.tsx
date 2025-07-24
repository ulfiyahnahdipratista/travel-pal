import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import { Login, Register, Home, Survey, Destinasi, DestinasiDetail, Kuliner, KulinerDetail, Favorit } from './pages'
import { Toaster } from 'sonner' // ✅ Tambahkan ini
import Middleware from './components/middleware';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './hooks/useFavorites';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<Middleware />}>
              <Route path="/" element={<Home />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="/destinasi" element={<Destinasi />} />
              <Route path="/destinasi/:id" element={<DestinasiDetail />} />
              <Route path="/kuliner" element={<Kuliner />} />
              <Route path="/kuliner/:id" element={<KulinerDetail />} />
              <Route path="/favorit" element={<Favorit />} />
            </Route>
          </Routes>
          <Toaster richColors closeButton position="top-right" /> {/* ✅ Tambahkan ini */}
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
