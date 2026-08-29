## Promotions gérables depuis l'admin + accès administrateur

### 1. Bug actuel

Les 4 promos (Vivian, Melina, Pristine, My Tunisia 2 L) sont marquées comme non disponibles dans le code, mais la carte promo ignore complètement ce champ : elles s'affichent encore comme achetables. C'est le "promo terminée" qui ne fonctionne pas.

### 2. Promotions pilotées par la base

- Nouvelle table `promotions` (nom, taille, quantité du pack, prix promo, ancien prix, image, disponible, actif, ordre) avec lecture publique et écriture réservée à l'admin, plus les 4 promos actuelles insérées telles quelles.
- La page d'accueil lit les promos depuis la base au lieu du fichier statique. Si aucune promo active : la section Promotions disparaît entièrement (avec son compte à rebours).
- Une promo marquée indisponible reste visible mais grisée, avec un badge rouge « Promotion terminée » et le bouton désactivé — exactement comme « Rupture de stock » sur les produits.

### 3. Page admin

Nouvel onglet « Promotions » à côté de « Produits » :
- Liste des promos avec bascule verte/rouge « Disponible / Terminée » (un clic, comme le stock produit).
- Créer / modifier / supprimer une promo (nom, taille, qté du pack, prix promo, ancien prix, image, ordre).

### 4. Accès administrateur

Le compte admin existant est **rayenbm69@gmail.com** (un seul administrateur configuré). Trois ajouts :

1. **Mot de passe oublié** sur la page de connexion : saisie de l'email → email de réinitialisation → nouvelle page `/reset-password` pour définir le nouveau mot de passe.
2. **Ajouter un administrateur** depuis la page admin : un admin connecté saisit l'email d'un compte existant et lui accorde le rôle admin (liste des admins avec possibilité de retirer le rôle, sans pouvoir se retirer soi-même).
3. Petit lien discret « Admin » dans le pied de page pour accéder à `/auth` sans taper l'URL.

### Détails techniques

- Migration : `create table public.promotions` + GRANT (`select` anon/authenticated, tout pour service_role) + RLS (lecture publique, écriture via `private.has_role(auth.uid(),'admin')`) + INSERT des 4 promos existantes.
- `src/lib/promotions.functions.ts` : `listPromotions` (client publiable serveur, public) ; `upsertPromotion`, `deletePromotion`, `setPromotionAvailable` (protégés, contrôle admin comme dans `admin.functions.ts`).
- `src/lib/admin.functions.ts` : `listAdmins`, `grantAdminByEmail` (recherche l'utilisateur via l'API Auth admin, insère le rôle), `revokeAdmin`. L'index unique `one_admin_only` sur `user_roles` doit être remplacé par un index permettant plusieurs admins tout en gardant la revendication initiale atomique.
- Auth : `supabase.auth.resetPasswordForEmail(email, { redirectTo: origin + '/reset-password' })` ; nouvelle route publique `src/routes/reset-password.tsx` avec `updateUser({ password })`.
- `src/lib/promotions.ts` statique supprimé ; `PromoCard` respecte `available` (grisé + badge + bouton désactivé).
