import { CATEGORY_IMAGE } from "@/lib/site";
import { QtyControl } from "@/components/qty-control";

export type ProductRow = {
  id: string;
  name: string;
  size: string;
  category: string;
  price_tnd: number;
  image_url: string | null;
  featured?: boolean;
  in_stock?: boolean;
};

export function ProductCard({ p }: { p: ProductRow }) {
  const img = p.image_url || CATEGORY_IMAGE[p.category] || CATEGORY_IMAGE.water;
  const outOfStock = p.in_stock === false;
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card transition ${
        outOfStock ? "opacity-60" : "hover:-translate-y-0.5 hover:shadow-soft"
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-card">
        <img
          src={img}
          alt={`${p.name} ${p.size}`}
          loading="lazy"
          width={400}
          height={400}
          className={`h-full w-full object-cover transition duration-500 ${
            outOfStock ? "grayscale" : "group-hover:scale-105"
          }`}
        />
        <span
          className={`absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-soft ${
            outOfStock
              ? "bg-destructive text-destructive-foreground"
              : "bg-emerald-500 text-white"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${outOfStock ? "bg-white/90" : "bg-white"}`}
          />
          {outOfStock ? "Rupture de stock" : "En stock"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div>
          <h3 className="text-sm font-semibold leading-tight sm:text-base">{p.name}</h3>
          <p className="text-xs text-muted-foreground">{p.size}</p>
        </div>
        <div className="mt-auto">
          <span className="block text-lg font-bold text-primary sm:text-xl">
            {Number(p.price_tnd).toFixed(3)}
            <span className="ml-1 text-xs font-medium text-muted-foreground">TND</span>
          </span>
          <div className="mt-2">
            {outOfStock ? (
              <button
                disabled
                className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-muted px-3 py-2.5 text-sm font-semibold text-muted-foreground"
              >
                Indisponible
              </button>
            ) : (
              <QtyControl
                product={{
                  id: p.id,
                  name: p.name,
                  size: p.size,
                  price: Number(p.price_tnd),
                }}
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
