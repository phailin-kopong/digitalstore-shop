export type Product = {
  id: number; name: string; type: string; price: number; max?: number;
  emoji: string; g: string; isNew?: boolean; format: string; desc: string;
};

export const categoryIcons: Record<string, string> = {
  "วอลเปเปอร์": "🌿", "สติกเกอร์": "🎀", "ไอคอน": "🍎", "วิดเจ็ต": "🔮",
  "แพลนเนอร์": "📅", "แปรง": "🖌️", "สมุดโน้ต": "📓", "ฟอนต์": "🔤",
};

export const priceText = (p: Product) =>
  p.max ? `฿${p.price} – ฿${p.max}` : `฿${p.price}`;

export const artistOf = (p: Product) => p.name.split(" | ")[0];
