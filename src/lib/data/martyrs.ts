/**
 * ═══════════════════════════════════════════════════════════════
 *  MÉMOIRE DES MARTYRS
 * ═══════════════════════════════════════════════════════════════
 *  Hommage aux patriotes tombés pour la démocratie et la dignité
 *  du peuple sénégalais (2021-2024).
 *
 *  Sensibilité : ces données sont historiques et symboliques.
 *  Toute modification doit être validée par la direction PASTEF.
 *
 *  Utilisé par : Martyrs.tsx
 * ═══════════════════════════════════════════════════════════════
 */

export type Martyr = {
  initiales: string;  // Affichées dans le médaillon
  nom: string;        // Nom complet
  age: number;        // Âge au moment du décès
  lieu: string;       // Ville et quartier
  date: string;       // Mois + année (format libre)
  cause: string;      // Circonstances (texte de mémoire)
};

export const MARTYRS: Martyr[] = [
  {
    initiales: "BD",
    nom: "Bassirou Diop",
    age: 22,
    lieu: "Dakar — Parcelles Assainies",
    date: "Mars 2021",
    cause:
      "Tué par balle réelle lors d'une manifestation pacifique pour la libération du Président Sonko.",
  },
  {
    initiales: "MN",
    nom: "Mamadou Ndiaye",
    age: 19,
    lieu: "Ziguinchor",
    date: "Juin 2023",
    cause:
      "Étudiant abattu lors des affrontements ayant suivi la condamnation du leader de l'opposition.",
  },
  {
    initiales: "AF",
    nom: "Aïssatou Fall",
    age: 25,
    lieu: "Bignona",
    date: "Mars 2021",
    cause:
      "Décédée des suites de ses blessures après la répression d'un rassemblement citoyen.",
  },
  {
    initiales: "OS",
    nom: "Ousmane Sy",
    age: 28,
    lieu: "Dakar — Cité Keur Gorgui",
    date: "Juin 2023",
    cause:
      "Militant touché à la tête lors de la dispersion violente d'une marche pacifique.",
  },
  {
    initiales: "CD",
    nom: "Cheikh Diatta",
    age: 21,
    lieu: "Mbacké",
    date: "Février 2024",
    cause:
      "Jeune patriote mort en détention dans des circonstances toujours non élucidées.",
  },
  {
    initiales: "FT",
    nom: "Fatou Thiam",
    age: 24,
    lieu: "Pikine",
    date: "Juin 2023",
    cause:
      "Tuée par projectile alors qu'elle rentrait chez elle pendant les manifestations.",
  },
];
