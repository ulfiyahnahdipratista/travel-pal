import ListKuliner from "@/components/list-kuliner"
import BaseLayout from "@/layouts/base"


const Kuliner = () => {
  return (
    <BaseLayout
      text="KULINER"
      deskripsi="/kulinér/"
      main_page={true}
    >
      <div className="bg-gray-100">
        <ListKuliner />
      </div>
    </BaseLayout>
  )
}

export default Kuliner