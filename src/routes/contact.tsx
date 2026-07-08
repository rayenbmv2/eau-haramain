import { createFileRoute } from "@tanstack/react-router";
import { Phone, Clock, MessageCircle, MapPin } from "lucide-react";
import { SITE, waUrl } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Commander sur WhatsApp" },
      {
        name: "description",
        content:
          "Contactez شركة الحرمين sur WhatsApp ou par téléphone pour passer votre commande d'eau à Ben Arous.",
      },
      { property: "og:title", content: `Contact — ${SITE.brand}` },
      {
        property: "og:description",
        content:
          "Joignez-nous sur WhatsApp au +216 52 243 555 ou par téléphone, du lundi au dimanche de 8h à 20h.",
      },
      { property: "og:url", content: "https://aqua-dash-tunisia.lovable.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://aqua-dash-tunisia.lovable.app/contact" }],
  }),
  component: ContactPage,
});


function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Nous contacter</h1>
      <p className="mt-2 text-muted-foreground">
        WhatsApp est le moyen le plus rapide pour passer commande.
      </p>

      <div className="mt-8 space-y-4">
        <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--whatsapp)]/15 text-[var(--whatsapp)]">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">WhatsApp (recommandé)</p>
            <p className="mt-0.5 text-base font-medium">{SITE.phoneDisplay}</p>
            <div className="mt-3">
              <a
                href={waUrl("Bonjour, j'ai une question.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--whatsapp)] px-5 py-3 text-sm font-semibold text-[var(--whatsapp-foreground)] shadow-soft hover:opacity-95"
              >
                <MessageCircle className="h-5 w-5" /> Discuter sur WhatsApp
              </a>
            </div>
          </div>
        </div>

        <a
          href={`tel:+${SITE.whatsappRaw}`}
          className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-card transition hover:bg-accent/40"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Téléphone</p>
            <p className="mt-0.5 text-base font-medium">{SITE.phoneDisplay}</p>
          </div>
        </a>

        <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Horaires</p>
            <p className="mt-0.5 text-base font-medium">{SITE.hours}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
