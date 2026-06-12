import PresenceMap from "@/components/map/PresenceMap";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";

import { getUser } from "@/lib/auth";
import { COLORS } from "@/lib/constants/colors";
import { PILIERS } from "@/lib/data/piliers";

export const Route = createFileRoute("/dashboard/parti")({
  component: PartiPage,
});

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

type TabKey = "actualites" | "engagement" | "memoire" | "consultations";
type EventType = "reunion" | "webinaire" | "meeting" | "formation" | "commemoration";
type CotisationStatus = "payee" | "en_retard" | "a_venir";

interface Evenement {
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

interface Actualite {
  id: string;
  titre: string;
  extrait: string;
  source: string;
  date: string;
  important: boolean;
  categorie: "communique" | "decision" | "nomination" | "terrain" | "international";
  photo?: string;
}

interface Cotisation {
  mois: string;
  montant: number;
  status: CotisationStatus;
  datePaiement?: string;
  methode?: string;
}

interface Martyr {
  nom: string;
  date: string;
  lieu: string;
  description: string;
  avatar: string;
}

interface Consultation {
  id: string;
  titre: string;
  description: string;
  participants: number;
  fin: string;
  options: { label: string; votes: number }[];
  aVote: boolean;
}

interface CelluleInfo {
  region: string;
  cellules: number;
  membres: number;
  responsable: string;
}

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════ */

const pilier = PILIERS[3];

const EVENT_CONFIG: Record<EventType, { icon: string; color: string; label: string }> = {
  reunion:        { icon: "🏛️", color: COLORS.vert, label: "Réunion" },
  webinaire:      { icon: "💻", color: "#2563EB", label: "Webinaire" },
  meeting:        { icon: "📢", color: COLORS.rouge, label: "Meeting" },
  formation:      { icon: "🎓", color: "#7C3AED", label: "Formation" },
  commemoration:  { icon: "🕯️", color: "#6B7280", label: "Commémoration" },
};

const MOCK_EVENTS: Evenement[] = [
  { id: "ev1", date: "12 JUIN", heure: "18h00", titre: "Réunion de cellule — Dakar Plateau", lieu: "Maison du Parti, Dakar", type: "reunion", inscrits: 45, cellule: "Cellule Plateau", enligne: false },
  { id: "ev2", date: "14 JUIN", heure: "20h00", titre: "Webinaire Diaspora : Bilan 100 jours Congrès", lieu: "Zoom (lien envoyé par email)", type: "webinaire", inscrits: 312, enligne: true },
  { id: "ev3", date: "18 JUIN", heure: "10h00", titre: "Formation : Animation de cellule (module 3)", lieu: "Centre de formation, Thiès", type: "formation", inscrits: 28, enligne: false },
  { id: "ev4", date: "21 JUIN", heure: "15h00", titre: "Meeting populaire — Place de l'Indépendance", lieu: "Dakar, Place de l'Indépendance", type: "meeting", inscrits: 2400, enligne: false },
  { id: "ev5", date: "25 JUIN", heure: "09h00", titre: "Hommage aux Martyrs de la Lutte Démocratique", lieu: "Place de la Nation, Dakar", type: "commemoration", inscrits: 890, enligne: false },
  { id: "ev6", date: "28 JUIN", heure: "19h00", titre: "Réunion de cellule — Diaspora Paris", lieu: "Foyer sénégalais, 18e arrondissement", type: "reunion", inscrits: 67, cellule: "Cellule Paris Nord", enligne: false },
  { id: "ev7", date: "02 JUIL", heure: "14h00", titre: "Atelier : Rédiger un projet Co-Dev (Pilier 3)", lieu: "En ligne + présentiel Kaolack", type: "formation", inscrits: 156, enligne: true },
];

const MOCK_ACTUS: Actualite[] = [
  { id: "a1", titre: "Résolution générale du Premier Congrès adoptée à l'unanimité", extrait: "Le Premier Congrès ordinaire de PASTEF-LES PATRIOTES, tenu à Diamniadio le 6 juin 2026, a adopté à l'unanimité la Résolution générale fixant les sept directives stratégiques du parti.", source: "Direction Nationale", date: "6 juin 2026", important: true, categorie: "decision", photo: "/images/actus/congres.jpeg" },
  { id: "a2", titre: "La JPS mobilise la jeunesse pour la plateforme numérique", extrait: "La Jeunesse Patriotique du Sénégal (JPS) lance une campagne nationale d'inscription sur la plateforme numérique. Les jeunes cadres s'activent dans toutes les régions.", source: "JPS Nationale", date: "8 juin 2026", important: true, categorie: "communique", photo: "/images/actus/jeune.jpeg" },
  { id: "a3", titre: "Maïmouna Dièye à la rencontre des enfants de la pouponnière", extrait: "L'ancienne ministre de la Famille et de l'Action sociale Maïmouna Dièye s'est rendue à la pouponnière nationale pour soutenir les enfants et évaluer les conditions d'accueil.", source: "Coordination Sociale", date: "5 juin 2026", important: false, categorie: "terrain", photo: "/images/actus/enfants.jpeg" },
  { id: "a4", titre: "El Malick Ndiaye reçu par le marabout de Darou", extrait: "Le Secrétaire Général du PASTEF, El Malick Ndiaye, a été reçu par Borom Darou lors d'une visite de courtoisie marquée par des échanges sur la paix et le développement communautaire.", source: "Bureau National", date: "3 juin 2026", important: false, categorie: "nomination", photo: "/images/actus/elmalik.jpeg" },
  { id: "a5", titre: "Khady Diène Gaye au tournoi sportif national", extrait: "L'ancienne ministre de la Jeunesse et des Sports, Khady Diène Gaye, a présidé la cérémonie de remise des trophées lors du tournoi hippique de Thiès.", source: "Coordination Sportive", date: "1 juin 2026", important: false, categorie: "international", photo: "/images/actus/sport.jpeg" },
];

const MOCK_COTISATIONS: Cotisation[] = [
  { mois: "Juin 2026", montant: 2000, status: "a_venir" },
  { mois: "Mai 2026", montant: 2000, status: "payee", datePaiement: "3 mai 2026", methode: "Wave" },
  { mois: "Avril 2026", montant: 2000, status: "payee", datePaiement: "1 avril 2026", methode: "Orange Money" },
  { mois: "Mars 2026", montant: 2000, status: "payee", datePaiement: "5 mars 2026", methode: "Wave" },
  { mois: "Février 2026", montant: 2000, status: "payee", datePaiement: "2 février 2026", methode: "Wave" },
  { mois: "Janvier 2026", montant: 2000, status: "en_retard" },
];

const MOCK_MARTYRS: Martyr[] = [
  { nom: "Abdoulaye Diallo", date: "Mars 2021", lieu: "Dakar", description: "Tombé lors des manifestations pour la démocratie. Étudiant en droit à l'UCAD, militant actif de la cellule Université.", avatar: "AD" },
  { nom: "Mariama Sow", date: "Juin 2023", lieu: "Ziguinchor", description: "Victime de la répression lors des marches pacifiques. Enseignante et mère de 3 enfants, figure de la résistance en Casamance.", avatar: "MS" },
  { nom: "Ibrahima Ndiaye", date: "Février 2024", lieu: "Saint-Louis", description: "Disparu lors des arrestations massives. Commerçant au marché Sor, responsable de cellule depuis 2019.", avatar: "IN" },
];

/* ─── Livres de Ousmane Sonko (couvertures servies depuis /public) ─── */
interface Livre {
  titre: string;
  prix: string;
  cover: string;
}

const MOCK_LIVRES: Livre[] = [
  { titre: "Solutions",                          prix: "10 000 000 FCFA", cover: "/images/livres/solutions.png"   },
  { titre: "Pétrole et gaz au Sénégal",          prix: "10 000 000 FCFA", cover: "/images/livres/petrole.png"     },
  { titre: "Les territoires du développement",   prix: "10 000 000 FCFA", cover: "/images/livres/territoires.png" },
  { titre: "Le projet PASTEF",                   prix: "10 000 000 FCFA", cover: "/images/livres/projet.png"      },
  { titre: "Discours à la Nation (2021-2024)",   prix: "10 000 000 FCFA", cover: "/images/livres/discours.png"    },
  { titre: "L'économie souveraine",              prix: "10 000 000 FCFA", cover: "/images/livres/economie.png"    },
];

const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: "c1", titre: "Réforme du système éducatif : quelle priorité ?", description: "Le parti consulte les militants sur les axes prioritaires de la réforme éducative à proposer au gouvernement.", participants: 12450, fin: "Dans 4 jours", aVote: false,
    options: [
      { label: "Formation des enseignants et revalorisation salariale", votes: 4820 },
      { label: "Rénovation des infrastructures scolaires", votes: 3210 },
      { label: "Intégration des langues nationales dans le cursus", votes: 2890 },
      { label: "Programme numérique dans toutes les écoles", votes: 1530 },
    ],
  },
  {
    id: "c2", titre: "Stratégie diaspora 2027–2030", description: "Définir les priorités d'organisation de la diaspora pour les 3 prochaines années.", participants: 8732, fin: "Dans 11 jours", aVote: true,
    options: [
      { label: "Renforcement des cellules existantes", votes: 3200 },
      { label: "Ouverture de 15 nouveaux pays", votes: 2100 },
      { label: "Fonds d'investissement diaspora", votes: 2432 },
      { label: "Programme de retour et réinsertion", votes: 1000 },
    ],
  },
  {
    id: "c3", titre: "Position du parti sur la monnaie unique CEDEAO", description: "Faut-il soutenir le projet ECO ou défendre une monnaie nationale souveraine ?", participants: 15230, fin: "Dans 2 jours", aVote: false,
    options: [
      { label: "Soutenir l'ECO avec conditions", votes: 6120 },
      { label: "Monnaie nationale souveraine", votes: 7340 },
      { label: "Monnaie ouest-africaine alternative hors CEDEAO", votes: 1770 },
    ],
  },
];

const MOCK_CELLULES: CelluleInfo[] = [
  { region: "Dakar", cellules: 245, membres: 18420, responsable: "Abdou Sall" },
  { region: "Thiès", cellules: 128, membres: 9840, responsable: "Fatou Diop" },
  { region: "Ziguinchor", cellules: 86, membres: 6720, responsable: "Ousmane Diatta" },
  { region: "Saint-Louis", cellules: 74, membres: 5890, responsable: "Awa Ndiaye" },
  { region: "Kaolack", cellules: 65, membres: 4950, responsable: "Moussa Faye" },
  { region: "Diourbel", cellules: 52, membres: 3870, responsable: "Ibrahima Gueye" },
  { region: "Matam", cellules: 48, membres: 3210, responsable: "Amadou Bâ" },
  { region: "Kédougou", cellules: 32, membres: 2140, responsable: "Aïssatou Diallo" },
  { region: "Fatick", cellules: 41, membres: 2980, responsable: "Cheikh Sarr" },
  { region: "Kaffrine", cellules: 29, membres: 1870, responsable: "Mame Binta" },
  { region: "Louga", cellules: 38, membres: 2540, responsable: "Modou Fall" },
  { region: "Kolda", cellules: 44, membres: 3100, responsable: "Lamine Baldé" },
  { region: "Sédhiou", cellules: 27, membres: 1650, responsable: "Mariama Cissé" },
  { region: "Tambacounda", cellules: 35, membres: 2310, responsable: "Papa Demba" },
  { region: "Diaspora", cellules: 156, membres: 42800, responsable: "Coordination Internationale" },
];

const COTISATION_STATUS: Record<CotisationStatus, { label: string; color: string; icon: string }> = {
  payee:    { label: "Payée", color: "#059669", icon: "✅" },
  en_retard:{ label: "En retard", color: COLORS.rouge, icon: "⚠️" },
  a_venir:  { label: "À payer", color: "#D97706", icon: "🔔" },
};

const ACTU_COLORS: Record<string, { color: string; label: string }> = {
  communique:    { color: COLORS.vert, label: "Communiqué" },
  decision:      { color: "#2563EB", label: "Décision" },
  nomination:    { color: "#7C3AED", label: "Nomination" },
  terrain:       { color: "#D97706", label: "Terrain" },
  international: { color: "#0891B2", label: "International" },
};

/* ═══════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
   ═══════════════════════════════════════════════════════════════ */

function PartiPage() {
  const user = getUser();
  const [activeTab, setActiveTab] = useState<TabKey>("actualites");

  const totalPatriotes = MOCK_CELLULES.reduce((s, c) => s + c.membres, 0);
  const totalCellules = MOCK_CELLULES.reduce((s, c) => s + c.cellules, 0);
  const cotisationsPayees = MOCK_COTISATIONS.filter((c) => c.status === "payee").length;
  const totalCotise = MOCK_COTISATIONS.filter((c) => c.status === "payee").reduce((s, c) => s + c.montant, 0);

  return (
    <>
      <PilierHeader pilier={pilier} />

      {/* Stats globales */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <StatChip icon="🌍" value={totalPatriotes.toLocaleString()} label="Patriotes dans le monde" color={COLORS.vert} />
        <StatChip icon="🏛️" value={totalCellules.toString()} label="Cellules actives" color="#2563EB" />
        <StatChip icon="🏆" value={`#${user?.rang ?? 42}`} label="Mon rang national" color="#D97706" />
        <StatChip icon="📊" value={`${user?.engagement ?? 87}%`} label="Mon engagement" color={COLORS.rouge} />
      </div>
      {/* ← AJOUTE ICI ↓ */}
    <div style={{ marginBottom: 24, background: COLORS.blanc, borderRadius: 16, border: `1px solid ${COLORS.ligne}`, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "#999", marginBottom: 4 }}>CARTE INTERACTIVE</div>
          <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0, color: COLORS.noir }}>🌍 Présence des patriotes dans le monde</h3>
        </div>
      </div>
      <div style={{ padding: "12px 20px 16px" }}>
        <PresenceMap height={440} />
      </div>
    </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: COLORS.blanc, borderRadius: 14, border: `1px solid ${COLORS.ligne}`, overflow: "hidden", width: "fit-content", flexWrap: "wrap" }}>
        {([
          { key: "actualites" as TabKey, icon: "📰", label: "Actualités & Agenda" },
          { key: "engagement" as TabKey, icon: "📊", label: "Mon engagement" },
          { key: "memoire" as TabKey, icon: "🕯️", label: "Mémoire & Bibliothèque" },
          { key: "consultations" as TabKey, icon: "🗳️", label: "Consultations" },
        ]).map((t) => (
          <TabBtn key={t.key} active={activeTab === t.key} onClick={() => setActiveTab(t.key)} icon={t.icon} label={t.label} />
        ))}
      </div>

      {activeTab === "actualites" && <ActualitesTab />}
      {activeTab === "engagement" && <EngagementTab user={user} cotisationsPayees={cotisationsPayees} totalCotise={totalCotise} />}
      {activeTab === "memoire" && <MemoireTab />}
      {activeTab === "consultations" && <ConsultationsTab />}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ONGLET ACTUALITÉS & COMMUNICATIONS
   ═══════════════════════════════════════════════════════════════ */

function ActualitesTab() {
  return (
    <>
      <ActualitesPageHeader />
      <div
        className="actus-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 380px",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <FeaturedArticle article={MOCK_ACTUS[0]} />
          <div
            className="actus-secondary-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 16,
              marginTop: 20,
            }}
          >
            {MOCK_ACTUS.slice(1, 5).map((a, i) => (
              <ArticleCard key={a.id} article={a} index={i} />
            ))}
          </div>
        </div>
        <EventsPanel />
      </div>
      <style>{`
        @media (max-width: 1200px) {
          .actus-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .actus-secondary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 500px) {
          .actus-secondary-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 800px) {
          .featured-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

/* ─── En-tête de la page actualités ─── */
function ActualitesPageHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 24,
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: -1,
            margin: 0,
            color: COLORS.noir,
            lineHeight: 1.1,
          }}
        >
          Actualités & Communications
        </h1>
        <div
          style={{
            width: 60,
            height: 3,
            background: COLORS.vert,
            marginTop: 8,
            marginBottom: 10,
            borderRadius: 2,
          }}
        />
        <p style={{ fontSize: 14, color: "#666", margin: 0, maxWidth: 580 }}>
          Restez informé des dernières nouvelles et communications officielles du parti.
        </p>
      </div>
      <button
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 22px",
          background: COLORS.blanc,
          border: `1px solid ${COLORS.ligne}`,
          borderRadius: 12,
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: 13,
          fontWeight: 700,
          color: "#444",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = COLORS.vert;
          e.currentTarget.style.color = COLORS.vert;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = COLORS.ligne;
          e.currentTarget.style.color = "#444";
        }}
      >
        Voir toutes les actualités <ArrowRightSvg size={14} color="currentColor" />
      </button>
    </motion.div>
  );
}

/* ─── Article à la une (gros bloc image + texte) ─── */
function FeaturedArticle({ article }: { article: Actualite }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: COLORS.blanc,
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${COLORS.ligne}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div
        className="featured-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 1fr",
        }}
      >
        <ArticleImage categorie={article.categorie} large photo={article.photo} />
        <div
          style={{
            padding: "32px 32px 28px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 13px",
                background: COLORS.rouge,
                color: "#fff",
                borderRadius: 7,
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: 1.2,
              }}
            >
              <HomeIcon size={12} color="#fff" /> À LA UNE
            </span>
            <span
              style={{
                fontSize: 11,
                color: "#888",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              {article.date.toUpperCase()}
            </span>
          </div>
          <h2
            style={{
              fontSize: 27,
              fontWeight: 900,
              color: COLORS.noir,
              lineHeight: 1.18,
              margin: 0,
              marginBottom: 18,
              letterSpacing: -0.5,
            }}
          >
            {article.titre}
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#666",
              lineHeight: 1.65,
              margin: 0,
              marginBottom: 26,
              flex: 1,
            }}
          >
            {article.extrait}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#888",
                fontWeight: 600,
              }}
            >
              <ClockIcon size={13} color="#888" /> 3 min de lecture
            </span>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 22px",
                background: COLORS.vert,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: `0 3px 10px ${COLORS.vert}40`,
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = `0 5px 14px ${COLORS.vert}55`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = `0 3px 10px ${COLORS.vert}40`;
              }}
            >
              Lire l'article <ArrowRightSvg size={14} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Card d'article secondaire ─── */
function ArticleCard({ article, index }: { article: Actualite; index: number }) {
  const cat = ACTU_COLORS[article.categorie];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.05 }}
      whileHover={{ y: -3 }}
      style={{
        background: COLORS.blanc,
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid ${COLORS.ligne}`,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ArticleImage categorie={article.categorie} photo={article.photo} />
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: 0.8,
              background: `${cat.color}15`,
              color: cat.color,
              padding: "3px 9px",
              borderRadius: 5,
              textTransform: "uppercase",
            }}
          >
            {cat.label}
          </span>
          <span
            style={{
              fontSize: 10,
              color: "#999",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontWeight: 600,
            }}
          >
            <CalendarIcon size={10} color="#999" /> {article.date}
          </span>
        </div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: COLORS.noir,
            lineHeight: 1.3,
            margin: "0 0 8px",
          }}
        >
          {article.titre}
        </h3>
        <p
          style={{
            fontSize: 11.5,
            color: "#777",
            lineHeight: 1.55,
            margin: 0,
            marginBottom: 14,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.extrait}
        </p>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11,
            fontWeight: 800,
            color: COLORS.vert,
          }}
        >
          Lire la suite <ArrowRightSvg size={12} color={COLORS.vert} />
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Image / illustration procédurale par catégorie ───
   À remplacer par <img src=...> quand de vraies photos seront dispos.
   Chaque catégorie a son propre fond + motif évocateur. */
// CHERCHE toute la fonction ArticleImage et REMPLACE PAR :
function ArticleImage({ categorie, large = false, photo }: { categorie: string; large?: boolean; photo?: string }) {
  const STYLES: Record<string, { from: string; to: string; pattern: ArticlePattern }> = {
    decision:      { from: "#0F4023", to: "#1B7F3E", pattern: "podium" },
    communique:    { from: "#0F1B3A", to: "#1e3a8a", pattern: "tech" },
    terrain:       { from: "#1B7F3E", to: "#0F4023", pattern: "crowd" },
    nomination:    { from: "#3a2a18", to: "#6b4422", pattern: "mic" },
    international: { from: "#075c75", to: "#0891B2", pattern: "flags" },
  };
  const s = STYLES[categorie] ?? { from: "#444", to: "#666", pattern: "default" as const };

  // Si une photo existe, on l'affiche avec un overlay dégradé
  if (photo) {
    return (
      <div
        style={{
          position: "relative",
          aspectRatio: large ? "auto" : "16 / 10",
          minHeight: large ? 360 : "auto",
          overflow: "hidden",
        }}
      >
        <img
          src={photo}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        {/* Overlay dégradé en bas pour lisibilité */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(transparent, rgba(0,0,0,0.3))",
          }}
        />
      </div>
    );
  }

  // Sinon fallback SVG
  return (
    <div
      style={{
        position: "relative",
        background: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)`,
        aspectRatio: large ? "auto" : "16 / 10",
        minHeight: large ? 360 : "auto",
        overflow: "hidden",
      }}
    >
      <ArticlePatternSvg type={s.pattern} />
    </div>
  );
}

type ArticlePattern = "podium" | "tech" | "crowd" | "mic" | "flags" | "default";

function ArticlePatternSvg({ type }: { type: ArticlePattern }) {
  switch (type) {
    case "podium":
      return (
        <svg viewBox="0 0 400 280" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="podium-vignette" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
            </linearGradient>
          </defs>
          <rect width="400" height="280" fill="url(#podium-vignette)" />
          {/* Banderole scène */}
          <rect x="50" y="40" width="300" height="160" fill="rgba(255,255,255,0.96)" rx="3" />
          <text x="200" y="90" fontSize="22" fontWeight="900" fill={COLORS.vert} textAnchor="middle" letterSpacing="2.5">PREMIER CONGRÈS</text>
          <text x="200" y="116" fontSize="13" fontWeight="800" fill={COLORS.rouge} textAnchor="middle" letterSpacing="1.5">PASTEF — LES PATRIOTES</text>
          <line x1="125" y1="132" x2="275" y2="132" stroke={COLORS.vert} strokeWidth="0.8" />
          <text x="200" y="152" fontSize="9" fontWeight="700" fill="#666" textAnchor="middle" letterSpacing="3">UNITÉ · TRAVAIL · JUSTICE</text>
          {/* Logo central */}
          <circle cx="200" cy="178" r="10" fill={COLORS.vert} />
          <text x="200" y="182" fontSize="11" fontWeight="900" fill="#fff" textAnchor="middle">P</text>
          {/* Pupitre + délégués */}
          <rect x="70" y="220" width="50" height="50" fill="rgba(0,0,0,0.55)" rx="2" />
          <rect x="140" y="220" width="50" height="50" fill="rgba(0,0,0,0.55)" rx="2" />
          <rect x="210" y="220" width="50" height="50" fill="rgba(0,0,0,0.55)" rx="2" />
          <rect x="280" y="220" width="50" height="50" fill="rgba(0,0,0,0.55)" rx="2" />
          <circle cx="95" cy="213" r="10" fill="rgba(0,0,0,0.65)" />
          <circle cx="165" cy="213" r="10" fill="rgba(0,0,0,0.65)" />
          <circle cx="235" cy="213" r="10" fill="rgba(0,0,0,0.65)" />
          <circle cx="305" cy="213" r="10" fill="rgba(0,0,0,0.65)" />
          {/* Drapeau Sénégal sur la gauche */}
          <g transform="translate(20, 60)">
            <rect x="0" y="0" width="1.5" height="160" fill="#8B6F4E" />
            <rect x="2" y="0" width="20" height="60" fill="#1B7F3E" />
            <rect x="2" y="20" width="20" height="20" fill="#FCD34D" />
            <rect x="2" y="40" width="20" height="20" fill="#C61C3E" />
            <polygon points="12,15 13.5,19 17.5,19 14,21.5 15.5,25.5 12,23 8.5,25.5 10,21.5 6.5,19 10.5,19" fill="#1B7F3E" />
          </g>
        </svg>
      );
    case "tech":
      return (
        <svg viewBox="0 0 400 250" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
          {/* Grille de fond */}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="250" stroke="rgba(56,189,248,0.06)" strokeWidth="1" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke="rgba(56,189,248,0.06)" strokeWidth="1" />
          ))}
          {/* Silhouette Afrique en lignes */}
          <g transform="translate(200, 125) scale(1.8)" fill="none" stroke="rgba(56,189,248,0.7)" strokeWidth="1.2">
            <path d="M -22 -38 Q -10 -45 4 -45 Q 16 -42 22 -32 Q 30 -20 32 -5 Q 33 12 28 25 Q 22 38 10 44 Q -2 46 -10 40 Q -22 30 -28 16 Q -32 -2 -30 -16 Q -28 -28 -22 -38 Z" />
          </g>
          {/* Nodes connectés */}
          <g fill="#38BDF8">
            <circle cx="190" cy="100" r="2.5" />
            <circle cx="220" cy="115" r="2.5" />
            <circle cx="215" cy="145" r="2.5" />
            <circle cx="180" cy="160" r="2.5" />
            <circle cx="155" cy="130" r="2.5" />
            <circle cx="245" cy="100" r="3" />
            <circle cx="170" cy="105" r="2" />
            <circle cx="200" cy="150" r="2" />
          </g>
          {/* Lignes de connexion */}
          <g stroke="rgba(56,189,248,0.4)" strokeWidth="0.6" fill="none">
            <line x1="190" y1="100" x2="220" y2="115" />
            <line x1="220" y1="115" x2="215" y2="145" />
            <line x1="215" y1="145" x2="180" y2="160" />
            <line x1="180" y1="160" x2="155" y2="130" />
            <line x1="155" y1="130" x2="170" y2="105" />
            <line x1="170" y1="105" x2="190" y2="100" />
          </g>
          {/* Halo */}
          <defs>
            <radialGradient id="tech-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(56,189,248,0.15)" />
              <stop offset="100%" stopColor="rgba(56,189,248,0)" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="125" r="100" fill="url(#tech-glow)" />
        </svg>
      );
    case "crowd":
      return (
        <svg viewBox="0 0 400 250" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
          {/* Plusieurs rangées de manifestants */}
          {[
            { y: 240, scale: 1.0, opacity: 0.85 },
            { y: 215, scale: 0.85, opacity: 0.65 },
            { y: 195, scale: 0.7, opacity: 0.45 },
          ].map((row, ri) => (
            <g key={ri} opacity={row.opacity}>
              {Array.from({ length: 14 }).map((_, i) => {
                const x = 10 + i * 30 + (ri % 2 ? 15 : 0);
                const s = row.scale;
                return (
                  <g key={i} transform={`translate(${x}, ${row.y}) scale(${s})`}>
                    {/* Tête */}
                    <circle cx="0" cy="-30" r="7" fill="rgba(0,0,0,0.55)" />
                    {/* T-shirt PASTEF */}
                    <path d="M -12 -22 L 12 -22 L 14 -5 L 12 30 L -12 30 L -14 -5 Z" fill="rgba(255,255,255,0.95)" />
                    <text x="0" y="0" fontSize="3.5" fontWeight="900" fill={COLORS.vert} textAnchor="middle">PASTEF</text>
                    <line x1="-9" y1="3" x2="9" y2="3" stroke={COLORS.rouge} strokeWidth="0.5" />
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      );
    case "mic":
      return (
        <svg viewBox="0 0 400 250" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="mic-spot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
            </linearGradient>
          </defs>
          <rect width="400" height="250" fill="url(#mic-spot)" />
          {/* Bureau brillant en bas */}
          <rect x="0" y="180" width="400" height="70" fill="rgba(0,0,0,0.25)" />
          <line x1="0" y1="180" x2="400" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Micro */}
          <g transform="translate(200, 100)">
            {/* Tête du micro */}
            <rect x="-18" y="-30" width="36" height="65" rx="18" fill="rgba(15,15,15,0.95)" />
            {/* Grille */}
            <g stroke="rgba(60,60,60,0.7)" strokeWidth="0.5" fill="none">
              <line x1="-15" y1="-25" x2="15" y2="-25" />
              <line x1="-15" y1="-15" x2="15" y2="-15" />
              <line x1="-15" y1="-5"  x2="15" y2="-5" />
              <line x1="-15" y1="5"   x2="15" y2="5" />
              <line x1="-15" y1="15"  x2="15" y2="15" />
              <line x1="-15" y1="25"  x2="15" y2="25" />
            </g>
            {/* Reflet */}
            <ellipse cx="-7" cy="-10" rx="4" ry="22" fill="rgba(255,255,255,0.15)" />
            {/* Manche */}
            <rect x="-2" y="35" width="4" height="50" fill="rgba(15,15,15,0.95)" />
            {/* Base */}
            <ellipse cx="0" cy="85" rx="24" ry="5" fill="rgba(15,15,15,0.95)" />
          </g>
        </svg>
      );
    case "flags":
      return (
        <svg viewBox="0 0 400 250" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
          {/* Bureau */}
          <rect x="0" y="200" width="400" height="50" fill="rgba(0,0,0,0.25)" />
          {/* Rangée de drapeaux */}
          {[
            { c: ["#1B7F3E", "#FCD34D", "#C61C3E"], dir: "h" },
            { c: ["#078930", "#FCDD09", "#DA121A"], dir: "h" },
            { c: ["#CE1126", "#FCD116", "#078930"], dir: "v" },
            { c: ["#009A44", "#FFFFFF", "#000000"], dir: "h" },
            { c: ["#FF0000", "#FFFFFF", "#009A49"], dir: "v" },
            { c: ["#000000", "#FFFFFF", "#078930"], dir: "h" },
          ].map((flag, i) => (
            <g key={i} transform={`translate(${30 + i * 60}, 70)`}>
              <rect x="0" y="0" width="2" height="135" fill="#A8956E" />
              <g>
                {flag.dir === "h"
                  ? flag.c.map((c, j) => (
                      <rect key={j} x="3" y={j * 16} width="50" height="16" fill={c} opacity="0.95" />
                    ))
                  : flag.c.map((c, j) => (
                      <rect key={j} x={3 + j * 17} y="0" width="17" height="48" fill={c} opacity="0.95" />
                    ))}
              </g>
              {/* Pointe lance */}
              <circle cx="1" cy="-2" r="3" fill="#D4A24C" />
            </g>
          ))}
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Panneau Prochains événements (vert sombre) ─── */
function EventsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        background: "linear-gradient(180deg, #0F4023 0%, #082B17 100%)",
        borderRadius: 20,
        padding: "26px 22px 20px",
        color: "#fff",
        boxShadow: "0 8px 24px rgba(8,43,23,0.22)",
      }}
    >
      <div style={{ marginBottom: 22, paddingLeft: 4 }}>
        <h2
          style={{
            fontSize: 19,
            fontWeight: 900,
            color: "#fff",
            margin: 0,
            letterSpacing: -0.3,
          }}
        >
          Prochains événements
        </h2>
        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.65)",
            margin: "5px 0 0",
            fontWeight: 500,
          }}
        >
          L'agenda des activités et rencontres du parti.
        </p>
      </div>

      {/* Timeline */}
      <div style={{ position: "relative", paddingLeft: 24 }}>
        <div
          style={{
            position: "absolute",
            left: 5,
            top: 28,
            bottom: 28,
            width: 1,
            background: "rgba(255,255,255,0.18)",
          }}
        />
        {MOCK_EVENTS.slice(0, 6).map((e, i) => (
          <EventTimelineItem key={e.id} event={e} index={i} />
        ))}
      </div>

      <button
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          width: "100%",
          padding: "14px 18px",
          marginTop: 12,
          background: COLORS.vert,
          color: "#fff",
          border: "none",
          borderRadius: 14,
          fontSize: 13,
          fontWeight: 800,
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: "0 4px 14px rgba(27,127,62,0.35)",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 6px 18px rgba(27,127,62,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "0 4px 14px rgba(27,127,62,0.35)";
        }}
      >
        Voir l'agenda complet <CalendarIcon size={14} color="#fff" />
      </button>
    </motion.div>
  );
}

function EventTimelineItem({ event, index }: { event: Evenement; index: number }) {
  const cfg = EVENT_CONFIG[event.type];
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      style={{ position: "relative", marginBottom: 12 }}
    >
      {/* Puce timeline */}
      <div
        style={{
          position: "absolute",
          left: -23,
          top: 26,
          width: 11,
          height: 11,
          borderRadius: "50%",
          background: cfg.color,
          boxShadow: "0 0 0 3px #082B17",
          zIndex: 2,
        }}
      />

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "12px 14px",
          color: COLORS.noir,
          display: "flex",
          gap: 11,
          alignItems: "center",
          cursor: "pointer",
          transition: "transform 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateX(2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none";
        }}
      >
        {/* Bloc date */}
        <div
          style={{
            flexShrink: 0,
            width: 44,
            textAlign: "center",
            padding: "8px 0",
            borderRadius: 8,
            background: COLORS.creme,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 900, color: cfg.color, lineHeight: 1 }}>
            {event.date.split(" ")[0]}
          </div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: cfg.color,
              letterSpacing: 1,
              marginTop: 3,
            }}
          >
            {event.date.split(" ")[1]}
          </div>
        </div>

        {/* Infos */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 5, marginBottom: 5, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: 0.6,
                background: `${cfg.color}15`,
                color: cfg.color,
                padding: "2px 7px",
                borderRadius: 4,
                textTransform: "uppercase",
              }}
            >
              {cfg.label}
            </span>
            {event.enligne && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 900,
                  letterSpacing: 0.6,
                  background: "#2563EB15",
                  color: "#2563EB",
                  padding: "2px 7px",
                  borderRadius: 4,
                  textTransform: "uppercase",
                }}
              >
                En ligne
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: COLORS.noir,
              lineHeight: 1.3,
              marginBottom: 4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {event.titre}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#888",
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 3,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, minWidth: 0 }}>
              <PinIcon size={10} color="#888" />
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 110,
                }}
              >
                {event.lieu}
              </span>
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              <ClockIcon size={10} color="#888" /> {event.heure}
            </span>
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#aaa",
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <UsersIcon size={10} color="#aaa" /> {event.inscrits} inscrits
          </div>
        </div>

        <ChevronRightSvg size={14} color="#ccc" />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ONGLET MON ENGAGEMENT
   ═══════════════════════════════════════════════════════════════ */

function EngagementTab({ user, cotisationsPayees, totalCotise }: { user: ReturnType<typeof getUser>; cotisationsPayees: number; totalCotise: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
      {/* Colonne gauche */}
      <div>
        {/* Carte profil engagement */}
        <div style={{ background: COLORS.blanc, borderRadius: 16, border: `1px solid ${COLORS.ligne}`, padding: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.vert}, ${COLORS.rouge})`, color: "#fff", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 20 }}>{user?.avatar ?? "P"}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.noir }}>{user?.nom ?? "Patriote"}</div>
              <div style={{ fontSize: 13, color: "#888" }}>{user?.fonction ?? "Militant"}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.vert, marginTop: 2 }}>🏆 Rang national : #{user?.rang ?? 42}</div>
            </div>
          </div>

          {/* Score d'engagement */}
          <div style={{ padding: "16px 18px", borderRadius: 14, background: `${COLORS.vert}08`, border: `1px solid ${COLORS.vert}20`, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#555" }}>Score d'engagement</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: COLORS.vert }}>{user?.engagement ?? 87}%</span>
            </div>
            <div style={{ height: 8, background: COLORS.ligne, borderRadius: 4, overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${user?.engagement ?? 87}%` }} transition={{ duration: 1 }} style={{ height: "100%", background: COLORS.vert, borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>Basé sur : cotisations, présence aux réunions, formations, contributions Co-Dev</div>
          </div>

          {/* Points */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <MiniStat label="Points patriote" value={(user?.points ?? 8540).toLocaleString()} color={COLORS.vert} icon="⭐" />
            <MiniStat label="Cotisations payées" value={`${cotisationsPayees}/6`} color="#2563EB" icon="💳" />
            <MiniStat label="Total cotisé" value={`${(totalCotise / 1000).toFixed(0)}K`} color="#D97706" icon="💰" />
          </div>
        </div>

        {/* Suivi des cotisations */}
        <SectionHeader icon="💳" title="Suivi des cotisations" subtitle="Historique mensuel — 2 000 FCFA/mois" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {MOCK_COTISATIONS.map((c, i) => {
            const st = COTISATION_STATUS[c.status];
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: COLORS.blanc, borderRadius: 12, border: `1px solid ${COLORS.ligne}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${st.color}12`, display: "grid", placeItems: "center", fontSize: 16, flexShrink: 0 }}>{st.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.noir }}>{c.mois}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>
                    {c.datePaiement ? `Payé le ${c.datePaiement} via ${c.methode}` : c.status === "en_retard" ? "Paiement en retard" : "Échéance à venir"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: st.color }}>{c.montant.toLocaleString()} FCFA</div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: st.color, background: `${st.color}12`, padding: "2px 8px", borderRadius: 4 }}>{st.label}</span>
                </div>
                {c.status !== "payee" && (
                  <button onClick={() => alert(`Paiement de ${c.montant} FCFA pour ${c.mois} — Orange Money / Wave`)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: COLORS.vert, color: "#fff", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                    Payer
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Colonne droite — Cellules */}
      <div>
        <SectionHeader icon="🏛️" title={`Cellules du parti (${MOCK_CELLULES.reduce((s, c) => s + c.cellules, 0)})`} subtitle="Présence par région" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {MOCK_CELLULES.sort((a, b) => b.membres - a.membres).map((c, i) => {
            const isDiaspora = c.region === "Diaspora";
            const maxMembres = MOCK_CELLULES[0].membres;
            const barWidth = (c.membres / maxMembres) * 100;
            return (
              <div key={c.region} style={{ background: COLORS.blanc, borderRadius: 12, padding: "12px 16px", border: `1px solid ${COLORS.ligne}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "#999", width: 20 }}>#{i + 1}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: isDiaspora ? "#D97706" : COLORS.noir }}>{isDiaspora ? "🌍 " : ""}{c.region}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 14, fontWeight: 900, color: COLORS.vert }}>{c.cellules}</span>
                    <span style={{ fontSize: 11, color: "#999", marginLeft: 4 }}>cellules</span>
                  </div>
                </div>
                <div style={{ height: 4, background: COLORS.ligne, borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
                  <div style={{ height: "100%", width: `${barWidth}%`, background: isDiaspora ? "#D97706" : COLORS.vert, borderRadius: 2, transition: "width 0.6s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#999" }}>
                  <span>👥 {c.membres.toLocaleString()} membres</span>
                  <span>Resp. : {c.responsable}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Classement engagement */}
        <div style={{ marginTop: 20, background: COLORS.blanc, borderRadius: 16, border: `1px solid ${COLORS.ligne}`, padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "#999", marginBottom: 14 }}>🏆 TOP 5 PATRIOTES — CLASSEMENT NATIONAL</div>
          {[
            { rang: 1, nom: "Fatou Sow", points: 15420, region: "Thiès" },
            { rang: 2, nom: "Ousmane Ndiaye", points: 14890, region: "Dakar" },
            { rang: 3, nom: "Awa Diallo", points: 13750, region: "Diaspora Paris" },
            { rang: 4, nom: "Moussa Faye", points: 12980, region: "Kaolack" },
            { rang: 5, nom: "Ibrahima Gueye", points: 12340, region: "Saint-Louis" },
          ].map((p) => (
            <div key={p.rang} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${COLORS.ligne}` }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: p.rang <= 3 ? `linear-gradient(135deg, #D97706, #E8B847)` : COLORS.ligne, color: p.rang <= 3 ? "#fff" : "#999", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 12 }}>{p.rang}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.noir }}>{p.nom}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{p.region}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.vert }}>⭐ {p.points.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ONGLET MÉMOIRE & BIBLIOTHÈQUE
   ═══════════════════════════════════════════════════════════════ */

function MemoireTab() {
  return (
    <div
      className="memoire-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.55fr)",
        gap: 24,
        alignItems: "start",
      }}
    >
      <MartyrsPanel />
      <BibliothequePanel />

      <style>{`
        @media (max-width: 1180px) {
          .memoire-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 700px) {
          .livres-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── PANNEAU MARTYRS ─── */
function MartyrsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: COLORS.blanc,
        borderRadius: 20,
        border: `1px solid ${COLORS.ligne}`,
        padding: 24,
      }}
    >
      <MemoireSectionHeader
        icon={<CandleIcon size={20} color={COLORS.vert} />}
        title="MÉMOIRE DES MARTYRS"
        subtitle="Hommage aux héros de la lutte démocratique 2021–2024"
      />

      <SolemnCard />

      <div>
        {MOCK_MARTYRS.map((m, i) => (
          <MartyrRow key={m.nom} martyr={m} isLast={i === MOCK_MARTYRS.length - 1} />
        ))}
      </div>

      <CommemorationBanner />
    </motion.div>
  );
}

function SolemnCard() {
  return (
    <div
      style={{
        position: "relative",
        background: "#000",
        borderRadius: 16,
        marginBottom: 22,
        overflow: "hidden",
        minHeight: 230,
        boxShadow: "0 8px 24px rgba(0,0,0,0.28)",
      }}
    >
      {/* Image de deuil — cœur drapeau du Sénégal */}
      <img
        src="/images/deuil.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          width: "auto",
          maxWidth: "55%",
          objectFit: "cover",
          objectPosition: "center",
          pointerEvents: "none",
        }}
      />

      {/* Voile à gauche pour lisibilité du texte */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, #000 0%, #000 32%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0) 78%)",
          pointerEvents: "none",
        }}
      />

      {/* Texte */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "36px 32px",
          maxWidth: "60%",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3,
            color: "rgba(255,255,255,0.7)",
            marginBottom: 16,
          }}
        >
          EN MÉMOIRE
        </div>
        <div
          style={{
            fontSize: 23,
            fontWeight: 400,
            lineHeight: 1.3,
            color: "#fff",
            marginBottom: 18,
            fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontStyle: "italic",
            letterSpacing: 0.2,
            textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          }}
        >
          « Ceux qui sont morts
          <br />
          ne sont jamais partis »
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.75)",
            letterSpacing: 1,
          }}
        >
          — Birago Diop —
        </div>
      </div>
    </div>
  );
}

function MartyrRow({ martyr, isLast }: { martyr: Martyr; isLast: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        padding: "16px 0",
        borderBottom: !isLast ? `1px solid ${COLORS.ligne}` : "none",
      }}
    >
      {/* Avatar grand cercle vert */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: `linear-gradient(135deg, #0F4023, ${COLORS.vert})`,
          color: "#fff",
          display: "grid",
          placeItems: "center",
          fontWeight: 800,
          fontSize: 13,
          flexShrink: 0,
          letterSpacing: 1,
        }}
      >
        {martyr.avatar}
      </div>

      {/* Infos */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: COLORS.noir,
            marginBottom: 6,
          }}
        >
          {martyr.nom}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              color: COLORS.rouge,
              fontWeight: 700,
              background: `${COLORS.rouge}10`,
              padding: "3px 9px",
              borderRadius: 6,
            }}
          >
            <CalendarIcon size={11} color={COLORS.rouge} /> {martyr.date}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: "#666",
              fontWeight: 600,
            }}
          >
            <PinIcon size={11} color="#888" /> {martyr.lieu}
          </span>
        </div>
        <p style={{ fontSize: 12, color: "#666", margin: 0, lineHeight: 1.55 }}>
          {martyr.description}
        </p>
      </div>

      {/* Mini bougie */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "#FFF6E5",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          alignSelf: "flex-start",
        }}
      >
        <CandleIcon size={16} color="#D97706" />
      </div>
    </div>
  );
}

function CommemorationBanner() {
  return (
    <div
      style={{
        marginTop: 18,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 18px",
        borderRadius: 14,
        background: `${COLORS.vert}08`,
        border: `1px solid ${COLORS.vert}15`,
        cursor: "pointer",
        transition: "background 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${COLORS.vert}12`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = `${COLORS.vert}08`;
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: COLORS.blanc,
          border: `1px solid ${COLORS.vert}20`,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <CalendarIcon size={20} color={COLORS.rouge} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#888",
            letterSpacing: 1.5,
            marginBottom: 3,
          }}
        >
          PROCHAINE COMMÉMORATION
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: COLORS.noir,
            marginBottom: 2,
          }}
        >
          25 juin 2026 — Journée nationale des Martyrs
        </div>
        <div style={{ fontSize: 11, color: "#888" }}>Place de la Nation</div>
      </div>
      <ChevronRightSvg color="#888" size={18} />
    </div>
  );
}

/* ─── PANNEAU BIBLIOTHÈQUE ─── */
function BibliothequePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      style={{
        background: COLORS.blanc,
        borderRadius: 20,
        border: `1px solid ${COLORS.ligne}`,
        padding: 24,
      }}
    >
      <MemoireSectionHeader
        icon={<BookIcon size={20} color={COLORS.vert} />}
        title="BIBLIOTHÈQUE NUMÉRIQUE"
        subtitle="Centre de recherche et production de pensée"
      />

      {/* Livres de Sonko */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              width: 32,
              height: 2,
              background: COLORS.vert,
              marginBottom: 8,
              borderRadius: 1,
            }}
          />
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: COLORS.noir,
              letterSpacing: 1.2,
            }}
          >
            LIVRES DE OUSMANE SONKO
          </div>
        </div>
        <div
          className="livres-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 16,
          }}
        >
          {MOCK_LIVRES.map((livre, i) => (
            <BookItem key={livre.titre} livre={livre} index={i} />
          ))}
        </div>
      </div>

      {/* Derniers documents */}
      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: COLORS.noir,
            letterSpacing: 1.2,
            marginBottom: 12,
          }}
        >
          DERNIERS DOCUMENTS AJOUTÉS
        </div>
        <div>
          {DOCUMENTS.map((doc, i, arr) => (
            <DocumentRow key={doc.titre} doc={doc} isLast={i === arr.length - 1} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const DOCUMENTS: Array<{
  titre: string;
  type: string;
  pages: number;
  date: string;
  color: string;
  icon: DocIconType;
}> = [
  { titre: "Résolution générale du Premier Congrès",                     type: "PDF", pages: 20,  date: "Juin 2026",  color: "#F59E0B", icon: "doc" },
  { titre: "Projet de Société PASTEF — Version intégrale",               type: "PDF", pages: 145, date: "2024",       color: "#2563EB", icon: "book" },
  { titre: "Rapport d'audit du Fonds Co-Développement Q1 2026",          type: "PDF", pages: 32,  date: "Avril 2026", color: "#10B981", icon: "chart" },
  { titre: "Note d'analyse : Renégociation des contrats pétroliers",     type: "PDF", pages: 18,  date: "Mai 2026",   color: "#EF4444", icon: "alert" },
  { titre: "Guide du responsable de cellule (2e édition)",               type: "PDF", pages: 56,  date: "Mars 2026",  color: "#8B5CF6", icon: "guide" },
  { titre: "Étude : Impact économique de la diaspora sénégalaise",       type: "PDF", pages: 74,  date: "2025",       color: "#059669", icon: "search" },
];

function BookItem({ livre, index }: { livre: Livre; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.05 }}
      whileHover={{ y: -4 }}
      style={{ cursor: "pointer" }}
    >
      <div
        style={{
          aspectRatio: "3 / 4.4",
          borderRadius: 6,
          marginBottom: 12,
          overflow: "hidden",
          boxShadow:
            "0 4px 14px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <BookCover src={livre.cover} alt={livre.titre} />
      </div>
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 700,
          color: COLORS.noir,
          lineHeight: 1.3,
          marginBottom: 8,
          minHeight: 32,
        }}
      >
        {livre.titre}
      </div>
      <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.vert }}>
        {livre.prix}
      </div>
    </motion.div>
  );
}

type DocIconType = "doc" | "book" | "chart" | "alert" | "guide" | "search";

function DocumentRow({
  doc,
  isLast,
}: {
  doc: (typeof DOCUMENTS)[number];
  isLast: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 4px",
        borderBottom: !isLast ? `1px solid ${COLORS.ligne}` : "none",
        cursor: "pointer",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = COLORS.creme;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: `${doc.color}14`,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <DocTypeIcon type={doc.icon} color={doc.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: COLORS.noir,
            lineHeight: 1.3,
            marginBottom: 4,
          }}
        >
          {doc.titre}
        </div>
        <div style={{ fontSize: 11, color: "#888", fontWeight: 500 }}>
          {doc.type} · {doc.pages} pages · {doc.date}
        </div>
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 12,
          fontWeight: 700,
          color: COLORS.vert,
          flexShrink: 0,
        }}
      >
        Lire <ArrowRightSvg size={13} color={COLORS.vert} />
      </div>
    </div>
  );
}

/* ─── HEADER COMMUN aux 2 panneaux ─── */
function MemoireSectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 22,
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `${COLORS.vert}12`,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 900,
              margin: 0,
              letterSpacing: 1.4,
              color: COLORS.noir,
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: 12, color: "#888", margin: "3px 0 0", fontWeight: 500 }}>
            {subtitle}
          </p>
        </div>
      </div>
      <VoirToutBtn />
    </div>
  );
}

function VoirToutBtn() {
  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 16px",
        background: COLORS.blanc,
        border: `1px solid ${COLORS.ligne}`,
        borderRadius: 10,
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 12,
        fontWeight: 700,
        color: "#555",
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = COLORS.vert;
        e.currentTarget.style.color = COLORS.vert;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.ligne;
        e.currentTarget.style.color = "#555";
      }}
    >
      Voir tout <ArrowRightSvg size={12} color="currentColor" />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COUVERTURE LIVRE — Affiche l'image fournie via /public/images/livres/
   ═══════════════════════════════════════════════════════════════ */
function BookCover({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}


/* ═══════════════════════════════════════════════════════════════
   ICÔNES SVG INLINE (pas de dépendance externe)
   ═══════════════════════════════════════════════════════════════ */

function CandleIcon({ size = 16, color = "#1B7F3E" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Flamme */}
      <path d="M12 2 C 10.5 4 9.5 5.5 9.5 7 C 9.5 8.4 10.6 9.5 12 9.5 C 13.4 9.5 14.5 8.4 14.5 7 C 14.5 5.5 13.5 4 12 2 Z" fill="#F59E0B" />
      <ellipse cx="12" cy="7" rx="1.3" ry="2" fill="#FCD34D" />
      {/* Bougie */}
      <rect x="9" y="10" width="6" height="11" rx="0.5" fill={color} />
      <ellipse cx="12" cy="10" rx="3" ry="0.8" fill={color} opacity="0.7" />
      {/* Mèche */}
      <line x1="12" y1="9.5" x2="12" y2="10.5" stroke="#000" strokeWidth="0.8" />
    </svg>
  );
}

function CalendarIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function PinIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BookIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4 C 4 3 5 2.5 6 2.5 L 11 2.5 L 11 21 L 6 21 C 5 21 4 20.5 4 19.5 Z" />
      <path d="M20 4 C 20 3 19 2.5 18 2.5 L 13 2.5 L 13 21 L 18 21 C 19 21 20 20.5 20 19.5 Z" />
      <rect x="11" y="2.5" width="2" height="18.5" fill="#fff" opacity="0.5" />
    </svg>
  );
}

function ChevronRightSvg({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ArrowRightSvg({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function ClockIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function UsersIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function HomeIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function DocTypeIcon({ type, color }: { type: DocIconType; color: string }) {
  const props = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2.2" as const, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "doc":
      return (
        <svg {...props}>
          <path d="M14 2 H 6 a 2 2 0 0 0 -2 2 v 16 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 V 8 z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="13" y2="17" />
        </svg>
      );
    case "book":
      return (
        <svg {...props}>
          <path d="M4 19.5 A 2.5 2.5 0 0 1 6.5 17 H 20 V 4 H 6.5 A 2.5 2.5 0 0 0 4 6.5 Z" />
        </svg>
      );
    case "chart":
      return (
        <svg {...props}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
          <line x1="3" y1="20" x2="21" y2="20" />
        </svg>
      );
    case "alert":
      return (
        <svg {...props}>
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "guide":
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <line x1="8" y1="8" x2="16" y2="8" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="8" y1="16" x2="13" y2="16" />
        </svg>
      );
    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
  }
}

/* ═══════════════════════════════════════════════════════════════
   ONGLET CONSULTATIONS CITOYENNES
   ═══════════════════════════════════════════════════════════════ */

function ConsultationsTab() {
  const [voted, setVoted] = useState<Record<string, number>>({});

  return (
    <div>
      <SectionHeader icon="🗳️" title="Consultations citoyennes" subtitle="Participe aux décisions stratégiques du parti — ton vote compte" />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {MOCK_CONSULTATIONS.map((c) => {
          const totalVotes = c.options.reduce((s, o) => s + o.votes, 0);
          const hasVoted = c.aVote || voted[c.id] !== undefined;
          const myVote = voted[c.id];

          return (
            <div key={c.id} style={{ background: COLORS.blanc, borderRadius: 16, border: `1px solid ${COLORS.ligne}`, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 4px", color: COLORS.noir }}>{c.titre}</h3>
                  <p style={{ fontSize: 13, color: "#888", margin: 0 }}>{c.description}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.rouge }}>⏱ {c.fin}</div>
                  <div style={{ fontSize: 11, color: "#999" }}>👥 {c.participants.toLocaleString()} votes</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {c.options.map((o, i) => {
                  const pctVal = totalVotes > 0 ? Math.round((o.votes / totalVotes) * 100) : 0;
                  const isMyVote = myVote === i;
                  const isWinning = pctVal === Math.max(...c.options.map((x) => Math.round((x.votes / totalVotes) * 100)));

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (!hasVoted) setVoted((prev) => ({ ...prev, [c.id]: i }));
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: `1px solid ${isMyVote ? COLORS.vert : COLORS.ligne}`,
                        background: isMyVote ? `${COLORS.vert}08` : COLORS.blanc,
                        cursor: hasVoted ? "default" : "pointer",
                        width: "100%",
                        fontFamily: "inherit",
                        textAlign: "left",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {/* Barre de résultat (visible après vote) */}
                      {hasVoted && (
                        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pctVal}%`, background: isWinning ? `${COLORS.vert}12` : `${COLORS.noir}05`, transition: "width 0.6s ease", zIndex: 0 }} />
                      )}
                      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12, width: "100%", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${isMyVote ? COLORS.vert : "#ddd"}`, background: isMyVote ? COLORS.vert : "transparent", display: "grid", placeItems: "center", fontSize: 10, color: "#fff", flexShrink: 0 }}>
                            {isMyVote ? "✓" : ""}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: isMyVote ? 800 : 600, color: COLORS.noir }}>{o.label}</span>
                        </div>
                        {hasVoted && (
                          <span style={{ fontSize: 13, fontWeight: 900, color: isWinning ? COLORS.vert : "#999" }}>{pctVal}%</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {hasVoted && (
                <div style={{ marginTop: 10, fontSize: 11, color: "#888", textAlign: "center" }}>
                  {c.aVote ? "Tu as déjà voté pour cette consultation." : "✅ Vote enregistré — merci pour ta participation !"}
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
   MICRO-COMPOSANTS
   ═══════════════════════════════════════════════════════════════ */

function PilierHeader({ pilier }: { pilier: (typeof PILIERS)[number] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24, padding: "20px 24px", borderRadius: 16, background: `linear-gradient(135deg, ${pilier.color}10, ${pilier.color}03)`, borderLeft: `4px solid ${pilier.color}` }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, color: pilier.color, marginBottom: 6 }}>{pilier.tag}</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, margin: 0, color: COLORS.noir }}>{pilier.title}</h1>
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

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.noir, display: "flex", alignItems: "center", gap: 8 }}>
        <span>{icon}</span>{title}
      </div>
      {subtitle && <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{subtitle}</div>}
    </div>
  );
}

function MiniStat({ label, value, color, icon }: { label: string; value: string; color: string; icon: string }) {
  return (
    <div style={{ padding: "12px 14px", borderRadius: 12, background: `${color}08`, border: `1px solid ${color}20`, textAlign: "center" }}>
      <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginTop: 2 }}>{label}</div>
    </div>
  );
}