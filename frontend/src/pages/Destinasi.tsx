import ListDestinasi from "@/components/list-destinasi"
import BaseLayout from "@/layouts/base"


const Destinasi = () => {
  return (
    <BaseLayout
      text="DESTINASI"
      deskripsi="/des·ti·na·si/"
      main_page={true}
    >
      <div className="bg-gray-100">
        <ListDestinasi />
      </div>
    </BaseLayout>
  )
}

export default Destinasi