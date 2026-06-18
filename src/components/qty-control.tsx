import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";

type Props = {
  product: { id: string; name: string; size: string; price: number };
};

export function QtyControl({ product }: Props) {
  const item = useCart((s) => s.items.find((i) => i.id === product.id));
  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);
  const qty = item?.qty ?? 0;

  if (qty === 0) {
    return (
      <button
        onClick={() => add(product)}
        aria-label={`Ajouter ${product.name}`}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95 active:scale-95"
      >
        <Plus className="h-4 w-4" /> Ajouter
      </button>
    );
  }

  return (
    <div className="flex w-full items-center justify-between rounded-xl bg-primary text-primary-foreground shadow-soft">
      <button
        onClick={() => setQty(product.id, qty - 1)}
        aria-label="Diminuer"
        className="flex h-10 w-10 items-center justify-center rounded-l-xl transition hover:bg-white/10 active:scale-95"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="flex-1 text-center text-sm font-bold tabular-nums">{qty}</span>
      <button
        onClick={() => setQty(product.id, qty + 1)}
        aria-label="Augmenter"
        className="flex h-10 w-10 items-center justify-center rounded-r-xl transition hover:bg-white/10 active:scale-95"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
