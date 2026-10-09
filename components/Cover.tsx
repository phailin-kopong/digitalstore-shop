import type { Product } from "@/lib/products";

export default function Cover({ p, big }: { p: Product; big?: boolean }) {
  return (
    <div className={`cover${big ? " big" : ""}`} style={{ background: `linear-gradient(135deg,${p.g})` }}>
      {p.isNew && <b className="new">NEW!</b>}
      <span>{p.emoji}</span>
      <em className="lab">{p.type}</em>
    </div>
  );
}
