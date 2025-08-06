import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

const API_URL = import.meta.env.VITE_API_URL || "http://202.10.47.198:3000";
const { data } = await supabase.auth.getSession();
const token = data.session?.access_token;

export type ReqApiDestinasi = {
  tipe: string[];
};

export const ApiDestinasi = async (payload: ReqApiDestinasi) => {
  try {
    // console.log("token supabase: ", token);
    const response = await axios.post(`${API_URL}/destinasi`, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching destinasi:", error);
    throw error;
  }
};

export const ApiListDestinasi = async (page: number, limit: number) => {
  try {
    // console.log("token supabase: ", token);
    const response = await axios.get(
      `${API_URL}/destinasi/list?page=${page}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching destinasi:", error);
    throw error;
  }
};

export const ApiDestinasiDetail = async (id: string) => {
  try {
    console.log("token supabase: ", token);
    const response = await axios.get(`${API_URL}/destinasi?id=${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching destinasi detail:", error);
    throw error;
  }
};
