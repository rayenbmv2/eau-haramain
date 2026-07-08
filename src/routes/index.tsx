import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Droplet, Flame } from "lucide-react";
import { listProducts } from "@/lib/products.functions";
import { ProductCard } from "@/components/product-card";
import { PromoCard } from "@/components/promo-card";
import { PromoCountdown } from "@/components/promo-countdown";
import { PROMOTIONS } from "@/lib/promotions";
import {
  SITE,
  GROUPS,
  productGroup,
  type GroupKey,
  waterSizeBucket,
  WATER_SIZE_ORDER,
  WATER_SIZE_LABEL,
  type WaterSize,
} from "@/lib/site";

const productsQO = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.brand} — Livraison d'eau à domicile à Ben Arous` },
      {
        name: "description",
        content:
          "Commandez de l'eau et des boissons. Livraison rapide à domicile et au bureau à Ben Arous.",
      },
      { property: "og:title", content: `${SITE.brand} — Livraison d'eau à Ben Arous` },
      {
        property: "og:description",
        content: "Commandez en ligne. Livraison le jour même à Ben Arous.",
      },
      { property: "og:url", content: "https://aqua-dash-tunisia.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://aqua-dash-tunisia.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.brand,
          url: "https://aqua-dash-tunisia.lovable.app/",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: SITE.brand,
          alternateName: SITE.brandEn,
          url: "https://aqua-dash-tunisia.lovable.app/",
          telephone: `+${SITE.whatsappRaw}`,
          areaServed: SITE.areas,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Ben Arous",
            addressCountry: "TN",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday", "Tuesday", "Wednesday", "Thursday",
                "Friday", "Saturday", "Sunday",
              ],
              opens: "08:00",
              closes: "20:00",
            },
          ],
        }),
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQO),
  component: Home,
});


type Filter = "all" | GroupKey;
type DrinkSize = "25cl" | "33cl" | "0.5L" | "1L" | "1.5L" | "other";

const DRINK_SIZE_ORDER: DrinkSize[] = ["25cl", "33cl", "0.5L", "1L", "1.5L", "other"];
const DRINK_SIZE_LABEL: Record<DrinkSize, string> = {
  "25cl": "25 cl",
  "33cl": "33 cl",
  "0.5L": "0,5 L",
  "1L": "1 L",
  "1.5L": "1,5 L",
  other: "Autres formats",
};

function drinkSizeBucket(size: string): DrinkSize {
  const normalized = size.toLowerCase().replace(",", ".");
  const cl = normalized.match(/(\d+(?:\.\d+)?)\s*c\s*l/);
  if (cl) {
    const value = parseFloat(cl[1]);
    if (value === 25) return "25cl";
    if (value === 30 || value === 33) return "33cl";
  }
  const liters = normalized.match(/(\d+(?:\.\d+)?)\s*l/);
  if (liters) {
    const value = parseFloat(liters[1]);
    if (value === 0.25) return "25cl";
    if (value === 0.3 || value === 0.33) return "33cl";
    if (value === 0.5) return "0.5L";
    if (value === 1) return "1L";
    if (value === 1.5) return "1.5L";
  }
  const bareNumber = normalized.match(/^\s*(\d+(?:\.\d+)?)\s*$/);
  if (bareNumber) {
    const value = parseFloat(bareNumber[1]);
    if (value === 0.25) return "25cl";
    if (value === 0.3 || value === 0.33) return "33cl";
    if (value === 0.5) return "0.5L";
    if (value === 1) return "1L";
    if (value === 1.5) return "1.5L";
  }
  return "other";
}

function Home() {
  const { data: products } = useSuspenseQuery(productsQO);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const { waterBuckets, drinkBuckets, totalShown } = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const water: typeof products = [];
    const drinks: typeof products = [];
    for (const p of products) {
      const g = productGroup(p);
      if (filter !== "all" && filter !== g) continue;
      if (needle) {
        const hay = `${p.name} ${p.size}`.toLowerCase();
        if (!hay.includes(needle)) continue;
      }
      (g === "water" ? water : drinks).push(p);
    }
    // Group water by size
    const waterBuckets: Record<WaterSize, typeof products> = {
      "2L": [],
      "1.5L": [],
      "1L": [],
      "0.5L": [],
      other: [],
    };
    for (const p of water) {
      waterBuckets[waterSizeBucket(p.size)].push(p);
    }
    for (const k of WATER_SIZE_ORDER) {
      waterBuckets[k].sort((a, b) => Number(a.price_tnd) - Number(b.price_tnd));
    }
    const drinkBuckets: Record<DrinkSize, typeof products> = {
      "25cl": [],
      "33cl": [],
      "0.5L": [],
      "1L": [],
      "1.5L": [],
      other: [],
    };
    for (const p of drinks) {
      drinkBuckets[drinkSizeBucket(p.size)].push(p);
    }
    for (const k of DRINK_SIZE_ORDER) {
      drinkBuckets[k].sort(
        (a, b) => a.sort_order - b.sort_order || Number(a.price_tnd) - Number(b.price_tnd),
      );
    }
    return {
      waterBuckets,
      drinkBuckets,
      totalShown: water.length + drinks.length,
    };
  }, [products, q, filter]);

  const waterCount = WATER_SIZE_ORDER.reduce(
    (s, k) => s + waterBuckets[k].length,
    0,
  );
  const drinkCount = DRINK_SIZE_ORDER.reduce(
    (s, k) => s + drinkBuckets[k].length,
    0,
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <header className="mb-5">
        <h1 className="text-2xl font-extrabold sm:text-3xl">
          Livraison d'eau à domicile à Ben Arous
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajoutez vos produits au panier, puis envoyez votre commande sur WhatsApp.
        </p>
      </header>

      <div className="sticky top-16 z-30 -mx-4 mb-6 border-y border-border/60 bg-background/90 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:rounded-2xl sm:border sm:p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un produit…"
              aria-label="Rechercher un produit"
              className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Chip active={filter === "all"} onClick={() => setFilter("all")}>
              Tout
            </Chip>
            {GROUPS.map((g) => (
              <Chip
                key={g.key}
                active={filter === g.key}
                onClick={() => setFilter(g.key)}
              >
                {g.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {totalShown === 0 && (
        <p className="py-16 text-center text-muted-foreground">Aucun produit trouvé.</p>
      )}

      <div className="space-y-10">
        <section id="promotions" className="scroll-mt-32">
          <div className="overflow-hidden rounded-3xl border-2 border-amber-400/50 bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 p-5 shadow-card sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-white">
                  <Flame className="h-6 w-6 sm:h-7 sm:w-7" />
                  <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
                    Promotions
                  </h2>
                </div>
                <p
                  dir="rtl"
                  className="mt-1 font-arabic text-base font-bold text-white/95 sm:text-lg"
                >
                  عروض حصرية · لفترة محدودة
                </p>
              </div>
              <PromoCountdown />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {PROMOTIONS.map((p) => (
                <PromoCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </section>


        {waterCount > 0 && (
          <section id="water" className="scroll-mt-32">
            <h2 className="mb-4 flex items-baseline gap-3 text-xl font-bold sm:text-2xl">
              Eau
              <span className="text-xs font-medium text-muted-foreground">
                {waterCount} produits
              </span>
            </h2>
            <div className="space-y-8">
              {WATER_SIZE_ORDER.map((k) =>
                waterBuckets[k].length === 0 ? null : (
                  <div key={k}>
                    <h3 className="mb-4 flex items-center gap-2 border-b border-primary/20 pb-2 text-lg font-bold text-primary sm:text-xl">
                      <Droplet className="h-5 w-5 fill-primary/20" />
                      {WATER_SIZE_LABEL[k]}
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                      {waterBuckets[k].map((p) => (
                        <ProductCard key={p.id} p={p} />
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>
        )}

        {drinkCount > 0 && (
          <section id="drinks" className="scroll-mt-32">
            <h2 className="mb-4 flex items-baseline gap-3 text-xl font-bold sm:text-2xl">
              Boissons
              <span className="text-xs font-medium text-muted-foreground">
                {drinkCount} produits
              </span>
            </h2>
            <div className="space-y-8">
              {DRINK_SIZE_ORDER.map((k) =>
                drinkBuckets[k].length === 0 ? null : (
                  <div key={k}>
                    <h3 className="mb-4 flex items-center gap-2 border-b border-primary/20 pb-2 text-lg font-bold text-primary sm:text-xl">
                      <Droplet className="h-5 w-5 fill-primary/20" />
                      {DRINK_SIZE_LABEL[k]}
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                      {drinkBuckets[k].map((p) => (
                        <ProductCard key={p.id} p={p} />
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-primary text-primary-foreground shadow-soft"
          : "bg-secondary text-secondary-foreground hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}
