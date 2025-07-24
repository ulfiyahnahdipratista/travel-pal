import ListFavorit from "@/components/list-favorit";
import BaseLayout from "@/layouts/base";

export default function Favorit() {
  return (
    <BaseLayout
      text="FAVORIT"
      deskripsi="/fa·vo·rit/"
      main_page={true}
    >
      <div className="bg-gray-100">
        <ListFavorit />
      </div>

    </BaseLayout>
  )
}