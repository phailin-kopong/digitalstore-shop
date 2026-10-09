import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/lib/cart";

const kanit = Kanit({ subsets: ["thai", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-kanit" });

export const metadata: Metadata = {
  title: "DigitalStore – ผลงานดิจิทัลโดยศิลปินไทย",
  description: "ร้านขายผลงานดิจิทัลโดยศิลปินไทย สติกเกอร์ แพลนเนอร์ ฟอนต์ วอลเปเปอร์ และอื่นๆ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={kanit.variable}>
      <body>
        <CartProvider>
          <Header />
          <main className="wrap">{children}</main>
          <footer><div className="wrap">© 2026 DigitalStore · ทำด้วยความรักเพื่อศิลปินไทย 🌷</div></footer>
        </CartProvider>
      </body>
    </html>
  );
}
