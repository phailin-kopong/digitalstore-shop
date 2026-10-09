import { createClient } from "@supabase/supabase-js";

// ⚠️ ใช้เฉพาะฝั่งเซิร์ฟเวอร์เท่านั้น (route handler / server action)
// คีย์ SUPABASE_SECRET_KEY ข้ามกฎความปลอดภัยของตารางได้ ห้ามนำไปใช้ในไฟล์ที่มี "use client"
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
