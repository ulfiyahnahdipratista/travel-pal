import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const { data } = await supabase.auth.getSession();
const token = data.session?.access_token;

type ReqApiFavoritToggle = {
  tipe: string;
  id: number;
};

export const ApiFavoritToggle = async (payload: ReqApiFavoritToggle) => {
  try {
    console.log("token supabase: API FavoritToggle: ", token);
    const response = await axios.post(`${API_URL}/favorit/toggle`, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("API FavoritToggle: ", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching kuliner detail:", error);
    throw error;
  }
};

// tipe | destinasi | kuliner
export const ApiFavorit = async (tipe: string) => {
  try {
    console.log("token supabase: ", token);
    const response = await axios.get(`${API_URL}/favorit?tipe=${tipe}`, {
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
