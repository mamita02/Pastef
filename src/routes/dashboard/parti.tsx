import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { COLORS } from "@/lib/constants/colors";
import { PILIERS } from "@/lib/data/piliers";

export const Route = createFileRoute("/dashboard/parti")({
  component: PartiPage,
});

const pilier = PILIERS[3]; // Vie du Parti & Intelligence Collective

const AGENDA = [
  { date: "12 JUIN", titre: "Réunion de cellule — Dakar Plateau", lieu: "Maison du Parti, Dakar" },
  { date: "18 JUIN", titre: "Webinaire Diaspora Europe",          lieu: "En ligne (Zoom)" },
  { date: "25 JUIN", titre: "Hommage aux Martyrs",                lieu: "Place de la Nation" },
];

const CONSULTATIONS = [
  { titre: "Réforme du système éducatif",  participants: 12450, fin: "Dans 4 jours" },
  { titre: "Stratégie diaspora 2030",      participants: 8732,  fin: "Dans 11 jours" },
];

function PartiPage() {
  return (
    <>
      <PilierHeader pilier={pilier} />

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
        {/* Agenda */}
        <div
          style={{
            background: COLORS.blanc,
            borderRadius: 16,
            padding: 20,
            border: `1px solid ${COLORS.ligne}`,
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 16px" }}>📅 Mon agenda</h3>
          {AGENDA.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                display: "flex",
                gap: 14,
                padding: "12px 14px",
                background: COLORS.creme,
                borderRadius: 12,
                marginBottom: 10,
                borderLeft: `3px solid ${pilier.color}`,
              }}
            >
              <div
                style={{
                  width: 56,
                  flexShrink: 0,
                  textAlign: "center",
                  borderRight: `1px solid ${COLORS.ligne}`,
                  paddingRight: 12,
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 800, color: pilier.color, letterSpacing: 1 }}>
                  {e.date.split(" ")[0]}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#666" }}>
                  {e.date.split(" ")[1]}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{e.titre}</div>
                <div style={{ fontSize: 11, color: "#888" }}>📍 {e.lieu}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Consultations citoyennes */}
        <div
          style={{
            background: COLORS.blanc,
            borderRadius: 16,
            padding: 20,
            border: `1px solid ${COLORS.ligne}`,
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 16px" }}>
            🗳️ Consultations citoyennes
          </h3>
          {CONSULTATIONS.map((c, i) => (
            <div
              key={i}
              style={{
                padding: 12,
                background: COLORS.creme,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{c.titre}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#666" }}>
                <span>👥 {c.participants.toLocaleString("fr-FR")}</span>
                <span style={{ color: pilier.color, fontWeight: 700 }}>⏱ {c.fin}</span>
              </div>
            </div>
          ))}
          <button
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              background: pilier.color,
              color: "#fff",
              border: "none",
              fontWeight: 800,
              cursor: "pointer",
              marginTop: 6,
              fontFamily: "inherit",
            }}
          >
            Participer →
          </button>
        </div>
      </div>
    </>
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