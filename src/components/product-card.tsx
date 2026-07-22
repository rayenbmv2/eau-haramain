import { Flame } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Promotion } from "@/lib/promotions";

export function PromoCard({ p }: { p: Promotion }) {
  const add = useCart((s) => s.add);
  const savings = (p.oldPriceTnd * p.packQty - p.priceTnd).toFixed(3);

  const handleAdd = () => {
    if (!p.available) return;
    add({
      id: p.id,
      name: `PROMO ${p.name} — Pack de ${p.packQty}`,
      size: p.size,
      price: p.priceTnd,
    });
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-amber-400/60 bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-red-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-soft">
        <Flame className="h-3 w-3" /> Promo
      </div>
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-red-50 dark:from-amber-950/30 dark:to-red-950/30">
        <img
          src={p.image}
          alt={`${p.name} ${p.size} pack promo`}
          loading="lazy"
          width={400}
          height={400}
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
            !p.available ? "grayscale opacity-60" : ""
          }`}
        />
        <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
          Pack de {p.packQty} (packs de 6 bouteilles)
        </span>
        {!p.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-red-600 shadow-soft">
              Indisponible
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div>
          <h3 className="text-sm font-bold leading-tight sm:text-base">
            {p.name} {p.size}
          </h3>
          <p className="text-xs text-muted-foreground">
            {p.packQty} packs de 6 bouteilles
          </p>
        </div>
        <div className="mt-auto space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-red-600 sm:text-2xl">
              {p.priceTnd.toFixed(3)}
              <span className="ml-1 text-xs font-medium text-muted-foreground">
                TND
              </span>
            </span>
            <span className="text-xs font-medium text-muted-foreground line-through">
              {(p.oldPriceTnd * p.packQty).toFixed(3)}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-emerald-600">
            Vous économisez {savings} TND
          </p>
          <button
            onClick={handleAdd}
            disabled={!p.available}
            className={`w-full rounded-xl px-3 py-2.5 text-sm font-bold text-white shadow-soft transition ${
              p.available
                ? "bg-gradient-to-r from-amber-500 to-red-500 hover:opacity-95"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            {p.available ? "Ajouter au panier" : "Indisponible"}
          </button>
        </div>
      </div>
    </article>
  );
}
