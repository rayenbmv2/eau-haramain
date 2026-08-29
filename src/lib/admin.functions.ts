import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function isAdmin(context: { supabase: any; userId: string }): Promise<boolean> {
  // user_roles RLS lets users read their own roles, so this works under the
  // authenticated client without needing a SECURITY DEFINER RPC.
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[isAdmin] role lookup failed", error);
    throw new Error("Authorization check failed.");
  }
  return !!data;
}

async function assertAdmin(context: { supabase: any; userId: string }) {
  if (!(await isAdmin(context))) throw new Error("Forbidden: admin only");
}

const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  size: z.string().min(1),
  category: z.enum(["water", "sparkling", "soft_drinks", "packs"]),
  price_tnd: z.number().nonnegative(),
  image_url: z.string().nullable().optional(),
  featured: z.boolean(),
  sort_order: z.number().int(),
  in_stock: z.boolean().optional(),
});

export const setProductStock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), in_stock: z.boolean() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("products")
      .update({ in_stock: data.in_stock })
      .eq("id", data.id);
    if (error) {
      console.error("[setProductStock]", error);
      throw new Error("Failed to update stock. Please try again.");
    }
    return { ok: true };
  });

export const isCurrentUserAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    return { isAdmin: await isAdmin(context), userId: context.userId };
  });

export const claimAdminIfNone = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Bootstrap only: succeeds solely while no admin exists at all.
    const { count, error: cErr } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (cErr) {
      console.error("[claimAdminIfNone:count]", cErr);
      throw new Error("Could not claim admin role.");
    }
    if ((count ?? 0) > 0) return { claimed: false };
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) {
      if ((error as any).code === "23505") return { claimed: false };
      console.error("[claimAdminIfNone]", error);
      throw new Error("Could not claim admin role.");
    }
    return { claimed: true };
  });

export const listAdmins = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles, error } = await supabaseAdmin
      .from("user_roles")
      .select("id, user_id")
      .eq("role", "admin");
    if (error) {
      console.error("[listAdmins]", error);
      throw new Error("Could not load administrators.");
    }
    const { data: usersRes } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const emailById = new Map((usersRes?.users ?? []).map((u) => [u.id, u.email ?? ""]));
    return (roles ?? []).map((r) => ({
      id: r.id,
      userId: r.user_id,
      email: emailById.get(r.user_id) ?? "—",
      isSelf: r.user_id === context.userId,
    }));
  });

export const grantAdminByEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ email: z.string().email() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.trim().toLowerCase();
    const { data: usersRes, error: uErr } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000,
    });
    if (uErr) {
      console.error("[grantAdminByEmail:list]", uErr);
      throw new Error("Could not look up this user.");
    }
    const user = (usersRes?.users ?? []).find((u) => (u.email ?? "").toLowerCase() === email);
    if (!user) {
      return { ok: false, reason: "not_found" as const };
    }
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: user.id, role: "admin" });
    if (error && (error as any).code !== "23505") {
      console.error("[grantAdminByEmail:insert]", error);
      throw new Error("Could not grant the administrator role.");
    }
    return { ok: true as const };
  });

export const revokeAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.userId === context.userId) {
      throw new Error("Vous ne pouvez pas retirer votre propre accès.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .eq("role", "admin");
    if (error) {
      console.error("[revokeAdmin]", error);
      throw new Error("Could not revoke the administrator role.");
    }
    return { ok: true };
  });

export const upsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => productSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.id) {
      const { error } = await context.supabase
        .from("products")
        .update({
          name: data.name,
          size: data.size,
          category: data.category,
          price_tnd: data.price_tnd,
          image_url: data.image_url ?? null,
          featured: data.featured,
          sort_order: data.sort_order,
          ...(data.in_stock !== undefined ? { in_stock: data.in_stock } : {}),
        })
        .eq("id", data.id);
      if (error) {
        console.error("[upsertProduct:update]", error);
        throw new Error("Failed to save product. Please try again.");
      }
      return { ok: true, id: data.id };
    } else {
      const { data: row, error } = await context.supabase
        .from("products")
        .insert({
          name: data.name,
          size: data.size,
          category: data.category,
          price_tnd: data.price_tnd,
          image_url: data.image_url ?? null,
          featured: data.featured,
          sort_order: data.sort_order,
        })
        .select("id")
        .single();
      if (error) {
        console.error("[upsertProduct:insert]", error);
        throw new Error("Failed to create product. Please try again.");
      }
      return { ok: true, id: row.id };
    }
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) {
      console.error("[deleteProduct]", error);
      throw new Error("Failed to delete product. Please try again.");
    }
    return { ok: true };
  });
