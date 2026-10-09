"use client";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

export default function AddToCart({ p }: { p: Product }) {
  const { add, items } = useCart();
  const router = useRouter();
  const inCart = items.some((i) => i.id === p.id);

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button className="btn" type="button" onClick={() => add(p)} disabled={inCart}>
        {inCart ? "อยู่ในตะกร้าแล้ว ✓" : "เพิ่มลงตะกร้า"}
      </button>
      <button className="btn ghost" type="button" onClick={() => { add(p); router.push("/cart"); }}>
        ซื้อเลย
      </button>
    </div>
  );
}
