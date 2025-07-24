import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const { data } = await supabase.auth.getSession();
const token = data.session?.access_token;

type ReqApiKuliner = {
  kabupaten: string;
};

export const ApiKuliner = async (payload: ReqApiKuliner) => {
  try {
    console.log("token supabase: ", token);
    const response = await axios.get(
      `${API_URL}/kuliner?kabupaten=${payload.kabupaten.toString()}`,
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
    console.error("Error fetching kuliner:", error);
    throw error;
  }
};

export const ApiListKuliner = async (page: number, limit: number) => {
  try {
    console.log("token supabase: ", token);
    const response = await axios.get(
      `${API_URL}/kuliner/list?page=${page}&limit=${limit}`,
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
    console.error("Error fetching kuliner:", error);
    throw error;
  }
};

export const ApiKulinerDetail = async (id: string) => {
  try {
    console.log("token supabase: ", token);
    const response = await axios.get(`${API_URL}/kuliner?id=${id}`, {
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
