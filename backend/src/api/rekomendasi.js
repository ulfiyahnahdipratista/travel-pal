import axios from "axios";

export const createRekomendasi = async ({
  max_recom = "2",
  treshold = "0.5",
  data,
}) => {
  try {
    console.log(data);

    const response = await axios.post(
      `http://localhost:8000/recommendation?max_recom=${max_recom}&treshold=${treshold}`,
      {
        user_survey: data,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
