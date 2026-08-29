import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export type Promotion = {
  id: string;
  name: string;
  size: string;
  pack_qty: number;
  price_tnd: number;
  old_price_tnd: number;
  image_url: string | null;
  available: boolean;
  active: boolean;
  sort_order: number;
};

const SELECT =
  "id, name, size, pack_qty, price_tnd, old_price_tnd, image_url, available, active, sort_order";

export const listPromotions = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
  const { data, error } = await supabase
    .from("promotions")
    .select(SELECT)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[listPromotions]", error);
    throw new Error("Failed to load promotions. Please try again.");
  }
  return (data ?? []).map((p) => ({
    ...p,
    price_tnd: Number(p.price_tnd),
    old_price_tnd: Number(p.old_price_tnd),
  })) as Promotion[];
});

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[promotions assertAdmin]", error);
    throw new Error("Authorization check failed.");
  }
  if (!data) throw new Error("Forbidden: admin only");
}

const promoSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  size: z.string().min(1),
  pack_qty: z.number().int().min(1),
  price_tnd: z.number().nonnegative(),
  old_price_tnd: z.number().nonnegative(),
  image_url: z.string().nullable().optional(),
  available: z.boolean(),
  active: z.boolean(),
  sort_order: z.number().int(),
});

export const upsertPromotion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => promoSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const row = {
      name: data.name,
      size: data.size,
      pack_qty: data.pack_qty,
      price_tnd: data.price_tnd,
      old_price_tnd: data.old_price_tnd,
      image_url: data.image_url || null,
      available: data.available,
      active: data.active,
      sort_order: data.sort_order,
    };
    const q = data.id
      ? context.supabase.from("promotions").update(row).eq("id", data.id)
      : context.supabase.from("promotions").insert(row);
    const { error } = await q;
    if (error) {
      console.error("[upsertPromotion]", error);
      throw new Error("Failed to save promotion. Please try again.");
    }
    return { ok: true };
  });

export const setPromotionAvailable = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), available: z.boolean() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("promotions")
      .update({ available: data.available })
      .eq("id", data.id);
    if (error) {
      console.error("[setPromotionAvailable]", error);
      throw new Error("Failed to update promotion. Please try again.");
    }
    return { ok: true };
  });

export const setPromotionActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), active: z.boolean() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("promotions")
      .update({ active: data.active })
      .eq("id", data.id);
    if (error) {
      console.error("[setPromotionActive]", error);
      throw new Error("Failed to update promotion. Please try again.");
    }
    return { ok: true };
  });

export const deletePromotion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("promotions").delete().eq("id", data.id);
    if (error) {
      console.error("[deletePromotion]", error);
      throw new Error("Failed to delete promotion. Please try again.");
    }
    return { ok: true };
  });
