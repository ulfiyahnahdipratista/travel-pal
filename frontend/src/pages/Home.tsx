import BaseLayout from "@/layouts/base"
import { ListRekomendasiDestinasi } from "@/components/list-rekomendasi-destinasi"

const Home = () => {
  return (
    <BaseLayout
      text="Welcome to Travel Pal" deskripsi="Your journey starts here!" main_page={true}>
      <div className="flex flex-col items-center justify-center bg-gray-100">
        <ListRekomendasiDestinasi />
      </div>
    </BaseLayout>
  )
}

export default Home