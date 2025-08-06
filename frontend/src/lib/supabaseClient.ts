// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// console.log("Initializing Supabase client...");
// console.log("meta.env : ", import.meta.env.VITE_SUPABASE_URL);

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL! ||
  "https://koxyqzwgqunsgueptvou.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY! ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtveHlxendncXVuc2d1ZXB0dm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NDg5NzMsImV4cCI6MjA2ODMyNDk3M30.fjd59awO6f4IIPK9GUdmZNKB8rkwnoHaqDcA0nygLDI";

export const supabase = createClient(supabaseUrl, supabaseKey);
