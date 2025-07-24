// File: src/controller/kuliner.js
import prisma from "../service/prisma.js";
import pkg from "@prisma/client";
const { sql } = pkg;

export const getKulinerByKabupaten = async (request, h) => {
  const { kabupaten, limit = 5, id } = request.query;

  if (kabupaten && !id) {
    if (!kabupaten) {
      return h
        .response({
          status: "error",
          message: "Kabupaten tidak boleh kosong",
        })
        .code(400);
    }

    const data = await prisma.$queryRaw(
      sql`SELECT * FROM kuliner WHERE kabupaten ILIKE ${kabupaten} ORDER BY RANDOM() LIMIT ${Math.max(
        1,
        Math.min(Number(limit), 50)
      )}`
    );

    console.log("data kuliner:", data);

    return h.response({
      status: "success",
      message: `Kuliner dengan kabupaten ${kabupaten} berhasil di dapat`,
      data,
    });
  } else if (id && !kabupaten) {
    return getKulinerById(request, h);
  }
};

export const getKulinerList = async (request, h) => {
  try {
    const { page = 1, limit = 10 } = request.query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const [data, total] = await Promise.all([
      prisma.kuliner.findMany({
        skip,
        take: pageSize,
      }),
      prisma.kuliner.count(),
    ]);

    return h.response({
      status: "success",
      message: "Berhasil mendapatkan data kuliner",
      data,
      meta: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching kuliner list:", error);
    return h
      .response({
        status: "error",
        message: "Gagal mendapatkan data kuliner",
      })
      .code(500);
  }
};

export const getKulinerById = async (request, h) => {
  try {
    const { id } = request.query;

    const data = await prisma.kuliner.findUnique({
      where: { id: parseInt(id) },
    });

    return h.response({
      status: "success",
      message: `Kuliner dengan id ${id} berhasil di dapat`,
      data,
    });
  } catch (error) {
    console.error("Error fetching kuliner by ID:", error);
    return h
      .response({
        status: "error",
        message: "Gagal mendapatkan data kuliner",
        data: error,
      })
      .code(500);
  }
};
