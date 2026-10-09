"use server";
import { createClient } from "@/lib/supabase/server";

type Result = { orderId?: string; error?: string };

// สร้างออเดอร์ โดยดึงราคาจริงจากฐานข้อมูล ไม่เชื่อราคาที่ส่งมาจากหน้าเว็บ
export async function placeOrder(ids: number[]): Promise<Result> {
  const uniq = [...new Set(ids)].filter((n) => Number.isInteger(n));
  if (uniq.length === 0) return { error: "ตะกร้าว่างอยู่" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "login" };

  const { data: prods, error: pe } = await supabase.from("products").select("id,name,price").in("id", uniq);
  if (pe || !prods || prods.length === 0) return { error: "ไม่พบสินค้า" };

  const list = prods as { id: number; name: string; price: number }[];
  const total = list.reduce((s, p) => s + p.price, 0);

  const { data: order, error: oe } = await supabase
    .from("orders")
    .insert({ user_id: user.id, total })
    .select("id")
    .single();
  if (oe || !order) return { error: "สร้างออเดอร์ไม่สำเร็จ: " + (oe?.message ?? "") };

  const { error: ie } = await supabase.from("order_items").insert(
    list.map((p) => ({ order_id: order.id, product_id: p.id, product_name: p.name, price: p.price }))
  );
  if (ie) return { error: "บันทึกรายการสินค้าไม่สำเร็จ: " + ie.message };

  return { orderId: order.id };
}
