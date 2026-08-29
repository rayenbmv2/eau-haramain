import { Flame } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Promotion } from "@/lib/promotions.functions";

export function PromoCard({ p }: { p: Promotion }) {
  const add = useCart((s) => s.add);
  const oldTotal = p.old_price_tnd * p.pack_qty;
  const savings = (oldTotal - p.price_tnd).toFixed(3);
  const available = p.available;

  const handleAdd = () => {
    if (!available) return;
    add(
      {
        id: p.id,
        name: `PROMO ${p.name}`,
        size: p.size,
        price: p.price_tnd / p.pack_qty,
      },
      p.pack_qty,
    );
  };

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-card shadow-card transition ${
        available
          ? "border-amber-400/60 hover:-translate-y-0.5 hover:shadow-soft"
          : "border-border/60 opacity-60"
      }`}
    >
      <div
        className={`absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-soft ${
          available ? "bg-gradient-to-r from-amber-500 to-red-500" : "bg-red-600"
        }`}
      >
        <Flame className="h-3 w-3" /> {available ? "Promo" : "Terminée"}
      </div>
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-red-50 dark:from-amber-950/30 dark:to-red-950/30">
        <img
          src={p.image_url ?? ""}
          alt={`${p.name} ${p.size} pack promo`}
          loading="lazy"
          width={400}
          height={400}
          className={`h-full w-full object-cover transition duration-500 ${
            available ? "group-hover:scale-105" : "grayscale"
          }`}
        />
        <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
          Pack de {p.pack_qty} (packs de 6 bouteilles)
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div>
          <h3 className="text-sm font-bold leading-tight sm:text-base">
            {p.name} {p.size}
          </h3>
          <p className="text-xs text-muted-foreground">
            {p.pack_qty} packs de 6 bouteilles
          </p>
        </div>
        <div className="mt-auto space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-red-600 sm:text-2xl">
              {p.price_tnd.toFixed(3)}
              <span className="ml-1 text-xs font-medium text-muted-foreground">
                TND
              </span>
            </span>
            <span className="text-xs font-medium text-muted-foreground line-through">
              {oldTotal.toFixed(3)}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-emerald-600">
            Vous économisez {savings} TND
          </p>
          {available ? (
            <button
              onClick={handleAdd}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-3 py-2.5 text-sm font-bold text-white shadow-soft transition hover:opacity-95"
            >
              Ajouter au panier
            </button>
          ) : (
            <button
              disabled
              className="w-full cursor-not-allowed rounded-xl bg-muted px-3 py-2.5 text-sm font-bold text-muted-foreground"
            >
              Promotion terminée
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
