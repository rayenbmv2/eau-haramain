import { createFileRoute } from "@tanstack/react-router";
import { Truck, Home, Building2, Clock, Package } from "lucide-react";
import { WhatsAppCTA } from "@/components/whatsapp-button";
import { SITE, genericOrderMessage } from "@/lib/site";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "Delivery — Fast Water Delivery in Ben Arous" },
      { name: "description", content: "Same-day home and business water delivery in Ben Arous. Bulk orders welcome." },
    ],
  }),
  component: DeliveryPage,
});

function DeliveryPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Delivery</h1>
      <p className="mt-2 text-muted-foreground">
        Fast, reliable water delivery — for homes and businesses across Ben Arous.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          { icon: Truck, title: "Fast delivery in Tunisia", desc: "Reliable service across Ben Arous and surrounding areas." },
          { icon: Home, title: "Home delivery", desc: "We bring your order directly to your door." },
          { icon: Building2, title: "Business delivery", desc: "Offices, cafés, restaurants, events — scheduled or on-demand." },
          { icon: Clock, title: "Same-day when possible", desc: "Order early in the day for same-day delivery." },
          { icon: Package, title: "Bulk orders accepted", desc: "Special pricing for large quantities. Just message us." },
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

      <div className="mt-10 rounded-2xl bg-gradient-hero p-6 text-primary-foreground sm:p-8">
        <h2 className="text-xl font-bold sm:text-2xl">Delivery areas</h2>
        <p className="mt-2 text-white/85">{SITE.areas.join(" · ")}</p>
        <div className="mt-5">
          <WhatsAppCTA
            message={genericOrderMessage}
            className="!bg-white !text-[var(--ocean)] hover:!opacity-95"
          >
            Place an order on WhatsApp
          </WhatsAppCTA>
        </div>
      </div>
    </section>
  );
}
