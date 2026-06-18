import { Link } from "@tanstack/react-router";
import { Droplet, Menu, X } from "lucide-react";
import { useState } from "react";
import { SITE } from "@/lib/site";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/delivery", label: "Livraison" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft">
            <Droplet className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-arabic text-base font-bold text-foreground">{SITE.brand}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Livraison d'eau
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "bg-secondary text-foreground" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-foreground md:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="rounded-lg px-3 py-3 text-base font-medium text-muted-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-arabic text-lg font-bold">{SITE.brand}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Livraison rapide d'eau et de boissons à Ben Arous et environs.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Contact</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>WhatsApp : {SITE.phoneDisplay}</li>
            <li>Téléphone : {SITE.phoneDisplay}</li>
            <li>{SITE.hours}</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Zones de livraison</p>
          <p className="mt-2 text-sm text-muted-foreground">{SITE.areas.join(" · ")}</p>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE.brand}. Tous droits réservés.
      </div>
    </footer>
  );
}
