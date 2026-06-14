import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

/**
 * ═══════════════════════════════════════════════════════════════
 *  President — Section "Mot du Président"
 * ═══════════════════════════════════════════════════════════════
 *
 *  Design clair : photo à gauche sur cercle vert, citation à droite,
 *  signature manuscrite + bouton vers /pastef, timeline 5 étapes en bas.
 *
 *  ⚠️ Photo : remplacer /public/images/Sonko.png par la nouvelle
 *      (l'image carrée fournie). Le composant gère le cadrage.
 * ═══════════════════════════════════════════════════════════════
 */

// ─── Couleurs ───
const VERT = "#1B7F3E";
const VERT_DEEP = "#0F4023";
const ROUGE = "#C61C3E";
const ROUGE_DEEP = "#8E1430";
const NOIR = "#1A1A1A";
const TEXTE = "#3A3A3A";
const FOND = "#FAFAF7";
const GRIS_DOUX = "#6B6B6B";

// ─── Timeline 5 étapes (couleurs alternées vert / rouge) ───
type IconName = "flag" | "building" | "pin" | "briefcase" | "users";

const TIMELINE: { annee: string; label: string; color: string; icon: IconName }[] = [
  { annee: "2014", label: "Fondation du parti PASTEF.",                                  color: VERT,  icon: "flag" },
  { annee: "2017", label: "Élu député à l'Assemblée nationale.",                         color: ROUGE, icon: "building" },
  { annee: "2022", label: "Élu maire de Ziguinchor.",                                    color: VERT,  icon: "pin" },
  { annee: "2024", label: "Nommé Premier ministre du Sénégal après la présidentielle.",  color: ROUGE, icon: "briefcase" },
  { annee: "2026", label: "Président de l'Assemblée nationale et du PASTEF.",            color: VERT,  icon: "users" },
];

export function President() {
  return (
    <section
      id="president"
      style={{
        background: FOND,
        padding: "80px 40px 70px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Motif décoratif (points subtils en haut-gauche) */}
      <DotsPattern />

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ═══════ BLOC HAUT : photo + texte ═══════ */}
        <div
          className="president-hero"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
            gap: 60,
            alignItems: "center",
            marginBottom: 80,
          }}
        >
          {/* ─── PHOTO (gauche) — fondue avec l'arrière-plan ─── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/images/Sonko.png"
              alt="Ousmane Sonko, Président de PASTEF"
              style={{
                width: "100%",
                maxWidth: 520,
                display: "block",
                // Fondu radial doux : centre opaque, bords transparents
                maskImage:
                  "radial-gradient(ellipse 70% 75% at center, black 40%, rgba(0,0,0,0.6) 65%, transparent 92%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 75% at center, black 40%, rgba(0,0,0,0.6) 65%, transparent 92%)",
              }}
            />
          </motion.div>

          {/* ─── TEXTE (droite) ─── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Titre bicolore */}
            <h2
              style={{
                fontSize: "clamp(42px, 5vw, 76px)",
                fontWeight: 900,
                lineHeight: 1.0,
                margin: 0,
                marginBottom: 16,
                letterSpacing: -2,
                fontFamily: "inherit",
              }}
            >
              <span style={{ color: VERT, display: "block" }}>MOT DU</span>
              <span style={{ color: ROUGE_DEEP, display: "block" }}>PRÉSIDENT</span>
            </h2>

            {/* Petite barre décorative vert + rouge */}
            <div
              style={{
                display: "flex",
                gap: 4,
                marginBottom: 40,
                width: 90,
              }}
            >
              <div style={{ flex: 1, height: 3, background: VERT, borderRadius: 2 }} />
              <div style={{ flex: 1, height: 3, background: ROUGE, borderRadius: 2 }} />
            </div>

            {/* Citation */}
            <div style={{ position: "relative", maxWidth: 620, marginBottom: 38 }}>
              {/* Guillemet ouvrant */}
              <div
                style={{
                  fontSize: 64,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  color: VERT,
                  lineHeight: 0.4,
                  fontWeight: 900,
                  marginBottom: 24,
                  userSelect: "none",
                }}
                aria-hidden="true"
              >
                &ldquo;
              </div>

              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: TEXTE,
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Notre combat est celui d&rsquo;un Sénégal{" "}
                <strong style={{ color: VERT, fontWeight: 800 }}>
                  souverain, juste et prospère.
                </strong>
                <br />
                Avec foi, travail et détermination, nous bâtirons le Sénégal que nous méritons.
              </p>

              {/* Guillemet fermant (positionné en bas à droite) */}
              <div
                style={{
                  position: "absolute",
                  right: -10,
                  bottom: -34,
                  fontSize: 64,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  color: VERT,
                  lineHeight: 0.4,
                  fontWeight: 900,
                  userSelect: "none",
                }}
                aria-hidden="true"
              >
                &rdquo;
              </div>
            </div>

            {/* Signature + Bouton */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 30,
                flexWrap: "wrap",
                marginTop: 24,
              }}
            >
              {/* Signature manuscrite */}
              <div>
                <div
                  style={{
                    fontSize: 30,
                    fontStyle: "italic",
                    fontFamily:
                      '"Dancing Script", "Brush Script MT", "Lucida Handwriting", "Apple Chancery", cursive',
                    color: VERT,
                    fontWeight: 600,
                    lineHeight: 1,
                    marginBottom: 6,
                    letterSpacing: 0.3,
                  }}
                >
                  Ousmane Sonko
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 2.5,
                    color: GRIS_DOUX,
                  }}
                >
                  PRÉSIDENT DE PASTEF
                </div>
              </div>

              {/* Bouton "DÉCOUVRIR LE PARTI" */}
              <Link
                to="/pastef"
                style={{
                  background: VERT_DEEP,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "14px 26px 14px 14px",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 14,
                  boxShadow: `0 8px 22px ${VERT_DEEP}55`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 12px 28px ${VERT_DEEP}77`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = `0 8px 22px ${VERT_DEEP}55`;
                }}
              >
                {/* Cercle blanc avec flèche */}
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "#fff",
                    color: VERT_DEEP,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <ArrowRight size={13} />
                </span>
                DÉCOUVRIR LE PARTI
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ═══════ TIMELINE BAS — 5 étapes ═══════ */}
        <Chronologie />
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          .president-hero {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .timeline-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 32px 20px !important;
          }
          .timeline-grid::before {
            display: none !important;
          }
        }
        @media (max-width: 560px) {
          .timeline-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHRONOLOGIE
   ═══════════════════════════════════════════════════════════════ */

function Chronologie() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{ position: "relative" }}
    >
      <div
        className="timeline-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${TIMELINE.length}, 1fr)`,
          gap: 24,
          position: "relative",
        }}
      >
        {/* Ligne horizontale fine entre les pastilles (desktop) */}
        <TimelineConnector />

        {TIMELINE.map((etape, idx) => (
          <motion.div
            key={etape.annee}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + idx * 0.08 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 14,
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Pastille avec icône */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: etape.color,
                display: "grid",
                placeItems: "center",
                boxShadow: `0 6px 16px ${etape.color}55`,
                border: "4px solid #fff",
              }}
            >
              <TimelineIcon name={etape.icon} />
            </div>

            {/* Année + petite barre colorée */}
            <div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: NOIR,
                  lineHeight: 1,
                  letterSpacing: -0.8,
                  marginBottom: 6,
                }}
              >
                {etape.annee}
              </div>
              <div
                style={{
                  width: 28,
                  height: 2.5,
                  background: etape.color,
                  margin: "0 auto",
                  borderRadius: 1,
                }}
              />
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: 13,
                color: GRIS_DOUX,
                fontWeight: 500,
                lineHeight: 1.5,
                margin: 0,
                maxWidth: 200,
                padding: "0 6px",
              }}
            >
              {etape.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Ligne de connexion entre les pastilles ─── */
function TimelineConnector() {
  // On positionne 4 segments colorés entre les 5 pastilles
  return (
    <div
      style={{
        position: "absolute",
        top: 28,
        left: 0,
        right: 0,
        height: 2,
        display: "grid",
        gridTemplateColumns: `repeat(${TIMELINE.length}, 1fr)`,
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      {TIMELINE.map((etape, idx) => {
        const isLast = idx === TIMELINE.length - 1;
        if (isLast) return <div key={idx} />;
        const next = TIMELINE[idx + 1];
        return (
          <div key={idx} style={{ position: "relative", display: "flex", alignItems: "center" }}>
            {/* Demi-ligne droite depuis la pastille courante */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                right: 0,
                height: 2,
                background: `repeating-linear-gradient(90deg, ${etape.color} 0 4px, transparent 4px 8px)`,
                opacity: 0.5,
              }}
            />
            {/* Demi-ligne gauche vers la pastille suivante (colorée next) */}
            <div
              style={{
                position: "absolute",
                left: "100%",
                width: "50%",
                height: 2,
                background: `repeating-linear-gradient(90deg, ${next.color} 0 4px, transparent 4px 8px)`,
                opacity: 0.5,
              }}
            />
            {/* Petit cercle vide au milieu */}
            <div
              style={{
                position: "absolute",
                left: "100%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#fff",
                border: `1.5px solid ${etape.color}`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ICÔNES TIMELINE
   ═══════════════════════════════════════════════════════════════ */

function TimelineIcon({ name }: { name: IconName }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: 2.4 as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "flag":
      return (
        <svg {...common}>
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      );
    case "building":
      return (
        <svg {...common}>
          <path d="M3 21h18" />
          <path d="M4 21V8l8-5 8 5v13" />
          <line x1="8" y1="21" x2="8" y2="12" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="16" y1="21" x2="16" y2="12" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...common}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
  }
}

/* ═══════════════════════════════════════════════════════════════
   DÉCORATIONS
   ═══════════════════════════════════════════════════════════════ */

function DotsPattern() {
  return (
    <svg
      style={{
        position: "absolute",
        left: 30,
        top: 50,
        width: 180,
        height: 180,
        pointerEvents: "none",
        zIndex: 1,
      }}
      viewBox="0 0 180 180"
    >
      {Array.from({ length: 9 }).map((_, row) =>
        Array.from({ length: 9 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={10 + col * 20}
            cy={10 + row * 20}
            r="1.4"
            fill="#B0B0B0"
            opacity={0.55 - (row + col) * 0.025}
          />
        ))
      )}
    </svg>
  );
}

function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}