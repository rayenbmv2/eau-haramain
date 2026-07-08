export const SITE = {
  brand: "شركة الحرمين",
  brandEn: "Al Haramain",
  tagline: "Livraison rapide d'eau et boissons",
  whatsappRaw: "21699185506",
  phoneDisplay: "+216 99 185 506",
  hours: "Lun – Dim · 8h00 – 20h00",
  mapsUrl: "https://maps.app.goo.gl/9ZU1fBLyiJ1TQCkh8",
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
export type GroupKey = "water" | "drinks";
export const GROUPS: { key: GroupKey; label: string }[] = [
  { key: "water", label: "Eau" },
  { key: "drinks", label: "Boissons" },
];

export function productGroup(p: { name: string; category: string }): GroupKey {
  return p.category === "water" ? "water" : "drinks";
}

export type WaterSize = "2L" | "1.5L" | "1L" | "0.5L" | "other";
export const WATER_SIZE_ORDER: WaterSize[] = ["2L", "1.5L", "1L", "0.5L", "other"];
export const WATER_SIZE_LABEL: Record<WaterSize, string> = {
  "2L": "2 L",
  "1.5L": "1,5 L",
  "1L": "1 L",
  "0.5L": "0,5 L",
  other: "Autres formats",
};

export function waterSizeBucket(size: string): WaterSize {
  // Normalize: "1,5 L" -> "1.5", "0.5L" -> "0.5", "1 L" -> "1"
  const m = size.toLowerCase().replace(",", ".").match(/(\d+(?:\.\d+)?)\s*l/);
  if (!m) return "other";
  const v = parseFloat(m[1]);
  if (v === 2) return "2L";
  if (v === 1.5) return "1.5L";
  if (v === 1) return "1L";
  if (v === 0.5) return "0.5L";
  return "other";
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
