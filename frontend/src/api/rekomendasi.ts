import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

const API_URL = import.meta.env.VITE_API_URL || "http://202.10.47.198:3000";
const { data } = await supabase.auth.getSession();
const token = data.session?.access_token;

type ReqApiSurvey = {
  survey: string[];
  max_recom?: number;
  treshold?: number;
};

export const ApiSurvey = async (payload: ReqApiSurvey) => {
  try {
    // console.log("token supabase: ", token);
    const response = await axios.post(`${API_URL}/survey`, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching kuliner detail:", error);
    throw error;
  }
};

export const ApiGetRekomendasi = async () => {
  try {
    // console.log("token supabase: ", token);
    const response = await axios.get(`${API_URL}/survey`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching kuliner detail:", error);
    throw error;
  }
};
