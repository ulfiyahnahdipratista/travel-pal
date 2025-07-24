// File: src/controller/destinasi.js
import prisma from "../service/prisma.js";
import pkg from "@prisma/client";
const { sql } = pkg;

export const getDestinasiByTipe = async (request, h) => {
  try {
    const {
      tipe = [], // fast api
      limit_rekomendasi = 5, // tipe untuk fast api
      limit_destinasi = 8, // destinasi
    } = request.payload || {};

    const tipeArray = Array.isArray(tipe) ? tipe : [tipe];

    let result = [];
    const safeLimit = Math.max(1, Math.min(Number(limit_rekomendasi), 10)); // Batasi limit agar tidak ekstrem

    // Ambil data berdasarkan tipe
    for (const t of tipeArray) {
      const data = await prisma.$queryRaw(
        sql`SELECT * FROM destinasi WHERE tipe = ${t} ORDER BY RANDOM() LIMIT ${safeLimit}`
      );
      result.push(...data);
    }
    // Hapus duplikat berdasarkan ID (jika ada)
    const mapById = new Map();
    result.forEach((item) => {
      mapById.set(item.id, item);
    });
    result = [...mapById.values()];

    // Cek apakah jumlah masih kurang dari limit_destinasi
    if (result.length < limit_destinasi) {
      const sisa = limit_destinasi - result.length;

      // Ambil semua kategori dari hasil awal
      const kategoriList = [...new Set(result.map((d) => d.kategori))];
      const idList = result.map((d) => d.id);

      console.log("Kategori List:", kategoriList);
      console.log("ID List:", idList);

      let tambahan = [];
      if (kategoriList.length > 0 && idList.length > 0) {
        const kategoriPlaceholders = kategoriList
          .map((kat) => `'${kat}'`)
          .join(", ");
        const idPlaceholders = idList.map((id) => `${id}`).join(", ");

        console.log("Kategori Placeholders:", kategoriPlaceholders);
        console.log("ID Placeholders:", idPlaceholders);

        const query = `
          SELECT * FROM destinasi
          WHERE kategori IN (${kategoriPlaceholders})
          AND id NOT IN (${idPlaceholders})
          ORDER BY RANDOM()
          LIMIT ${sisa}
        `;

        console.log("Query:", query);

        tambahan = await prisma.$queryRawUnsafe(query);
        result.push(...tambahan);
      }

      result.push(...tambahan);
    }

    // Potong jika kelebihan
    if (result.length > limit_destinasi) {
      result = result.slice(0, limit_destinasi);
    }

    return h.response({
      status: "success",
      message: `Berhasil mengambil destinasi rekomendasi dengan jumlah ${result.length}`,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching destinasi by tipe:", error);
    return h
      .response({
        status: "error",
        message: "Gagal mendapatkan data destinasi",
        data: error,
      })
      .code(500);
  }
};

export const getDestinasiList = async (request, h) => {
  try {
    const { page = 1, limit = 10 } = request.query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const [data, total] = await Promise.all([
      prisma.destinasi.findMany({
        skip,
        take: pageSize,
      }),
      prisma.destinasi.count(),
    ]);

    return h.response({
      status: "success",
      message: "Berhasil mendapatkan data destinasi",
      data,
      meta: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching destinasi list:", error);
    return h
      .response({
        status: "error",
        message: "Gagal mendapatkan data destinasi",
      })
      .code(500);
  }
};

export const getDestinasiById = async (request, h) => {
  try {
    const { id } = request.query;

    const data = await prisma.destinasi.findUnique({
      where: { id: parseInt(id) },
    });

    return h.response({
      status: "success",
      message: `Destinasi dengan id ${id} berhasil di dapat`,
      data,
    });
  } catch (error) {
    console.error("Error fetching destinasi by ID:", error);
    return h
      .response({
        status: "error",
        message: "Gagal mendapatkan data destinasi",
      })
      .code(500);
  }
};
