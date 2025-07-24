// File: src/controller/survey.js

import { createRekomendasi } from "../api/rekomendasi.js";
import prisma from "../service/prisma.js";

export const CreateSurvey = async (request, h) => {
  try {
    const userId = request.auth.credentials.user_id;
    const { survey, max_recom, treshold } = request.payload;

    if (!userId || !Array.isArray(survey) || survey.length === 0) {
      return h
        .response({ status: "error", message: "Invalid input" })
        .code(400);
    }

    // Hapus survey sebelumnya jika ada
    await prisma.rekomendasi.deleteMany({
      where: {
        user_id: userId,
      },
    });

    const surveyJoin = survey.join(", ");

    // Kirim ke FastAPI
    const fastapiResponse = await createRekomendasi({
      max_recom: max_recom || 5,
      treshold: treshold || 0.4,
      data: surveyJoin,
    });

    console.log(fastapiResponse);

    if (fastapiResponse.status !== "success") {
      return h
        .response({
          status: "error",
          message: "Gagal mendapatkan rekomendasi",
        })
        .code(500);
    }

    const rekomendasiList = fastapiResponse.data;

    // Simpan semua rekomendasi baru ke DB
    const createdRekomendasi = await prisma.$transaction(
      rekomendasiList.map((item) =>
        prisma.rekomendasi.create({
          data: {
            user_id: userId,
            tipe_destinasi: item.tipe_destinasi,
            score: item.score,
          },
        })
      )
    );

    return h
      .response({
        status: "success",
        message: "Survey berhasil disimpan",
        data: createdRekomendasi.map((r) => r.tipe_destinasi),
      })
      .code(201);
  } catch (error) {
    console.error("Error creating survey:", error);
    return h
      .response({ status: "error", message: "Internal server error" })
      .code(500);
  }
};

export const GetSurvey = async (request, h) => {
  try {
    const userId = request.auth.credentials.user_id;
    const survey = await prisma.rekomendasi.findMany({
      where: { user_id: userId },
      select: {
        tipe_destinasi: true,
      },
    });

    return h
      .response({
        status: "success",
        message: `Survey berhasil didapatkan pada user ${userId}`,
        data: survey.map((r) => r.tipe_destinasi),
      })
      .code(200);
  } catch (error) {
    console.error("Error fetching survey:", error);
    return h
      .response({ status: "error", message: "Internal server error" })
      .code(500);
  }
};
