import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { COLORS } from "@/lib/constants/colors";
import { PILIERS } from "@/lib/data/piliers";

export const Route = createFileRoute("/dashboard/talents")({
  component: TalentsPage,
});

const pilier = PILIERS[0]; // Talents, Emploi & Marchés

function TalentsPage() {
  return (
    <>
      <PilierHeader pilier={pilier} />

      {/* Grille de widgets spécifiques au Pilier 01 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        <WidgetCard color={pilier.color} title="Profil pro" icon="📋">
          <div style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>
            Complétude de ton profil
          </div>
          <ProgressBar value={72} color={pilier.color} />
          <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
            <strong>72 %</strong> — il te manque 3 sections (formations, langues, références)
          </div>
        </WidgetCard>

        <WidgetCard color={pilier.color} title="Hub Marchés publics" icon="📑">
          <div style={{ fontSize: 24, fontWeight: 900, color: pilier.color }}>14</div>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
            Appels d'offres correspondant à ton profil
          </div>
          <ActionLink color={pilier.color}>Consulter les opportunités →</ActionLink>
        </WidgetCard>

        <WidgetCard color={pilier.color} title="Matching IA" icon="🤖">
          <div style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>
            3 offres d'emploi à fort potentiel détectées cette semaine.
          </div>
          <ActionLink color={pilier.color}>Voir les matchs →</ActionLink>
        </WidgetCard>

        <WidgetCard color={pilier.color} title="Mentorat" icon="🎯">
          <div style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>
            Prochaine session : <strong>Mardi 16 juin, 18h</strong>
          </div>
          <div style={{ fontSize: 12, color: "#888" }}>Mentor : Fatou Sow (Diaspora Canada)</div>
        </WidgetCard>
      </div>
    </>
  );
}

// ═════════ Composants partagés (à extraire dans /components/dashboard/ plus tard) ═════════

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
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 3,
          color: pilier.color,
          marginBottom: 8,
        }}
      >
        {pilier.tag}
      </div>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 900,
          letterSpacing: -1,
          marginBottom: 8,
          color: COLORS.noir,
        }}
      >
        {pilier.title}
      </h1>
      <p style={{ color: "#666", fontSize: 14, margin: 0, maxWidth: 720 }}>
        {pilier.desc}
      </p>
    </motion.div>
  );
}

function WidgetCard({
  color,
  title,
  icon,
  children,
}: {
  color: string;
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: COLORS.blanc,
        borderRadius: 16,
        padding: 20,
        border: `1px solid ${COLORS.ligne}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `${color}15`,
            display: "grid",
            placeItems: "center",
            fontSize: 16,
          }}
        >
          {icon}
        </span>
        <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: 6, background: COLORS.ligne, borderRadius: 3, overflow: "hidden" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1 }}
        style={{ height: "100%", background: color, borderRadius: 3 }}
      />
    </div>
  );
}

function ActionLink({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <button
      style={{
        background: "transparent",
        border: "none",
        color,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: 1,
        cursor: "pointer",
        padding: 0,
        textAlign: "left",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}