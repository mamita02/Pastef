import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { COLORS } from "@/lib/constants/colors";
import { getUser } from "@/lib/auth";

/**
 * ═══════════════════════════════════════════════════════════════
 *  VUE D'ENSEMBLE — /dashboard (route enfant par défaut)
 *  S'affiche dans le <Outlet /> de dashboard.tsx
 * ═══════════════════════════════════════════════════════════════
 */

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

const ACTIVITES = [
  { date: "Aujourd'hui", titre: "Contribution validée",     desc: "+25 000 FCFA pour le projet de Thiès",     color: COLORS.vert },
  { date: "Hier",        titre: "Nouvelle formation suivie", desc: "Module : Souveraineté économique",         color: COLORS.rouge },
  { date: "Il y a 2j",   titre: "Badge obtenu",              desc: "Mentor Diaspora — Niveau 2",               color: "#D4A017" },
  { date: "Il y a 5j",   titre: "Participation Congrès",     desc: "Présent au Premier Congrès de Diamniadio", color: COLORS.vert },
];

function DashboardOverview() {
  const user = getUser();
  if (!user) return null;

  const KPI = [
    { label: "Rang national",   value: `#${user.rang}`,                              color: COLORS.vert,  icon: "🏆", trend: "+5" },
    { label: "Points patriote", value: user.points.toLocaleString("fr-FR"),          color: COLORS.rouge, icon: "⭐", trend: "+120" },
    { label: "Contribution",    value: `${(user.contribution / 1000).toFixed(0)}K FCFA`, color: COLORS.vert,  icon: "💰", trend: "+15K" },
    { label: "Engagement",      value: `${user.engagement}%`,                        color: "#D4A017",    icon: "🔥", trend: "+3%" },
  ];

  return (
    <>
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, marginBottom: 4 }}>
          Bonjour {user.nom.split(" ")[0]} 👋
        </h1>
        <p style={{ color: "#666", fontSize: 14, margin: 0 }}>
          {user.fonction} · {user.region}
        </p>
      </motion.div>

      {/* KPI cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {KPI.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              background: COLORS.blanc,
              borderRadius: 16,
              padding: 20,
              border: `1px solid ${COLORS.ligne}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: `${k.color}15`,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 20,
                }}
              >
                {k.icon}
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: COLORS.vert,
                  fontWeight: 700,
                  background: `${COLORS.vert}15`,
                  padding: "3px 8px",
                  borderRadius: 999,
                  height: "fit-content",
                }}
              >
                ↑ {k.trend}
              </span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#888",
                letterSpacing: 1.5,
                fontWeight: 700,
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              {k.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -1 }}>
              {k.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activité récente */}
      <div
        style={{
          background: COLORS.blanc,
          borderRadius: 16,
          padding: 24,
          border: `1px solid ${COLORS.ligne}`,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 20px", letterSpacing: -0.3 }}>
          Activité récente
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {ACTIVITES.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              style={{
                display: "flex",
                gap: 14,
                padding: 14,
                borderRadius: 12,
                background: COLORS.creme,
                borderLeft: `3px solid ${a.color}`,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: a.color,
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 800, fontSize: 14 }}>{a.titre}</span>
                  <span style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>{a.date}</span>
                </div>
                <div style={{ fontSize: 13, color: "#555" }}>{a.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}