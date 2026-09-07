import { createFileRoute } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${SITE.brand}` },
      {
        name: "description",
        content: SITE.closedMessage,
      },
      { property: "og:title", content: `Contact — ${SITE.brand}` },
      {
        property: "og:description",
        content: SITE.closedMessage,
      },
      { property: "og:url", content: "https://aqua-dash-tunisia.lovable.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://aqua-dash-tunisia.lovable.app/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
        <Construction className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Site en maintenance</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">{SITE.closedMessage}</p>
      <p className="mt-8 text-sm text-muted-foreground">
        Merci de votre compréhension. À très bientôt.
      </p>
    </section>
  );
}
