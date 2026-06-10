/**
 * ═══════════════════════════════════════════════════════════════
 *  PALETTE OFFICIELLE — PASTEF
 * ═══════════════════════════════════════════════════════════════
 *
 *  Source unique de vérité pour toutes les couleurs de marque
 *  (vert / rouge / noir / blanc / crème / lignes).
 *
 *  Utilisation :
 *  ```ts
 *  import { COLORS } from "@/lib/constants/colors";
 *  // ou via le barrel :
 *  import { COLORS } from "@/lib/constants";
 *  ```
 *
 *  Règle d'or : NE JAMAIS hardcoder une couleur de marque dans un
 *  composant. Toujours passer par `COLORS.xxx` pour permettre une
 *  refonte centralisée (mode sombre, déclinaisons régionales, etc.).
 * ═══════════════════════════════════════════════════════════════
 */
export const COLORS = {
  // Couleurs primaires — drapeau du Sénégal
  vert: "#1B7F3E",        // Vert profond — souveraineté, identité
  vertClair: "#22C55E",   // Vert clair — accents, dégradés
  rouge: "#C61C3E",       // Rouge profond — courage, mémoire
  rougeClair: "#EF2D56",  // Rouge clair — accents secondaires

  // Neutres
  noir: "#0A0A0A",        // Texte principal, contrastes forts
  blanc: "#FFFFFF",       // Fonds, cartes
  creme: "#FAFAF7",       // Fond doux pour sections alternées
  ligne: "#E8E8E4",       // Bordures et séparateurs
} as const;

/**
 * Type dérivé — permet à TypeScript de connaître toutes les clés
 * disponibles dans la palette (autocomplétion + sécurité).
 */
export type ColorKey = keyof typeof COLORS;
