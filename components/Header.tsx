"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart";

const items = [
  { href: "/", label: "หน้าแรก" },
  { href: "/shop", label: "ร้านค้า" },
  { href: "/cart", label: "ชำระเงิน" },
  { href: "/account", label: "ประวัติการซื้อ" },
];

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const { items: cartItems } = useCart();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) =>
      setEmail(session?.user?.email ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  async function logout() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  const active = (href: string) =>
    href === "/" ? path === "/"
    : href === "/shop" ? path.startsWith("/shop") || path.startsWith("/products")
    : href === "/account" ? path.startsWith("/account") || path.startsWith("/orders")
    : path.startsWith(href);

  return (
    <header>
      <div className="wrap nav">
        <Link href="/" className="logo"><i>🌸</i>DigitalStore</Link>
        <nav>
          {items
            .filter((it) => it.href !== "/account" || email)
            .map((it) => (
              <Link key={it.href} href={it.href} className={active(it.href) ? "on" : ""}>{it.label}</Link>
            ))}
        </nav>
        <div className="right">
          {email ? (
            <>
              <Link href="/account" className="who">{email}</Link>
              <button className="linkbtn" onClick={logout}>ออกจากระบบ</button>
            </>
          ) : (
            <Link href="/login" className="chip">เข้าสู่ระบบ</Link>
          )}
          <Link href="/cart" className="cartbtn">🛍️ {cartItems.length}</Link>
        </div>
      </div>
    </header>
  );
}
