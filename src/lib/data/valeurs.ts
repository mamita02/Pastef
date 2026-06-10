import { COLORS } from "@/lib/constants/colors";

/**
 * ═══════════════════════════════════════════════════════════════
 *  VALEURS FONDAMENTALES PASTEF
 * ═══════════════════════════════════════════════════════════════
 *  Six principes hérités de la culture wolof et de la philosophie
 *  panafricaine, qui guident toute action du mouvement.
 *  Utilisé par : Valeurs.tsx
 * ═══════════════════════════════════════════════════════════════
 */

export type Valeur = {
  icon: string;   // Emoji symbolique
  title: string;  // Nom wolof + traduction
  desc: string;   // Définition opérationnelle
  c: string;      // Couleur d'accent (alterne vert/rouge)
};

export const VALUES: Valeur[] = [
  {
    icon: "🛡️",
    title: "Jom — Souveraineté",
    desc: "L'honneur comme fondement. Infrastructure souveraine, aucune dépendance.",
    c: COLORS.vert,
  },
  {
    icon: "⚖️",
    title: "Ngor — Transparence",
    desc: "Traçabilité totale, matching IA contre le favoritisme, méritocratie.",
    c: COLORS.rouge,
  },
  {
    icon: "✊",
    title: "Burok — Travail",
    desc: "Le travail comme valeur. L'insertion des jeunes au cœur de chaque action.",
    c: COLORS.vert,
  },
  {
    icon: "🤝",
    title: "Mbokk — Fraternité",
    desc: "Solidarité entre régions et diaspora. Unité nationale et dialogue social.",
    c: COLORS.rouge,
  },
  {
    icon: "🌍",
    title: "Teddungal — Panafricanisme",
    desc: "Connecter la diaspora. Coopération Sud-Sud, puissance africaine.",
    c: COLORS.vert,
  },
  {
    icon: "🤖",
    title: "Kersa — Innovation éthique",
    desc: "IA et Big Data au service du peuple. Technologie responsable et souveraine.",
    c: COLORS.rouge,
  },
];
