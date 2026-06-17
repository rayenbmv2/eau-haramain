export const SITE = {
  brand: "شركة الحرمين",
  brandEn: "Al Haramain",
  tagline: "Fast Water Delivery in Your Area",
  whatsappRaw: "21652243555",
  phoneDisplay: "+216 52 243 555",
  hours: "Mon – Sun · 8:00 – 20:00",
  areas: ["Ben Arous", "Mégrine", "Radès", "Ezzahra", "Hammam Lif", "Mourouj"],
};

export function waUrl(text: string) {
  return `https://wa.me/${SITE.whatsappRaw}?text=${encodeURIComponent(text)}`;
}

export function productOrderMessage(name: string, size: string, price: number) {
  return `Hello ${SITE.brand}, I want to order:
- Product: ${name} — ${size}
- Price: ${price.toFixed(3)} TND
- Quantity: 
- Delivery address: 
- Phone number: `;
}

export const genericOrderMessage = `Hello ${SITE.brand}, I want to order:
- Product: 
- Quantity: 
- Delivery address: 
- Phone number: `;

export const CATEGORY_LABELS: Record<string, string> = {
  water: "Bottled Water",
  sparkling: "Sparkling Water",
  soft_drinks: "Soft Drinks",
  packs: "Water Packs",
};

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
