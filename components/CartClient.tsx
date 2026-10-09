"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { placeOrder } from "@/app/actions";

export default function CartClient() {
  const { items, remove, clear } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const total = items.reduce((s, i) => s + i.price, 0);

  async function checkout() {
    setBusy(true);
    setErr("");
    const r = await placeOrder(items.map((i) => i.id));
    setBusy(false);
    if (r.error === "login") { router.push("/login"); return; }
    if (r.error || !r.orderId) { setErr(r.error ?? "เกิดข้อผิดพลาด"); return; }
    clear();
    router.push(`/orders/${r.orderId}`);
  }

  return (
    <div className="page">
      <h2>ตะกร้าสินค้า</h2>
      <div className="twocol">
        <div className="card">
          {items.length === 0 && (
            <p className="mute">ตะกร้ายังว่างอยู่ <Link href="/shop" style={{ color: "var(--brand)" }}>ไปเลือกสินค้ากันเลย →</Link></p>
          )}
          {items.map((i) => (
            <div key={i.id} className="cartrow">
              <div className="cover" style={{ background: `linear-gradient(135deg,${i.g})` }}><span>{i.emoji}</span></div>
              <div className="nm"><b>{i.name}</b><div className="mute">{i.type}</div></div>
              <b>฿{i.price}</b>
              <button className="linkbtn" onClick={() => remove(i.id)}>ลบ</button>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 8 }}>สรุปคำสั่งซื้อ</h3>
          <div className="row"><span className="mute">จำนวนสินค้า</span><span>{items.length} ชิ้น</span></div>
          <div className="row" style={{ borderTop: "1px solid var(--line)", fontWeight: 600, fontSize: 19 }}>
            <span>ยอดสุทธิ</span><span>฿{total}</span>
          </div>
          <button className="btn" style={{ width: "100%", marginTop: 14 }} disabled={busy || items.length === 0} onClick={checkout}>
            {busy ? "กำลังสร้างออเดอร์…" : "สั่งซื้อ"}
          </button>
          {err && <div className="msg err">{err}</div>}
          <p className="mute" style={{ fontSize: 12, textAlign: "center" }}>ราคาจริงจะคิดจากข้อมูลในระบบตอนสั่งซื้อ</p>
        </div>
      </div>
    </div>
  );
}
