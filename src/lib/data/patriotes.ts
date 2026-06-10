/**
 * ═══════════════════════════════════════════════════════════════
 *  CLASSEMENT — TOP PATRIOTES
 * ═══════════════════════════════════════════════════════════════
 *  Données de démonstration du carrousel "Top Patriotes".
 *  À terme, ces données seront fetchées depuis l'API back-end
 *  (TanStack Query), et ce fichier ne contiendra que le type.
 *
 *  Utilisé par : Classement.tsx, PatrioteCard.tsx
 * ═══════════════════════════════════════════════════════════════
 */

export type Patriote = {
  name: string;          // Nom complet
  fonction: string;      // Rôle dans le mouvement
  region: string;        // Région ou ville (Sénégal ou diaspora)
  flag: string;          // 🇸🇳 pour le Sénégal, 🌍 pour la diaspora
  contribution: string;  // Montant formaté en FCFA
  engagement: number;    // Score d'engagement (0-100)
  photo: string;         // Initiales (placeholder en attendant les photos)
};

export const PATRIOTES: Patriote[] = [
  { name: "Cheikh A. Mbacké", fonction: "Coordinateur Régional", region: "Dakar",            flag: "🇸🇳", contribution: "2 450 000", engagement: 98, photo: "CM" },
  { name: "Mamadou Kane",     fonction: "Responsable Diaspora",   region: "Paris, France",   flag: "🌍", contribution: "4 200 000", engagement: 99, photo: "MK" },
  { name: "Mariama Diallo",   fonction: "Présidente CoPaX",       region: "Thiès",           flag: "🇸🇳", contribution: "1 870 000", engagement: 95, photo: "MD" },
  { name: "Fatou Sène",       fonction: "Mobilisatrice",          region: "Milan, Italie",   flag: "🌍", contribution: "3 100 000", engagement: 96, photo: "FS" },
  { name: "Ibrahima Sow",     fonction: "Secrétaire Local",       region: "Saint-Louis",     flag: "🇸🇳", contribution: "1 620 000", engagement: 93, photo: "IS" },
  { name: "Abdou Diop",       fonction: "Trésorier Section",      region: "New York, USA",   flag: "🌍", contribution: "2 750 000", engagement: 94, photo: "AD" },
  { name: "Aïda Sarr",        fonction: "Responsable Jeunes",     region: "Ziguinchor",      flag: "🇸🇳", contribution: "1 180 000", engagement: 89, photo: "AS" },
  { name: "Khady Ba",         fonction: "Coordinatrice",          region: "Montréal, Canada",flag: "🌍", contribution: "2 100 000", engagement: 92, photo: "KB" },
];
