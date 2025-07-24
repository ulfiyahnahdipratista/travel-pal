// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

console.log("Initializing Supabase client...");
console.log("meta.env : ", import.meta.env.VITE_SUPABASE_URL);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
