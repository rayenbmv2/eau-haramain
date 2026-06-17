import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Truck, Tag, ShieldCheck, Package, MapPin, ArrowRight } from "lucide-react";
import { listProducts } from "@/lib/products.functions";
import { ProductCard } from "@/components/product-card";
import { WhatsAppCTA } from "@/components/whatsapp-button";
import { SITE, genericOrderMessage } from "@/lib/site";
import heroImg from "@/assets/hero-water.jpg";

const productsQO = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.brand} — Fast Water Delivery in Ben Arous` },
      { name: "description", content: "Order bottled water, sparkling water and soft drinks on WhatsApp. Same-day home & business delivery." },
      { property: "og:title", content: `${SITE.brand} — Fast Water Delivery` },
      { property: "og:description", content: "Order bottled water on WhatsApp. Same-day delivery in Ben Arous." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQO),
  component: Index,
});

function Index() {
  const { data: products } = useSuspenseQuery(productsQO);
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt=""
            width={1600}
            height={900}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--ocean)]/85 via-[var(--ocean)]/70 to-primary/30" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28 lg:py-36">
          <div className="max-w-2xl text-primary-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--whatsapp)]" />
              Delivering today in Ben Arous
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Fast Water Delivery in Your Area
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/90 sm:text-lg">
              Order bottled water and beverages with home or business delivery. Simple, fast, and trusted by your neighbors.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <WhatsAppCTA message={genericOrderMessage} className="!px-6 !py-3.5 !text-base">
                Order on WhatsApp
              </WhatsAppCTA>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/95 px-6 py-3.5 text-base font-semibold text-[var(--ocean)] transition hover:bg-white"
              >
                View Products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, title: "Fast delivery", desc: "Same-day delivery whenever possible." },
            { icon: Tag, title: "Best prices", desc: "Transparent, fair prices in TND." },
            { icon: ShieldCheck, title: "Trusted supplier", desc: "Years of service in Ben Arous." },
            { icon: Package, title: "Bulk orders", desc: "Special pricing for offices & events." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Featured products</h2>
            <p className="mt-1 text-sm text-muted-foreground">Popular picks ready for delivery today.</p>
          </div>
          <Link to="/products" className="hidden text-sm font-semibold text-primary hover:underline sm:inline">
            All products →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* Delivery areas */}
      <section className="mx-auto mt-14 max-w-6xl px-4">
        <div className="overflow-hidden rounded-3xl bg-gradient-hero p-8 text-primary-foreground sm:p-12">
          <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium opacity-90">
                <MapPin className="h-4 w-4" /> Delivery areas
              </div>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">We deliver across Ben Arous</h2>
              <p className="mt-2 text-white/85">
                {SITE.areas.join(" · ")}
              </p>
            </div>
            <WhatsAppCTA
              message={genericOrderMessage}
              className="!bg-white !text-[var(--ocean)] hover:!opacity-95"
            >
              Order Now
            </WhatsAppCTA>
          </div>
        </div>
      </section>
    </>
  );
}
