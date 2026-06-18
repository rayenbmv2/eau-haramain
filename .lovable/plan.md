# Refonte: catalogue style Glovo + panier WhatsApp (en français)

## Objectif
Transformer le site en un système de commande très simple, type Glovo :
- Pas de page intermédiaire — le catalogue est la page d'accueil.
- Bouton **+ / –** sur chaque produit (au lieu de « Commander »).
- Un panier flottant garde tout, calcule le total, et génère un message WhatsApp formaté à envoyer en un clic.
- Tout le texte de l'interface passe en français (le nom de marque arabe « شركة الحرمين » reste affiché tel quel).

## Nouvelle structure des pages

- **`/` (Accueil = catalogue complet)**
  - En-tête court : nom de la marque + slogan FR.
  - Barre de recherche + 3 puces de filtre : **Tout · Eau · Boissons gazeuses · Jus & Punch**.
  - 3 sections empilées (titres ancrés) :
    1. **Eau** — toutes les eaux (0,5L / 1L / 1,5L / 2L mélangées).
    2. **Boissons gazeuses** — sodas en bouteilles + canettes.
    3. **Jus & Punch** — Delio + Punch.
  - Chaque produit : image, nom, format, prix en TND, et un contrôle **− [qté] +**. Quand la quantité passe à 0, le contrôle redevient un seul bouton **+**.
- **`/livraison`** — traduction FR du contenu actuel (zones de Ben Arous, horaires, commandes en gros).
- **`/contact`** — traduction FR (WhatsApp, téléphone, horaires).
- **`/auth`** + **`/admin`** — inchangés (interface admin traduite en FR).

## Panier (cœur du changement)

- **Stockage** : `localStorage` (clé `haramain_cart_v1`), donc le panier survit au rechargement.
- **État** : un store léger (Zustand ou un petit contexte React) avec `items: { id, name, size, price, qty }[]`, et les actions `add / remove / setQty / clear`.
- **Indicateur flottant** : bouton rond en bas à droite (remplace le bouton WhatsApp flottant actuel) affichant le nombre d'articles + total. Caché si panier vide ; si vide, on garde un petit bouton WhatsApp de contact générique.
- **Drawer panier** (depuis la droite, plein écran sur mobile) :
  - Liste des articles avec contrôle − [qté] +, prix unitaire, sous-total par ligne, bouton supprimer.
  - **Total général** en bas, en gros, en TND.
  - Formulaire : **Nom**, **Téléphone**, **Adresse de livraison** (sauvegardés aussi dans localStorage pour pré-remplir la prochaine fois).
  - Deux boutons côte à côte :
    - **« Commander sur WhatsApp »** → ouvre `wa.me/21652243555?text=…` avec le message ci-dessous.
    - **« Copier la commande »** → copie le même texte dans le presse-papier (toast « Commande copiée »).
  - Bouton secondaire **« Vider le panier »**.

### Format du message WhatsApp / copié

```
Bonjour شركة الحرمين, je souhaite passer une commande :

Nom : Ahmed Ben Ali
Téléphone : 22 123 456
Adresse : Rue X, Ben Arous

Commande :
- 2× Sabrine 1,5L — 9,000 TND
- 6× Coca 1L — 85,800 TND
- 1× Delio Mangue — 10,500 TND

Total : 105,300 TND
```

Validation simple côté client : si Nom / Téléphone / Adresse manquent, on bloque l'envoi et on met en surbrillance les champs (pas d'erreur agressive). Le téléphone accepte tout format.

## Traduction française

Textes à traduire (liste non-exhaustive) :
- En-tête / nav : Accueil, Livraison, Contact, Connexion.
- Accueil : titres de section, recherche « Rechercher un produit… », puces de catégorie.
- Carte produit : libellé « TND », bouton + (aria-label « Ajouter »).
- Panier : « Votre panier », « Articles », « Total », « Nom », « Téléphone », « Adresse », « Commander sur WhatsApp », « Copier la commande », « Panier vide », « Vider le panier ».
- Livraison / Contact / Admin : traduits.
- Métadonnées `head()` de chaque route : titres + descriptions FR.

## Hors périmètre

- Pas de checkout / paiement / compte client — WhatsApp reste la seule étape finale.
- Pas de frais de livraison sur le site (à discuter sur WhatsApp).
- Pas de changement de schéma DB ni de produits — on garde le catalogue actuel tel quel.
- Pas de changement du thème visuel (bleu eau, polices) — uniquement la structure et la langue.

## Détails techniques (pour l'agent)

- **Store panier** : `src/lib/cart.ts` avec Zustand + middleware `persist` (à ajouter via `bun add zustand`).
- **Composants** : `CartFab` (bouton flottant), `CartDrawer` (utilise `ui/sheet`), `QtyControl` (− [n] +), `ProductCard` réécrit pour utiliser `QtyControl` à la place de `WhatsAppCTA`.
- **Helpers** : `src/lib/cart-message.ts` exportant `buildOrderMessage(customer, items)` retournant la chaîne FR ci-dessus, partagée par les boutons « Commander » et « Copier ».
- **`src/lib/site.ts`** : ajouter un dictionnaire FR centralisé (`L.fr.*`) pour éviter les chaînes dispersées.
- **Accueil (`src/routes/index.tsx`)** : remplacer le hero + featured par le chargement complet via `listProducts`, regroupé en 3 sections (`category === 'water'`, `'soft_drinks'`, et un nouveau regroupement « Jus & Punch » basé sur le nom — Delio / Punch). Conserver `queryOptions` + `useSuspenseQuery`.
- **`src/routes/products.tsx`** : supprimé, ou redirige vers `/`. Le lien « Produits » disparaît de la nav.
- **`WhatsAppButton` flottant** : remplacé par `CartFab`. Bouton WhatsApp de contact gardé uniquement dans `/contact`.
- **Pas de migration DB** ni de modification du schéma `products`.
