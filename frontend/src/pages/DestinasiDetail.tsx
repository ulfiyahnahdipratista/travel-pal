// src/pages/DestinasiDetail.tsx
import { useParams } from "react-router"; // Pastikan impor dari react-router-dom
import BaseLayout from "@/layouts/base";
import { DestinasiDetailContent } from "@/components/detail-destinasi";
import { useEffect } from "react";


export default function DestinasiDetail() {
  const { id } = useParams<{ id: string }>();

  const destinasiId = id || '';

  // Tambahkan useEffect ini
  useEffect(() => {
    // Scroll ke bagian paling atas halaman saat komponen di-mount
    window.scrollTo(0, 0);
  }, []); // Array dependensi kosong agar hanya berjalan sekali saat komponen dimuat


  return (
    <BaseLayout
      text="DESTINASI"
      deskripsi="/des·ti·na·si/"
      main_page={false}
    >
      <DestinasiDetailContent destinasiId={destinasiId} />
    </BaseLayout>
  );
}