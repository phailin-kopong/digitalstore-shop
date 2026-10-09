import Stripe from "stripe";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sessionId = request.nextUrl.searchParams.get("session_id");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const { data: order } = await supabase.from("orders").select("id,status").eq("id", id).maybeSingle();
  console.log("[confirm] สถานะออเดอร์:", order?.status, "| มี session_id:", !!sessionId);

  if (order && order.status === "pending" && sessionId) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      const { data: items } = await supabase.from("order_items").select("product_id").eq("order_id", id);
      const ids = [...new Set((items ?? []).map((i: { product_id: number }) => i.product_id))];
      const { data: prods } = await supabase.from("products").select("price").in("id", ids);
      const expected = ((prods ?? []) as { price: number }[]).reduce((s, p) => s + p.price, 0) * 100;

      console.log("[confirm] Stripe:", session.payment_status, "| จ่ายจริง:", session.amount_total, "| ควรเป็น:", expected, "| order_id ตรงกัน:", session.metadata?.order_id === id);

      if (session.payment_status === "paid" && session.metadata?.order_id === id && session.amount_total === expected) {
        const { data: updated, error: upErr } = await createAdminClient()
          .from("orders").update({ status: "paid" }).eq("id", id).select("id");
        if (upErr || !updated || updated.length === 0) {
          console.error("[confirm] อัปเดตสถานะไม่สำเร็จ:", upErr?.message ?? "ไม่มีแถวที่ถูกแก้ (คีย์อาจไม่ใช่ secret key)");
        } else {
          console.log("[confirm] อัปเดตเป็น paid สำเร็จ");
        }
      }
    } catch (e) {
      console.error("[confirm] เกิดข้อผิดพลาด:", e);
    }
  }

  return NextResponse.redirect(new URL(`/orders/${id}`, request.url));
}