import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

import { COLORS } from "@/lib/constants/colors";
import { PILIERS } from "@/lib/data/piliers";
import { getUser } from "@/lib/auth";

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
  objectif: number;        // FCFA
  collecte: number;        // FCFA
  contributors: number;
  status: ProjectStatus;
  deadline: string;
  createdAt: string;
  needs: string[];         // ce que le porteur cherche
  mvp: string;             // ce qui a déjà été fait
  impact: string;          // impact attendu
  funders: Funder[];
  photos: string[];        // emojis simulant les photos
  updates: number;
  proOnly: boolean;
}

interface DiasporaCity {
  ville: string;
  pays: string;
  lat: number;
  lng: number;
  membres: number;
  contributions: number;  // FCFA / mois
  projetsFinances: number;
  big?: boolean;
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
  diaspora:    "#D97706",
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
   MOCK DATA — PROJETS
   ═══════════════════════════════════════════════════════════════ */

const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Forage solaire et château d'eau — Village de Ndioum",
    pitch: "Donner accès à l'eau potable à 2 400 habitants grâce à un forage alimenté par panneaux solaires.",
    description: "Le village de Ndioum dans la commune de Podor n'a pas d'accès direct à l'eau potable. Les femmes marchent 3 km quotidiennement. Ce projet installe un forage de 80m, une pompe solaire, un château d'eau de 20m³ et 4 bornes-fontaines. Le terrain est déjà attribué par la mairie et l'étude hydrogéologique validée.",
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
  },
  {
    id: "p2",
    title: "Centre numérique communautaire — Kaolack",
    pitch: "Créer un espace de coworking et de formation numérique pour 500 jeunes par an.",
    description: "Ce centre de 150m² accueillera 30 postes informatiques, une salle de formation, un espace coworking et un fab lab. Il servira de relais local pour l'Académie PASTEF (Pilier 2) et de hub d'incubation pour les jeunes entrepreneurs de la région. Les formations en IA, développement web et entrepreneuriat y seront dispensées.",
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
    createdAt: "Il y a 2 mois",
    needs: ["Formateurs bénévoles", "Équipement réseau"],
    mvp: "Local identifié (bail signé), partenariat avec ESP Dakar, 15 PC reconditionnés reçus.",
    impact: "500 jeunes formés/an, 50 micro-entreprises créées en 3 ans, hub Académie PASTEF régional.",
    funders: [
      { nom: "Diaspora Italie", type: "diaspora", montant: 10000000, avatar: "🇮🇹" },
      { nom: "SenTech Solutions", type: "entreprise", montant: 8000000, avatar: "🏢" },
      { nom: "Fonds PASTEF", type: "pastef", montant: 5000000, avatar: "🟢" },
      { nom: "Mairie de Kaolack", type: "mairie", montant: 2000000, avatar: "🏛️" },
    ],
    photos: ["💻", "🎓", "🏢"],
    updates: 14,
    proOnly: false,
  },
  {
    id: "p3",
    title: "Coopérative maraîchère bio — Ziguinchor",
    pitch: "Lancer une coopérative de 60 femmes productrices de légumes bio pour le marché local.",
    description: "Cette coopérative réunit 60 femmes de 4 villages autour de Ziguinchor pour produire des légumes bio (tomate, oignon, aubergine, piment). Le projet finance l'achat de semences certifiées, l'installation d'un système d'irrigation goutte-à-goutte solaire, et la formation aux techniques de permaculture.",
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
    createdAt: "Il y a 1 semaine",
    needs: ["Financement", "Agronome conseil", "Débouchés marché Dakar"],
    mvp: "60 femmes recrutées, terrain de 2 hectares disponible, formation initiale effectuée.",
    impact: "60 emplois directs, autosuffisance alimentaire locale, 12 tonnes de légumes/an.",
    funders: [
      { nom: "Diaspora Espagne", type: "diaspora", montant: 1800000, avatar: "🇪🇸" },
      { nom: "32 patriotes", type: "diaspora", montant: 1400000, avatar: "👥" },
    ],
    photos: ["🌱", "👩‍🌾", "☀️"],
    updates: 3,
    proOnly: false,
  },
  {
    id: "p4",
    title: "Pharmacie communautaire — Matam",
    pitch: "Ouvrir la première pharmacie de la commune de Ranérou, 45 000 habitants sans accès aux médicaments.",
    description: "La commune de Ranérou (région de Matam) ne dispose d'aucune pharmacie. Les habitants parcourent 80 km pour se procurer des médicaments essentiels. Ce projet finance l'aménagement d'une pharmacie aux normes, le stock initial de médicaments génériques et la rémunération d'un pharmacien pendant 12 mois.",
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
    createdAt: "Il y a 10 jours",
    needs: ["Financement", "Fournisseur médicaments génériques", "Pharmacien(ne) volontaire 6 mois"],
    mvp: "Autorisation préfectorale obtenue, local identifié, convention avec District Sanitaire signée.",
    impact: "45 000 habitants desservis, réduction de 90% du temps d'accès aux médicaments.",
    funders: [
      { nom: "ONG Santé Sahel", type: "institution", montant: 3000000, avatar: "🏥" },
      { nom: "Diaspora USA", type: "diaspora", montant: 2300000, avatar: "🇺🇸" },
      { nom: "Fonds PASTEF", type: "pastef", montant: 1500000, avatar: "🟢" },
    ],
    photos: ["💊", "🏥", "🚑"],
    updates: 5,
    proOnly: false,
  },
  {
    id: "p5",
    title: "Plateforme e-commerce pour artisans sénégalais",
    pitch: "Connecter 200 artisans sénégalais (tissage, bijouterie, poterie) au marché international.",
    description: "Application mobile et site web permettant aux artisans de vendre directement à la diaspora et aux acheteurs internationaux. Paiement intégré (Wave, Stripe), logistique partenaire (DHL Express), et formation des artisans à la photo produit et au packaging.",
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
    createdAt: "Il y a 2 jours",
    needs: ["Développeur React Native", "Investisseur seed", "Partenaire logistique"],
    mvp: "Maquettes Figma terminées, 40 artisans pré-inscrits, partenariat DHL en négociation.",
    impact: "200 artisans connectés, +60% de revenus estimés, rayonnement culturel sénégalais.",
    funders: [],
    photos: ["🎨", "📱", "🌍"],
    updates: 0,
    proOnly: false,
  },
  {
    id: "p6",
    title: "Électrification solaire — 3 écoles rurales à Kédougou",
    pitch: "Installer des panneaux solaires dans 3 écoles pour que 900 élèves puissent étudier le soir.",
    description: "Trois écoles primaires de la commune de Saraya n'ont pas d'électricité. Les cours s'arrêtent à 16h et les enfants ne peuvent pas réviser le soir. Ce projet installe un kit solaire autonome par école (panneaux, batteries, éclairage LED, prises USB pour tablettes éducatives).",
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
    createdAt: "Il y a 4 mois",
    needs: [],
    mvp: "Projet terminé avec succès. 3 écoles équipées, inaugurées le 15 mai 2026.",
    impact: "900 élèves bénéficiaires, +2h d'étude/jour, baisse de 30% du taux d'abandon.",
    funders: [
      { nom: "Diaspora Canada", type: "diaspora", montant: 4000000, avatar: "🇨🇦" },
      { nom: "Fonds PASTEF", type: "pastef", montant: 3000000, avatar: "🟢" },
      { nom: "EnergySen SARL", type: "entreprise", montant: 2500000, avatar: "⚡" },
    ],
    photos: ["☀️", "🏫", "💡"],
    updates: 22,
    proOnly: false,
  },
];

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA — DIASPORA
   ═══════════════════════════════════════════════════════════════ */

const DIASPORA_CITIES: DiasporaCity[] = [
  { ville: "Paris", pays: "France", lat: 48.86, lng: 2.35, membres: 42800, contributions: 28500000, projetsFinances: 34, big: true },
  { ville: "Milan", pays: "Italie", lat: 45.46, lng: 9.19, membres: 28500, contributions: 18200000, projetsFinances: 22, big: true },
  { ville: "Madrid", pays: "Espagne", lat: 40.42, lng: -3.70, membres: 21400, contributions: 14800000, projetsFinances: 18, big: true },
  { ville: "New York", pays: "USA", lat: 40.71, lng: -74.01, membres: 18200, contributions: 22100000, projetsFinances: 15, big: true },
  { ville: "Bruxelles", pays: "Belgique", lat: 50.85, lng: 4.35, membres: 9800, contributions: 6400000, projetsFinances: 8 },
  { ville: "Montréal", pays: "Canada", lat: 45.50, lng: -73.57, membres: 8400, contributions: 7200000, projetsFinances: 9 },
  { ville: "Londres", pays: "UK", lat: 51.51, lng: -0.13, membres: 7600, contributions: 5800000, projetsFinances: 7 },
  { ville: "Abidjan", pays: "Côte d'Ivoire", lat: 5.36, lng: -4.01, membres: 11200, contributions: 4200000, projetsFinances: 12 },
  { ville: "Dubaï", pays: "EAU", lat: 25.20, lng: 55.27, membres: 6200, contributions: 9800000, projetsFinances: 6 },
  { ville: "Djeddah", pays: "Arabie S.", lat: 21.49, lng: 39.19, membres: 7800, contributions: 5100000, projetsFinances: 5 },
  { ville: "Nouakchott", pays: "Mauritanie", lat: 18.07, lng: -15.96, membres: 8900, contributions: 3200000, projetsFinances: 10 },
  { ville: "Berlin", pays: "Allemagne", lat: 52.52, lng: 13.41, membres: 5900, contributions: 4800000, projetsFinances: 4 },
  { ville: "Genève", pays: "Suisse", lat: 46.20, lng: 6.14, membres: 4200, contributions: 6100000, projetsFinances: 3 },
  { ville: "Libreville", pays: "Gabon", lat: 0.42, lng: 9.47, membres: 5400, contributions: 2800000, projetsFinances: 6 },
  { ville: "Casablanca", pays: "Maroc", lat: 33.57, lng: -7.59, membres: 4800, contributions: 2400000, projetsFinances: 3 },
  { ville: "Lisbonne", pays: "Portugal", lat: 38.72, lng: -9.14, membres: 3800, contributions: 2100000, projetsFinances: 2 },
];

/* ═══════════════════════════════════════════════════════════════
   PERSONAL IMPACT (mock)
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
   SENEGAL SVG MAP DATA (from SenegalMap.jsx)
   ═══════════════════════════════════════════════════════════════ */

const REGIONS_SVG = [
  { id: "saint-louis", name: "Saint-Louis", d: "M148,18 L168,12 L195,15 L210,25 L215,45 L205,65 L195,75 L180,80 L165,78 L155,85 L140,80 L130,65 L125,50 L130,35 Z", cx: 168, cy: 48, projets: 2, taux: 78 },
  { id: "matam", name: "Matam", d: "M215,45 L235,35 L260,30 L285,35 L295,50 L290,70 L275,85 L255,90 L235,85 L220,80 L205,65 Z", cx: 252, cy: 60, projets: 1, taux: 65 },
  { id: "louga", name: "Louga", d: "M105,55 L130,50 L140,65 L155,85 L150,100 L140,115 L125,118 L110,110 L95,100 L90,80 L95,65 Z", cx: 122, cy: 88, projets: 0, taux: 52 },
  { id: "tambacounda", name: "Tamba", d: "M255,90 L290,85 L320,95 L340,115 L335,140 L320,160 L295,165 L270,155 L250,140 L240,120 L245,100 Z", cx: 290, cy: 125, projets: 0, taux: 45 },
  { id: "dakar", name: "Dakar", d: "M52,105 L60,100 L68,105 L70,115 L65,122 L55,122 L48,115 Z", cx: 60, cy: 112, projets: 1, taux: 92 },
  { id: "thies", name: "Thiès", d: "M68,95 L95,85 L110,100 L115,115 L108,130 L95,138 L80,135 L70,125 L65,115 Z", cx: 90, cy: 114, projets: 0, taux: 74 },
  { id: "diourbel", name: "Diourbel", d: "M110,100 L130,95 L145,100 L150,115 L142,130 L128,135 L115,130 L108,118 Z", cx: 130, cy: 115, projets: 0, taux: 61 },
  { id: "fatick", name: "Fatick", d: "M90,138 L115,130 L135,135 L145,150 L140,168 L125,175 L108,172 L95,160 L85,148 Z", cx: 118, cy: 155, projets: 0, taux: 58 },
  { id: "kaolack", name: "Kaolack", d: "M135,135 L155,125 L175,130 L190,145 L185,165 L170,175 L150,172 L140,160 Z", cx: 162, cy: 152, projets: 1, taux: 70 },
  { id: "kaffrine", name: "Kaffrine", d: "M175,130 L200,120 L225,125 L245,140 L240,160 L225,170 L200,168 L185,158 Z", cx: 210, cy: 145, projets: 0, taux: 42 },
  { id: "kedougou", name: "Kédougou", d: "M320,160 L345,155 L365,170 L370,195 L355,215 L335,220 L315,210 L305,190 L310,172 Z", cx: 340, cy: 190, projets: 1, taux: 55 },
  { id: "kolda", name: "Kolda", d: "M210,195 L240,185 L270,190 L290,200 L285,220 L265,232 L240,230 L220,218 L205,208 Z", cx: 248, cy: 210, projets: 0, taux: 48 },
  { id: "sedhiou", name: "Sédhiou", d: "M155,200 L180,192 L210,195 L220,210 L215,225 L195,235 L170,230 L155,218 Z", cx: 185, cy: 215, projets: 0, taux: 44 },
  { id: "ziguinchor", name: "Ziguinchor", d: "M108,205 L130,195 L155,200 L160,215 L155,232 L140,242 L120,240 L105,228 L100,215 Z", cx: 132, cy: 220, projets: 1, taux: 68 },
];

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
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedDiaspora, setSelectedDiaspora] = useState<DiasporaCity | null>(null);

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

      {/* Stats */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <StatChip icon="🚀" value={MOCK_PROJECTS.length.toString()} label="Projets soumis" color={COLORS.vert} />
        <StatChip icon="💰" value={formatCFA(totalCollecte)} label={"sur " + formatCFA(totalObjectif)} color="#2563EB" />
        <StatChip icon="👥" value={totalContributors.toString()} label="Contributeurs" color="#D97706" />
        <StatChip icon="🌍" value={totalDiaspora.toLocaleString()} label={"Diaspora · " + DIASPORA_CITIES.length + " villes"} color={COLORS.rouge} />
      </div>

      {/* Tabs */}
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
              {selectedProject && <ProjectDetail project={selectedProject} userName={user?.nom ?? "Patriote"} onClose={() => setSelectedProject(null)} />}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* ═══ TAB: DIASPORA ═══ */}
      {activeTab === "diaspora" && (
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Carte Sénégal */}
            <div style={{ background: COLORS.blanc, borderRadius: 16, border: `1px solid ${COLORS.ligne}`, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "#999", marginBottom: 14 }}>CARTE DES PROJETS PAR RÉGION</div>
              <SenegalMapSVG hovered={hoveredRegion} onHover={setHoveredRegion} />
              <div style={{ display: "flex", gap: 16, marginTop: 14, justifyContent: "center", fontSize: 11, color: "#888" }}>
                <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: COLORS.vert, marginRight: 4 }} />Forte activité</span>
                <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "#D97706", marginRight: 4 }} />Moyenne</span>
                <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: COLORS.rouge, marginRight: 4 }} />À développer</span>
              </div>
            </div>

            {/* Grille villes diaspora */}
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "#999", marginBottom: 12 }}>PRÉSENCE DIASPORA — {DIASPORA_CITIES.length} VILLES · {totalDiaspora.toLocaleString()} PATRIOTES</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
              {DIASPORA_CITIES.sort((a, b) => b.membres - a.membres).map((c) => (
                <DiasporaCard key={c.ville} city={c} selected={selectedDiaspora?.ville === c.ville} onClick={() => setSelectedDiaspora(selectedDiaspora?.ville === c.ville ? null : c)} />
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedDiaspora && <DiasporaDetail city={selectedDiaspora} onClose={() => setSelectedDiaspora(null)} />}
          </AnimatePresence>
        </div>
      )}

      {/* ═══ TAB: TRANSPARENCE ═══ */}
      {activeTab === "transparence" && <TransparenceTab projects={MOCK_PROJECTS} />}

      {/* ═══ TAB: MON IMPACT ═══ */}
      {activeTab === "impact" && <ImpactTab userName={user?.nom ?? "Patriote"} />}
    </>
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

/* ═══════════════════════════════════════════════════════════════
   CARTE SVG SÉNÉGAL
   ═══════════════════════════════════════════════════════════════ */

function SenegalMapSVG({ hovered, onHover }: { hovered: string | null; onHover: (id: string | null) => void }) {
  const chorColor = (taux: number) => taux >= 70 ? COLORS.vert : taux >= 50 ? "#D97706" : COLORS.rouge;

  return (
    <svg viewBox="0 0 400 270" style={{ width: "100%", maxWidth: 500, margin: "0 auto", display: "block", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))" }}>
      {REGIONS_SVG.map((r) => {
        const isHov = hovered === r.id;
        return (
          <g key={r.id} onMouseEnter={() => onHover(r.id)} onMouseLeave={() => onHover(null)} style={{ cursor: "pointer" }}>
            <path d={r.d} fill={isHov ? `${chorColor(r.taux)}` : `${chorColor(r.taux)}BB`} stroke="#fff" strokeWidth={isHov ? 2.5 : 1.5} style={{ transition: "all 0.2s", transform: isHov ? "scale(1.02)" : "scale(1)", transformOrigin: `${r.cx}px ${r.cy}px` }} />
            <text x={r.cx} y={r.cy - 6} textAnchor="middle" fontSize="8" fontWeight="700" fill={isHov ? "#fff" : COLORS.noir} style={{ pointerEvents: "none", fontFamily: "'Outfit',sans-serif" }}>{r.name}</text>
            {r.projets > 0 && (
              <g>
                <circle cx={r.cx} cy={r.cy + 10} r="8" fill="#fff" stroke={chorColor(r.taux)} strokeWidth="1.5" />
                <text x={r.cx} y={r.cy + 13} textAnchor="middle" fontSize="8" fontWeight="900" fill={chorColor(r.taux)} style={{ pointerEvents: "none" }}>{r.projets}</text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CARTE PROJET
   ═══════════════════════════════════════════════════════════════ */

function ProjectCard({ project: p, selected, onClick }: { project: Project; selected: boolean; onClick: () => void }) {
  const sector = SECTOR_CONFIG[p.sector];
  const status = STATUS_CONFIG[p.status];
  const progress = pct(p.collecte, p.objectif);

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} onClick={onClick} whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }} style={{ background: COLORS.blanc, border: selected ? `2px solid ${COLORS.vert}` : `1px solid ${COLORS.ligne}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.15s ease" }}>
      {/* Badges */}
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

          {/* Barre de financement */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
              <span style={{ color: "#555" }}>{formatCFA(p.collecte)} collectés</span>
              <span style={{ color: progress === 100 ? "#059669" : COLORS.vert }}>{progress}%</span>
            </div>
            <div style={{ height: 6, background: COLORS.ligne, borderRadius: 3, overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} style={{ height: "100%", background: progress === 100 ? "#059669" : `linear-gradient(90deg, ${COLORS.vert}, ${COLORS.vertClair ?? COLORS.vert})`, borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 3 }}>Objectif : {formatCFA(p.objectif)} · {p.contributors} contributeurs</div>
          </div>

          {/* Porteur + Financeurs */}
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

/* ═══════════════════════════════════════════════════════════════
   DÉTAIL PROJET (Panel droit)
   ═══════════════════════════════════════════════════════════════ */

function ProjectDetail({ project: p, userName, onClose }: { project: Project; userName: string; onClose: () => void }) {
  const sector = SECTOR_CONFIG[p.sector];
  const status = STATUS_CONFIG[p.status];
  const progress = pct(p.collecte, p.objectif);

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} style={{ width: 420, flexShrink: 0, background: COLORS.blanc, border: `1px solid ${COLORS.ligne}`, borderRadius: 16, position: "sticky", top: 100, maxHeight: "calc(100vh - 120px)", overflowY: "auto", boxShadow: "0 12px 40px rgba(0,0,0,0.06)" }}>
      {/* Header */}
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
        {/* Financement */}
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
          {p.deadline !== "Financé" && p.deadline !== "Terminé" && (
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.rouge, marginTop: 6 }}>📅 Deadline : {p.deadline}</div>
          )}
        </div>

        {/* Infos */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          <InfoBlock label="Secteur" value={`${sector.icon} ${sector.label}`} />
          <InfoBlock label="Région" value={p.region} />
          <InfoBlock label="Porteur" value={p.porteur} />
          <InfoBlock label="Mises à jour" value={`${p.updates} publications`} />
        </div>

        {/* Description */}
        <Section title="Description du projet">
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "#444", margin: 0 }}>{p.description}</p>
        </Section>

        {/* MVP */}
        <Section title="Ce qui a déjà été fait (MVP)">
          <div style={{ fontSize: 13, color: "#444", background: `${COLORS.vert}08`, padding: "12px 14px", borderRadius: 10, borderLeft: `3px solid ${COLORS.vert}` }}>{p.mvp}</div>
        </Section>

        {/* Besoins */}
        {p.needs.length > 0 && (
          <Section title="Ce que le porteur recherche">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {p.needs.map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#444" }}>
                  <span style={{ color: "#D97706", fontWeight: 700 }}>→</span>{n}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Impact */}
        <Section title="Impact attendu">
          <div style={{ fontSize: 13, color: "#444", background: "#2563EB08", padding: "12px 14px", borderRadius: 10, borderLeft: "3px solid #2563EB" }}>{p.impact}</div>
        </Section>

        {/* Financeurs */}
        {p.funders.length > 0 && (
          <Section title={`Financeurs (${p.funders.length})`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {p.funders.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 10, background: COLORS.creme, border: `1px solid ${COLORS.ligne}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{f.avatar}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{f.nom}</div>
                      <div style={{ fontSize: 10, color: FUNDER_COLORS[f.type], fontWeight: 700 }}>{FUNDER_LABELS[f.type]}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.vert }}>{formatCFA(f.montant)}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Bouton financer */}
        {p.status !== "termine" && p.status !== "finance" && (
          <button onClick={() => alert(`Contribution au projet "${p.title}" — Orange Money, Wave ou Stripe`)} style={{ width: "100%", padding: "14px 20px", borderRadius: 12, border: "none", background: COLORS.vert, color: "#fff", fontSize: 14, fontWeight: 800, fontFamily: "inherit", cursor: "pointer", marginBottom: 10 }}>
            💰 Financer ce projet →
          </button>
        )}

        <button style={{ width: "100%", padding: "12px 20px", borderRadius: 12, border: `1.5px solid ${COLORS.ligne}`, background: "transparent", color: "#666", fontSize: 13, fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}>
          🔖 Sauvegarder · 📤 Partager
        </button>

        <div style={{ marginTop: 14, textAlign: "center", fontSize: 11, color: "#999" }}>Publié {p.createdAt} · Signaler ce projet</div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CARTE DIASPORA
   ═══════════════════════════════════════════════════════════════ */

function DiasporaCard({ city: c, selected, onClick }: { city: DiasporaCity; selected: boolean; onClick: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onClick={onClick} whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }} style={{ background: COLORS.blanc, border: selected ? "2px solid #D97706" : `1px solid ${COLORS.ligne}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.15s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.big ? "linear-gradient(135deg, #D97706, #E8B847)" : "#D97706" + "25", color: c.big ? "#fff" : "#D97706", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 11, flexShrink: 0 }}>{c.big ? "🔥" : c.ville.slice(0, 2)}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.noir }}>{c.ville}</div>
          <div style={{ fontSize: 11, color: "#888" }}>{c.pays}</div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#D97706" }}>{c.membres.toLocaleString()}</div>
          <div style={{ fontSize: 10, color: "#888" }}>patriotes</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#888", fontWeight: 600 }}>
        <span>💰 {formatCFA(c.contributions)}/mois</span>
        <span>🚀 {c.projetsFinances} projets financés</span>
      </div>
    </motion.div>
  );
}

function DiasporaDetail({ city: c, onClose }: { city: DiasporaCity; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} style={{ width: 360, flexShrink: 0, background: COLORS.blanc, border: `1px solid ${COLORS.ligne}`, borderRadius: 16, position: "sticky", top: 100, maxHeight: "calc(100vh - 120px)", overflowY: "auto", boxShadow: "0 12px 40px rgba(0,0,0,0.06)" }}>
      <div style={{ background: "linear-gradient(135deg, #D9770618, #D9770606)", padding: "20px 24px", borderBottom: `1px solid ${COLORS.ligne}`, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 30, height: 30, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.06)", cursor: "pointer", fontSize: 14, display: "grid", placeItems: "center" }}>✕</button>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: "#D97706", marginBottom: 8 }}>🌍 DIASPORA</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 4px", color: COLORS.noir }}>{c.ville}</h2>
        <div style={{ fontSize: 13, color: "#666" }}>{c.pays}</div>
      </div>
      <div style={{ padding: "20px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          <InfoBlock label="Patriotes actifs" value={c.membres.toLocaleString()} />
          <InfoBlock label="Contributions/mois" value={formatCFA(c.contributions)} />
          <InfoBlock label="Projets financés" value={c.projetsFinances.toString()} />
          <InfoBlock label="Contribution/an" value={formatCFA(c.contributions * 12)} />
        </div>
        <button onClick={() => alert(`Voir les projets à parrainer depuis ${c.ville}`)} style={{ width: "100%", padding: "12px 20px", borderRadius: 12, border: "none", background: "#D97706", color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: "inherit", cursor: "pointer" }}>
          🚀 Voir les projets de ma région →
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ONGLET TRANSPARENCE
   ═══════════════════════════════════════════════════════════════ */

function TransparenceTab({ projects }: { projects: Project[] }) {
  const funded = projects.filter((p) => p.status === "finance" || p.status === "termine");
  const totalCollecte = projects.reduce((s, p) => s + p.collecte, 0);
  const totalObjectif = projects.reduce((s, p) => s + p.objectif, 0);
  const totalDepense = funded.reduce((s, p) => s + p.collecte, 0);

  return (
    <div>
      <div style={{ background: COLORS.blanc, borderRadius: 16, border: `1px solid ${COLORS.ligne}`, padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "#999", marginBottom: 16 }}>📊 TABLEAU DE TRANSPARENCE — TOUS LES FLUX SONT PUBLICS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
          <BigStat label="Total collecté" value={formatCFA(totalCollecte)} color={COLORS.vert} icon="💰" />
          <BigStat label="Objectif global" value={formatCFA(totalObjectif)} color="#2563EB" icon="🎯" />
          <BigStat label="Projets financés" value={funded.length.toString()} color="#059669" icon="✅" />
          <BigStat label="Taux de réalisation" value={Math.round((totalCollecte / totalObjectif) * 100) + "%"} color="#D97706" icon="📈" />
        </div>
        <div style={{ padding: "14px 16px", borderRadius: 12, background: `${COLORS.vert}08`, border: `1px solid ${COLORS.vert}20`, fontSize: 13, color: "#444", lineHeight: 1.6 }}>
          💡 <strong>Engagement de transparence :</strong> Chaque franc collecté est traçable. Les factures, comptes-rendus et photos d'avancement sont publiés pour chaque projet financé. Conformément au mandat du Congrès de Diamniadio sur la lutte rigoureuse contre la corruption.
        </div>
      </div>

      {/* Liste des projets avec détail financier */}
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "#999", marginBottom: 12 }}>DÉTAIL PAR PROJET</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {projects.map((p) => {
          const sector = SECTOR_CONFIG[p.sector];
          const progress = pct(p.collecte, p.objectif);
          return (
            <div key={p.id} style={{ background: COLORS.blanc, borderRadius: 14, padding: "16px 20px", border: `1px solid ${COLORS.ligne}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>{sector.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.noir }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{p.region} · {p.porteur}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, background: `${STATUS_CONFIG[p.status].color}15`, color: STATUS_CONFIG[p.status].color, padding: "3px 10px", borderRadius: 6 }}>{STATUS_CONFIG[p.status].label}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 10 }}>
                <MiniStat label="Collecté" value={formatCFA(p.collecte)} color={COLORS.vert} />
                <MiniStat label="Objectif" value={formatCFA(p.objectif)} color="#2563EB" />
                <MiniStat label="Contributeurs" value={p.contributors.toString()} color="#D97706" />
                <MiniStat label="Mises à jour" value={p.updates.toString()} color="#666" />
              </div>
              <div style={{ height: 4, background: COLORS.ligne, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: progress === 100 ? "#059669" : COLORS.vert, borderRadius: 2 }} />
              </div>
              {/* Financeurs en ligne */}
              {p.funders.length > 0 && (
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  {p.funders.map((f, i) => (
                    <span key={i} style={{ fontSize: 10, fontWeight: 700, color: FUNDER_COLORS[f.type], background: `${FUNDER_COLORS[f.type]}12`, padding: "3px 10px", borderRadius: 6 }}>
                      {f.avatar} {f.nom} — {formatCFA(f.montant)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ONGLET MON IMPACT
   ═══════════════════════════════════════════════════════════════ */

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
          <BigStat label="Rang contributeur" value="#127" color="#D97706" icon="🏆" />
          <BigStat label="Impact direct" value="4 750 personnes" color="#059669" icon="👥" />
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "#999", marginBottom: 12 }}>HISTORIQUE DE MES CONTRIBUTIONS</div>
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

/* ═══════════════════════════════════════════════════════════════
   MICRO-COMPOSANTS
   ═══════════════════════════════════════════════════════════════ */

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

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 800, color }}>{value}</div>
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