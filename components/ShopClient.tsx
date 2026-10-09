"use client";
import { useMemo, useState } from "react";
import { categoryIcons, type Product } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function ShopClient({ products, initialCat, initialQ }: { products: Product[]; initialCat: string; initialQ: string }) {
  const [cat, setCat] = useState(initialCat);
  const [q, setQ] = useState(initialQ);
  const [sort, setSort] = useState("new");

  const list = useMemo(() => {
    const l = products.filter(
      (p) => (cat === "All" || p.type === cat) && p.name.toLowerCase().includes(q.toLowerCase())
    );
    if (sort === "low") l.sort((a, b) => a.price - b.price);
    if (sort === "high") l.sort((a, b) => b.price - a.price);
    return l;
  }, [products, cat, q, sort]);

  return (
    <div className="page">
      <div className="crumb">หน้าแรก / ผลงานดิจิทัล</div>
      <div className="bar">
        <div className="chips">
          {["All", ...Object.keys(categoryIcons)].map((c) => (
            <button key={c} className={`chip${c === cat ? " on" : ""}`} onClick={() => setCat(c)}>
              {c === "All" ? "ทั้งหมด" : c}
            </button>
          ))}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาสินค้าหรือศิลปิน…" />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">เรียงตามล่าสุด</option>
          <option value="low">ราคา: ต่ำไปสูง</option>
          <option value="high">ราคา: สูงไปต่ำ</option>
        </select>
      </div>
      <div className="grid">
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
      {list.length === 0 && <p className="mute">ไม่พบสินค้า</p>}
    </div>
  );
}
