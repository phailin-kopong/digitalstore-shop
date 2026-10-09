import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type OrderRow = { id: string; total: number; status: string; created_at: string };
const STATUS: Record<string, string> = { pending: "รอชำระเงิน", paid: "ชำระแล้ว" };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("orders")
    .select("id,total,status,created_at")
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as OrderRow[];

  return (
    <div className="page">
      <h2>บัญชีของฉัน</h2>
      <div className="card" style={{ maxWidth: 640 }}>
        <div className="mute">อีเมล</div>
        <div style={{ fontWeight: 600, marginBottom: 18 }}>{user.email}</div>
        <div className="mute" style={{ marginBottom: 6 }}>ประวัติการสั่งซื้อ</div>
        {orders.length === 0 && <p style={{ margin: 0 }}>ยังไม่มีรายการสั่งซื้อ</p>}
        {orders.map((o) => (
          <Link key={o.id} href={`/orders/${o.id}`} className="row" style={{ borderTop: "1px solid var(--line)" }}>
            <span>
              {new Date(o.created_at).toLocaleDateString("th-TH", { timeZone: "Asia/Bangkok" })}{" "}
              <span className={`badge${o.status === "paid" ? " paid" : ""}`}>{STATUS[o.status] ?? o.status}</span>
            </span>
            <b>฿{o.total}</b>
          </Link>
        ))}
      </div>
    </div>
  );
}
