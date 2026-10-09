import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/products";

type Row = {
  id: number; name: string; type: string; price: number; max_price: number | null;
  emoji: string; gradient: string; is_new: boolean; format: string; description: string;
};

const toProduct = (r: Row): Product => ({
  id: r.id, name: r.name, type: r.type, price: r.price, max: r.max_price ?? undefined,
  emoji: r.emoji, g: r.gradient, isNew: r.is_new, format: r.format, desc: r.description,
});

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").order("id");
  if (error) throw new Error(error.message);
  return (data as Row[]).map(toProduct);
}

export async function getProduct(id: number): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toProduct(data as Row) : null;
}
