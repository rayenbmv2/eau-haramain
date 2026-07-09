import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  size: string;
  price: number;
  qty: number;
};

export type Customer = { name: string; phone: string; address: string };

type CartState = {
  items: CartItem[];
  customer: Customer;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  setCustomer: (c: Partial<Customer>) => void;
};

const noopStorage: Storage = {
  length: 0,
  clear: () => {},
  getItem: () => null,
  key: () => null,
  removeItem: () => {},
  setItem: () => {},
};

const safeStorage = (): Storage =>
  typeof window === "undefined" ? noopStorage : window.localStorage;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      customer: { name: "", phone: "", address: "" },
      add: (item, qty = 1) =>
        set((s) => {
          const inc = Math.max(1, qty);
          const ex = s.items.find((i) => i.id === item.id);
          if (ex) {
            return {
              items: s.items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + inc } : i,
              ),
            };
          }
          return { items: [...s.items, { ...item, qty: inc }] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
      setCustomer: (c) =>
        set((s) => ({ customer: { ...s.customer, ...c } })),
    }),
    {
      name: "haramain_cart_v1",
      storage: createJSONStorage(() => safeStorage()),
    },
  ),
);

export function cartTotal(items: CartItem[]) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((s, i) => s + i.qty, 0);
}

export function buildOrderMessage(customer: Customer, items: CartItem[]) {
  const lines = items
    .map(
      (i) =>
        `- ${i.qty}× ${i.name} ${i.size} — ${(i.price * i.qty).toFixed(3)} TND`,
    )
    .join("\n");
  const total = cartTotal(items).toFixed(3);
  return `Bonjour شركة الحرمين, je souhaite passer une commande :

Nom : ${customer.name}
Téléphone : ${customer.phone}
Adresse : ${customer.address}

Commande :
${lines}

Total : ${total} TND`;
}
