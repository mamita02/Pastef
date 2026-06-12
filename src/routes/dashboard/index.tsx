import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Award,
  Bell,
  BellRing,
  Briefcase,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import { getUser } from "@/lib/auth";
import { COLORS } from "@/lib/constants/colors";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

/* ═══════════════════════════════════════════════════════════════
   VUE D'ENSEMBLE — Page d'accueil du dashboard patriote
   ─────────────────────────────────────────────────────────────
   Layout 2 colonnes :
   • Gauche : Score d'engagement + Stats + Suivi cotisations
   • Droite : Cellules du parti par région
   ═══════════════════════════════════════════════════════════════ */

/* ─── DONNÉES MOCK (à brancher sur Supabase / API) ─── */

const COTISATION_MENSUELLE = 2000; // FCFA

type StatutCotisation = "a_payer" | "payee";

const COTISATIONS: Array<{
  mois: string;
  statut: StatutCotisation;
  detail: string;
  via?: "Wave" | "Orange Money";
}> = [
  { mois: "Juin 2025",    statut: "a_payer", detail: "Échéance à venir" },
  { mois: "Mai 2025",     statut: "payee",   detail: "Payé le 31 mai 2025",     via: "Wave" },
  { mois: "Avril 2025",   statut: "payee",   detail: "Payé le 30 avril 2025",   via: "Orange Money" },
  { mois: "Mars 2025",    statut: "payee",   detail: "Payé le 31 mars 2025",    via: "Wave" },
  { mois: "Février 2025", statut: "payee",   detail: "Payé le 28 février 2025", via: "Wave" },
];

const REGIONS = [
  { num: "01", nom: "Diaspora",    membres: 42800, cellules: 156, color: "#F97316" }, // orange
  { num: "02", nom: "Dakar",       membres: 18420, cellules: 245, color: COLORS.vert },
  { num: "03", nom: "Thiès",       membres:  9840, cellules: 128, color: COLORS.vert },
  { num: "04", nom: "Ziguinchor",  membres:  6720, cellules:  86, color: COLORS.vert },
  { num: "05", nom: "Saint-Louis", membres:  5890, cellules:  74, color: COLORS.vert },
  { num: "06", nom: "Kaolack",     membres:  4950, cellules:  65, color: COLORS.vert },
  { num: "07", nom: "Diourbel",    membres:  3870, cellules:  52, color: COLORS.vert },
  { num: "08", nom: "Matam",       membres:  3210, cellules:  48, color: COLORS.vert },
  { num: "09", nom: "Kolda",       membres:  3100, cellules:  44, color: COLORS.vert },
];

const TOTAL_CELLULES = 1100;
const NB_COTISATIONS_PAYEES = 4;
const NB_COTISATIONS_TOTAL = 6;
const NB_NOTIFICATIONS = 3;

/* ═══════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */

function DashboardOverview() {
  const user = getUser();
  if (!user) return null;

  const totalCotise = NB_COTISATIONS_PAYEES * COTISATION_MENSUELLE; // 8 000 FCFA
  const cellulesMax = Math.max(...REGIONS.map((r) => r.cellules));

  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* ═══ EN-TÊTE DE PAGE ═══ */}
      <PageHeader prenom={user.nom.split(" ")[0]} />

      {/* ═══ GRID PRINCIPALE : 2 COLONNES ═══ */}
      <div
        className="dashboard-overview-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* ─── COLONNE GAUCHE ─── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
          <EngagementCard score={user.engagement} />

          <StatsRow points={user.points} totalCotise={totalCotise} />

          <CotisationsCard />
        </div>

        {/* ─── COLONNE DROITE : Cellules par région ─── */}
        <CellulesParti cellulesMax={cellulesMax} />
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .dashboard-overview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EN-TÊTE DE PAGE
   ═══════════════════════════════════════════════════════════════ */

function PageHeader({ prenom }: { prenom: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 24,
        flexWrap: "wrap",
      }}
    >
      <div>
        <div style={{ fontSize: 14, color: "#555", marginBottom: 6, fontWeight: 500 }}>
          Bienvenue, {prenom} <span style={{ fontSize: 16 }}>👋</span>
        </div>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: -1,
            margin: 0,
            color: COLORS.noir,
          }}
        >
          Vue d'ensemble
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Cloche de notifications */}
        <button
          aria-label="Notifications"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: COLORS.blanc,
            border: `1px solid ${COLORS.ligne}`,
            cursor: "pointer",
            position: "relative",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = COLORS.vert;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = COLORS.ligne;
          }}
        >
          <Bell size={18} color={COLORS.noir} strokeWidth={2} />
          {NB_NOTIFICATIONS > 0 && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                minWidth: 18,
                height: 18,
                padding: "0 5px",
                borderRadius: 999,
                background: COLORS.rouge,
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                display: "grid",
                placeItems: "center",
                border: `2px solid ${COLORS.creme}`,
              }}
            >
              {NB_NOTIFICATIONS}
            </span>
          )}
        </button>

        {/* Sélecteur de mois */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "11px 18px",
            borderRadius: 12,
            background: COLORS.blanc,
            border: `1px solid ${COLORS.ligne}`,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 700,
            color: COLORS.noir,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = COLORS.vert;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = COLORS.ligne;
          }}
        >
          <Calendar size={16} color={COLORS.vert} strokeWidth={2.2} />
          <span>Juin 2025</span>
          <ChevronDown size={14} color="#888" strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CARTE D'ENGAGEMENT — Grosse bannière verte avec cercle
   ═══════════════════════════════════════════════════════════════ */

function EngagementCard({ score }: { score: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      style={{
        position: "relative",
        background: `linear-gradient(135deg, #0F5A2D 0%, ${COLORS.vert} 60%, #1B7F3E 100%)`,
        borderRadius: 20,
        padding: "32px 36px",
        color: "#fff",
        overflow: "hidden",
        boxShadow: `0 8px 32px ${COLORS.vert}25`,
      }}
    >
      {/* Halo décoratif */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -60,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
        {/* Bloc texte */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.85, marginBottom: 10 }}>
            Score d'engagement
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              letterSpacing: -2,
              lineHeight: 1,
              marginBottom: 10,
            }}
          >
            {score}%
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, opacity: 0.95, marginBottom: 18 }}>
            Excellent ! Continuez ainsi.
          </div>

          {/* Barre de progression */}
          <div
            style={{
              height: 6,
              background: "rgba(255,255,255,0.18)",
              borderRadius: 999,
              overflow: "hidden",
              maxWidth: 380,
              marginBottom: 16,
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #4ADE80, #86EFAC)",
                borderRadius: 999,
              }}
            />
          </div>

          <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.5, maxWidth: 420 }}>
            Basé sur : cotisations, présence aux réunions,
            <br />
            formations, contributions Co-Dev
          </div>
        </div>

        {/* Cercle de progression */}
        <ProgressRing percent={score} />
      </div>
    </motion.div>
  );
}

/* ─── Cercle SVG de progression (96%) ─── */
function ProgressRing({ percent, size = 150 }: { percent: number; size?: number }) {
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(6px)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <TrendingUp size={26} color="#86EFAC" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3 STATS — Points / Cotisations / Total cotisé
   ═══════════════════════════════════════════════════════════════ */

function StatsRow({ points, totalCotise }: { points: number; totalCotise: number }) {
  const stats = [
    {
      icon: <Wallet size={24} color={COLORS.vert} strokeWidth={2.2} />,
      iconBg: `${COLORS.vert}15`,
      value: points.toLocaleString("fr-FR"),
      label: "Points patriote",
      footer: <span style={{ color: COLORS.vert, fontWeight: 700 }}>↑ 12% ce mois</span>,
    },
    {
      icon: <Briefcase size={24} color="#2563EB" strokeWidth={2.2} />,
      iconBg: "#2563EB15",
      value: `${NB_COTISATIONS_PAYEES}/${NB_COTISATIONS_TOTAL}`,
      label: "Cotisations payées",
      footer: <span style={{ color: "#666", fontWeight: 600 }}>À jour</span>,
    },
    {
      icon: <Award size={24} color="#D97706" strokeWidth={2.2} />,
      iconBg: "#D9770615",
      value: `${(totalCotise / 1000).toFixed(0)}K`,
      label: "Total cotisé",
      footer: <span style={{ color: COLORS.vert, fontWeight: 700 }}>↑ 8% ce mois</span>,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 0,
        background: COLORS.blanc,
        borderRadius: 16,
        border: `1px solid ${COLORS.ligne}`,
        overflow: "hidden",
      }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.06 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "22px 24px",
            borderRight: i < 2 ? `1px solid ${COLORS.ligne}` : "none",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: s.iconBg,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            {s.icon}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: COLORS.noir, lineHeight: 1, marginBottom: 4 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: "#666", fontWeight: 500, marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 11 }}>{s.footer}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUIVI DES COTISATIONS
   ═══════════════════════════════════════════════════════════════ */

function CotisationsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        background: COLORS.blanc,
        borderRadius: 16,
        border: `1px solid ${COLORS.ligne}`,
        padding: "24px 26px 14px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 18,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Calendar size={18} color={COLORS.noir} strokeWidth={2.2} />
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: COLORS.noir }}>
              Suivi des cotisations
            </h3>
          </div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 4, marginLeft: 28 }}>
            Historique mensuel — {COTISATION_MENSUELLE.toLocaleString("fr-FR")} FCFA/mois
          </div>
        </div>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            background: "transparent",
            border: `1px solid ${COLORS.ligne}`,
            borderRadius: 10,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 600,
            color: "#555",
            transition: "all 0.2s",
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
          Voir tout l'historique
          <ChevronRight size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Liste des cotisations */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {COTISATIONS.map((c, i) => (
          <CotisationRow key={c.mois} cotisation={c} delay={0.35 + i * 0.05} />
        ))}
      </div>
    </motion.div>
  );
}

function CotisationRow({
  cotisation,
  delay,
}: {
  cotisation: (typeof COTISATIONS)[number];
  delay: number;
}) {
  const isAPayer = cotisation.statut === "a_payer";
  const detail = cotisation.via
    ? `${cotisation.detail} via ${cotisation.via}`
    : cotisation.detail;

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 4px",
        borderBottom: `1px solid ${COLORS.ligne}`,
      }}
    >
      {/* Icône statut */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: isAPayer ? "#FEF3C7" : "#DCFCE7",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        {isAPayer ? (
          <BellRing size={16} color="#D97706" strokeWidth={2.5} />
        ) : (
          <Check size={18} color={COLORS.vert} strokeWidth={3} />
        )}
      </div>

      {/* Infos mois */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.noir, marginBottom: 2 }}>
          {cotisation.mois}
        </div>
        <div style={{ fontSize: 12, color: "#888" }}>{detail}</div>
      </div>

      {/* Montant */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: isAPayer ? "#D97706" : COLORS.noir,
          }}
        >
          {COTISATION_MENSUELLE.toLocaleString("fr-FR")} FCFA
        </div>
        {isAPayer && (
          <div style={{ fontSize: 10, color: "#D97706", fontWeight: 700, marginTop: 2 }}>
            À payer
          </div>
        )}
      </div>

      {/* Badge / Action */}
      <div style={{ flexShrink: 0, minWidth: 70, textAlign: "right" }}>
        {isAPayer ? (
          <button
            style={{
              padding: "9px 20px",
              background: COLORS.vert,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: `0 2px 6px ${COLORS.vert}40`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = `0 4px 10px ${COLORS.vert}50`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = `0 2px 6px ${COLORS.vert}40`;
            }}
          >
            Payer
          </button>
        ) : (
          <span
            style={{
              display: "inline-block",
              padding: "5px 12px",
              borderRadius: 6,
              background: COLORS.creme,
              border: `1px solid ${COLORS.ligne}`,
              fontSize: 11,
              fontWeight: 700,
              color: "#666",
            }}
          >
            Payée
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CELLULES DU PARTI — Colonne droite
   ═══════════════════════════════════════════════════════════════ */

function CellulesParti({ cellulesMax }: { cellulesMax: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 }}
      style={{
        background: COLORS.blanc,
        borderRadius: 16,
        border: `1px solid ${COLORS.ligne}`,
        padding: "24px 22px 18px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Users size={18} color={COLORS.noir} strokeWidth={2.2} />
          <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: COLORS.noir }}>
            Cellules du parti{" "}
            <span style={{ color: "#888", fontWeight: 600 }}>
              ({TOTAL_CELLULES.toLocaleString("fr-FR")})
            </span>
          </h3>
        </div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 4, marginLeft: 28 }}>
          Présence par région
        </div>
      </div>

      {/* Liste des régions */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {REGIONS.map((r, i) => (
          <RegionRow
            key={r.nom}
            region={r}
            cellulesMax={cellulesMax}
            delay={0.25 + i * 0.04}
          />
        ))}
      </div>

      {/* CTA */}
      <Link
        to="/dashboard/parti"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginTop: 14,
          padding: "12px 16px",
          background: `${COLORS.vert}10`,
          borderRadius: 12,
          color: COLORS.vert,
          fontSize: 13,
          fontWeight: 800,
          textDecoration: "none",
          border: `1px solid ${COLORS.vert}20`,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${COLORS.vert}18`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `${COLORS.vert}10`;
        }}
      >
        Voir toutes les régions
        <ChevronRight size={14} strokeWidth={2.5} />
      </Link>
    </motion.div>
  );
}

function RegionRow({
  region,
  cellulesMax,
  delay,
}: {
  region: (typeof REGIONS)[number];
  cellulesMax: number;
  delay: number;
}) {
  const pct = (region.cellules / cellulesMax) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 4px",
        borderBottom: `1px solid ${COLORS.ligne}`,
        cursor: "pointer",
        transition: "background 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = COLORS.creme;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      {/* Numéro */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: "#bbb",
          letterSpacing: 1,
          width: 22,
          flexShrink: 0,
        }}
      >
        {region.num}
      </div>

      {/* Petite carte stylisée */}
      <div
        style={{
          width: 32,
          height: 32,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          opacity: 0.6,
        }}
      >
        <AfricaIcon size={26} />
      </div>

      {/* Nom + membres + barre */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: COLORS.noir,
            marginBottom: 5,
          }}
        >
          {region.nom}
        </div>
        <div
          style={{
            height: 4,
            background: COLORS.ligne,
            borderRadius: 999,
            overflow: "hidden",
            marginBottom: 4,
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: "easeOut", delay: delay + 0.1 }}
            style={{
              height: "100%",
              background: region.color,
              borderRadius: 999,
            }}
          />
        </div>
        <div style={{ fontSize: 10, color: "#999", fontWeight: 600 }}>
          {region.membres.toLocaleString("fr-FR")} membres
        </div>
      </div>

      {/* Nb cellules + chevron */}
      <div style={{ textAlign: "right", flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: COLORS.noir, lineHeight: 1 }}>
            {region.cellules}
          </div>
          <div style={{ fontSize: 9, color: "#aaa", fontWeight: 600, marginTop: 2 }}>
            cellules
          </div>
        </div>
        <ChevronRight size={14} color="#bbb" strokeWidth={2.5} />
      </div>
    </motion.div>
  );
}

/* ─── Icône Afrique stylisée (silhouette grise simplifiée) ─── */
function AfricaIcon({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M11 3 L18 3 L21 6 L24 7 L25 10 L24 13 L26 15 L25 18 L23 21 L22 25 L19 28 L16 29 L14 28 L13 25 L10 22 L9 19 L7 16 L7 12 L8 8 L9 5 Z"
        fill="#D4D4D4"
      />
    </svg>
  );
}