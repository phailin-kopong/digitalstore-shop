import Link from "next/link";
import { priceText, type Product } from "@/lib/products";
import Cover from "./Cover";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/products/${p.id}`} className="pc">
      <Cover p={p} />
      <div className="pt">{p.name}</div>
      <div className="pp">{priceText(p)}</div>
    </Link>
  );
}
