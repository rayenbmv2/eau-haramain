export const SITE = {
  brand: "شركة الحرمين",
  brandEn: "Al Haramain",
  tagline: "Livraison rapide d'eau et boissons",
  whatsappRaw: "21652243555",
  phoneDisplay: "+216 52 243 555",
  hours: "Lun – Dim · 8h00 – 20h00",
  areas: ["Ben Arous", "Mégrine", "Radès", "Ezzahra", "Hammam Lif", "Mourouj"],
};

export function waUrl(text: string) {
  return `https://wa.me/${SITE.whatsappRaw}?text=${encodeURIComponent(text)}`;
}

export const genericOrderMessage = `Bonjour, je souhaite passer une commande :
- Produit : 
- Quantité : 
- Adresse : `;

export const CATEGORY_LABELS: Record<string, string> = {
  water: "Eau",
  sparkling: "Eau gazeuse",
  soft_drinks: "Boissons gazeuses",
  packs: "Packs",
};

// Top-level groupings shown on the home page
export type GroupKey = "water" | "sodas" | "juice";
export const GROUPS: { key: GroupKey; label: string }[] = [
  { key: "water", label: "Eau" },
  { key: "sodas", label: "Boissons gazeuses" },
  { key: "juice", label: "Jus & Punch" },
];

export function productGroup(p: { name: string; category: string }): GroupKey {
  const n = p.name.toLowerCase();
  if (/delio|punch/.test(n)) return "juice";
  if (p.category === "water") return "water";
  return "sodas";
}

import productWater from "@/assets/product-water.jpg";
import productSparkling from "@/assets/product-sparkling.jpg";
import productSoft from "@/assets/product-soft.jpg";
import productPack from "@/assets/product-pack.jpg";

export const CATEGORY_IMAGE: Record<string, string> = {
  water: productWater,
  sparkling: productSparkling,
  soft_drinks: productSoft,
  packs: productPack,
};
