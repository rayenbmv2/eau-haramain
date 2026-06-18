import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, LogOut, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { listProducts } from "@/lib/products.functions";
import {
  isCurrentUserAdmin,
  claimAdminIfNone,
  upsertProduct,
  deleteProduct,
} from "@/lib/admin.functions";
import { CATEGORY_LABELS } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Produits" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type ProductForm = {
  id?: string;
  name: string;
  size: string;
  category: "water" | "sparkling" | "soft_drinks" | "packs";
  price_tnd: number;
  image_url: string;
  featured: boolean;
  sort_order: number;
};

const empty: ProductForm = {
  name: "",
  size: "",
  category: "water",
  price_tnd: 0,
  image_url: "",
  featured: false,
  sort_order: 100,
};

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const checkAdmin = useServerFn(isCurrentUserAdmin);
  const claim = useServerFn(claimAdminIfNone);
  const save = useServerFn(upsertProduct);
  const del = useServerFn(deleteProduct);

  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState<ProductForm | null>(null);

  useEffect(() => {
    (async () => {
      const res = await checkAdmin();
      if (!res.isAdmin) {
        const c = await claim();
        const res2 = await checkAdmin();
        setIsAdmin(res2.isAdmin || c.claimed);
      } else setIsAdmin(true);
      setReady(true);
    })();
  }, [checkAdmin, claim]);

  const productsQ = useQuery({ queryKey: ["products"], queryFn: () => listProducts() });

  const saveMut = useMutation({
    mutationFn: (data: ProductForm) => save({ data: { ...data, image_url: data.image_url || null } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      setEditing(null);
    },
  });

  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-bold">Accès refusé</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Votre compte n'a pas les droits administrateur.
        </p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Admin · Produits</h1>
          <p className="text-sm text-muted-foreground">Ajouter, modifier et supprimer des produits.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing({ ...empty })}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> Nouveau produit
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-input px-4 py-2.5 text-sm font-medium"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border/60 bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Format</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Prix (TND)</th>
              <th className="px-4 py-3">Mis en avant</th>
              <th className="px-4 py-3">Tri</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {productsQ.data?.map((p) => (
              <tr key={p.id} className="border-t border-border/60">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.size}</td>
                <td className="px-4 py-3 text-muted-foreground">{CATEGORY_LABELS[p.category]}</td>
                <td className="px-4 py-3 font-semibold text-primary">{Number(p.price_tnd).toFixed(3)}</td>
                <td className="px-4 py-3">{p.featured ? "Oui" : "—"}</td>
                <td className="px-4 py-3">{p.sort_order}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() =>
                        setEditing({
                          id: p.id,
                          name: p.name,
                          size: p.size,
                          category: p.category as any,
                          price_tnd: Number(p.price_tnd),
                          image_url: p.image_url ?? "",
                          featured: p.featured,
                          sort_order: p.sort_order,
                        })
                      }
                      className="rounded-lg p-2 hover:bg-accent"
                      aria-label="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Supprimer « ${p.name} ${p.size} » ?`)) delMut.mutate(p.id);
                      }}
                      className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-soft">
            <h2 className="text-lg font-bold">{editing.id ? "Modifier le produit" : "Nouveau produit"}</h2>
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                saveMut.mutate(editing);
              }}
            >
              <Field label="Nom">
                <input
                  required
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Format">
                <input
                  required
                  value={editing.size}
                  onChange={(e) => setEditing({ ...editing, size: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Catégorie">
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value as any })}
                  className="input"
                >
                  {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prix (TND)">
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    required
                    value={editing.price_tnd}
                    onChange={(e) => setEditing({ ...editing, price_tnd: Number(e.target.value) })}
                    className="input"
                  />
                </Field>
                <Field label="Ordre de tri">
                  <input
                    type="number"
                    value={editing.sort_order}
                    onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                    className="input"
                  />
                </Field>
              </div>
              <Field label="URL de l'image (optionnel)">
                <input
                  value={editing.image_url}
                  onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                  className="input"
                  placeholder="https://…"
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.featured}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                />
                Mettre en avant
              </label>
              {saveMut.error && (
                <p className="text-sm text-destructive">{(saveMut.error as Error).message}</p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-xl border border-input px-4 py-2 text-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saveMut.isPending}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  {saveMut.isPending ? "Enregistrement…" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`.input{width:100%;border:1px solid var(--input);background:var(--background);border-radius:0.75rem;padding:0.55rem 0.75rem;font-size:0.875rem;outline:none}.input:focus{border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in oklab,var(--primary) 25%,transparent)}`}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
