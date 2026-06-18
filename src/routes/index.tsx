import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { listProducts } from "@/lib/products.functions";
import { ProductCard } from "@/components/product-card";
import { SITE, GROUPS, productGroup, type GroupKey } from "@/lib/site";

const productsQO = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.brand} — Livraison d'eau à Ben Arous` },
      {
        name: "description",
        content:
          "Commandez de l'eau, des boissons gazeuses et des jus. Livraison rapide à domicile et au bureau à Ben Arous.",
      },
      { property: "og:title", content: `${SITE.brand} — Livraison rapide` },
      {
        property: "og:description",
        content: "Commandez en ligne. Livraison le jour même à Ben Arous.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQO),
  component: Home,
});

type Filter = "all" | GroupKey;

function Home() {
  const { data: products } = useSuspenseQuery(productsQO);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const grouped = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const map: Record<GroupKey, typeof products> = {
      water: [],
      sodas: [],
      juice: [],
    };
    for (const p of products) {
      const g = productGroup(p);
      if (filter !== "all" && filter !== g) continue;
      if (needle) {
        const hay = `${p.name} ${p.size}`.toLowerCase();
        if (!hay.includes(needle)) continue;
      }
      map[g].push(p);
    }
    return map;
  }, [products, q, filter]);

  const totalShown = grouped.water.length + grouped.sodas.length + grouped.juice.length;

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <header className="mb-5">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Notre catalogue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajoutez vos produits au panier, puis envoyez votre commande sur WhatsApp.
        </p>
      </header>

      {/* Search + filters sticky */}
      <div className="sticky top-16 z-30 -mx-4 mb-6 border-y border-border/60 bg-background/90 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:rounded-2xl sm:border sm:p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un produit…"
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
        {GROUPS.map((g) =>
          grouped[g.key].length === 0 ? null : (
            <section key={g.key} id={g.key} className="scroll-mt-32">
              <h2 className="mb-4 flex items-baseline gap-3 text-xl font-bold sm:text-2xl">
                {g.label}
                <span className="text-xs font-medium text-muted-foreground">
                  {grouped[g.key].length} produits
                </span>
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {grouped[g.key].map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            </section>
          ),
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
