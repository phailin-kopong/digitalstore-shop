"use server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// สร้างหน้าชำระเงินของ Stripe สำหรับออเดอร์หนึ่งรายการ
export async function createCheckout(orderId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: order } = await supabase
    .from("orders")
    .select("id,status,order_items(product_id)")
    .eq("id", orderId)
    .maybeSingle();
  if (!order || order.status !== "pending") redirect(`/orders/${orderId}`);

  // ใช้ราคาจากตารางสินค้า ไม่ใช้ราคาที่เก็บในรายการออเดอร์
  const ids = [...new Set((order.order_items as { product_id: number }[]).map((i) => i.product_id))];
  const { data: prods } = await supabase.from("products").select("id,name,price").in("id", ids);
  const list = (prods ?? []) as { id: number; name: string; price: number }[];
  if (list.length === 0) redirect(`/orders/${orderId}`);

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const base = `${host.startsWith("localhost") ? "http" : "https"}://${host}`;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: list.map((p) => ({
      quantity: 1,
      price_data: { currency: "thb", unit_amount: p.price * 100, product_data: { name: p.name } },
    })),
    metadata: { order_id: order.id },
    success_url: `${base}/orders/${order.id}/confirm?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/orders/${order.id}`,
  });

  redirect(session.url!);
}
