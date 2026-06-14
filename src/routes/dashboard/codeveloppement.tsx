import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import PresenceMap from "@/components/map/PresenceMap";
import { getUser } from "@/lib/auth";
import { COLORS } from "@/lib/constants/colors";
import { PILIERS } from "@/lib/data/piliers";

export const Route = createFileRoute("/dashboard/codeveloppement")({
  component: CoDevPage,
});

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

type ProjectStatus = "en_cours" | "finance" | "en_attente" | "termine";
type ProjectSector = "agriculture" | "education" | "sante" | "numerique" | "energie" | "infrastructure" | "culture" | "commerce";
type FunderType = "diaspora" | "entreprise" | "institution" | "pastef" | "mairie";

interface Funder {
  nom: string;
  type: FunderType;
  montant: number;
  avatar: string;
}

interface MonthlyReport {
  mois: string;             // "Juin 2026"
  avancement: number;       // % d'avancement à la fin du mois
  resume: string;           // résumé de l'avancement
  depenses: number;         // FCFA dépensés ce mois
  pdfUrl: string;           // chemin du rapport téléchargeable
  publie: boolean;
}

interface ExpenseItem {
  poste: string;
  montant: number;
  fournisseur: string;
  facture: string;          // référence facture
  date: string;
}

interface Project {
  id: string;
  title: string;
  pitch: string;
  description: string;
  sector: ProjectSector;
  region: string;
  commune: string;
  porteur: string;
  porteurAvatar: string;
  porteurType: "patriote" | "cellule" | "mairie" | "cooperative";
  objectif: number;
  collecte: number;
  contributors: number;
  status: ProjectStatus;
  deadline: string;
  livraisonPrevue: string;        // date livraison prévue
  avancement: number;             // 0-100
  createdAt: string;
  needs: string[];
  mvp: string;
  impact: string;
  funders: Funder[];
  photos: string[];
  updates: number;
  proOnly: boolean;
  rapports: MonthlyReport[];      // rapports mensuels
  depenses: ExpenseItem[];        // détail des dépenses
}

interface DiasporaCity {
  ville: string;
  pays: string;
  pays_iso: string;               // code pour drapeau
  lat: number;
  lng: number;
  membres: number;
  contributions: number;
  projetsFinances: number;
  big?: boolean;
  coordinateur: string;
  contact: string;
  projetsParraines: string[];     // IDs de projets soutenus par cette ville
}

/* ═══════════════════════════════════════════════════════════════
   CONSTANTES
   ═══════════════════════════════════════════════════════════════ */

const pilier = PILIERS[2];

const SECTOR_CONFIG: Record<ProjectSector, { icon: string; label: string; color: string }> = {
  agriculture:     { icon: "🌾", label: "Agriculture", color: "#059669" },
  education:       { icon: "📚", label: "Éducation", color: "#2563EB" },
  sante:           { icon: "🏥", label: "Santé", color: "#DC2626" },
  numerique:       { icon: "💻", label: "Numérique", color: "#7C3AED" },
  energie:         { icon: "⚡", label: "Énergie", color: "#D97706" },
  infrastructure:  { icon: "🏗️", label: "Infrastructure", color: "#6B7280" },
  culture:         { icon: "🎭", label: "Culture", color: "#EC4899" },
  commerce:        { icon: "🏪", label: "Commerce", color: "#0891B2" },
};

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  en_attente: { label: "En attente", color: "#D97706", bg: "#D97706" },
  en_cours:   { label: "Financement en cours", color: COLORS.vert, bg: COLORS.vert },
  finance:    { label: "Financé", color: "#2563EB", bg: "#2563EB" },
  termine:    { label: "Projet terminé", color: "#059669", bg: "#059669" },
};

const FUNDER_COLORS: Record<FunderType, string> = {
  diaspora:    COLORS.rouge,
  entreprise:  "#2563EB",
  institution: COLORS.rouge,
  pastef:      COLORS.vert,
  mairie:      "#059669",
};

const FUNDER_LABELS: Record<FunderType, string> = {
  diaspora:    "Diaspora",
  entreprise:  "Entreprise",
  institution: "Institution",
  pastef:      "Fonds PASTEF",
  mairie:      "Mairie",
};

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA — PROJETS (avec rapports mensuels et dépenses)
   ═══════════════════════════════════════════════════════════════ */

const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Forage solaire et château d'eau — Village de Ndioum",
    pitch: "Donner accès à l'eau potable à 2 400 habitants grâce à un forage alimenté par panneaux solaires.",
    description: "Le village de Ndioum dans la commune de Podor n'a pas d'accès direct à l'eau potable. Les femmes marchent 3 km quotidiennement. Ce projet installe un forage de 80m, une pompe solaire, un château d'eau de 20m³ et 4 bornes-fontaines.",
    sector: "infrastructure",
    region: "Saint-Louis",
    commune: "Podor",
    porteur: "Cellule PASTEF Podor",
    porteurAvatar: "CP",
    porteurType: "cellule",
    objectif: 18500000,
    collecte: 12750000,
    contributors: 187,
    status: "en_cours",
    deadline: "15 août 2026",
    livraisonPrevue: "30 novembre 2026",
    avancement: 42,
    createdAt: "Il y a 3 semaines",
    needs: ["Financement", "Ingénieur hydraulique bénévole", "Suivi terrain"],
    mvp: "Étude hydrogéologique validée, terrain attribué, devis de 3 entreprises reçus.",
    impact: "2 400 habitants desservis, 0 km de marche pour les femmes, qualité de vie transformée.",
    funders: [
      { nom: "Communauté de Paris", type: "diaspora", montant: 6200000, avatar: "🇫🇷" },
      { nom: "Mairie de Podor", type: "mairie", montant: 3500000, avatar: "🏛️" },
      { nom: "Fonds PASTEF", type: "pastef", montant: 2000000, avatar: "🟢" },
      { nom: "45 patriotes individuels", type: "diaspora", montant: 1050000, avatar: "👥" },
    ],
    photos: ["🏗️", "☀️", "💧"],
    updates: 8,
    proOnly: false,
    rapports: [
      { mois: "Juin 2026", avancement: 42, resume: "Forage terminé à 80m de profondeur. Débit confirmé à 8m³/h. Installation des panneaux solaires démarrée.", depenses: 4200000, pdfUrl: "/rapports/p1-juin.pdf", publie: true },
      { mois: "Mai 2026", avancement: 28, resume: "Démarrage des travaux de forage. Équipe technique mobilisée. 35m de profondeur atteinte fin de mois.", depenses: 3100000, pdfUrl: "/rapports/p1-mai.pdf", publie: true },
      { mois: "Avril 2026", avancement: 12, resume: "Phase préparatoire : sécurisation du terrain, achat des équipements, recrutement des ouvriers locaux.", depenses: 1800000, pdfUrl: "/rapports/p1-avril.pdf", publie: true },
    ],
    depenses: [
      { poste: "Forage 80m + analyses eau", montant: 5200000, fournisseur: "HYDROFOR Sénégal", facture: "FAC-2026-0142", date: "10 juin 2026" },
      { poste: "Panneaux solaires + pompe", montant: 3100000, fournisseur: "SolarTech SARL", facture: "FAC-2026-0156", date: "18 mai 2026" },
      { poste: "Main d'œuvre locale (6 ouvriers × 2 mois)", montant: 600000, fournisseur: "Coopérative Podor", facture: "REC-2026-007", date: "30 mai 2026" },
      { poste: "Étude hydrogéologique", montant: 200000, fournisseur: "Bureau d'études HYDRO-CONSEIL", facture: "FAC-2026-0098", date: "20 avril 2026" },
    ],
  },
  {
    id: "p2",
    title: "Centre numérique communautaire — Kaolack",
    pitch: "Créer un espace de coworking et de formation numérique pour 500 jeunes par an.",
    description: "Ce centre de 150m² accueillera 30 postes informatiques, une salle de formation, un espace coworking et un fab lab.",
    sector: "numerique",
    region: "Kaolack",
    commune: "Kaolack",
    porteur: "Moussa Diop",
    porteurAvatar: "MD",
    porteurType: "patriote",
    objectif: 25000000,
    collecte: 25000000,
    contributors: 312,
    status: "finance",
    deadline: "Financé",
    livraisonPrevue: "31 décembre 2026",
    avancement: 65,
    createdAt: "Il y a 2 mois",
    needs: ["Formateurs bénévoles", "Équipement réseau"],
    mvp: "Local identifié (bail signé), partenariat ESP Dakar, 15 PC reconditionnés reçus.",
    impact: "500 jeunes formés/an, 50 micro-entreprises créées en 3 ans.",
    funders: [
      { nom: "Diaspora Italie", type: "diaspora", montant: 10000000, avatar: "🇮🇹" },
      { nom: "SenTech Solutions", type: "entreprise", montant: 8000000, avatar: "🏢" },
      { nom: "Fonds PASTEF", type: "pastef", montant: 5000000, avatar: "🟢" },
      { nom: "Mairie de Kaolack", type: "mairie", montant: 2000000, avatar: "🏛️" },
    ],
    photos: ["💻", "🎓", "🏢"],
    updates: 14,
    proOnly: false,
    rapports: [
      { mois: "Juin 2026", avancement: 65, resume: "Aménagement du local terminé. Installation réseau et 30 postes informatiques. Recrutement de 4 formateurs.", depenses: 8500000, pdfUrl: "/rapports/p2-juin.pdf", publie: true },
      { mois: "Mai 2026", avancement: 45, resume: "Travaux de rénovation : électricité, peinture, climatisation. Réception des PC reconditionnés.", depenses: 6200000, pdfUrl: "/rapports/p2-mai.pdf", publie: true },
      { mois: "Avril 2026", avancement: 20, resume: "Signature bail, demande d'autorisations administratives, achat du mobilier.", depenses: 4100000, pdfUrl: "/rapports/p2-avril.pdf", publie: true },
    ],
    depenses: [
      { poste: "30 postes informatiques + écrans", montant: 7800000, fournisseur: "Computec Dakar", facture: "FAC-2026-0234", date: "12 juin 2026" },
      { poste: "Installation réseau + serveur", montant: 2300000, fournisseur: "NetworkPro SN", facture: "FAC-2026-0245", date: "20 juin 2026" },
      { poste: "Rénovation locale + climatisation", montant: 5400000, fournisseur: "BTP Kaolack", facture: "FAC-2026-0189", date: "15 mai 2026" },
      { poste: "Mobilier bureaux + chaises", montant: 1900000, fournisseur: "Mobilier Plus", facture: "FAC-2026-0167", date: "28 avril 2026" },
      { poste: "Caution + loyer 6 mois", montant: 1400000, fournisseur: "SCI Kaolack Centre", facture: "REC-2026-012", date: "10 avril 2026" },
    ],
  },
  {
    id: "p3",
    title: "Coopérative maraîchère bio — Ziguinchor",
    pitch: "Lancer une coopérative de 60 femmes productrices de légumes bio pour le marché local.",
    description: "Cette coopérative réunit 60 femmes de 4 villages autour de Ziguinchor pour produire des légumes bio.",
    sector: "agriculture",
    region: "Ziguinchor",
    commune: "Ziguinchor",
    porteur: "Coopérative Jàmm Bugum",
    porteurAvatar: "JB",
    porteurType: "cooperative",
    objectif: 8500000,
    collecte: 3200000,
    contributors: 89,
    status: "en_cours",
    deadline: "30 septembre 2026",
    livraisonPrevue: "15 janvier 2027",
    avancement: 18,
    createdAt: "Il y a 1 semaine",
    needs: ["Financement", "Agronome conseil", "Débouchés marché Dakar"],
    mvp: "60 femmes recrutées, terrain de 2 hectares disponible, formation initiale effectuée.",
    impact: "60 emplois directs, autosuffisance alimentaire locale.",
    funders: [
      { nom: "Diaspora Espagne", type: "diaspora", montant: 1800000, avatar: "🇪🇸" },
      { nom: "32 patriotes", type: "diaspora", montant: 1400000, avatar: "👥" },
    ],
    photos: ["🌱", "👩‍🌾", "☀️"],
    updates: 3,
    proOnly: false,
    rapports: [
      { mois: "Juin 2026", avancement: 18, resume: "Préparation terrain en cours. Formation initiale des 60 femmes complétée. Achat des semences certifiées.", depenses: 950000, pdfUrl: "/rapports/p3-juin.pdf", publie: true },
    ],
    depenses: [
      { poste: "Semences bio certifiées", montant: 480000, fournisseur: "Senegal Seeds Bio", facture: "FAC-2026-0301", date: "5 juin 2026" },
      { poste: "Formation permaculture (3 jours)", montant: 320000, fournisseur: "ISRA Ziguinchor", facture: "FAC-2026-0298", date: "12 juin 2026" },
      { poste: "Préparation du terrain", montant: 150000, fournisseur: "Coopérative locale", facture: "REC-2026-019", date: "20 juin 2026" },
    ],
  },
  {
    id: "p4",
    title: "Pharmacie communautaire — Matam",
    pitch: "Ouvrir la première pharmacie de la commune de Ranérou, 45 000 habitants sans accès aux médicaments.",
    description: "La commune de Ranérou ne dispose d'aucune pharmacie. Les habitants parcourent 80 km pour se procurer des médicaments essentiels.",
    sector: "sante",
    region: "Matam",
    commune: "Ranérou",
    porteur: "Dr. Aïssatou Ba",
    porteurAvatar: "AB",
    porteurType: "patriote",
    objectif: 14000000,
    collecte: 6800000,
    contributors: 156,
    status: "en_cours",
    deadline: "1er octobre 2026",
    livraisonPrevue: "1er décembre 2026",
    avancement: 35,
    createdAt: "Il y a 10 jours",
    needs: ["Financement", "Fournisseur médicaments", "Pharmacien(ne) 6 mois"],
    mvp: "Autorisation préfectorale obtenue, local identifié, convention signée.",
    impact: "45 000 habitants desservis.",
    funders: [
      { nom: "ONG Santé Sahel", type: "institution", montant: 3000000, avatar: "🏥" },
      { nom: "Diaspora USA", type: "diaspora", montant: 2300000, avatar: "🇺🇸" },
      { nom: "Fonds PASTEF", type: "pastef", montant: 1500000, avatar: "🟢" },
    ],
    photos: ["💊", "🏥", "🚑"],
    updates: 5,
    proOnly: false,
    rapports: [
      { mois: "Juin 2026", avancement: 35, resume: "Local aménagé. Convention signée avec le District Sanitaire. Recrutement de Mme Fall (pharmacienne) en cours.", depenses: 2400000, pdfUrl: "/rapports/p4-juin.pdf", publie: true },
      { mois: "Mai 2026", avancement: 15, resume: "Validation administrative reçue. Démarrage des travaux d'aménagement du local.", depenses: 1500000, pdfUrl: "/rapports/p4-mai.pdf", publie: true },
    ],
    depenses: [
      { poste: "Aménagement local pharmacie", montant: 2200000, fournisseur: "BTP Matam", facture: "FAC-2026-0212", date: "15 juin 2026" },
      { poste: "Mobilier + comptoir + étagères", montant: 800000, fournisseur: "Mobilier Pharma", facture: "FAC-2026-0228", date: "22 juin 2026" },
      { poste: "Caution local + 3 mois loyer", montant: 600000, fournisseur: "Propriétaire local", facture: "REC-2026-009", date: "10 mai 2026" },
      { poste: "Frais administratifs + licences", montant: 300000, fournisseur: "Administration", facture: "REC-2026-005", date: "5 mai 2026" },
    ],
  },
  {
    id: "p5",
    title: "Plateforme e-commerce pour artisans sénégalais",
    pitch: "Connecter 200 artisans sénégalais au marché international.",
    description: "Application mobile et site web permettant aux artisans de vendre directement à la diaspora.",
    sector: "commerce",
    region: "Dakar",
    commune: "Médina",
    porteur: "Awa Ndiaye",
    porteurAvatar: "AN",
    porteurType: "patriote",
    objectif: 12000000,
    collecte: 0,
    contributors: 0,
    status: "en_attente",
    deadline: "En attente de financement",
    livraisonPrevue: "À définir",
    avancement: 0,
    createdAt: "Il y a 2 jours",
    needs: ["Développeur React Native", "Investisseur seed", "Partenaire logistique"],
    mvp: "Maquettes Figma terminées, 40 artisans pré-inscrits.",
    impact: "200 artisans connectés, +60% de revenus estimés.",
    funders: [],
    photos: ["🎨", "📱", "🌍"],
    updates: 0,
    proOnly: false,
    rapports: [],
    depenses: [],
  },
  {
    id: "p6",
    title: "Électrification solaire — 3 écoles rurales à Kédougou",
    pitch: "Installer des panneaux solaires dans 3 écoles pour que 900 élèves puissent étudier le soir.",
    description: "Trois écoles primaires de la commune de Saraya n'ont pas d'électricité.",
    sector: "energie",
    region: "Kédougou",
    commune: "Saraya",
    porteur: "Mairie de Saraya",
    porteurAvatar: "MS",
    porteurType: "mairie",
    objectif: 9500000,
    collecte: 9500000,
    contributors: 203,
    status: "termine",
    deadline: "Terminé",
    livraisonPrevue: "15 mai 2026 (livré)",
    avancement: 100,
    createdAt: "Il y a 4 mois",
    needs: [],
    mvp: "Projet terminé avec succès. 3 écoles équipées, inaugurées le 15 mai 2026.",
    impact: "900 élèves bénéficiaires, +2h d'étude/jour.",
    funders: [
      { nom: "Diaspora Canada", type: "diaspora", montant: 4000000, avatar: "🇨🇦" },
      { nom: "Fonds PASTEF", type: "pastef", montant: 3000000, avatar: "🟢" },
      { nom: "EnergySen SARL", type: "entreprise", montant: 2500000, avatar: "⚡" },
    ],
    photos: ["☀️", "🏫", "💡"],
    updates: 22,
    proOnly: false,
    rapports: [
      { mois: "Mai 2026", avancement: 100, resume: "Inauguration officielle le 15 mai 2026. 3 écoles équipées, 900 élèves bénéficiaires. Audit final clos.", depenses: 1800000, pdfUrl: "/rapports/p6-mai.pdf", publie: true },
      { mois: "Avril 2026", avancement: 85, resume: "Installation finalisée dans les 3 écoles. Tests techniques validés. Formation des enseignants.", depenses: 3200000, pdfUrl: "/rapports/p6-avril.pdf", publie: true },
      { mois: "Mars 2026", avancement: 55, resume: "Installation en cours dans les écoles n°1 et n°2. École n°3 démarrée.", depenses: 2800000, pdfUrl: "/rapports/p6-mars.pdf", publie: true },
      { mois: "Février 2026", avancement: 20, resume: "Démarrage des travaux. Livraison des kits solaires. Coordination avec les directeurs d'école.", depenses: 1700000, pdfUrl: "/rapports/p6-fevrier.pdf", publie: true },
    ],
    depenses: [
      { poste: "3 kits solaires complets (panneaux + batteries)", montant: 6300000, fournisseur: "EnergySen SARL", facture: "FAC-2026-0078", date: "20 février 2026" },
      { poste: "Installation et câblage (3 écoles)", montant: 1800000, fournisseur: "Électricité Kédougou", facture: "FAC-2026-0098", date: "15 mars 2026" },
      { poste: "Éclairage LED + prises USB tablettes", montant: 900000, fournisseur: "Lighting Pro", facture: "FAC-2026-0112", date: "5 avril 2026" },
      { poste: "Formation enseignants + maintenance", montant: 500000, fournisseur: "EnergySen SARL", facture: "FAC-2026-0156", date: "10 mai 2026" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA — DIASPORA (enrichi avec coordinateur + projets parrainés)
   ═══════════════════════════════════════════════════════════════ */

const DIASPORA_CITIES: DiasporaCity[] = [
  { ville: "Paris", pays: "France", pays_iso: "🇫🇷", lat: 48.86, lng: 2.35, membres: 42800, contributions: 28500000, projetsFinances: 34, big: true, coordinateur: "Mamadou Diop", contact: "+33 6 12 34 56 78", projetsParraines: ["p1", "p2"] },
  { ville: "Milan", pays: "Italie", pays_iso: "🇮🇹", lat: 45.46, lng: 9.19, membres: 28500, contributions: 18200000, projetsFinances: 22, big: true, coordinateur: "Serigne Mbaye", contact: "+39 320 123 4567", projetsParraines: ["p2"] },
  { ville: "Madrid", pays: "Espagne", pays_iso: "🇪🇸", lat: 40.42, lng: -3.70, membres: 21400, contributions: 14800000, projetsFinances: 18, big: true, coordinateur: "Cheikh Guèye", contact: "+34 612 345 678", projetsParraines: ["p3"] },
  { ville: "New York", pays: "USA", pays_iso: "🇺🇸", lat: 40.71, lng: -74.01, membres: 18200, contributions: 22100000, projetsFinances: 15, big: true, coordinateur: "Fatou Ndiaye", contact: "+1 212 555 0123", projetsParraines: ["p4"] },
  { ville: "Bruxelles", pays: "Belgique", pays_iso: "🇧🇪", lat: 50.85, lng: 4.35, membres: 9800, contributions: 6400000, projetsFinances: 8, coordinateur: "Abdoulaye Fall", contact: "+32 478 12 34 56", projetsParraines: [] },
  { ville: "Montréal", pays: "Canada", pays_iso: "🇨🇦", lat: 45.50, lng: -73.57, membres: 8400, contributions: 7200000, projetsFinances: 9, coordinateur: "Sokhna Dieng", contact: "+1 514 555 0456", projetsParraines: ["p6"] },
  { ville: "Londres", pays: "UK", pays_iso: "🇬🇧", lat: 51.51, lng: -0.13, membres: 7600, contributions: 5800000, projetsFinances: 7, coordinateur: "Oumar Sow", contact: "+44 7911 123456", projetsParraines: [] },
  { ville: "Abidjan", pays: "Côte d'Ivoire", pays_iso: "🇨🇮", lat: 5.36, lng: -4.01, membres: 11200, contributions: 4200000, projetsFinances: 12, coordinateur: "Babacar Ndiaye", contact: "+225 07 12 34 56 78", projetsParraines: [] },
  { ville: "Dubaï", pays: "EAU", pays_iso: "🇦🇪", lat: 25.20, lng: 55.27, membres: 6200, contributions: 9800000, projetsFinances: 6, coordinateur: "Aliou Cissé", contact: "+971 50 123 4567", projetsParraines: [] },
  { ville: "Djeddah", pays: "Arabie S.", pays_iso: "🇸🇦", lat: 21.49, lng: 39.19, membres: 7800, contributions: 5100000, projetsFinances: 5, coordinateur: "Mbacké Seck", contact: "+966 55 123 4567", projetsParraines: [] },
  { ville: "Nouakchott", pays: "Mauritanie", pays_iso: "🇲🇷", lat: 18.07, lng: -15.96, membres: 8900, contributions: 3200000, projetsFinances: 10, coordinateur: "Demba Diallo", contact: "+222 36 12 34 56", projetsParraines: [] },
  { ville: "Berlin", pays: "Allemagne", pays_iso: "🇩🇪", lat: 52.52, lng: 13.41, membres: 5900, contributions: 4800000, projetsFinances: 4, coordinateur: "Pape Diouf", contact: "+49 170 1234567", projetsParraines: [] },
  { ville: "Genève", pays: "Suisse", pays_iso: "🇨🇭", lat: 46.20, lng: 6.14, membres: 4200, contributions: 6100000, projetsFinances: 3, coordinateur: "Awa Thiam", contact: "+41 79 123 45 67", projetsParraines: [] },
  { ville: "Libreville", pays: "Gabon", pays_iso: "🇬🇦", lat: 0.42, lng: 9.47, membres: 5400, contributions: 2800000, projetsFinances: 6, coordinateur: "Souleymane Ba", contact: "+241 06 12 34 56", projetsParraines: [] },
  { ville: "Casablanca", pays: "Maroc", pays_iso: "🇲🇦", lat: 33.57, lng: -7.59, membres: 4800, contributions: 2400000, projetsFinances: 3, coordinateur: "Modou Gaye", contact: "+212 6 12 34 56 78", projetsParraines: [] },
  { ville: "Lisbonne", pays: "Portugal", pays_iso: "🇵🇹", lat: 38.72, lng: -9.14, membres: 3800, contributions: 2100000, projetsFinances: 2, coordinateur: "Ibou Niang", contact: "+351 912 345 678", projetsParraines: [] },
];

/* ═══════════════════════════════════════════════════════════════
   PERSONAL IMPACT
   ═══════════════════════════════════════════════════════════════ */

const MY_CONTRIBUTIONS = [
  { projet: "Forage solaire — Ndioum", montant: 25000, date: "2 juin 2026", sector: "infrastructure" as ProjectSector },
  { projet: "Centre numérique — Kaolack", montant: 15000, date: "18 mai 2026", sector: "numerique" as ProjectSector },
  { projet: "Électrification — Kédougou", montant: 10000, date: "3 avril 2026", sector: "energie" as ProjectSector },
  { projet: "Coopérative maraîchère — Ziguinchor", montant: 20000, date: "20 mars 2026", sector: "agriculture" as ProjectSector },
];

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

function formatCFA(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(".0", "") + "M FCFA";
  if (n >= 1000) return Math.round(n / 1000) + "K FCFA";
  return n.toLocaleString() + " FCFA";
}

function pct(collecte: number, objectif: number): number {
  return Math.min(100, Math.round((collecte / objectif) * 100));
}

/* ═══════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
   ═══════════════════════════════════════════════════════════════ */

type TabKey = "projets" | "diaspora" | "transparence" | "impact";

function CoDevPage() {
  const user = getUser();
  const [activeTab, setActiveTab] = useState<TabKey>("projets");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSector, setFilterSector] = useState<ProjectSector | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | "all">("all");
  const [selectedCity, setSelectedCity] = useState<string>(DIASPORA_CITIES[0].ville);

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.region.toLowerCase().includes(q) && !p.porteur.toLowerCase().includes(q) && !p.sector.includes(q)) return false;
      }
      if (filterSector !== "all" && p.sector !== filterSector) return false;
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      return true;
    });
  }, [searchQuery, filterSector, filterStatus]);

  const totalCollecte = MOCK_PROJECTS.reduce((s, p) => s + p.collecte, 0);
  const totalObjectif = MOCK_PROJECTS.reduce((s, p) => s + p.objectif, 0);
  const totalContributors = MOCK_PROJECTS.reduce((s, p) => s + p.contributors, 0);
  const totalDiaspora = DIASPORA_CITIES.reduce((s, c) => s + c.membres, 0);

  return (
    <>
      <PilierHeader pilier={pilier} />

      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <StatChip icon="🚀" value={MOCK_PROJECTS.length.toString()} label="Projets soumis" color={COLORS.vert} />
        <StatChip icon="💰" value={formatCFA(totalCollecte)} label={"sur " + formatCFA(totalObjectif)} color="#2563EB" />
        <StatChip icon="👥" value={totalContributors.toString()} label="Contributeurs" color={COLORS.rouge} />
        <StatChip icon="🌍" value={totalDiaspora.toLocaleString()} label={"Diaspora · " + DIASPORA_CITIES.length + " villes"} color={COLORS.vert} />
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: COLORS.blanc, borderRadius: 14, border: `1px solid ${COLORS.ligne}`, overflow: "hidden", width: "fit-content", flexWrap: "wrap" }}>
        {([
          { key: "projets" as TabKey, icon: "🚀", label: "Projets à financer" },
          { key: "diaspora" as TabKey, icon: "🌍", label: "Carte Diaspora" },
          { key: "transparence" as TabKey, icon: "📊", label: "Transparence" },
          { key: "impact" as TabKey, icon: "💎", label: "Mon impact" },
        ]).map((t) => (
          <TabBtn key={t.key} active={activeTab === t.key} onClick={() => { setActiveTab(t.key); setSelectedProject(null); }} icon={t.icon} label={t.label} />
        ))}
      </div>

      {/* ═══ TAB: PROJETS ═══ */}
      {activeTab === "projets" && (
        <>
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Rechercher un projet, une région, un porteur..." />
            <FilterSelect value={filterSector} onChange={(v) => setFilterSector(v as ProjectSector | "all")} options={[{ value: "all", label: "Tous les secteurs" }, ...Object.entries(SECTOR_CONFIG).map(([k, v]) => ({ value: k, label: `${v.icon} ${v.label}` }))]} />
            <FilterSelect value={filterStatus} onChange={(v) => setFilterStatus(v as ProjectStatus | "all")} options={[{ value: "all", label: "Tous les statuts" }, ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))]} />
          </div>

          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              <AnimatePresence mode="popLayout">
                {filteredProjects.length === 0 ? (
                  <EmptyState icon="🚀" msg="Aucun projet ne correspond à ta recherche." />
                ) : (
                  filteredProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} selected={selectedProject?.id === p.id} onClick={() => setSelectedProject(p)} />
                  ))
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* ═══ TAB: DIASPORA ═══ */}
      {activeTab === "diaspora" && (
        <DiasporaTab
          cities={DIASPORA_CITIES}
          projects={MOCK_PROJECTS}
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          totalDiaspora={totalDiaspora}
        />
      )}

      {/* ═══ TAB: TRANSPARENCE ═══ */}
      {activeTab === "transparence" && <TransparenceTab projects={MOCK_PROJECTS} />}

      {/* ═══ TAB: MON IMPACT ═══ */}
      {activeTab === "impact" && <ImpactTab userName={user?.nom ?? "Patriote"} />}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB DIASPORA — Carte + liste pays/villes + détails à droite
   ═══════════════════════════════════════════════════════════════ */

function DiasporaTab({
  cities,
  projects,
  selectedCity,
  onSelectCity,
  totalDiaspora,
}: {
  cities: DiasporaCity[];
  projects: Project[];
  selectedCity: string;
  onSelectCity: (v: string) => void;
  totalDiaspora: number;
}) {
  const [searchCity, setSearchCity] = useState("");

  const filteredCities = useMemo(
    () =>
      cities.filter(
        (c) =>
          c.ville.toLowerCase().includes(searchCity.toLowerCase()) ||
          c.pays.toLowerCase().includes(searchCity.toLowerCase()),
      ),
    [cities, searchCity],
  );

  const current = cities.find((c) => c.ville === selectedCity) ?? cities[0];
  const totalContributions = cities.reduce((s, c) => s + c.contributions, 0);
  const totalProjets = cities.reduce((s, c) => s + c.projetsFinances, 0);

  return (
    <div>
      {/* ═══ CARTE INTERACTIVE ═══ */}
      <div style={{ position: "relative", background: COLORS.blanc, borderRadius: 20, border: `1px solid ${COLORS.ligne}`, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: "24px 28px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: COLORS.vert, marginBottom: 4 }}>CARTE INTERACTIVE</div>
              <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0, color: COLORS.noir }}>🗺️ Projets &amp; Présence territoriale</h3>
              <p style={{ fontSize: 12, color: "#888", margin: "6px 0 0" }}>Zoomez pour explorer les régions, communes et cellules.</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.vert }}>{projects.length}</div>
              <div style={{ fontSize: 11, color: "#888" }}>projets actifs</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "16px 24px 20px" }}>
          <PresenceMap height={460} />
        </div>
      </div>

      {/* ═══ HEADER PRÉSENCE DIASPORA (vert) ═══ */}
      <div style={{ position: "relative", background: `linear-gradient(135deg, ${COLORS.vert} 0%, #145F2E 100%)`, borderRadius: 16, padding: "26px 30px", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/pattern-sn.png)", backgroundSize: "80px auto", backgroundRepeat: "repeat", opacity: 0.06, pointerEvents: "none" }} />
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 18 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>PRÉSENCE DIASPORA</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: -0.5 }}>
              {cities.length} villes · {totalDiaspora.toLocaleString()} patriotes
            </h2>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: "8px 0 0" }}>
              Sélectionnez un pays pour voir les détails de la communauté et les projets parrainés.
            </p>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>💰 {formatCFA(totalContributions)}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Contributions / mois</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>🚀 {totalProjets}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Projets financés</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ LAYOUT 2 COLONNES : Liste pays / Détails ═══ */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "flex-start" }}>
        {/* ─── COLONNE GAUCHE : Liste pays ─── */}
        <div style={{ background: COLORS.blanc, borderRadius: 16, border: `1px solid ${COLORS.ligne}`, overflow: "hidden", position: "sticky", top: 100 }}>
          <div style={{ padding: "16px 18px", borderBottom: `1px solid ${COLORS.ligne}` }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "#999", marginBottom: 10 }}>SÉLECTIONNER UN PAYS</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.creme, borderRadius: 10, padding: "8px 12px" }}>
              <span style={{ fontSize: 13, opacity: 0.5 }}>🔍</span>
              <input
                type="text"
                placeholder="Rechercher un pays..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                style={{ flex: 1, border: "none", outline: "none", fontSize: 12, fontFamily: "inherit", color: COLORS.noir, background: "transparent" }}
              />
            </div>
          </div>

          <div style={{ maxHeight: "60vh", overflowY: "auto", padding: "8px" }}>
            {filteredCities.length === 0 && (
              <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: "#999" }}>Aucun pays trouvé.</div>
            )}
            {filteredCities.map((c) => {
              const isActive = c.ville === selectedCity;
              return (
                <button
                  key={c.ville}
                  onClick={() => onSelectCity(c.ville)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    padding: "12px 14px",
                    border: "none",
                    background: isActive ? `${COLORS.vert}10` : "transparent",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                    marginBottom: 4,
                    borderLeft: isActive ? `3px solid ${COLORS.vert}` : "3px solid transparent",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = COLORS.creme; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize: 22 }}>{c.pays_iso}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.noir }}>{c.ville}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{c.pays}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: isActive ? COLORS.vert : "#555" }}>{c.membres.toLocaleString()}</div>
                    <div style={{ fontSize: 9, color: "#999", fontWeight: 600 }}>patriotes</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── COLONNE DROITE : Détails du pays ─── */}
        <DiasporaDetailPanel city={current} projects={projects} />
      </div>
    </div>
  );
}

function DiasporaDetailPanel({ city: c, projects }: { city: DiasporaCity; projects: Project[] }) {
  const projetsParraines = projects.filter((p) => c.projetsParraines.includes(p.id));
  const totalParraine = projetsParraines.reduce((s, p) => {
    const f = p.funders.find((f) => f.nom.toLowerCase().includes(c.ville.toLowerCase()) || f.nom.toLowerCase().includes(c.pays.toLowerCase()));
    return s + (f?.montant ?? 0);
  }, 0);

  return (
    <motion.div
      key={c.ville}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{ background: COLORS.blanc, borderRadius: 16, border: `1px solid ${COLORS.ligne}`, overflow: "hidden" }}
    >
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.vert}, #145F2E)`, padding: "24px 28px", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/pattern-sn.png)", backgroundSize: "60px auto", backgroundRepeat: "repeat", opacity: 0.08 }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255,255,255,0.15)", display: "grid", placeItems: "center", fontSize: 36, backdropFilter: "blur(8px)" }}>
              {c.pays_iso}
            </div>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 900, margin: 0, color: "#fff", letterSpacing: -0.5 }}>{c.ville}</h2>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>{c.pays}</div>
            </div>
          </div>
          {c.big && (
            <span style={{ padding: "5px 14px", background: COLORS.rouge, color: "#fff", borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>
              🔥 PÔLE MAJEUR
            </span>
          )}
        </div>
      </div>

      {/* Stats principales */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderBottom: `1px solid ${COLORS.ligne}` }}>
        <StatCell icon="👥" value={c.membres.toLocaleString()} label="Patriotes actifs" color={COLORS.vert} />
        <StatCell icon="💰" value={formatCFA(c.contributions)} label="Par mois" color={COLORS.rouge} divider />
        <StatCell icon="📈" value={formatCFA(c.contributions * 12)} label="Estimé par an" color={COLORS.vert} divider />
        <StatCell icon="🚀" value={c.projetsFinances.toString()} label="Projets financés" color={COLORS.rouge} divider />
      </div>

      <div style={{ padding: "20px 24px" }}>
        {/* Coordinateur */}
        <Section title="Coordinateur de la communauté">
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: COLORS.creme, borderRadius: 12, border: `1px solid ${COLORS.ligne}` }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.vert}, ${COLORS.rouge})`, color: "#fff", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 14 }}>
              {c.coordinateur.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.noir }}>{c.coordinateur}</div>
              <div style={{ fontSize: 11, color: "#888" }}>Coordinateur · {c.ville}</div>
            </div>
            <a href={`tel:${c.contact.replace(/\s/g, "")}`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: COLORS.vert, color: "#fff", textDecoration: "none", borderRadius: 8, fontSize: 12, fontWeight: 800 }}>
              📞 {c.contact}
            </a>
          </div>
        </Section>

        {/* Projets parrainés */}
        <Section title={`Projets parrainés depuis ${c.ville} (${projetsParraines.length})`}>
          {projetsParraines.length === 0 ? (
            <div style={{ padding: "20px 16px", background: COLORS.creme, borderRadius: 12, textAlign: "center", color: "#999", fontSize: 13 }}>
              Aucun projet directement parrainé pour le moment.
              <div style={{ fontSize: 11, marginTop: 4 }}>Cette communauté a financé {c.projetsFinances} projets via le Fonds PASTEF.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {projetsParraines.map((p) => {
                const sector = SECTOR_CONFIG[p.sector];
                const progress = pct(p.collecte, p.objectif);
                const funder = p.funders.find((f) => f.nom.toLowerCase().includes(c.ville.toLowerCase()) || f.nom.toLowerCase().includes(c.pays.toLowerCase()));
                return (
                  <div key={p.id} style={{ padding: "14px 16px", background: COLORS.creme, borderRadius: 12, border: `1px solid ${COLORS.ligne}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${sector.color}15`, display: "grid", placeItems: "center", fontSize: 18, flexShrink: 0 }}>{sector.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.noir, lineHeight: 1.3 }}>{p.title}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>📍 {p.region} · {p.porteur}</div>
                      </div>
                    </div>
                    {funder && (
                      <div style={{ fontSize: 11, padding: "5px 10px", background: `${COLORS.vert}10`, borderRadius: 6, display: "inline-block", color: COLORS.vert, fontWeight: 800 }}>
                        Contribution : {formatCFA(funder.montant)}
                      </div>
                    )}
                    <div style={{ marginTop: 8, height: 4, background: COLORS.ligne, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${progress}%`, background: progress === 100 ? "#059669" : COLORS.vert }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ padding: "12px 16px", background: `${COLORS.vert}08`, border: `1px solid ${COLORS.vert}20`, borderRadius: 10, fontSize: 12, fontWeight: 700, color: COLORS.vert, textAlign: "center" }}>
                💰 Total parrainé depuis {c.ville} : <strong style={{ fontSize: 14 }}>{formatCFA(totalParraine)}</strong>
              </div>
            </div>
          )}
        </Section>

        {/* Engagement de la communauté */}
        <Section title="Indicateurs d'engagement">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <EngagementBar label="Taux d'adhésion" value={c.big ? 84 : 62} color={COLORS.vert} />
            <EngagementBar label="Cotisation à jour" value={c.big ? 78 : 55} color={COLORS.rouge} />
            <EngagementBar label="Participation événements" value={c.big ? 71 : 48} color={COLORS.vert} />
            <EngagementBar label="Mobilisation projets" value={c.big ? 88 : 60} color={COLORS.rouge} />
          </div>
        </Section>
      </div>
    </motion.div>
  );
}

function StatCell({ icon, value, label, color, divider }: { icon: string; value: string; label: string; color: string; divider?: boolean }) {
  return (
    <div style={{ padding: "20px 16px", textAlign: "center", borderLeft: divider ? `1px solid ${COLORS.ligne}` : "none" }}>
      <div style={{ fontSize: 14, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 900, color, letterSpacing: -0.3 }}>{value}</div>
      <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function EngagementBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ padding: "12px 14px", background: COLORS.creme, borderRadius: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
        <span style={{ color: "#555", fontWeight: 700 }}>{label}</span>
        <span style={{ color, fontWeight: 900 }}>{value}%</span>
      </div>
      <div style={{ height: 5, background: COLORS.ligne, borderRadius: 3, overflow: "hidden" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8 }} style={{ height: "100%", background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB TRANSPARENCE — Rapports mensuels, dépenses, livraison
   ═══════════════════════════════════════════════════════════════ */

function TransparenceTab({ projects }: { projects: Project[] }) {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<Record<string, "rapports" | "depenses" | "financement">>({});

  const funded = projects.filter((p) => p.status === "finance" || p.status === "termine");
  const totalCollecte = projects.reduce((s, p) => s + p.collecte, 0);
  const totalObjectif = projects.reduce((s, p) => s + p.objectif, 0);
  const totalDepenses = projects.reduce((s, p) => s + p.depenses.reduce((s2, e) => s2 + e.montant, 0), 0);
  const totalRapports = projects.reduce((s, p) => s + p.rapports.length, 0);

  return (
    <div>
      {/* Header transparence */}
      <div style={{ background: COLORS.blanc, borderRadius: 16, border: `1px solid ${COLORS.ligne}`, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 24 }}>📊</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: COLORS.noir }}>Tableau de transparence</div>
            <div style={{ fontSize: 11, color: "#888" }}>Tous les flux financiers et l'avancement sont publics et vérifiables.</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
          <BigStat label="Total collecté" value={formatCFA(totalCollecte)} color={COLORS.vert} icon="💰" />
          <BigStat label="Total dépensé" value={formatCFA(totalDepenses)} color={COLORS.rouge} icon="💸" />
          <BigStat label="Projets financés" value={funded.length.toString()} color="#059669" icon="✅" />
          <BigStat label="Rapports publiés" value={totalRapports.toString()} color="#2563EB" icon="📄" />
        </div>

        <div style={{ padding: "14px 16px", borderRadius: 12, background: `${COLORS.vert}08`, border: `1px solid ${COLORS.vert}20`, fontSize: 13, color: "#444", lineHeight: 1.6 }}>
          💡 <strong>Engagement de transparence :</strong> Chaque mois, le porteur publie un rapport détaillé téléchargeable en PDF. Toutes les factures sont référencées. Conformément au mandat du Congrès de Diamniadio sur la lutte rigoureuse contre la corruption.
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "#999", marginBottom: 12 }}>
        DÉTAIL PAR PROJET — Cliquez pour ouvrir le suivi complet
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {projects.map((p) => {
          const sector = SECTOR_CONFIG[p.sector];
          const status = STATUS_CONFIG[p.status];
          const progress = pct(p.collecte, p.objectif);
          const totalSpent = p.depenses.reduce((s, e) => s + e.montant, 0);
          const isOpen = expandedProject === p.id;
          const view = activeView[p.id] ?? "rapports";

          return (
            <div key={p.id} style={{ background: COLORS.blanc, borderRadius: 16, border: isOpen ? `2px solid ${COLORS.vert}` : `1px solid ${COLORS.ligne}`, overflow: "hidden", transition: "all 0.2s" }}>
              {/* Header du projet (toujours visible) */}
              <button
                onClick={() => setExpandedProject(isOpen ? null : p.id)}
                style={{ width: "100%", padding: "18px 22px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${sector.color}15`, display: "grid", placeItems: "center", fontSize: 22, flexShrink: 0 }}>{sector.icon}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: COLORS.noir }}>{p.title}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, background: `${status.color}15`, color: status.color, padding: "3px 10px", borderRadius: 6 }}>{status.label}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      📍 {p.region} · 👤 {p.porteur} · 📅 Livraison prévue : <strong style={{ color: COLORS.vert }}>{p.livraisonPrevue}</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
                    <MetricBlock label="Avancement" value={`${p.avancement}%`} color={p.avancement === 100 ? "#059669" : COLORS.vert} />
                    <MetricBlock label="Contributeurs" value={p.contributors.toString()} color={COLORS.rouge} />
                    <span style={{ fontSize: 14, color: "#999", transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
                  </div>
                </div>

                {/* Double barre de progression */}
                <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                      <span style={{ color: "#555" }}>💰 Collecté : {formatCFA(p.collecte)}</span>
                      <span style={{ color: COLORS.vert }}>{progress}% de {formatCFA(p.objectif)}</span>
                    </div>
                    <div style={{ height: 6, background: COLORS.ligne, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${progress}%`, background: progress === 100 ? "#059669" : COLORS.vert, borderRadius: 3 }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                      <span style={{ color: "#555" }}>🚧 Avancement projet</span>
                      <span style={{ color: p.avancement === 100 ? "#059669" : COLORS.rouge }}>{p.avancement}%</span>
                    </div>
                    <div style={{ height: 6, background: COLORS.ligne, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${p.avancement}%`, background: p.avancement === 100 ? "#059669" : COLORS.rouge, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              </button>

              {/* CONTENU DÉPLIÉ : Rapports / Dépenses / Financement */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden", borderTop: `1px solid ${COLORS.ligne}`, background: COLORS.creme }}>
                    <div style={{ padding: "20px 24px" }}>
                      {/* Sub-tabs */}
                      <div style={{ display: "flex", gap: 6, marginBottom: 16, padding: 4, background: COLORS.blanc, borderRadius: 10, border: `1px solid ${COLORS.ligne}`, width: "fit-content" }}>
                        {([
                          { key: "rapports" as const, label: `📄 Rapports mensuels (${p.rapports.length})` },
                          { key: "depenses" as const, label: `💸 Dépenses détaillées (${p.depenses.length})` },
                          { key: "financement" as const, label: `💰 Financement (${p.funders.length})` },
                        ]).map((v) => (
                          <button
                            key={v.key}
                            onClick={() => setActiveView({ ...activeView, [p.id]: v.key })}
                            style={{
                              padding: "8px 14px",
                              border: "none",
                              borderRadius: 8,
                              background: view === v.key ? COLORS.vert : "transparent",
                              color: view === v.key ? "#fff" : "#666",
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                              fontFamily: "inherit",
                              transition: "all 0.15s",
                            }}
                          >
                            {v.label}
                          </button>
                        ))}
                      </div>

                      {/* ─── RAPPORTS MENSUELS ─── */}
                      {view === "rapports" && (
                        <div>
                          {p.rapports.length === 0 ? (
                            <EmptyMini icon="📄" msg="Aucun rapport disponible pour ce projet (financement en attente)." />
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                              {p.rapports.map((r, i) => (
                                <div key={i} style={{ background: COLORS.blanc, borderRadius: 12, padding: "16px 18px", border: `1px solid ${COLORS.ligne}`, borderLeft: `4px solid ${COLORS.vert}` }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 10 }}>
                                    <div>
                                      <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.noir, marginBottom: 4 }}>📅 {r.mois}</div>
                                      <div style={{ display: "flex", gap: 14, fontSize: 11, color: "#666" }}>
                                        <span>🚧 Avancement : <strong style={{ color: COLORS.vert }}>{r.avancement}%</strong></span>
                                        <span>💸 Dépenses du mois : <strong style={{ color: COLORS.rouge }}>{formatCFA(r.depenses)}</strong></span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => alert(`Téléchargement du rapport : ${r.pdfUrl}`)}
                                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: COLORS.vert, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                                    >
                                      📥 Télécharger PDF
                                    </button>
                                  </div>
                                  <p style={{ fontSize: 12, color: "#444", margin: 0, lineHeight: 1.6 }}>{r.resume}</p>
                                  <div style={{ marginTop: 10, height: 4, background: COLORS.ligne, borderRadius: 2, overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${r.avancement}%`, background: COLORS.vert, borderRadius: 2 }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* ─── DÉPENSES DÉTAILLÉES ─── */}
                      {view === "depenses" && (
                        <div>
                          {p.depenses.length === 0 ? (
                            <EmptyMini icon="💸" msg="Aucune dépense enregistrée pour ce projet." />
                          ) : (
                            <>
                              <div style={{ background: COLORS.blanc, borderRadius: 12, overflow: "hidden", border: `1px solid ${COLORS.ligne}` }}>
                                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr", background: COLORS.creme, padding: "10px 14px", fontSize: 10, fontWeight: 800, color: "#999", letterSpacing: 1, borderBottom: `1px solid ${COLORS.ligne}` }}>
                                  <span>POSTE</span>
                                  <span>FOURNISSEUR</span>
                                  <span>FACTURE</span>
                                  <span>DATE</span>
                                  <span style={{ textAlign: "right" }}>MONTANT</span>
                                </div>
                                {p.depenses.map((d, i) => (
                                  <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr", padding: "12px 14px", fontSize: 12, alignItems: "center", borderBottom: i < p.depenses.length - 1 ? `1px solid ${COLORS.ligne}` : "none" }}>
                                    <span style={{ fontWeight: 700, color: COLORS.noir }}>{d.poste}</span>
                                    <span style={{ color: "#666" }}>{d.fournisseur}</span>
                                    <span style={{ color: "#888", fontSize: 11, fontFamily: "monospace" }}>{d.facture}</span>
                                    <span style={{ color: "#888", fontSize: 11 }}>{d.date}</span>
                                    <span style={{ textAlign: "right", fontWeight: 900, color: COLORS.rouge }}>{formatCFA(d.montant)}</span>
                                  </div>
                                ))}
                                <div style={{ background: `${COLORS.vert}08`, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `2px solid ${COLORS.vert}` }}>
                                  <span style={{ fontSize: 12, fontWeight: 800, color: COLORS.noir }}>TOTAL DÉPENSÉ</span>
                                  <span style={{ fontSize: 16, fontWeight: 900, color: COLORS.vert }}>{formatCFA(totalSpent)}</span>
                                </div>
                              </div>
                              <div style={{ marginTop: 12, padding: "10px 14px", background: `${COLORS.vert}06`, borderRadius: 8, fontSize: 11, color: "#666" }}>
                                💡 Toutes les factures sont archivées et vérifiables. Audit indépendant trimestriel par ONECCA.
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* ─── FINANCEMENT ─── */}
                      {view === "financement" && (
                        <div>
                          {p.funders.length === 0 ? (
                            <EmptyMini icon="💰" msg="Aucun financeur pour le moment — projet en attente." />
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              {p.funders.map((f, i) => {
                                const pctF = Math.round((f.montant / p.collecte) * 100);
                                return (
                                  <div key={i} style={{ background: COLORS.blanc, borderRadius: 12, padding: "14px 16px", border: `1px solid ${COLORS.ligne}`, display: "flex", alignItems: "center", gap: 14 }}>
                                    <span style={{ fontSize: 24 }}>{f.avatar}</span>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.noir }}>{f.nom}</div>
                                      <div style={{ fontSize: 10, fontWeight: 800, color: FUNDER_COLORS[f.type], background: `${FUNDER_COLORS[f.type]}15`, padding: "2px 8px", borderRadius: 4, display: "inline-block", marginTop: 4 }}>
                                        {FUNDER_LABELS[f.type]}
                                      </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                      <div style={{ fontSize: 16, fontWeight: 900, color: COLORS.vert }}>{formatCFA(f.montant)}</div>
                                      <div style={{ fontSize: 10, color: "#888", fontWeight: 600 }}>{pctF}% du financement</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetricBlock({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 17, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, color: "#999", fontWeight: 700, letterSpacing: 0.5, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function EmptyMini({ icon, msg }: { icon: string; msg: string }) {
  return (
    <div style={{ padding: "32px 20px", background: COLORS.blanc, borderRadius: 12, textAlign: "center" }}>
      <div style={{ fontSize: 30, marginBottom: 8, opacity: 0.5 }}>{icon}</div>
      <div style={{ fontSize: 12, color: "#999" }}>{msg}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPOSANTS PARTAGÉS
   ═══════════════════════════════════════════════════════════════ */

function PilierHeader({ pilier }: { pilier: (typeof PILIERS)[number] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24, padding: "20px 24px", borderRadius: 16, background: `linear-gradient(135deg, ${pilier.color}10, ${pilier.color}03)`, borderLeft: `4px solid ${pilier.color}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, color: pilier.color, marginBottom: 6 }}>{pilier.tag}</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, margin: 0, color: COLORS.noir }}>{pilier.title}</h1>
        </div>
        <div style={{ padding: "8px 18px", borderRadius: 10, background: pilier.color, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Soumettre un projet</div>
      </div>
    </motion.div>
  );
}

function StatChip({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: COLORS.blanc, border: `1px solid ${COLORS.ligne}`, borderRadius: 12, padding: "10px 16px", flex: "1 1 140px", minWidth: 140 }}>
      <span style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: "grid", placeItems: "center", fontSize: 16, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 18, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: active ? 800 : 600, fontFamily: "inherit", color: active ? COLORS.vert : "#666", background: active ? `${COLORS.vert}10` : "transparent", borderBottom: active ? `2px solid ${COLORS.vert}` : "2px solid transparent", whiteSpace: "nowrap", transition: "all 0.15s ease" }}>
      <span>{icon}</span>{label}
    </button>
  );
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div style={{ flex: 1, minWidth: 240, display: "flex", alignItems: "center", gap: 10, background: COLORS.blanc, border: `1px solid ${COLORS.ligne}`, borderRadius: 10, padding: "10px 16px" }}>
      <span style={{ fontSize: 16, opacity: 0.5 }}>🔍</span>
      <input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} style={{ flex: 1, border: "none", outline: "none", fontSize: 13, fontFamily: "inherit", color: COLORS.noir, background: "transparent" }} />
    </div>
  );
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${COLORS.ligne}`, background: COLORS.blanc, fontSize: 12, fontWeight: 600, fontFamily: "inherit", color: "#444", cursor: "pointer", outline: "none" }}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function ProjectCard({ project: p, selected, onClick }: { project: Project; selected: boolean; onClick: () => void }) {
  const sector = SECTOR_CONFIG[p.sector];
  const status = STATUS_CONFIG[p.status];
  const progress = pct(p.collecte, p.objectif);

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} onClick={onClick} whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }} style={{ background: COLORS.blanc, border: selected ? `2px solid ${COLORS.vert}` : `1px solid ${COLORS.ligne}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.15s ease" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, fontWeight: 800, background: `${sector.color}15`, color: sector.color, padding: "3px 10px", borderRadius: 6 }}>{sector.icon} {sector.label}</span>
        <span style={{ fontSize: 10, fontWeight: 800, background: `${status.color}15`, color: status.color, padding: "3px 10px", borderRadius: 6 }}>{status.label}</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: "#888", padding: "3px 10px", borderRadius: 6, background: "#f5f5f5" }}>📍 {p.region} · {p.commune}</span>
      </div>

      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: `${sector.color}12`, display: "grid", placeItems: "center", fontSize: 24, flexShrink: 0 }}>{sector.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 4px", color: COLORS.noir, lineHeight: 1.3 }}>{p.title}</h3>
          <p style={{ fontSize: 12, color: "#888", margin: "0 0 10px", lineHeight: 1.5 }}>{p.pitch}</p>

          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
              <span style={{ color: "#555" }}>{formatCFA(p.collecte)} collectés</span>
              <span style={{ color: progress === 100 ? "#059669" : COLORS.vert }}>{progress}%</span>
            </div>
            <div style={{ height: 6, background: COLORS.ligne, borderRadius: 3, overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} style={{ height: "100%", background: progress === 100 ? "#059669" : COLORS.vert, borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 3 }}>Objectif : {formatCFA(p.objectif)} · {p.contributors} contributeurs</div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${COLORS.vert}20`, color: COLORS.vert, display: "grid", placeItems: "center", fontSize: 9, fontWeight: 900 }}>{p.porteurAvatar}</div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#555" }}>{p.porteur}</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {p.funders.slice(0, 4).map((f, i) => (
                <span key={i} style={{ fontSize: 12 }} title={`${f.nom} — ${formatCFA(f.montant)}`}>{f.avatar}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectDetail({ project: p, onClose }: { project: Project; onClose: () => void }) {
  const sector = SECTOR_CONFIG[p.sector];
  const status = STATUS_CONFIG[p.status];
  const progress = pct(p.collecte, p.objectif);

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} style={{ width: 420, flexShrink: 0, background: COLORS.blanc, border: `1px solid ${COLORS.ligne}`, borderRadius: 16, position: "sticky", top: 100, maxHeight: "calc(100vh - 120px)", overflowY: "auto", boxShadow: "0 12px 40px rgba(0,0,0,0.06)" }}>
      <div style={{ background: `linear-gradient(135deg, ${sector.color}18, ${sector.color}06)`, padding: "20px 24px", borderBottom: `1px solid ${COLORS.ligne}`, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 30, height: 30, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.06)", cursor: "pointer", fontSize: 14, display: "grid", placeItems: "center", color: "#666" }}>✕</button>
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, fontWeight: 800, background: `${sector.color}20`, color: sector.color, padding: "3px 10px", borderRadius: 6 }}>{sector.icon} {sector.label}</span>
          <span style={{ fontSize: 10, fontWeight: 800, background: `${status.color}20`, color: status.color, padding: "3px 10px", borderRadius: 6 }}>{status.label}</span>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 6px", lineHeight: 1.3, color: COLORS.noir }}>{p.title}</h2>
        <div style={{ fontSize: 13, color: "#666" }}>📍 {p.region} · {p.commune} · par <strong>{p.porteur}</strong></div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        <div style={{ padding: "14px 16px", borderRadius: 12, background: `${COLORS.vert}08`, border: `1px solid ${COLORS.vert}20`, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: COLORS.vert }}>{formatCFA(p.collecte)}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: progress === 100 ? "#059669" : COLORS.vert }}>{progress}%</span>
          </div>
          <div style={{ height: 8, background: COLORS.ligne, borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: progress === 100 ? "#059669" : COLORS.vert, borderRadius: 4, transition: "width 0.8s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888" }}>
            <span>Objectif : {formatCFA(p.objectif)}</span>
            <span>{p.contributors} contributeurs</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          <InfoBlock label="Secteur" value={`${sector.icon} ${sector.label}`} />
          <InfoBlock label="Région" value={p.region} />
          <InfoBlock label="Livraison prévue" value={p.livraisonPrevue} />
          <InfoBlock label="Avancement" value={`${p.avancement}%`} />
        </div>

        <Section title="Description du projet">
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "#444", margin: 0 }}>{p.description}</p>
        </Section>

        <Section title="Ce qui a déjà été fait (MVP)">
          <div style={{ fontSize: 13, color: "#444", background: `${COLORS.vert}08`, padding: "12px 14px", borderRadius: 10, borderLeft: `3px solid ${COLORS.vert}` }}>{p.mvp}</div>
        </Section>

        {p.needs.length > 0 && (
          <Section title="Ce que le porteur recherche">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {p.needs.map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#444" }}>
                  <span style={{ color: COLORS.rouge, fontWeight: 700 }}>→</span>{n}
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section title="Impact attendu">
          <div style={{ fontSize: 13, color: "#444", background: "#2563EB08", padding: "12px 14px", borderRadius: 10, borderLeft: "3px solid #2563EB" }}>{p.impact}</div>
        </Section>

        {p.status !== "termine" && p.status !== "finance" && (
          <button onClick={() => alert(`Contribution au projet "${p.title}"`)} style={{ width: "100%", padding: "14px 20px", borderRadius: 12, border: "none", background: COLORS.vert, color: "#fff", fontSize: 14, fontWeight: 800, fontFamily: "inherit", cursor: "pointer", marginBottom: 10 }}>
            💰 Financer ce projet →
          </button>
        )}
      </div>
    </motion.div>
  );
}

function ImpactTab({ userName }: { userName: string }) {
  const totalDonne = MY_CONTRIBUTIONS.reduce((s, c) => s + c.montant, 0);
  return (
    <div>
      <div style={{ background: COLORS.blanc, borderRadius: 16, border: `1px solid ${COLORS.ligne}`, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.vert}, ${COLORS.rouge})`, color: "#fff", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 18 }}>{userName.split(" ").map((n) => n[0]).join("")}</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.noir }}>{userName}</div>
            <div style={{ fontSize: 13, color: "#888" }}>Contributeur depuis mars 2026</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
          <BigStat label="Total contribué" value={formatCFA(totalDonne)} color={COLORS.vert} icon="💰" />
          <BigStat label="Projets soutenus" value={MY_CONTRIBUTIONS.length.toString()} color="#2563EB" icon="🚀" />
          <BigStat label="Rang contributeur" value="#127" color={COLORS.rouge} icon="🏆" />
          <BigStat label="Impact direct" value="4 750 personnes" color="#059669" icon="👥" />
        </div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "#999", marginBottom: 12 }}>HISTORIQUE</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MY_CONTRIBUTIONS.map((c, i) => {
          const sector = SECTOR_CONFIG[c.sector];
          return (
            <div key={i} style={{ background: COLORS.blanc, borderRadius: 12, padding: "14px 18px", border: `1px solid ${COLORS.ligne}`, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${sector.color}12`, display: "grid", placeItems: "center", fontSize: 18, flexShrink: 0 }}>{sector.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.noir }}>{c.projet}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{c.date}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: COLORS.vert }}>{formatCFA(c.montant)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: COLORS.creme, borderRadius: 10, padding: "10px 12px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#999", letterSpacing: 0.5, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.noir }}>{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "#999", marginBottom: 10, textTransform: "uppercase" as const }}>{title}</div>
      {children}
    </div>
  );
}

function BigStat({ label, value, color, icon }: { label: string; value: string; color: string; icon: string }) {
  return (
    <div style={{ padding: "14px 16px", borderRadius: 12, background: `${color}08`, border: `1px solid ${color}20` }}>
      <div style={{ fontSize: 12, color: "#888", fontWeight: 600, marginBottom: 6 }}>{icon} {label}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
    </div>
  );
}

function EmptyState({ icon, msg }: { icon: string; msg: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "60px 20px", background: COLORS.blanc, borderRadius: 16, border: `1px solid ${COLORS.ligne}` }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <p style={{ fontSize: 13, color: "#888", margin: 0 }}>{msg}</p>
    </motion.div>
  );
}