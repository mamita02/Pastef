import PresenceMap from "@/components/map/PresenceMap";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";

import { getUser } from "@/lib/auth";
import { COLORS } from "@/lib/constants/colors";
import {
  EVENT_CONFIG,
  MOCK_EVENTS,
  type Evenement,
} from "@/lib/data/actualites";
import { PILIERS } from "@/lib/data/piliers";

export const Route = createFileRoute("/dashboard/parti")({
  component: PartiPage,
});

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

type TabKey = "agenda" | "engagement" | "memoire" | "consultations";
type CotisationStatus = "payee" | "en_retard" | "a_venir";

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

interface Livre {
  titre: string;
  prix: string;
  cover: string;
}

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════ */

const pilier = PILIERS[3];

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

// Conservé pour les stats globales (totalPatriotes, totalCellules)
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

/* ═══════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
   ═══════════════════════════════════════════════════════════════ */

function PartiPage() {
  const user = getUser();
  const [activeTab, setActiveTab] = useState<TabKey>("agenda");

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

      {/* Carte interactive */}
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
          { key: "agenda" as TabKey, icon: "📅", label: "Agenda" },
          { key: "engagement" as TabKey, icon: "📊", label: "Mon engagement" },
          { key: "memoire" as TabKey, icon: "🕯️", label: "Mémoire & Bibliothèque" },
          { key: "consultations" as TabKey, icon: "🗳️", label: "Consultations" },
        ]).map((t) => (
          <TabBtn key={t.key} active={activeTab === t.key} onClick={() => setActiveTab(t.key)} icon={t.icon} label={t.label} />
        ))}
      </div>

      {activeTab === "agenda" && <AgendaTab />}
      {activeTab === "engagement" && <EngagementTab user={user} cotisationsPayees={cotisationsPayees} totalCotise={totalCotise} />}
      {activeTab === "memoire" && <MemoireTab />}
      {activeTab === "consultations" && <ConsultationsTab />}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ONGLET AGENDA — Design magazine avec visuels par type
   ═══════════════════════════════════════════════════════════════ */

// Filtrage : on ne garde que reunions, meetings et commémorations
const AGENDA_EVENTS = MOCK_EVENTS.filter(
  (e) => e.type === "reunion" || e.type === "meeting" || e.type === "commemoration"
);

function AgendaTab() {
  return (
    <>
      {/* Header de l'onglet */}
      <div
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
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2.5, color: COLORS.vert, marginBottom: 6 }}>
            📅 AGENDA DU PARTI
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, margin: 0, color: COLORS.noir, letterSpacing: -0.6 }}>
            Prochains rendez-vous
          </h2>
          <div style={{ width: 50, height: 3, background: COLORS.vert, marginTop: 10, borderRadius: 2 }} />
          <p style={{ fontSize: 13, color: "#666", margin: "10px 0 0", maxWidth: 520 }}>
            Réunions de cellule, meetings populaires et commémorations — venez participer à la vie du parti.
          </p>
        </div>

        {/* Légende des types */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(["reunion", "meeting", "commemoration"] as const).map((t) => {
            const cfg = EVENT_CONFIG[t];
            return (
              <div
                key={t}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 11px",
                  borderRadius: 8,
                  background: COLORS.blanc,
                  border: `1px solid ${COLORS.ligne}`,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#555",
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color }} />
                {cfg.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grille de cards */}
      <div
        className="agenda-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 20,
        }}
      >
        {AGENDA_EVENTS.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
      </div>

      {AGENDA_EVENTS.length === 0 && (
        <div
          style={{
            padding: 60,
            background: COLORS.blanc,
            borderRadius: 16,
            border: `1px dashed ${COLORS.ligne}`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.noir }}>Aucun événement à venir</div>
          <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>De nouveaux rendez-vous seront bientôt annoncés.</p>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .agenda-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

function EventCard({ event, index }: { event: Evenement; index: number }) {
  const cfg = EVENT_CONFIG[event.type];

  const handleShare = async () => {
    const shareData = {
      title: event.titre,
      text: `${event.titre} — ${event.date} à ${event.heure}\n📍 ${event.lieu}`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert("✅ Lien copié dans le presse-papier !");
      }
    } catch {
      // utilisateur a annulé
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ y: -4 }}
      style={{
        background: COLORS.blanc,
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${COLORS.ligne}`,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.25s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
      }}
    >
      {/* HERO VISUEL */}
      <EventHero type={event.type} color={cfg.color} />

      {/* CONTENU */}
      <div style={{ padding: "22px 22px 18px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        {/* Date + heure */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "6px 12px",
              background: `${cfg.color}12`,
              border: `1px solid ${cfg.color}24`,
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 900,
              color: cfg.color,
              letterSpacing: 0.4,
            }}
          >
            <CalendarIcon size={13} color={cfg.color} /> {event.date}
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#888" }}>
            <ClockIcon size={12} color="#888" /> {event.heure}
          </span>
        </div>

        {/* Titre */}
        <h3
          style={{
            fontSize: 17,
            fontWeight: 900,
            color: COLORS.noir,
            lineHeight: 1.3,
            margin: 0,
            letterSpacing: -0.2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {event.titre}
        </h3>

        {/* Infos lieu / inscrits */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#666", paddingTop: 4 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: COLORS.creme, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <PinIcon size={13} color="#666" />
            </span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
              {event.lieu}
            </span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: COLORS.creme, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <UsersIcon size={13} color="#666" />
            </span>
            <span>
              <strong style={{ color: COLORS.noir, fontWeight: 800 }}>{event.inscrits.toLocaleString()}</strong>{" "}
              patriotes inscrits
            </span>
          </div>
        </div>

        {/* CTA Partager */}
        <button
          onClick={handleShare}
          style={{
            marginTop: "auto",
            padding: "12px 16px",
            background: "transparent",
            color: COLORS.noir,
            border: `1.5px solid ${COLORS.ligne}`,
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = cfg.color;
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = cfg.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = COLORS.noir;
            e.currentTarget.style.borderColor = COLORS.ligne;
          }}
        >
          <ShareIcon size={14} color="currentColor" /> Partager l'événement
        </button>
      </div>
    </motion.article>
  );
}

/* ─── Visuel hero de la card événement (selon type) ─── */
function EventHero({ type, color }: { type: Evenement["type"]; color: string }) {
  return (
    <div
      style={{
        position: "relative",
        height: 140,
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        overflow: "hidden",
      }}
    >
      {/* Badge type en haut à droite */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          padding: "6px 12px",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(4px)",
          borderRadius: 8,
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          color,
          zIndex: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        {EVENT_CONFIG[type].label}
      </div>

      {/* Illustration SVG selon type */}
      {type === "reunion" && <ReunionIllustration />}
      {type === "meeting" && <MeetingIllustration />}
      {type === "commemoration" && <CommemorationIllustration />}

      {/* Voile bas pour transition douce */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 30,
          background: "linear-gradient(transparent, rgba(0,0,0,0.15))",
        }}
      />
    </div>
  );
}

/* ─── Illustration : Réunion (table ronde + silhouettes) ─── */
function ReunionIllustration() {
  return (
    <svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <ellipse cx="200" cy="100" rx="120" ry="22" fill="rgba(0,0,0,0.18)" />
      <ellipse cx="200" cy="96" rx="120" ry="22" fill="rgba(255,255,255,0.92)" />
      <rect x="170" y="86" width="18" height="14" fill={COLORS.creme} rx="1" />
      <rect x="200" y="86" width="18" height="14" fill={COLORS.creme} rx="1" />
      <rect x="230" y="86" width="18" height="14" fill={COLORS.creme} rx="1" />
      {[
        { x: 90, y: 80 }, { x: 140, y: 70 }, { x: 200, y: 64 },
        { x: 260, y: 70 }, { x: 310, y: 80 },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="11" fill="rgba(255,255,255,0.95)" />
          <ellipse cx={p.x} cy={p.y + 18} rx="14" ry="10" fill="rgba(255,255,255,0.95)" />
        </g>
      ))}
      <circle cx="50" cy="40" r="2" fill="rgba(255,255,255,0.4)" />
      <circle cx="360" cy="35" r="3" fill="rgba(255,255,255,0.3)" />
      <circle cx="380" cy="60" r="2" fill="rgba(255,255,255,0.5)" />
    </svg>
  );
}

/* ─── Illustration : Meeting (foule + drapeau Sénégal) ─── */
function MeetingIllustration() {
  return (
    <svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <g transform="translate(170, 18)" opacity="0.92">
        <rect x="0" y="0" width="1.5" height="80" fill="rgba(255,255,255,0.7)" />
        <rect x="2" y="0" width="60" height="14" fill="#1B7F3E" />
        <rect x="2" y="14" width="60" height="14" fill="#FCD34D" />
        <rect x="2" y="28" width="60" height="14" fill="#C61C3E" />
        <polygon points="32,18 33.5,23 38.5,23 34.5,26 36,31 32,28 28,31 29.5,26 25.5,23 30.5,23" fill="#1B7F3E" />
      </g>
      {[
        { y: 130, scale: 1.0, opacity: 0.95 },
        { y: 118, scale: 0.85, opacity: 0.75 },
        { y: 108, scale: 0.7, opacity: 0.5 },
      ].map((row, ri) => (
        <g key={ri} opacity={row.opacity}>
          {Array.from({ length: 16 }).map((_, i) => {
            const x = 10 + i * 26 + (ri % 2 ? 13 : 0);
            return (
              <g key={i} transform={`translate(${x}, ${row.y}) scale(${row.scale})`}>
                <circle cx="0" cy="-18" r="6" fill="rgba(255,255,255,0.92)" />
                <path d="M -10 -12 L 10 -12 L 12 -2 L 10 14 L -10 14 L -12 -2 Z" fill="rgba(255,255,255,0.92)" />
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

/* ─── Illustration : Commémoration (bougies + ruban) ─── */
function CommemorationIllustration() {
  return (
    <svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="candle-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(252,211,77,0.35)" />
          <stop offset="100%" stopColor="rgba(252,211,77,0)" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="70" r="80" fill="url(#candle-glow)" />
      {[120, 160, 200, 240, 280].map((x, i) => {
        const height = i === 2 ? 50 : i === 1 || i === 3 ? 42 : 36;
        return (
          <g key={i} transform={`translate(${x}, ${130 - height})`}>
            <ellipse cx="0" cy="-4" rx="3" ry="6" fill="#F59E0B" opacity="0.95" />
            <ellipse cx="0" cy="-3" rx="1.5" ry="3.5" fill="#FCD34D" />
            <line x1="0" y1="2" x2="0" y2="6" stroke="#000" strokeWidth="0.8" />
            <rect x="-5" y="6" width="10" height={height - 8} fill="rgba(255,255,255,0.92)" rx="1" />
            <ellipse cx="0" cy="6" rx="5" ry="1.5" fill="rgba(255,255,255,0.7)" />
          </g>
        );
      })}
      <path d="M 140 28 Q 200 18 260 28 L 258 36 Q 200 26 142 36 Z" fill="rgba(255,255,255,0.85)" />
      <text x="200" y="33" fontSize="7" fontWeight="900" fill="#6B7280" textAnchor="middle" letterSpacing="2">
        EN MÉMOIRE
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ONGLET MON ENGAGEMENT — Profil + cotisations (épuré, sans Top 5)
   ═══════════════════════════════════════════════════════════════ */

function EngagementTab({
  user,
  cotisationsPayees,
  totalCotise,
}: {
  user: ReturnType<typeof getUser>;
  cotisationsPayees: number;
  totalCotise: number;
}) {
  return (
    <>
      <div
        className="engagement-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 380px) minmax(0, 1fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <ProfilCard user={user} cotisationsPayees={cotisationsPayees} totalCotise={totalCotise} />
        <CotisationsPanel />
      </div>

      <style>{`
        @media (max-width: 960px) {
          .engagement-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

/* ─── Carte profil patriote ─── */
function ProfilCard({
  user,
  cotisationsPayees,
  totalCotise,
}: {
  user: ReturnType<typeof getUser>;
  cotisationsPayees: number;
  totalCotise: number;
}) {
  const engagement = user?.engagement ?? 96;
  const points = user?.points ?? 12340;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: "relative",
        background: COLORS.blanc,
        borderRadius: 20,
        border: `1px solid ${COLORS.ligne}`,
        overflow: "hidden",
        boxShadow: "0 2px 14px rgba(0,0,0,0.04)",
      }}
    >
      {/* Bandeau décoratif haut */}
      <div
        style={{
          height: 80,
          background: `linear-gradient(135deg, ${COLORS.vert}, #0F4023)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg viewBox="0 0 400 80" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <circle key={i} cx={i * 24} cy={Math.sin(i) * 20 + 40} r="1.5" fill="#fff" />
          ))}
          <path d="M 0 60 Q 100 30 200 50 T 400 40" stroke="#fff" strokeWidth="1" fill="none" opacity="0.4" />
        </svg>
      </div>

      {/* Avatar centré */}
      <div style={{ padding: "0 24px 28px", marginTop: -42, position: "relative" }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.vert}, ${COLORS.rouge})`,
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontWeight: 900,
            fontSize: 28,
            border: `4px solid ${COLORS.blanc}`,
            boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            margin: "0 auto 14px",
          }}
        >
          {user?.avatar ?? "M"}
        </div>

        {/* Identité */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.noir, letterSpacing: -0.3 }}>
            {user?.nom ?? "Mamita"}
          </div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 2, fontWeight: 600 }}>
            {user?.fonction ?? "Patriote · Mentor Académie"}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              background: `${COLORS.vert}10`,
              border: `1px solid ${COLORS.vert}25`,
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 800,
              color: COLORS.vert,
              marginTop: 10,
              letterSpacing: 0.3,
            }}
          >
            🏆 Rang national : #{user?.rang ?? 18}
          </div>
        </div>

        {/* Score d'engagement */}
        <div
          style={{
            padding: "18px 16px",
            borderRadius: 14,
            background: `${COLORS.vert}06`,
            border: `1px solid ${COLORS.vert}18`,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#555", letterSpacing: 0.3 }}>
              Score d'engagement
            </span>
            <span style={{ fontSize: 22, fontWeight: 900, color: COLORS.vert, letterSpacing: -0.5 }}>
              {engagement}%
            </span>
          </div>
          <div style={{ height: 8, background: COLORS.ligne, borderRadius: 4, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${engagement}%` }}
              transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${COLORS.vert}, #2EB867)`,
                borderRadius: 4,
              }}
            />
          </div>
          <div style={{ fontSize: 10.5, color: "#888", marginTop: 8, lineHeight: 1.5 }}>
            Basé sur : cotisations, présence aux réunions, formations, contributions Co-Dev
          </div>
        </div>

        {/* Mini stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <MiniStat label="Points patriote" value={points.toLocaleString()} color={COLORS.vert} icon="⭐" />
          <MiniStat label="Cotisations payées" value={`${cotisationsPayees}/6`} color="#2563EB" icon="💳" />
          <MiniStat label="Total cotisé" value={`${(totalCotise / 1000).toFixed(0)}K`} color="#D97706" icon="💰" />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Panneau Cotisations ─── */
function CotisationsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
    >
      {/* Header du panneau */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: `${COLORS.vert}12`,
              display: "grid",
              placeItems: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            💳
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0, color: COLORS.noir, letterSpacing: -0.2 }}>
              Suivi des cotisations
            </h3>
            <p style={{ fontSize: 12, color: "#888", margin: "2px 0 0", fontWeight: 500 }}>
              Historique mensuel — 2 000 FCFA / mois
            </p>
          </div>
        </div>
        <div
          style={{
            padding: "8px 14px",
            background: `${COLORS.vert}10`,
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 800,
            color: COLORS.vert,
            letterSpacing: 0.5,
          }}
        >
          {MOCK_COTISATIONS.filter((c) => c.status === "payee").length} / {MOCK_COTISATIONS.length} payées
        </div>
      </div>

      {/* Liste des cotisations */}
      <div
        style={{
          background: COLORS.blanc,
          borderRadius: 16,
          border: `1px solid ${COLORS.ligne}`,
          overflow: "hidden",
        }}
      >
        {MOCK_COTISATIONS.map((c, i) => {
          const st = COTISATION_STATUS[c.status];
          const isLast = i === MOCK_COTISATIONS.length - 1;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 18px",
                borderBottom: !isLast ? `1px solid ${COLORS.ligne}` : "none",
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
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: `${st.color}14`,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 17,
                  flexShrink: 0,
                }}
              >
                {st.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.noir, marginBottom: 3 }}>
                  {c.mois}
                </div>
                <div style={{ fontSize: 11.5, color: "#888", fontWeight: 500 }}>
                  {c.datePaiement
                    ? `Payé le ${c.datePaiement} via ${c.methode}`
                    : c.status === "en_retard"
                    ? "Paiement en retard"
                    : "Échéance à venir"}
                </div>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: st.color, marginBottom: 3 }}>
                  {c.montant.toLocaleString()} FCFA
                </div>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: 10,
                    fontWeight: 800,
                    color: st.color,
                    background: `${st.color}12`,
                    padding: "3px 9px",
                    borderRadius: 5,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                  }}
                >
                  {st.label}
                </span>
              </div>

              {c.status !== "payee" && (
                <button
                  onClick={() => alert(`Paiement de ${c.montant} FCFA pour ${c.mois} — Orange Money / Wave`)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 10,
                    border: "none",
                    background: COLORS.vert,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    flexShrink: 0,
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
                  Payer
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer info paiement sécurisé */}
      <div
        style={{
          marginTop: 14,
          padding: "14px 16px",
          background: `${COLORS.vert}06`,
          border: `1px solid ${COLORS.vert}15`,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          gap: 11,
        }}
      >
        <div style={{ fontSize: 18 }}>🔒</div>
        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>
          Paiements 100 % sécurisés via{" "}
          <strong style={{ color: COLORS.noir }}>Wave</strong> et{" "}
          <strong style={{ color: COLORS.noir }}>Orange Money</strong>. Reçu envoyé par e-mail.
        </div>
      </div>
    </motion.div>
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

function MartyrsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: COLORS.blanc, borderRadius: 20, border: `1px solid ${COLORS.ligne}`, padding: 24 }}
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, #000 0%, #000 32%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0) 78%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 2, padding: "36px 32px", maxWidth: "60%" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>
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
          « Ceux qui sont morts<br />ne sont jamais partis »
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", letterSpacing: 1 }}>— Birago Diop —</div>
      </div>
    </div>
  );
}

function MartyrRow({ martyr, isLast }: { martyr: Martyr; isLast: boolean }) {
  return (
    <div style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: !isLast ? `1px solid ${COLORS.ligne}` : "none" }}>
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
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.noir, marginBottom: 6 }}>{martyr.nom}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: COLORS.rouge, fontWeight: 700, background: `${COLORS.rouge}10`, padding: "3px 9px", borderRadius: 6 }}>
            <CalendarIcon size={11} color={COLORS.rouge} /> {martyr.date}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "#666", fontWeight: 600 }}>
            <PinIcon size={11} color="#888" /> {martyr.lieu}
          </span>
        </div>
        <p style={{ fontSize: 12, color: "#666", margin: 0, lineHeight: 1.55 }}>{martyr.description}</p>
      </div>
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#FFF6E5", display: "grid", placeItems: "center", flexShrink: 0, alignSelf: "flex-start" }}>
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
      onMouseEnter={(e) => { e.currentTarget.style.background = `${COLORS.vert}12`; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = `${COLORS.vert}08`; }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: COLORS.blanc, border: `1px solid ${COLORS.vert}20`, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <CalendarIcon size={20} color={COLORS.rouge} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#888", letterSpacing: 1.5, marginBottom: 3 }}>
          PROCHAINE COMMÉMORATION
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.noir, marginBottom: 2 }}>
          25 juin 2026 — Journée nationale des Martyrs
        </div>
        <div style={{ fontSize: 11, color: "#888" }}>Place de la Nation</div>
      </div>
      <ChevronRightSvg color="#888" size={18} />
    </div>
  );
}

function BibliothequePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      style={{ background: COLORS.blanc, borderRadius: 20, border: `1px solid ${COLORS.ligne}`, padding: 24 }}
    >
      <MemoireSectionHeader
        icon={<BookIcon size={20} color={COLORS.vert} />}
        title="BIBLIOTHÈQUE NUMÉRIQUE"
        subtitle="Centre de recherche et production de pensée"
      />

      <div style={{ marginBottom: 28 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ width: 32, height: 2, background: COLORS.vert, marginBottom: 8, borderRadius: 1 }} />
          <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.noir, letterSpacing: 1.2 }}>
            LIVRES DE OUSMANE SONKO
          </div>
        </div>
        <div className="livres-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
          {MOCK_LIVRES.map((livre, i) => (
            <BookItem key={livre.titre} livre={livre} index={i} />
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.noir, letterSpacing: 1.2, marginBottom: 12 }}>
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
  titre: string; type: string; pages: number; date: string; color: string; icon: DocIconType;
}> = [
  { titre: "Résolution générale du Premier Congrès",                 type: "PDF", pages: 20,  date: "Juin 2026",  color: "#F59E0B", icon: "doc" },
  { titre: "Projet de Société PASTEF — Version intégrale",           type: "PDF", pages: 145, date: "2024",       color: "#2563EB", icon: "book" },
  { titre: "Rapport d'audit du Fonds Co-Développement Q1 2026",      type: "PDF", pages: 32,  date: "Avril 2026", color: "#10B981", icon: "chart" },
  { titre: "Note d'analyse : Renégociation des contrats pétroliers", type: "PDF", pages: 18,  date: "Mai 2026",   color: "#EF4444", icon: "alert" },
  { titre: "Guide du responsable de cellule (2e édition)",           type: "PDF", pages: 56,  date: "Mars 2026",  color: "#8B5CF6", icon: "guide" },
  { titre: "Étude : Impact économique de la diaspora sénégalaise",   type: "PDF", pages: 74,  date: "2025",       color: "#059669", icon: "search" },
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
          boxShadow: "0 4px 14px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <img src={livre.cover} alt={livre.titre} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.noir, lineHeight: 1.3, marginBottom: 8, minHeight: 32 }}>
        {livre.titre}
      </div>
      <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.vert }}>{livre.prix}</div>
    </motion.div>
  );
}

type DocIconType = "doc" | "book" | "chart" | "alert" | "guide" | "search";

function DocumentRow({ doc, isLast }: { doc: (typeof DOCUMENTS)[number]; isLast: boolean }) {
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
      onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.creme; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ width: 42, height: 42, borderRadius: 12, background: `${doc.color}14`, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <DocTypeIcon type={doc.icon} color={doc.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.noir, lineHeight: 1.3, marginBottom: 4 }}>
          {doc.titre}
        </div>
        <div style={{ fontSize: 11, color: "#888", fontWeight: 500 }}>
          {doc.type} · {doc.pages} pages · {doc.date}
        </div>
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: COLORS.vert, flexShrink: 0 }}>
        Lire <ArrowRightSvg size={13} color={COLORS.vert} />
      </div>
    </div>
  );
}

function MemoireSectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, gap: 14, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${COLORS.vert}12`, display: "grid", placeItems: "center", flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 900, margin: 0, letterSpacing: 1.4, color: COLORS.noir }}>{title}</h2>
          <p style={{ fontSize: 12, color: "#888", margin: "3px 0 0", fontWeight: 500 }}>{subtitle}</p>
        </div>
      </div>
      <button
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 16px", background: COLORS.blanc,
          border: `1px solid ${COLORS.ligne}`, borderRadius: 10,
          cursor: "pointer", fontFamily: "inherit",
          fontSize: 12, fontWeight: 700, color: "#555",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.vert; e.currentTarget.style.color = COLORS.vert; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.ligne; e.currentTarget.style.color = "#555"; }}
      >
        Voir tout <ArrowRightSvg size={12} color="currentColor" />
      </button>
    </div>
  );
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
                      onClick={() => { if (!hasVoted) setVoted((prev) => ({ ...prev, [c.id]: i })); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 16px", borderRadius: 10,
                        border: `1px solid ${isMyVote ? COLORS.vert : COLORS.ligne}`,
                        background: isMyVote ? `${COLORS.vert}08` : COLORS.blanc,
                        cursor: hasVoted ? "default" : "pointer",
                        width: "100%", fontFamily: "inherit",
                        textAlign: "left", position: "relative", overflow: "hidden",
                        transition: "all 0.15s ease",
                      }}
                    >
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        marginBottom: 24, padding: "20px 24px", borderRadius: 16,
        background: `linear-gradient(135deg, ${pilier.color}10, ${pilier.color}03)`,
        borderLeft: `4px solid ${pilier.color}`,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, color: pilier.color, marginBottom: 6 }}>
        {pilier.tag}
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, margin: 0, color: COLORS.noir }}>
        {pilier.title}
      </h1>
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
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "12px 20px", border: "none", cursor: "pointer",
        fontSize: 12, fontWeight: active ? 800 : 600, fontFamily: "inherit",
        color: active ? COLORS.vert : "#666",
        background: active ? `${COLORS.vert}10` : "transparent",
        borderBottom: active ? `2px solid ${COLORS.vert}` : "2px solid transparent",
        whiteSpace: "nowrap", transition: "all 0.15s ease",
      }}
    >
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
    <div style={{ padding: "12px 10px", borderRadius: 12, background: `${color}08`, border: `1px solid ${color}20`, textAlign: "center" }}>
      <div style={{ fontSize: 15, marginBottom: 3 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 900, color, letterSpacing: -0.3 }}>{value}</div>
      <div style={{ fontSize: 9.5, color: "#888", fontWeight: 700, marginTop: 2, letterSpacing: 0.2 }}>{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ICÔNES SVG INLINE
   ═══════════════════════════════════════════════════════════════ */

function CandleIcon({ size = 16, color = "#1B7F3E" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2 C 10.5 4 9.5 5.5 9.5 7 C 9.5 8.4 10.6 9.5 12 9.5 C 13.4 9.5 14.5 8.4 14.5 7 C 14.5 5.5 13.5 4 12 2 Z" fill="#F59E0B" />
      <ellipse cx="12" cy="7" rx="1.3" ry="2" fill="#FCD34D" />
      <rect x="9" y="10" width="6" height="11" rx="0.5" fill={color} />
      <ellipse cx="12" cy="10" rx="3" ry="0.8" fill={color} opacity="0.7" />
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

function ShareIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
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
      return (<svg {...props}><path d="M4 19.5 A 2.5 2.5 0 0 1 6.5 17 H 20 V 4 H 6.5 A 2.5 2.5 0 0 0 4 6.5 Z" /></svg>);
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