import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Öffentlicher Client (RLS enforced)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin/Server-Client (Service Role) – RLS wird umgangen; nur serverseitig verwenden!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;
export const supabaseAdmin = supabaseServiceRole
  ? createClient(supabaseUrl, supabaseServiceRole, {
      auth: { persistSession: false },
    })
  : supabase;
