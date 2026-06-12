import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

/**
 * ═══════════════════════════════════════════════════════════════
 *  President — Hero "Vision & Action" sur fond vert profond
 * ═══════════════════════════════════════════════════════════════
 *
 *  Le bouton "DÉCOUVRIR NOS ACTIONS" route vers /pastef
 *  (page publique de découverte du parti).
 * ═══════════════════════════════════════════════════════════════
 */

// ─── Couleurs hero ───
const VERT_DEEP = "#0A4D2E";
const VERT_DARK = "#073B23";
const VERT_LIGHT = "#1B7F3E";
const JAUNE = "#F4B400";
const BLANC = "#FFFFFF";
const BLANC_DOUX = "rgba(255,255,255,0.85)";
const BLANC_SUBTIL = "rgba(255,255,255,0.6)";

// ─── Étapes clés ───
const TIMELINE = [
  { annee: "2014", label: "Création de PASTEF" },
  { annee: "2017", label: "Députation à l'Assemblée" },
  { annee: "2024", label: "Premier Ministre" },
  { annee: "2026", label: "Plateforme Patriote" },
];

export function President() {
  return (
    <section
      id="president"
      style={{
        background: `linear-gradient(135deg, ${VERT_DEEP} 0%, ${VERT_DARK} 100%)`,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        padding: "60px 40px 40px",
      }}
    >
      <BackgroundPattern />

      <div
        style={{
          maxWidth: 1500,
          width: "100%",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          gap: 40,
          flex: 1,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ─── COLONNE TEXTE ─── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 18px",
              borderRadius: 6,
              background: "rgba(0,0,0,0.25)",
              border: `1px solid rgba(255,255,255,0.15)`,
              color: BLANC,
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: 2,
              marginBottom: 32,
              backdropFilter: "blur(10px)",
            }}
          >
            VISION &amp; ACTION
          </div>

          <h1
            style={{
              fontSize: "clamp(40px, 4.5vw, 72px)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              marginBottom: 28,
              color: BLANC,
            }}
          >
            Agir aujourd&rsquo;hui
            <br />
            pour <span style={{ color: JAUNE }}>changer</span>
            <br />
            <span style={{ color: JAUNE }}>demain.</span>
          </h1>

          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: BLANC_DOUX,
              maxWidth: 480,
              marginBottom: 36,
            }}
          >
            Des idées claires, des actions concrètes pour un Sénégal
            souverain, juste et prospère.
          </p>

          {/* ═══ BOUTON LINK vers /pastef ═══ */}
          <Link
            to="/pastef"
            style={{
              background: BLANC,
              color: VERT_DEEP,
              border: "none",
              borderRadius: 8,
              padding: "14px 26px",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.5,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 14px 36px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
            }}
          >
            DÉCOUVRIR NOS ACTIONS
            <ArrowRight />
          </Link>
        </motion.div>

        {/* ─── COLONNE PHOTO ─── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "10%",
              top: "50%",
              transform: "translateY(-50%)",
              width: "60%",
              height: "70%",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${VERT_LIGHT}40 0%, transparent 70%)`,
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
          <img
            src="/images/Sonko.png"
            alt="Ousmane Sonko, Premier Ministre du Sénégal"
            style={{
              width: "100%",
              maxWidth: 720,
              objectFit: "contain",
              display: "block",
              position: "relative",
              filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.4))",
            }}
          />
        </motion.div>
      </div>

      <Chronologie />
    </section>
  );
}

// ─── Chronologie ───
function Chronologie() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{
        maxWidth: 1100,
        width: "100%",
        margin: "60px auto 20px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 32,
          left: "8%",
          right: "8%",
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${JAUNE}80 50%, transparent 100%)`,
          zIndex: 0,
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${TIMELINE.length}, 1fr)`,
          position: "relative",
          zIndex: 1,
        }}
      >
        {TIMELINE.map((etape, idx) => (
          <motion.div
            key={etape.annee}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + idx * 0.1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: JAUNE,
                border: `3px solid ${VERT_DEEP}`,
                boxShadow: `0 0 0 2px ${JAUNE}, 0 4px 12px ${JAUNE}60`,
                marginTop: 24,
              }}
            />
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: BLANC,
                letterSpacing: -1,
              }}
            >
              {etape.annee}
            </div>
            <div
              style={{
                fontSize: 12,
                color: BLANC_SUBTIL,
                fontWeight: 600,
                maxWidth: 160,
                lineHeight: 1.3,
              }}
            >
              {etape.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Décorations SVG ───
function BackgroundPattern() {
  return (
    <>
      <svg
        style={{
          position: "absolute",
          right: -100,
          bottom: -100,
          width: 500,
          height: 500,
          opacity: 0.08,
          pointerEvents: "none",
          zIndex: 1,
        }}
        viewBox="0 0 500 500"
      >
        <circle cx="250" cy="250" r="240" fill="none" stroke="#fff" strokeWidth="1" />
        <circle cx="250" cy="250" r="180" fill="none" stroke="#fff" strokeWidth="1" />
        <circle cx="250" cy="250" r="120" fill="none" stroke="#fff" strokeWidth="1" />
        <circle cx="250" cy="250" r="60" fill="none" stroke="#fff" strokeWidth="1" />
      </svg>
      <svg
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 400,
          height: 400,
          opacity: 0.06,
          pointerEvents: "none",
          zIndex: 1,
        }}
        viewBox="0 0 400 400"
      >
        <path d="M 400 50 Q 200 150 0 100" fill="none" stroke="#fff" strokeWidth="1.5" />
        <path d="M 400 100 Q 200 200 0 150" fill="none" stroke="#fff" strokeWidth="1.5" />
        <path d="M 400 150 Q 200 250 0 200" fill="none" stroke="#fff" strokeWidth="1.5" />
      </svg>
      <svg
        style={{
          position: "absolute",
          left: 40,
          top: 200,
          width: 120,
          height: 120,
          opacity: 0.1,
          pointerEvents: "none",
          zIndex: 1,
        }}
        viewBox="0 0 120 120"
      >
        {[0, 1, 2, 3, 4].map((row) =>
          [0, 1, 2, 3, 4].map((col) => (
            <circle
              key={`${row}-${col}`}
              cx={20 + col * 20}
              cy={20 + row * 20}
              r="1.5"
              fill="#fff"
            />
          )),
        )}
      </svg>
    </>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}