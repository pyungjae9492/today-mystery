import { createClient } from "@supabase/supabase-js"

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error("Supabase env is not configured: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/ANON_KEY are required")
  }
  return createClient(url, key)
}

export type ChatLogInsert = {
  id?: string
  session_id: string
  quiz_id?: string
  role: "user" | "assistant"
  content: string
  metadata?: Record<string, unknown>
} 