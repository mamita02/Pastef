# 📄 src/pages/

Dossier qui contient **toutes les pages routables** du site.

Ce dossier est destiné à grossir au fur et à mesure que le projet
ajoute de nouvelles pages (Martyrs, Classement, Piliers détaillés,
Profil patriote, Dashboard, etc.).

---

## 🗂️ Organisation

```
src/pages/
├── index.tsx          → /             (page d'accueil — assemble les sections)
├── martyrs.tsx        → /martyrs      (à créer)
├── classement.tsx     → /classement   (à créer)
├── piliers/
│   ├── 1.tsx          → /piliers/1
│   └── ...
└── ...
```

> **Règle d'or :** une page = un fichier (ou un dossier si la page
> a des sous-routes). Pas de logique complexe dedans : on **assemble**
> des composants venus de `@/components/sections/` ou `@/components/shared/`.

---

## ➕ Ajouter une nouvelle page

### 1. Créer le fichier

```tsx
// src/pages/martyrs.tsx
import { createFileRoute } from "@tanstack/react-router";
import { COLORS } from "@/lib/constants/colors";
import { Nav, Footer, WhatsApp } from "@/components/sections";
// Importer / créer les sections propres à la page Martyrs
// import { MartyrsHero, MartyrsGallery } from "@/components/sections";

export const Route = createFileRoute("/martyrs")({
  head: () => ({
    meta: [
      { title: "Nos Martyrs — PASTEF" },
      { name: "description", content: "Mémoire des patriotes tombés pour le Sénégal." },
    ],
  }),
  component: MartyrsPage,
});

function MartyrsPage() {
  return (
    <div style={{ background: COLORS.blanc, color: COLORS.noir }}>
      <Nav scrolled={false} />
      {/* <MartyrsHero /> */}
      {/* <MartyrsGallery /> */}
      <Footer />
      <WhatsApp />
    </div>
  );
}
```

### 2. Régénérer le routeTree

TanStack Router scanne ce dossier automatiquement. Au prochain
`dev` ou `build`, le fichier `src/routeTree.gen.ts` sera mis à jour.

### 3. Créer / ajouter les sections nécessaires

- Section spécifique à la page → `src/components/sections/MartyrsHero.tsx`
- Composant réutilisable → `src/components/shared/MartyrCard.tsx`
- Données → `src/lib/data/martyrs.ts` (déjà présent)

---

## 🧩 Convention de nommage

| Type             | Format             | Exemple                  |
|------------------|--------------------|--------------------------|
| Page (URL)       | kebab-case         | `mot-du-president.tsx`   |
| Composant React  | PascalCase         | `MartyrsGallery.tsx`     |
| Hook             | camelCase + `use`  | `useMartyrs.ts`          |
| Constantes       | UPPER_SNAKE_CASE   | `MARTYRS`, `COLORS`      |

---

## 🎯 Pages prévues (roadmap)

- [x] `/`              — Landing (index.tsx)
- [ ] `/martyrs`       — Mémoire complète des martyrs
- [ ] `/classement`    — Vue complète du classement des patriotes
- [ ] `/piliers/[id]`  — Détail d'un des 4 piliers
- [ ] `/president`     — Vision détaillée d'Ousmane Sonko
- [ ] `/diaspora`      — Portail diaspora
- [ ] `/marches`       — Hub Marchés publics
- [ ] `/academie`      — Académie & formations
- [ ] `/dashboard`     — Tableau de bord (espace membre)
- [ ] `/login`         — Connexion
- [ ] `/inscription`   — Inscription / adhésion
