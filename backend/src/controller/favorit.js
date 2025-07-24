import prisma from "../service/prisma.js";

export const toggleFavorit = async (request, h) => {
  const { tipe, id } = request.payload;

  const userId = request.auth.credentials.user_id; // Ambil user_id dari token JWT

  console.log("userId : ", userId);

  if (!userId) {
    return h.response({ error: "Unauthorized" }).code(401);
  }

  try {
    // Cek apakah favorit sudah ada
    const existing = await prisma.favorit.findFirst({
      where: {
        user_id: userId,
        tipe,
        destinasi_kuliner_id: id,
      },
    });

    if (existing) {
      // Hapus favorit
      await prisma.favorit.delete({
        where: { id: existing.id },
      });

      return h.response({ status: "removed" }).code(200);
    } else {
      // Tambah favorit
      const created = await prisma.favorit.create({
        data: {
          user_id: userId,
          tipe,
          destinasi_kuliner_id: id,
        },
      });

      return h.response({ status: "added", favorit_id: created.id }).code(200);
    }
  } catch (error) {
    console.error("Gagal toggle favorit:", error);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

export const getFavoritList = async (request, h) => {
  const { tipe } = request.query;
  const userId = request.auth.credentials.user_id;

  if (!userId || !["destinasi", "kuliner"].includes(tipe)) {
    return h.response({ error: "Bad Request" }).code(400);
  }

  try {
    const favoritList = await prisma.favorit.findMany({
      where: {
        user_id: userId,
        tipe,
      },
    });

    const ids = favoritList.map((fav) => fav.destinasi_kuliner_id);

    let detailData = [];
    if (tipe === "destinasi") {
      detailData = await prisma.destinasi.findMany({
        where: { id: { in: ids } },
      });
    } else {
      detailData = await prisma.kuliner.findMany({
        where: { id: { in: ids } },
      });
    }

    return h
      .response({
        status: "success",
        message: "Data favorit berhasil diambil dengan tipe " + tipe,
        data: detailData,
      })
      .code(200);
  } catch (error) {
    console.error("Gagal ambil data favorit:", error);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};
