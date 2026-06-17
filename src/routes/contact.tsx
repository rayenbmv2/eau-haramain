import { createFileRoute } from "@tanstack/react-router";
import { Phone, Clock, MessageCircle } from "lucide-react";
import { WhatsAppCTA } from "@/components/whatsapp-button";
import { SITE, genericOrderMessage } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Order Water on WhatsApp" },
      { name: "description", content: "Reach us on WhatsApp or phone to place your water delivery order." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Contact us</h1>
      <p className="mt-2 text-muted-foreground">
        WhatsApp is the fastest way to place your order.
      </p>

      <div className="mt-8 space-y-4">
        <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--whatsapp)]/15 text-[var(--whatsapp)]">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">WhatsApp (preferred)</p>
            <p className="mt-0.5 text-base font-medium">{SITE.phoneDisplay}</p>
            <div className="mt-3">
              <WhatsAppCTA message={genericOrderMessage}>Chat on WhatsApp</WhatsAppCTA>
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
            <p className="text-sm font-semibold">Phone</p>
            <p className="mt-0.5 text-base font-medium">{SITE.phoneDisplay}</p>
          </div>
        </a>

        <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Working hours</p>
            <p className="mt-0.5 text-base font-medium">{SITE.hours}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
