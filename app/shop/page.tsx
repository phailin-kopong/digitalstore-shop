import ShopClient from "@/components/ShopClient";
import { getProducts } from "@/lib/data";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ cat?: string; q?: string }> }) {
  const sp = await searchParams;
  const products = await getProducts();
  return <ShopClient products={products} initialCat={sp.cat ?? "All"} initialQ={sp.q ?? ""} />;
}
