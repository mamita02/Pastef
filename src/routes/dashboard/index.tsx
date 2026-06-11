import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { getUser } from "@/lib/auth";
import { COLORS } from "@/lib/constants/colors";
import { PILIERS } from "@/lib/data/piliers";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

/* ═══════════════════════════════════════════════════════════════
   DONNÉES AGRÉGÉES — Vue d'ensemble de toute la plateforme
   À terme : venir de Supabase / API
   ═══════════════════════════════════════════════════════════════ */

const PLATFORM_STATS = {
  totalPatriotes: 122340,
  totalCellules: 1100,
  totalRegions: 14,
  diasporaVilles: 18,
  totalCartes: 89400,
  totalBracelets: 52600,
};

const PILIER_SUMMARIES = [
  {
    pilier: 0,
    stats: [
      { label: "Offres d'emploi", value: "247", icon: "💼" },
      { label: "Marchés publics", value: "89", icon: "📋" },
      { label: "Profils actifs", value: "18.4K", icon: "👤" },
    ],
    highlight: "34 nouveaux marchés cette semaine",
    progress: 72,
    link: "/dashboard/talents",
  },
  {
    pilier: 1,
    stats: [
      { label: "Modules", value: "42", icon: "📚" },
      { label: "En formation", value: "3.2K", icon: "🎓" },
      { label: "Certificats", value: "1.8K", icon: "🏅" },
    ],
    highlight: "Module « Souveraineté » trending",
    progress: 65,
    link: "/dashboard/academie",
  },
  {
    pilier: 2,
    stats: [
      { label: "Projets actifs", value: "156", icon: "🚀" },
      { label: "Collecté", value: "248M", icon: "💰" },
      { label: "Contributeurs", value: "8.7K", icon: "👥" },
    ],
    highlight: "Thiès : objectif atteint à 94%",
    progress: 78,
    link: "/dashboard/codeveloppement",
  },
  {
    pilier: 3,
    stats: [
      { label: "Cellules actives", value: "1.1K", icon: "🏛️" },
      { label: "Consultations", value: "12", icon: "🗳️" },
      { label: "Événements", value: "28", icon: "📅" },
    ],
    highlight: "Congrès de Diamniadio : 12K inscrits",
    progress: 84,
    link: "/dashboard/parti",
  },
];

const ACTIVITES = [
  { date: "Aujourd'hui", titre: "Contribution validée",     desc: "+25 000 FCFA — Projet forage Ndioum",           color: COLORS.vert,  icon: "💰" },
  { date: "Aujourd'hui", titre: "Formation terminée",       desc: "Module : Souveraineté économique (100%)",        color: COLORS.rouge, icon: "🎓" },
  { date: "Hier",        titre: "Badge obtenu",             desc: "Mentor Diaspora — Niveau 2",                     color: "#D97706",    icon: "🏅" },
  { date: "Il y a 2j",   titre: "Offre consultée",          desc: "Développeur Full-Stack — Ministère du Numérique",color: "#2563EB",    icon: "💼" },
  { date: "Il y a 3j",   titre: "Vote consultation",        desc: "Réforme éducative — 12 450 participants",        color: COLORS.vert,  icon: "🗳️" },
  { date: "Il y a 5j",   titre: "Participation Congrès",    desc: "Premier Congrès de Diamniadio",                  color: COLORS.rouge, icon: "🏛️" },
];

const PROCHAINS = [
  { date: "12 JUIN", heure: "18h", titre: "Réunion de cellule — Dakar Plateau",        type: "reunion",       color: COLORS.vert },
  { date: "14 JUIN", heure: "20h", titre: "Webinaire Diaspora : Bilan 100 jours",      type: "webinaire",     color: "#2563EB" },
  { date: "18 JUIN", heure: "10h", titre: "Formation : Animation de cellule (Mod. 3)",  type: "formation",     color: "#7C3AED" },
  { date: "25 JUIN", heure: "09h", titre: "Hommage aux Martyrs",                       type: "commemoration", color: "#6B7280" },
];

/* ═══════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */

function DashboardOverview() {
  const user = getUser();
  if (!user) return null;

  const KPI = [
    { label: "Rang national",   value: `#${user.rang}`,                                   icon: "🏆", trend: "+5",   color: COLORS.vert },
    { label: "Points patriote",  value: user.points.toLocaleString("fr-FR"),                icon: "⭐", trend: "+120", color: "#D97706" },
    { label: "Contribution",     value: `${(user.contribution / 1000).toFixed(0)}K FCFA`,   icon: "💰", trend: "+15K", color: "#2563EB" },
    { label: "Engagement",       value: `${user.engagement}%`,                              icon: "🔥", trend: "+3%",  color: COLORS.rouge },
  ];

  return (
    <>
      {/* ═══ BANNIÈRE D'ACCUEIL avec motif africain ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: "relative",
          marginBottom: 28,
          padding: "28px 32px",
          borderRadius: 20,
          background: `linear-gradient(135deg, ${COLORS.vert}08, ${COLORS.rouge}05)`,
          border: `1px solid ${COLORS.ligne}`,
          overflow: "hidden",
        }}
      >
        {/* Motif africain décoratif (côté droit) */}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 180, opacity: 0.08, pointerEvents: "none" }}>
          <AfricanPattern />
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2.5, color: COLORS.vert, textTransform: "uppercase" }}>
              Tableau de bord
            </div>
            <div style={{ width: 32, height: 1, background: COLORS.vert, opacity: 0.4 }} />
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: -1, margin: "0 0 6px" }}>
            Bonjour {user.nom.split(" ")[0]} 👋
          </h1>
          <p style={{ color: "#666", fontSize: 14, margin: 0 }}>
            {user.fonction} · {user.region}
          </p>
        </div>

        {/* Compteurs plateforme (coins) */}
        <div style={{ position: "absolute", top: 20, right: 200, display: "flex", gap: 20, opacity: 0.6 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: COLORS.vert }}>{(PLATFORM_STATS.totalPatriotes / 1000).toFixed(0)}K</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>patriotes</div>
          </div>
          <div style={{ width: 1, background: COLORS.ligne }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: COLORS.rouge }}>{PLATFORM_STATS.totalCellules}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>cellules</div>
          </div>
        </div>
      </motion.div>

      {/* ═══ KPI PERSONNELS ═══ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        {KPI.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              background: COLORS.blanc,
              borderRadius: 16,
              padding: "18px 20px",
              border: `1px solid ${COLORS.ligne}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: `${k.color}12`,
                display: "grid", placeItems: "center", fontSize: 18,
              }}>
                {k.icon}
              </div>
              <span style={{
                fontSize: 10, color: COLORS.vert, fontWeight: 800,
                background: `${COLORS.vert}12`, padding: "3px 8px",
                borderRadius: 999, height: "fit-content",
              }}>
                ↑ {k.trend}
              </span>
            </div>
            <div style={{ fontSize: 10, color: "#999", letterSpacing: 1.5, fontWeight: 800, textTransform: "uppercase", marginBottom: 4 }}>
              {k.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -1, color: COLORS.noir }}>
              {k.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ═══ LES 4 PILIERS — Résumé ═══ */}
      <div style={{ marginBottom: 28 }}>
        <SectionLabel label="Les 4 piliers" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {PILIER_SUMMARIES.map((ps, i) => {
            const p = PILIERS[ps.pilier];
            return (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
              >
                <Link
                  to={ps.link}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                    background: COLORS.blanc,
                    borderRadius: 16,
                    padding: "20px",
                    border: `1px solid ${COLORS.ligne}`,
                    borderLeft: `4px solid ${p.color}`,
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 6px 24px ${p.color}15`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: `${p.color}12`,
                        display: "grid", placeItems: "center", fontSize: 18,
                      }}>
                        {p.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: p.color }}>{p.tag.toUpperCase()}</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.noir }}>{p.title.split(" & ")[0]}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>→</span>
                  </div>

                  {/* Mini stats */}
                  <div style={{ display: "flex", gap: 0, marginBottom: 12 }}>
                    {ps.stats.map((s, j) => (
                      <div key={j} style={{
                        flex: 1, textAlign: "center",
                        borderRight: j < 2 ? `1px solid ${COLORS.ligne}` : "none",
                        padding: "0 8px",
                      }}>
                        <div style={{ fontSize: 16, fontWeight: 900, color: COLORS.noir }}>{s.value}</div>
                        <div style={{ fontSize: 9, color: "#999", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: 4, background: COLORS.ligne, borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ height: "100%", width: `${ps.progress}%`, background: p.color, borderRadius: 2, transition: "width 0.8s ease" }} />
                  </div>
                  <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>
                    💡 {ps.highlight}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ═══ DOUBLE COLONNE : Activité + Événements ═══ */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 28 }}>

        {/* Activité récente */}
        <div style={{ background: COLORS.blanc, borderRadius: 16, padding: "20px 22px", border: `1px solid ${COLORS.ligne}` }}>
          <SectionLabel label="Activité récente" inside />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ACTIVITES.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                style={{
                  display: "flex", gap: 12, padding: "12px 14px",
                  borderRadius: 12, background: COLORS.creme,
                  borderLeft: `3px solid ${a.color}`,
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: `${a.color}15`, display: "grid",
                  placeItems: "center", fontSize: 16, flexShrink: 0,
                }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontWeight: 800, fontSize: 13 }}>{a.titre}</span>
                    <span style={{ fontSize: 10, color: "#aaa", fontWeight: 600, flexShrink: 0 }}>{a.date}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>{a.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Prochains événements */}
        <div style={{ background: COLORS.blanc, borderRadius: 16, padding: "20px 22px", border: `1px solid ${COLORS.ligne}` }}>
          <SectionLabel label="Prochains événements" inside />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PROCHAINS.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
                style={{
                  display: "flex", gap: 12, padding: "12px 14px",
                  borderRadius: 12, background: COLORS.creme,
                }}
              >
                <div style={{
                  width: 48, flexShrink: 0, textAlign: "center",
                  borderRight: `1px solid ${COLORS.ligne}`, paddingRight: 10,
                }}>
                  <div style={{ fontSize: 9, fontWeight: 900, color: ev.color, letterSpacing: 0.5 }}>
                    {ev.date.split(" ")[0]}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#888" }}>
                    {ev.date.split(" ")[1]}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: "#bbb", marginTop: 2 }}>
                    {ev.heure}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.noir, marginBottom: 2 }}>{ev.titre}</div>
                  <span style={{
                    fontSize: 9, fontWeight: 800, color: ev.color,
                    background: `${ev.color}12`, padding: "2px 7px",
                    borderRadius: 4, textTransform: "uppercase", letterSpacing: 0.5,
                  }}>
                    {ev.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <Link
            to="/dashboard/parti"
            style={{
              display: "block", textAlign: "center", marginTop: 14,
              padding: "10px 16px", borderRadius: 10,
              background: `${COLORS.vert}10`, color: COLORS.vert,
              fontWeight: 800, fontSize: 12, textDecoration: "none",
              border: `1px solid ${COLORS.vert}20`,
            }}
          >
            Voir tout l'agenda →
          </Link>
        </div>
      </div>

      {/* ═══ BARRE VENTES CARTES / BRACELETS ═══ */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 28,
      }}>
        <SalesCard icon="🪪" label="Cartes vendues" value={PLATFORM_STATS.totalCartes} total={PLATFORM_STATS.totalPatriotes} color="#7C3AED" />
        <SalesCard icon="📿" label="Bracelets vendus" value={PLATFORM_STATS.totalBracelets} total={PLATFORM_STATS.totalPatriotes} color="#D97706" />
        <SalesCard icon="🌍" label="Villes diaspora" value={PLATFORM_STATS.diasporaVilles} total={25} color="#0891B2" suffix="/ 25 cibles" />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPOSANTS UTILITAIRES
   ═══════════════════════════════════════════════════════════════ */

function SectionLabel({ label, inside }: { label: string; inside?: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      marginBottom: inside ? 16 : 14,
      ...(inside ? {} : { paddingLeft: 2 }),
    }}>
      <div style={{
        fontSize: 10, fontWeight: 800, letterSpacing: 2, color: "#999",
        textTransform: "uppercase",
      }}>
        {label}
      </div>
      <div style={{ flex: 1, height: 1, background: COLORS.ligne }} />
    </div>
  );
}

function SalesCard({
  icon, label, value, total, color, suffix,
}: {
  icon: string; label: string; value: number; total: number; color: string; suffix?: string;
}) {
  const pct = Math.round((value / total) * 100);
  return (
    <div style={{
      background: COLORS.blanc, borderRadius: 16, padding: "18px 20px",
      border: `1px solid ${COLORS.ligne}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.noir, marginBottom: 2 }}>
        {value.toLocaleString("fr-FR")}
      </div>
      <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>
        {suffix ?? `sur ${total.toLocaleString("fr-FR")} patriotes`}
      </div>
      <div style={{ height: 5, background: COLORS.ligne, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 3, transition: "width 0.8s ease" }} />
      </div>
      <div style={{ textAlign: "right", fontSize: 10, fontWeight: 800, color, marginTop: 4 }}>{pct}%</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOTIF AFRICAIN SVG — Inspiré des motifs géométriques PASTEF
   Spirales, triangles, zigzags en vert et rouge
   ═══════════════════════════════════════════════════════════════ */

function AfricanPattern() {
  return (
    <svg viewBox="0 0 180 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      {/* Rangée 1 — Triangles */}
      <g transform="translate(20, 20)">
        <polygon points="0,40 20,0 40,40" fill={COLORS.vert} />
        <polygon points="50,40 70,0 90,40" fill={COLORS.rouge} />
        <polygon points="100,40 120,0 140,40" fill={COLORS.vert} />
      </g>
      {/* Zigzag */}
      <g transform="translate(10, 70)">
        <polyline points="0,0 20,18 40,0 60,18 80,0 100,18 120,0 140,18 160,0" fill="none" stroke={COLORS.rouge} strokeWidth="4" />
        <polyline points="0,12 20,30 40,12 60,30 80,12 100,30 120,12 140,30 160,12" fill="none" stroke={COLORS.vert} strokeWidth="4" />
      </g>
      {/* Spirale carrée */}
      <g transform="translate(30, 110)">
        <rect x="0" y="0" width="50" height="50" fill="none" stroke={COLORS.vert} strokeWidth="4" />
        <rect x="10" y="10" width="30" height="30" fill="none" stroke={COLORS.vert} strokeWidth="3" />
        <rect x="18" y="18" width="14" height="14" fill={COLORS.vert} />
      </g>
      <g transform="translate(95, 110)">
        <rect x="0" y="0" width="50" height="50" fill="none" stroke={COLORS.rouge} strokeWidth="4" />
        <rect x="10" y="10" width="30" height="30" fill="none" stroke={COLORS.rouge} strokeWidth="3" />
        <rect x="18" y="18" width="14" height="14" fill={COLORS.rouge} />
      </g>
      {/* Barres verticales */}
      <g transform="translate(15, 175)">
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={i} x1={i * 10} y1="0" x2={i * 10} y2="20" stroke={i % 2 === 0 ? COLORS.vert : COLORS.rouge} strokeWidth="3" />
        ))}
      </g>
      {/* Rangée 2 — Losanges */}
      <g transform="translate(20, 210)">
        <polygon points="25,0 50,25 25,50 0,25" fill={COLORS.rouge} />
        <polygon points="75,0 100,25 75,50 50,25" fill={COLORS.vert} />
        <polygon points="125,0 150,25 125,50 100,25" fill={COLORS.rouge} />
      </g>
      {/* Double zigzag */}
      <g transform="translate(10, 270)">
        <polyline points="0,0 15,14 30,0 45,14 60,0 75,14 90,0 105,14 120,0 135,14 150,0" fill="none" stroke={COLORS.vert} strokeWidth="3.5" />
      </g>
      {/* Triangles inversés */}
      <g transform="translate(20, 290)">
        <polygon points="0,0 40,0 20,35" fill={COLORS.vert} />
        <polygon points="50,0 90,0 70,35" fill={COLORS.rouge} />
        <polygon points="100,0 140,0 120,35" fill={COLORS.vert} />
      </g>
      {/* Barres + spirale */}
      <g transform="translate(15, 340)">
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={i} x1={i * 10} y1="0" x2={i * 10} y2="14" stroke={i % 2 === 0 ? COLORS.rouge : COLORS.vert} strokeWidth="2.5" />
        ))}
      </g>
      <g transform="translate(55, 360)">
        <circle cx="25" cy="25" r="24" fill="none" stroke={COLORS.vert} strokeWidth="4" />
        <circle cx="25" cy="25" r="14" fill="none" stroke={COLORS.rouge} strokeWidth="3" />
        <circle cx="25" cy="25" r="6" fill={COLORS.vert} />
      </g>
    </svg>
  );
}