import Footer from "@/components/footer";
import Header from "@/components/header";
import { MainNav } from "@/components/navbar";

type props = {
  children?: React.ReactNode
  main_page: boolean
  text: string,
  deskripsi: string
}

export default function BaseLayout({ children, main_page, deskripsi, text }: props) {
  return (
    <div>
      {/* navbar */}
      <MainNav />

      {main_page ? (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <Header text={text} deskripsi={deskripsi} />
        </div>
      ) : null}
      {/* konten */}
      {children}

      {/* footer */}
      <Footer />
    </div>
  )
}

// <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//   <Header text="Welcome to Travel Pal" deskripsi="Your journey starts here!" />
// </div>