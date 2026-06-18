import { useEffect, useState } from "react";
import { ShoppingBag, X, Trash2, MessageCircle, Copy, Check, Minus, Plus } from "lucide-react";
import {
  useCart,
  cartTotal,
  cartCount,
  buildOrderMessage,
} from "@/lib/cart";
import { waUrl } from "@/lib/site";

export function CartFab() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const items = useCart((s) => s.items);
  useEffect(() => setMounted(true), []);

  const count = cartCount(items);
  const total = cartTotal(items);

  return (
    <>
      {mounted && count > 0 ? (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le panier"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-primary px-5 py-3.5 text-primary-foreground shadow-soft transition hover:scale-[1.03] active:scale-95 sm:bottom-7 sm:right-7"
        >
          <span className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-primary">
              {count}
            </span>
          </span>
          <span className="text-sm font-bold tabular-nums">{total.toFixed(3)} TND</span>
        </button>
      ) : (
        mounted && (
          <a
            href={waUrl("Bonjour, j'ai une question.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact WhatsApp"
            className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--whatsapp)] text-[var(--whatsapp-foreground)] shadow-soft transition hover:scale-110 sm:bottom-7 sm:right-7"
          >
            <MessageCircle className="h-6 w-6" />
          </a>
        )
      )}
      {open && <CartPanel onClose={() => setOpen(false)} />}
    </>
  );
}

function CartPanel({ onClose }: { onClose: () => void }) {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const customer = useCart((s) => s.customer);
  const setCustomer = useCart((s) => s.setCustomer);

  const [copied, setCopied] = useState(false);
  const [touched, setTouched] = useState(false);

  const total = cartTotal(items);
  const valid =
    customer.name.trim() && customer.phone.trim() && customer.address.trim() && items.length > 0;

  const message = buildOrderMessage(customer, items);

  async function copy() {
    setTouched(true);
    if (!valid) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  function order(e: React.MouseEvent) {
    setTouched(true);
    if (!valid) {
      e.preventDefault();
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-foreground/50 backdrop-blur-sm" onClick={onClose}>
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col bg-background shadow-soft sm:max-w-md"
      >
        <header className="flex items-center justify-between border-b border-border/60 px-4 py-4">
          <div>
            <h2 className="text-lg font-bold">Votre panier</h2>
            <p className="text-xs text-muted-foreground">
              {items.length === 0 ? "Panier vide" : `${items.length} article(s)`}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-2 hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {items.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Ajoutez des produits avec le bouton +.
            </p>
          ) : (
            <ul className="space-y-2">
              {items.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold leading-tight">{i.name}</p>
                    <p className="text-xs text-muted-foreground">{i.size}</p>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                      {i.price.toFixed(3)} × {i.qty} ={" "}
                      <span className="font-bold text-primary">
                        {(i.price * i.qty).toFixed(3)} TND
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setQty(i.id, i.qty - 1)}
                      aria-label="Diminuer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-input hover:bg-secondary"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold tabular-nums">{i.qty}</span>
                    <button
                      onClick={() => setQty(i.id, i.qty + 1)}
                      aria-label="Augmenter"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-input hover:bg-secondary"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => remove(i.id)}
                    aria-label="Supprimer"
                    className="rounded-lg p-1.5 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-bold">Vos informations</h3>
              <Field
                label="Nom complet"
                value={customer.name}
                onChange={(v) => setCustomer({ name: v })}
                error={touched && !customer.name.trim()}
                placeholder="Ahmed Ben Ali"
              />
              <Field
                label="Téléphone"
                value={customer.phone}
                onChange={(v) => setCustomer({ phone: v })}
                error={touched && !customer.phone.trim()}
                placeholder="22 123 456"
                type="tel"
              />
              <Field
                label="Adresse de livraison"
                value={customer.address}
                onChange={(v) => setCustomer({ address: v })}
                error={touched && !customer.address.trim()}
                placeholder="Rue, ville (Ben Arous…)"
                textarea
              />
            </div>
          )}
        </div>

        {items.length > 0 && (
          <footer className="space-y-3 border-t border-border/60 bg-card px-4 py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-2xl font-extrabold text-primary tabular-nums">
                {total.toFixed(3)} TND
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Frais de livraison à confirmer sur WhatsApp.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={valid ? waUrl(message) : "#"}
                onClick={order}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold shadow-soft transition ${
                  valid
                    ? "bg-[var(--whatsapp)] text-[var(--whatsapp-foreground)] hover:opacity-95"
                    : "cursor-not-allowed bg-muted text-muted-foreground"
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                Commander
              </a>
              <button
                onClick={copy}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-background px-3 py-3 text-sm font-semibold hover:bg-secondary"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copié !" : "Copier"}
              </button>
            </div>
            {touched && !valid && (
              <p className="text-xs text-destructive">
                Veuillez remplir nom, téléphone et adresse.
              </p>
            )}
            <button
              onClick={() => {
                if (confirm("Vider le panier ?")) clear();
              }}
              className="w-full text-center text-xs text-muted-foreground hover:text-destructive"
            >
              Vider le panier
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  const cls = `mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/30 ${
    error ? "border-destructive" : "border-input focus:border-primary"
  }`;
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </label>
  );
}
