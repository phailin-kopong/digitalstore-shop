import Link from "next/link";
import { notFound } from "next/navigation";
import { priceText, artistOf } from "@/lib/products";
import { getProduct, getProducts } from "@/lib/data";
import Cover from "@/components/Cover";
import ProductCard from "@/components/ProductCard";
import AddToCart from "@/components/AddToCart";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n)) notFound();
  const p = await getProduct(n);
  if (!p) notFound();
  const all = await getProducts();

  return (
    <div className="page">
      <div className="crumb"><Link href="/shop">← กลับไปร้านค้า</Link></div>
      <div className="detail">
        <Cover p={p} big />
        <div>
          <span className="pill">{p.type}</span>
          <h2 style={{ margin: "12px 0 6px", fontSize: 24 }}>{p.name}</h2>
          <div className="mute">โดย {artistOf(p)} · ★ 4.9</div>
          <div className="grad" style={{ fontSize: 32, fontWeight: 600, margin: "14px 0" }}>{priceText(p)}</div>
          <p className="mute">{p.desc}</p>
          <ul className="feat">
            <li>ดาวน์โหลดทันทีหลังชำระเงิน</li>
            <li>ไฟล์: {p.format}</li>
            <li>สิทธิ์ใช้งานส่วนตัว</li>
            <li>อัปเดตฟรีจากศิลปิน</li>
          </ul>
          <AddToCart p={p} />
        </div>
      </div>
      <h2 style={{ marginTop: 48 }}>สินค้าที่คุณอาจชอบ</h2>
      <div className="grid">
        {all.filter((x) => x.id !== p.id).slice(0, 4).map((x) => <ProductCard key={x.id} p={x} />)}
      </div>
    </div>
  );
}
