import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, Home, Building2, Clock, Package } from "lucide-react";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "Livraison — Eau livrée rapidement à Ben Arous" },
      {
        name: "description",
        content:
          "Livraison à domicile et au bureau le jour même à Ben Arous. Commandes en gros acceptées.",
      },
    ],
  }),
  component: DeliveryPage,
});

function DeliveryPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Livraison</h1>
      <p className="mt-2 text-muted-foreground">
        Livraison rapide et fiable — pour les particuliers et les professionnels à Ben Arous.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          { icon: Truck, title: "Livraison rapide", desc: "Service fiable à Ben Arous et environs." },
          { icon: Home, title: "À domicile", desc: "Nous livrons directement à votre porte." },
          { icon: Building2, title: "Pour les pros", desc: "Bureaux, cafés, restaurants, événements — à la demande ou planifié." },
          { icon: Clock, title: "Jour même si possible", desc: "Commandez tôt pour une livraison le jour même." },
          { icon: Package, title: "Commandes en gros", desc: "Prix spéciaux pour les grandes quantités. Contactez-nous." },
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
        <h2 className="text-xl font-bold sm:text-2xl">Zones de livraison</h2>
        <p className="mt-2 text-white/85">{SITE.areas.join(" · ")}</p>
        <div className="mt-5">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[var(--ocean)] hover:opacity-95"
          >
            Voir le catalogue
          </Link>
        </div>
      </div>
    </section>
  );
}
