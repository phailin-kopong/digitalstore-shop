import Link from "next/link";
import { categoryIcons, artistOf } from "@/lib/products";
import { getProducts } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const products = await getProducts();
  return (
    <div className="page">
      <div className="hero center">
        <span className="pill">✿ ศิลปินและผลงานใหม่ทุกสัปดาห์</span>
        <h1 style={{ marginTop: 14 }}>ผลงาน<span className="grad">ดิจิทัล</span></h1>
        <p className="mute">ผลงานดิจิทัลสุดครีเอทีฟกว่า 1,300 ชิ้นจากศิลปินไทย ทั้งแพลนเนอร์ สมุดโน้ต สติกเกอร์ ฟอนต์ ไอคอน วิดเจ็ต วอลเปเปอร์ และแปรง Procreate</p>
        <Link href="/shop" className="btn">เลือกซื้อเลย</Link>
      </div>

      <div className="cats">
        {Object.entries(categoryIcons).map(([c, e]) => (
          <Link key={c} href={`/shop?cat=${encodeURIComponent(c)}`} className="tile"><span>{e}</span>{c}</Link>
        ))}
      </div>

      <h2>มาใหม่</h2>
      <div className="grid">{products.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}</div>

      <h2 style={{ marginTop: 56 }}>พบกับศิลปิน</h2>
      <div className="arts">
        {products.map((p) => (
          <Link key={p.id} href={`/shop?q=${encodeURIComponent(artistOf(p).split(" ")[0])}`} className="art">
            <div className="av" style={{ background: `linear-gradient(135deg,${p.g})` }}>{p.emoji}</div>
            {artistOf(p)}
          </Link>
        ))}
      </div>
    </div>
  );
}
