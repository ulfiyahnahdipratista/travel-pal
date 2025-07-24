-- CreateTable
CREATE TABLE "rekomendasi" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "tipe_destinasi" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rekomendasi_pkey" PRIMARY KEY ("id")
);
