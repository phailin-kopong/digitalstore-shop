"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/lib/products";

export type CartItem = { id: number; name: string; type: string; price: number; emoji: string; g: string };
type Ctx = { items: CartItem[]; add: (p: Product) => void; remove: (id: number) => void; clear: () => void };

const CartContext = createContext<Ctx | null>(null);
const KEY = "digitalstore-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // โหลดตะกร้าที่เคยเก็บไว้ในเบราว์เซอร์
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  // บันทึกตะกร้าทุกครั้งที่เปลี่ยน
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add = (p: Product) =>
    setItems((cur) =>
      cur.some((i) => i.id === p.id) ? cur : [...cur, { id: p.id, name: p.name, type: p.type, price: p.price, emoji: p.emoji, g: p.g }]
    );
  const remove = (id: number) => setItems((cur) => cur.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  return <CartContext.Provider value={{ items, add, remove, clear }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart ต้องใช้ภายใน CartProvider");
  return ctx;
}
