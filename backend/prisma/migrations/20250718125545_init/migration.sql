-- CreateTable
CREATE TABLE "destinasi" (
    "id" SERIAL NOT NULL,
    "url_maps" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "jumlah_review" INTEGER NOT NULL,
    "tipe" TEXT NOT NULL,
    "url_gambar" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "kategori" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,

    CONSTRAINT "destinasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kuliner" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "url_gambar" TEXT NOT NULL,

    CONSTRAINT "kuliner_pkey" PRIMARY KEY ("id")
);
