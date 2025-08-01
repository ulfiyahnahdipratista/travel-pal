import { KulinerDetailContent } from "@/components/detail-kuliner";
import { Button } from "@/components/ui/button";
import BaseLayout from "@/layouts/base";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export default function KulinerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const kulinerId = id || '';


  // Tambahkan useEffect ini
  useEffect(() => {
    // Scroll ke bagian paling atas halaman saat komponen di-mount
    window.scrollTo(0, 0);
  }, []); // Array dependensi kosong agar hanya berjalan sekali saat komponen dimuat


  return (
    <BaseLayout
      text="KULINER"
      deskripsi="/des·ti·na·si/"
      main_page={false}
    >
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mt-14 mb-6 flex items-center text-primary hover:text-primary transition-colors">
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </Button>
        <KulinerDetailContent kulinerId={kulinerId} />
      </div>
    </BaseLayout>
  )
}