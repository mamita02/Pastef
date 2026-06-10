import { COLORS } from "@/lib/constants/colors";

/**
 * ═══════════════════════════════════════════════════════════════
 *  LES 4 PILIERS PASTEF
 * ═══════════════════════════════════════════════════════════════
 *  Architecture stratégique issue du Premier Congrès de Diamniadio.
 *  Utilisé par : Piliers.tsx, Nav.tsx (sous-menu).
 * ═══════════════════════════════════════════════════════════════
 */

export type Pilier = {
  num: string;       // Numéro affiché (01, 02, ...)
  icon: string;      // Emoji d'illustration
  color: string;     // Couleur principale du pilier
  title: string;     // Titre court
  desc: string;      // Description (1-2 phrases)
  tag: string;       // Label court ("Pilier 1", ...)
};

export const PILIERS: Pilier[] = [
  {
    num: "01",
    icon: "💼",
    color: COLORS.vert,
    title: "Talents, Emploi & Marchés",
    desc: "Profils pro, Hub Marchés publics, Matching IA, Mentorat, Patriote Pro.",
    tag: "Pilier 1",
  },
  {
    num: "02",
    icon: "🎓",
    color: COLORS.rouge,
    title: "Académie & Innovation",
    desc: "Filières idéologique, organisationnelle, professionnelle. Sandbox, Badges, Certificats.",
    tag: "Pilier 2",
  },
  {
    num: "03",
    icon: "🌍",
    color: COLORS.vert,
    title: "Co-Développement & Diaspora",
    desc: "Crowdfunding territorial, Portail Diaspora, Big Data transparent, Orange Money / Wave.",
    tag: "Pilier 3",
  },
  {
    num: "04",
    icon: "🏛️",
    color: COLORS.rouge,
    title: "Vie du Parti & Intelligence Collective",
    desc: "Actualités, Agenda, Mémoire des Martyrs, Bibliothèque, Consultations citoyennes.",
    tag: "Pilier 4",
  },
];
