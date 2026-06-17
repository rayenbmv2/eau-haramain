import { MessageCircle } from "lucide-react";
import { waUrl, genericOrderMessage } from "@/lib/site";

export function FloatingWhatsApp() {
  return (
    <a
      href={waUrl(genericOrderMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--whatsapp)] text-[var(--whatsapp-foreground)] shadow-soft transition hover:scale-110 sm:bottom-7 sm:right-7"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

export function WhatsAppCTA({
  message,
  children,
  className = "",
  variant = "primary",
}: {
  message: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition active:scale-95";
  const styles =
    variant === "primary"
      ? "bg-[var(--whatsapp)] text-[var(--whatsapp-foreground)] hover:opacity-95 shadow-soft"
      : "border border-[var(--whatsapp)] text-[var(--whatsapp)] hover:bg-[var(--whatsapp)]/10";
  return (
    <a
      href={waUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${styles} ${className}`}
    >
      <MessageCircle className="h-5 w-5" />
      {children}
    </a>
  );
}
