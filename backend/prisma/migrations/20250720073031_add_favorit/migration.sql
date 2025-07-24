-- CreateTable
CREATE TABLE "favorit" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "destinasi_kuliner_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorit_pkey" PRIMARY KEY ("id")
);
