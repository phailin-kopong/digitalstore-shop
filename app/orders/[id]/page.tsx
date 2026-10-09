import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createCheckout } from "@/app/payment";

type Item = { id: number; product_id: number; product_name: string; price: number };
const STATUS: Record<string, string> = { pending: "รอชำระเงิน", paid: "ชำระแล้ว" };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: order } = await supabase
    .from("orders")
    .select("id,total,status,created_at,order_items(id,product_id,product_name,price)")
    .eq("id", id)
    .maybeSingle();
  if (!order) notFound();

  const items = order.order_items as Item[];
  const paid = order.status === "paid";
  const when = new Date(order.created_at).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });

  return (
    <div className="page">
      <div className="crumb"><Link href="/account">← กลับไปบัญชีของฉัน</Link></div>
      <h2>ออเดอร์ของคุณ</h2>
      <div className="card" style={{ maxWidth: 640 }}>
        <div className="row"><span className="mute">รหัสออเดอร์</span><span style={{ fontSize: 12 }}>{order.id}</span></div>
        <div className="row"><span className="mute">วันที่</span><span>{when}</span></div>
        <div className="row">
          <span className="mute">สถานะ</span>
          <span className={`badge${paid ? " paid" : ""}`}>{STATUS[order.status] ?? order.status}</span>
        </div>
        <div style={{ borderTop: "1px solid var(--line)", margin: "8px 0" }} />
        {items.map((i) => (
          <div key={i.id} className="row" style={{ alignItems: "center" }}>
            <span>{i.product_name}</span>
            {paid ? (
              <a className="btn" href={`/download/${i.id}`} style={{ padding: "6px 16px", fontSize: 14 }}>ดาวน์โหลด</a>
            ) : (
              <span>฿{i.price}</span>
            )}
          </div>
        ))}
        <div className="row" style={{ borderTop: "1px solid var(--line)", fontWeight: 600, fontSize: 19 }}>
          <span>ยอดสุทธิ</span><span>฿{order.total}</span>
        </div>

        {!paid && (
          <form action={createCheckout.bind(null, order.id)}>
            <button className="btn" type="submit" style={{ width: "100%", marginTop: 14 }}>ชำระเงินด้วย Stripe</button>
          </form>
        )}
        {paid && <p className="mute" style={{ marginBottom: 0 }}>ขอบคุณที่อุดหนุนศิลปินไทยค่ะ 🌸 ดาวน์โหลดได้ตลอดเวลาจากหน้านี้</p>}
      </div>
    </div>
  );
}
