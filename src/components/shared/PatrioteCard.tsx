import { motion } from "framer-motion";
import { COLORS } from "@/lib/constants/colors";
import type { Patriote } from "@/lib/data/patriotes";

/**
 * ═══════════════════════════════════════════════════════════════
 *  PatrioteCard — Carte d'un patriote dans le classement
 * ═══════════════════════════════════════════════════════════════
 *
 *  Carte affichée dans le carrousel "Top Patriotes" (Classement.tsx).
 *  Design "premium" : photo en haut, infos structurées en bas,
 *  bande de motifs sénégalais sur le côté droit.
 *
 *  Le champ `photo` accepte :
 *    • une URL externe       — "https://..."
 *    • un chemin local        — "/images/patriotes/xxx.jpg"
 *    • des initiales          — "MD" (fallback si pas d'image)
 * ═══════════════════════════════════════════════════════════════
 */

type PatrioteCardProps = {
  p: Patriote;
};

export function PatrioteCard({ p }: PatrioteCardProps) {
  const isTop3 = (p.classement ?? 99) <= 3;

  // Détection automatique : image (URL ou chemin local) ou initiales
  const hasImage =
    !!p.photo && (p.photo.startsWith("http") || p.photo.startsWith("/"));

  return (
    <div
      style={{
        width: 400,
        flexShrink: 0,
        background: COLORS.blanc,
        border: `1px solid ${COLORS.ligne}`,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
        position: "relative",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.borderColor = COLORS.vert;
        e.currentTarget.style.boxShadow = `0 24px 50px ${COLORS.vert}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = COLORS.ligne;
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
      }}
    >
      {/* ═══ EN-TÊTE — Photo + badge classement ═══ */}
      <div
        style={{
          position: "relative",
          height: 180,
          background: `linear-gradient(135deg, ${COLORS.vert} 0%, ${COLORS.vertClair} 100%)`,
          overflow: "hidden",
        }}
      >
        {/* Photo de fond — si URL/chemin local, sinon initiales */}
        {hasImage ? (
          <img
            src={p.photo}
            alt={p.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontSize: 56,
              fontWeight: 900,
              letterSpacing: -2,
              opacity: 0.95,
            }}
          >
            {p.photo}
          </div>
        )}

        {/* Overlay dégradé pour la lisibilité */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.4) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Bande de motifs sénégalais sur le bord droit */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: 28,
            backgroundImage: "url(/images/pattern-sn.png)",
            backgroundSize: "28px auto",
            backgroundRepeat: "repeat-y",
            opacity: 0.85,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />

        {/* Badge classement (top-left) */}
        {p.classement && (
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              padding: "6px 12px",
              background: isTop3 ? "#FFD700" : "rgba(255,255,255,0.95)",
              color: isTop3 ? "#000" : COLORS.noir,
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 0.5,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {isTop3 && <span style={{ fontSize: 12 }}>🏆</span>}
            #{p.classement}
          </div>
        )}

        {/* Drapeau (top-right, devant la bande de motifs) */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 50,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.95)",
            display: "grid",
            placeItems: "center",
            fontSize: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {p.flag}
        </div>
      </div>

      {/* ═══ CORPS — Identité + données ═══ */}
      <div style={{ padding: "18px 20px 20px" }}>
        {/* Nom + fonction */}
        <h3
          style={{
            color: COLORS.noir,
            fontWeight: 900,
            fontSize: 17,
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: -0.3,
          }}
        >
          {p.name}
        </h3>
        <div
          style={{
            color: COLORS.vert,
            fontSize: 12,
            marginTop: 4,
            fontWeight: 700,
            letterSpacing: 0.3,
          }}
        >
          {p.fonction}
        </div>

        {/* Localisation */}
        <div
          style={{
            color: "#888",
            fontSize: 12,
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontWeight: 500,
          }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {p.region}
        </div>

        {/* Séparateur */}
        <div style={{ height: 1, background: COLORS.ligne, margin: "14px 0" }} />

        {/* Contribution */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              color: "#999",
              fontSize: 9,
              letterSpacing: 1.5,
              fontWeight: 800,
              marginBottom: 4,
            }}
          >
            CONTRIBUTION
          </div>
          <div
            style={{
              color: COLORS.noir,
              fontWeight: 900,
              fontSize: 20,
              letterSpacing: -0.5,
            }}
          >
            {p.contribution}{" "}
            <span
              style={{
                fontSize: 11,
                color: "#999",
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              FCFA
            </span>
          </div>
        </div>

        {/* Barre d'engagement */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "#666",
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            <span>Engagement</span>
            <span
              style={{
                color: p.engagement >= 95 ? COLORS.vert : COLORS.rouge,
                fontWeight: 900,
              }}
            >
              {p.engagement}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: COLORS.ligne,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${p.engagement}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                height: "100%",
                background:
                  p.engagement >= 95
                    ? `linear-gradient(90deg, ${COLORS.vert}, ${COLORS.vertClair})`
                    : `linear-gradient(90deg, ${COLORS.rouge}, ${COLORS.rougeClair})`,
                borderRadius: 4,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}