import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { COLORS } from "@/lib/constants/colors";
import { PILIERS } from "@/lib/data/piliers";

export const Route = createFileRoute("/dashboard/codeveloppement")({
  component: CodevPage,
});

const pilier = PILIERS[2]; // Co-Développement & Diaspora

const PROJETS = [
  { region: "Thiès",       montant: 45000, objectif: 100000, contributeurs: 234 },
  { region: "Kaolack",     montant: 28000, objectif: 80000,  contributeurs: 156 },
  { region: "Ziguinchor",  montant: 67000, objectif: 75000,  contributeurs: 412 },
];

function CodevPage() {
  return (
    <>
      <PilierHeader pilier={pilier} />

      {/* Stats globales */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatBlock label="Ma contribution totale" value="125 000 FCFA" color={pilier.color} />
        <StatBlock label="Projets soutenus"       value="8"             color={pilier.color} />
        <StatBlock label="Régions impactées"      value="5 / 14"        color={pilier.color} />
      </div>

      {/* Projets en cours */}
      <div
        style={{
          background: COLORS.blanc,
          borderRadius: 16,
          padding: 24,
          border: `1px solid ${COLORS.ligne}`,
          marginBottom: 24,
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 20px" }}>
          🌍 Crowdfunding territorial actif
        </h3>
        {PROJETS.map((p, i) => {
          const pct = Math.round((p.montant / p.objectif) * 100);
          return (
            <div key={p.region} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>📍 {p.region}</span>
                <span style={{ fontSize: 12, color: "#666" }}>
                  {p.montant.toLocaleString("fr-FR")} / {p.objectif.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
              <div style={{ height: 8, background: COLORS.ligne, borderRadius: 4, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  style={{ height: "100%", background: pilier.color, borderRadius: 4 }}
                />
              </div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
                {p.contributeurs} patriotes contributeurs · {pct}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Moyens de paiement */}
      <div
        style={{
          background: COLORS.blanc,
          borderRadius: 16,
          padding: 20,
          border: `1px solid ${COLORS.ligne}`,
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 14px" }}>
          💳 Moyens de paiement connectés
        </h3>
        <div style={{ display: "flex", gap: 12 }}>
          <PaymentChip label="Orange Money" icon="🟠" />
          <PaymentChip label="Wave" icon="🌊" />
        </div>
      </div>
    </>
  );
}

function StatBlock({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      style={{
        background: COLORS.blanc,
        borderRadius: 14,
        padding: 18,
        border: `1px solid ${COLORS.ligne}`,
      }}
    >
      <div style={{ fontSize: 10, color: "#888", letterSpacing: 1.5, fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
    </div>
  );
}

function PaymentChip({ label, icon }: { label: string; icon: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 999,
        background: COLORS.creme,
        border: `1px solid ${COLORS.ligne}`,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
      <span style={{ color: COLORS.vert, fontSize: 14 }}>✓</span>
    </div>
  );
}

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