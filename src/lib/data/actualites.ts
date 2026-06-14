// src/lib/data/actualites.ts
import { COLORS } from "@/lib/constants/colors";

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

export type EventType =
  | "reunion"
  | "webinaire"
  | "meeting"
  | "formation"
  | "commemoration";

export interface Evenement {
  id: string;
  date: string;
  heure: string;
  titre: string;
  lieu: string;
  type: EventType;
  inscrits: number;
  cellule?: string;
  enligne: boolean;
}

export interface Actualite {
  id: string;
  titre: string;
  extrait: string;
  source: string;
  date: string;
  important: boolean;
  categorie:
    | "communique"
    | "decision"
    | "nomination"
    | "terrain"
    | "international";
  photo?: string;
}

/* ═══════════════════════════════════════════════════════════════
   CONFIGS VISUELLES
   ═══════════════════════════════════════════════════════════════ */

export const EVENT_CONFIG: Record<
  EventType,
  { icon: string; color: string; label: string }
> = {
  reunion:       { icon: "🏛️", color: COLORS.vert, label: "Réunion" },
  webinaire:     { icon: "💻", color: "#2563EB",   label: "Webinaire" },
  meeting:       { icon: "📢", color: COLORS.rouge, label: "Meeting" },
  formation:     { icon: "🎓", color: "#7C3AED",   label: "Formation" },
  commemoration: { icon: "🕯️", color: "#6B7280",   label: "Commémoration" },
};

export const ACTU_COLORS: Record<string, { color: string; label: string }> = {
  communique:    { color: COLORS.vert, label: "Communiqué" },
  decision:      { color: "#2563EB",   label: "Décision" },
  nomination:    { color: "#7C3AED",   label: "Nomination" },
  terrain:       { color: "#D97706",   label: "Terrain" },
  international: { color: "#0891B2",   label: "International" },
};

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════ */

export const MOCK_EVENTS: Evenement[] = [
  { id: "ev1", date: "12 JUIN", heure: "18h00", titre: "Réunion de cellule — Dakar Plateau", lieu: "Maison du Parti, Dakar", type: "reunion", inscrits: 45, cellule: "Cellule Plateau", enligne: false },
  { id: "ev2", date: "14 JUIN", heure: "20h00", titre: "Webinaire Diaspora : Bilan 100 jours Congrès", lieu: "Zoom (lien envoyé par email)", type: "webinaire", inscrits: 312, enligne: true },
  { id: "ev3", date: "18 JUIN", heure: "10h00", titre: "Formation : Animation de cellule (module 3)", lieu: "Centre de formation, Thiès", type: "formation", inscrits: 28, enligne: false },
  { id: "ev4", date: "21 JUIN", heure: "15h00", titre: "Meeting populaire — Place de l'Indépendance", lieu: "Dakar, Place de l'Indépendance", type: "meeting", inscrits: 2400, enligne: false },
  { id: "ev5", date: "25 JUIN", heure: "09h00", titre: "Hommage aux Martyrs de la Lutte Démocratique", lieu: "Place de la Nation, Dakar", type: "commemoration", inscrits: 890, enligne: false },
  { id: "ev6", date: "28 JUIN", heure: "19h00", titre: "Réunion de cellule — Diaspora Paris", lieu: "Foyer sénégalais, 18e arrondissement", type: "reunion", inscrits: 67, cellule: "Cellule Paris Nord", enligne: false },
  { id: "ev7", date: "02 JUIL", heure: "14h00", titre: "Atelier : Rédiger un projet Co-Dev (Pilier 3)", lieu: "En ligne + présentiel Kaolack", type: "formation", inscrits: 156, enligne: true },
];

export const MOCK_ACTUS: Actualite[] = [
  { id: "a1", titre: "Résolution générale du Premier Congrès adoptée à l'unanimité", extrait: "Le Premier Congrès ordinaire de PASTEF-LES PATRIOTES, tenu à Diamniadio le 6 juin 2026, a adopté à l'unanimité la Résolution générale fixant les sept directives stratégiques du parti.", source: "Direction Nationale", date: "6 juin 2026", important: true, categorie: "decision", photo: "/images/actus/congres.jpeg" },
  { id: "a2", titre: "La JPS mobilise la jeunesse pour la plateforme numérique", extrait: "La Jeunesse Patriotique du Sénégal (JPS) lance une campagne nationale d'inscription sur la plateforme numérique. Les jeunes cadres s'activent dans toutes les régions.", source: "JPS Nationale", date: "8 juin 2026", important: true, categorie: "communique", photo: "/images/actus/jeune.jpeg" },
  { id: "a3", titre: "Maïmouna Dièye à la rencontre des enfants de la pouponnière", extrait: "L'ancienne ministre de la Famille et de l'Action sociale Maïmouna Dièye s'est rendue à la pouponnière nationale pour soutenir les enfants et évaluer les conditions d'accueil.", source: "Coordination Sociale", date: "5 juin 2026", important: false, categorie: "terrain", photo: "/images/actus/enfants.jpeg" },
  { id: "a4", titre: "El Malick Ndiaye reçu par le marabout de Darou", extrait: "Le Secrétaire Général du PASTEF, El Malick Ndiaye, a été reçu par Borom Darou lors d'une visite de courtoisie marquée par des échanges sur la paix et le développement communautaire.", source: "Bureau National", date: "3 juin 2026", important: false, categorie: "nomination", photo: "/images/actus/elmalik.jpeg" },
  { id: "a5", titre: "Khady Diène Gaye au tournoi sportif national", extrait: "L'ancienne ministre de la Jeunesse et des Sports, Khady Diène Gaye, a présidé la cérémonie de remise des trophées lors du tournoi hippique de Thiès.", source: "Coordination Sportive", date: "1 juin 2026", important: false, categorie: "international", photo: "/images/actus/sport.jpeg" },
];