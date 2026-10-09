import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// ดาวน์โหลดไฟล์สินค้า ตรวจทุกครั้งว่าเป็นของลูกค้าคนนี้และชำระเงินแล้ว จากนั้นสร้างลิงก์ชั่วคราว 60 วินาที
export async function GET(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params;
  const n = Number(itemId);
  if (!Number.isInteger(n)) return NextResponse.json({ error: "ไม่พบรายการ" }, { status: 404 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const { data: item } = await supabase.from("order_items").select("product_id,orders(status)").eq("id", n).maybeSingle();
  if (!item) return NextResponse.json({ error: "ไม่พบรายการ" }, { status: 404 });

  const rel = item.orders as { status: string } | { status: string }[] | null;
  const status = Array.isArray(rel) ? rel[0]?.status : rel?.status;
  if (status !== "paid") return NextResponse.json({ error: "ยังไม่ได้ชำระเงิน" }, { status: 403 });

  const admin = createAdminClient();
  const { data: product } = await admin.from("products").select("file_path").eq("id", item.product_id).maybeSingle();
  if (!product?.file_path) return NextResponse.json({ error: "สินค้านี้ยังไม่มีไฟล์ให้ดาวน์โหลด" }, { status: 404 });

  const { data, error } = await admin.storage.from("product-files").createSignedUrl(product.file_path, 60, { download: true });
  if (error || !data) return NextResponse.json({ error: "สร้างลิงก์ดาวน์โหลดไม่สำเร็จ" }, { status: 500 });

  return NextResponse.redirect(data.signedUrl);
}
