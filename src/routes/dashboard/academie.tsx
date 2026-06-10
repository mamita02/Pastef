import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { COLORS } from "@/lib/constants/colors";
import { PILIERS } from "@/lib/data/piliers";

export const Route = createFileRoute("/dashboard/academie")({
  component: AcademiePage,
});

const pilier = PILIERS[1]; // Académie & Innovation

const FORMATIONS = [
  { titre: "Souveraineté économique",         progress: 78, niveau: "Avancé" },
  { titre: "Organisation politique moderne",  progress: 45, niveau: "Intermédiaire" },
  { titre: "Communication militante",         progress: 100, niveau: "Certifié" },
];

const BADGES = [
  { nom: "Mentor",            icon: "🎯", obtenu: true },
  { nom: "Communicant",       icon: "📢", obtenu: true },
  { nom: "Stratège",          icon: "♟️", obtenu: false },
  { nom: "Mobilisateur",      icon: "🚀", obtenu: false },
];

function AcademiePage() {
  return (
    <>
      <PilierHeader pilier={pilier} />

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* Formations en cours */}
        <div
          style={{
            background: COLORS.blanc,
            borderRadius: 16,
            padding: 20,
            border: `1px solid ${COLORS.ligne}`,
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 16px" }}>
            🎓 Mes formations
          </h3>
          {FORMATIONS.map((f, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{f.titre}</span>
                <span style={{ fontSize: 11, color: pilier.color, fontWeight: 700 }}>
                  {f.progress}%
                </span>
              </div>
              <div style={{ height: 5, background: COLORS.ligne, borderRadius: 3, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${f.progress}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  style={{ height: "100%", background: pilier.color, borderRadius: 3 }}
                />
              </div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>{f.niveau}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div
          style={{
            background: COLORS.blanc,
            borderRadius: 16,
            padding: 20,
            border: `1px solid ${COLORS.ligne}`,
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 16px" }}>🏅 Badges</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {BADGES.map((b) => (
              <div
                key={b.nom}
                style={{
                  textAlign: "center",
                  padding: 12,
                  borderRadius: 12,
                  background: b.obtenu ? `${pilier.color}10` : COLORS.creme,
                  opacity: b.obtenu ? 1 : 0.5,
                  border: `1px solid ${b.obtenu ? `${pilier.color}33` : COLORS.ligne}`,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 4 }}>{b.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700 }}>{b.nom}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// (Composant PilierHeader identique — voir talents.tsx)
// Pour éviter la duplication, extrais-le dans /components/dashboard/PilierHeader.tsx
function PilierHeader({ pilier }: { pilier: (typeof PILIERS)[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        marginBottom: 28,
        padding: 24,
        borderRadius: 16,
        background: `linear-gradient(135deg, ${pilier.color}10, ${pilier.color}03)`,
        borderLeft: `4px solid ${pilier.color}`,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, color: pilier.color, marginBottom: 8 }}>
        {pilier.tag}
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>
        {pilier.title}
      </h1>
      <p style={{ color: "#666", fontSize: 14, margin: 0, maxWidth: 720 }}>{pilier.desc}</p>
    </motion.div>
  );
}