import { WhatsAppCTA } from "@/components/whatsapp-button";
import { CATEGORY_IMAGE, productOrderMessage } from "@/lib/site";

export type ProductRow = {
  id: string;
  name: string;
  size: string;
  category: string;
  price_tnd: number;
  image_url: string | null;
  featured?: boolean;
};

export function ProductCard({ p }: { p: ProductRow }) {
  const img = p.image_url || CATEGORY_IMAGE[p.category];
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="relative aspect-square overflow-hidden bg-gradient-card">
        <img
          src={img}
          alt={`${p.name} ${p.size}`}
          loading="lazy"
          width={400}
          height={400}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {p.featured && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div>
          <h3 className="text-sm font-semibold leading-tight sm:text-base">{p.name}</h3>
          <p className="text-xs text-muted-foreground">{p.size}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-primary sm:text-xl">
            {Number(p.price_tnd).toFixed(3)}
            <span className="ml-1 text-xs font-medium text-muted-foreground">TND</span>
          </span>
        </div>
        <WhatsAppCTA
          message={productOrderMessage(p.name, p.size, Number(p.price_tnd))}
          className="w-full !py-2.5 !text-sm"
        >
          Order
        </WhatsAppCTA>
      </div>
    </article>
  );
}
