import { PatrioteCard } from "@/components/shared/PatrioteCard";
import { COLORS } from "@/lib/constants/colors";
import { PATRIOTES, type Patriote } from "@/lib/data/patriotes";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * ═══════════════════════════════════════════════════════════════
 *  Classement — Carrousel "Top Patriotes"
 * ═══════════════════════════════════════════════════════════════
 *
 *  Carrousel auto-défilant affichant les patriotes les plus engagés.
 *  Largeur de carte : 320px → environ 6 visibles sur desktop large.
 *  Au clic : popup détaillé avec photo, biographie et réseaux sociaux.
 * ═══════════════════════════════════════════════════════════════
 */

export function Classement() {
  const [selectedPatriote, setSelectedPatriote] = useState<Patriote | null>(null);

  return (
    <section
      id="classement"
      style={{
        padding: "120px 0",
        background: COLORS.creme,
        overflow: "hidden",
      }}
    >
      {/* ═══ Header de section ═══ */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 32px",
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: 999,
            background: COLORS.blanc,
            border: `1px solid ${COLORS.rouge}44`,
            color: COLORS.rouge,
            fontSize: 11,
            letterSpacing: 3,
            fontWeight: 800,
            marginBottom: 20,
          }}
        >
          CLASSEMENT
        </div>
        <h2
          style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 900,
            color: COLORS.noir,
            letterSpacing: -1.5,
            marginBottom: 14,
          }}
        >
          Top <span style={{ color: COLORS.vert }}>Patriotes</span>
        </h2>
        <p
          style={{
            color: "#444",
            fontSize: 16,
            maxWidth: 640,
            margin: "0 auto",
            fontWeight: 500,
          }}
        >
          Les membres les plus engagés du Sénégal et de la diaspora.
        </p>
      </div>

      {/* ═══ Carrousel auto-défilant ═══ */}
      <div className="carousel-wrap" style={{ overflow: "hidden", position: "relative" }}>
        {/* Masque fondu sur les bords */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            background: `linear-gradient(90deg, ${COLORS.creme} 0%, transparent 5%, transparent 95%, ${COLORS.creme} 100%)`,
          }}
        />

        {/* Piste */}
        <div className="carousel-track" style={{ display: "flex", gap: 24, width: "fit-content" }}>
          {[...PATRIOTES, ...PATRIOTES].map((p, i) => (
            <div key={i} onClick={() => setSelectedPatriote(p)}>
              <PatrioteCard p={p} />
            </div>
          ))}
        </div>
      </div>

      {/* ═══ POPUP PATRIOTE ═══ */}
      <AnimatePresence>
        {selectedPatriote && (
          <PatriotePopup
            patriote={selectedPatriote}
            onClose={() => setSelectedPatriote(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   POPUP — Design premium avec photo, bio et réseaux sociaux
   ═══════════════════════════════════════════════════════════════ */

function PatriotePopup({ patriote, onClose }: { patriote: Patriote; onClose: () => void }) {
  const p = patriote;
  const isTop3 = (p.classement ?? 99) <= 3;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "grid",
        placeItems: "center",
        zIndex: 9999,
        padding: 20,
        fontFamily: "'Outfit', system-ui, sans-serif",
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 880,
          maxHeight: "92vh",
          background: COLORS.blanc,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.4)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 340px) minmax(0, 1fr)",
        }}
        className="patriote-popup-grid"
      >
        {/* ═══ COLONNE GAUCHE — Photo + classement ═══ */}
        <div
          style={{
            position: "relative",
            background: `linear-gradient(135deg, ${COLORS.vert}, ${COLORS.vertClair})`,
            minHeight: 480,
          }}
        >
          {p.photo && p.photo.startsWith("http") ? (
            <img
              src={p.photo}
              alt={p.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                fontSize: 96,
                fontWeight: 900,
                letterSpacing: -3,
              }}
            >
              {p.photo}
            </div>
          )}

          {/* Overlay bas */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 200,
              background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Bande motifs côté droit */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: 32,
              backgroundImage: "url(/images/pattern-sn.png)",
              backgroundSize: "32px auto",
              backgroundRepeat: "repeat-y",
              opacity: 0.6,
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          />

          {/* Badge classement */}
          {p.classement && (
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                padding: "8px 14px",
                background: isTop3 ? "#FFD700" : "rgba(255,255,255,0.95)",
                color: isTop3 ? "#000" : COLORS.noir,
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 900,
                letterSpacing: 0.5,
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {isTop3 && <span style={{ fontSize: 14 }}>🏆</span>}
              Rang #{p.classement}
            </div>
          )}

          {/* Drapeau */}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 56,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.95)",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
              boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
            }}
          >
            {p.flag}
          </div>

          {/* Identité en bas de la photo */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 24,
              right: 24,
              color: "#fff",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 2,
                opacity: 0.85,
                marginBottom: 6,
                textTransform: "uppercase",
              }}
            >
              {p.fonction}
            </div>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 900,
                margin: 0,
                lineHeight: 1.15,
                letterSpacing: -0.5,
              }}
            >
              {p.name}
            </h2>
            <div
              style={{
                fontSize: 12,
                marginTop: 8,
                opacity: 0.85,
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontWeight: 600,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {p.region}
            </div>
          </div>
        </div>

        {/* ═══ COLONNE DROITE — Contenu ═══ */}
        <div
          style={{
            padding: "32px 36px 28px",
            overflowY: "auto",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Bouton fermeture */}
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 36,
              height: 36,
              borderRadius: 10,
              border: `1px solid ${COLORS.ligne}`,
              background: COLORS.blanc,
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = COLORS.creme;
              e.currentTarget.style.borderColor = COLORS.rouge;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = COLORS.blanc;
              e.currentTarget.style.borderColor = COLORS.ligne;
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.noir} strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Stats compactes en haut */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 24,
              marginTop: 8,
              paddingRight: 50,
            }}
          >
            <StatBox label="Contribution" value={`${p.contribution}`} suffix="FCFA" color={COLORS.vert} />
            <StatBox label="Engagement" value={`${p.engagement}%`} color={p.engagement >= 95 ? COLORS.vert : COLORS.rouge} />
          </div>

          {/* Slogan */}
          {p.slogan && (
            <div
              style={{
                padding: "16px 18px",
                background: `${COLORS.vert}08`,
                border: `1px solid ${COLORS.vert}18`,
                borderRadius: 12,
                marginBottom: 20,
                borderLeft: `3px solid ${COLORS.vert}`,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: 1.8,
                  color: COLORS.vert,
                  marginBottom: 4,
                }}
              >
                ❝ DEVISE
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: COLORS.noir,
                  fontStyle: "italic",
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                « {p.slogan} »
              </div>
            </div>
          )}

          {/* Œuvre / parcours */}
          {p.oeuvre && (
            <div style={{ marginBottom: 24 }}>
              <SubsectionLabel>Son engagement</SubsectionLabel>
              <p style={{ fontSize: 13, color: "#444", lineHeight: 1.7, margin: 0 }}>
                {p.oeuvre}
              </p>
            </div>
          )}

          {/* Réseaux sociaux */}
          {(p.linkedin || p.twitter || p.facebook) && (
            <div style={{ marginTop: "auto" }}>
              <SubsectionLabel>Le retrouver</SubsectionLabel>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {p.linkedin && <SocialLink href={p.linkedin} type="linkedin" />}
                {p.twitter && <SocialLink href={p.twitter} type="twitter" />}
                {p.facebook && <SocialLink href={p.facebook} type="facebook" />}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Responsive : empile la grille en colonne sur petit écran */}
      <style>{`
        @media (max-width: 720px) {
          .patriote-popup-grid {
            grid-template-columns: 1fr !important;
          }
          .patriote-popup-grid > div:first-child {
            min-height: 280px !important;
          }
        }
      `}</style>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PETITS COMPOSANTS
   ═══════════════════════════════════════════════════════════════ */

function StatBox({
  label,
  value,
  suffix,
  color,
}: {
  label: string;
  value: string;
  suffix?: string;
  color: string;
}) {
  return (
    <div
      style={{
        padding: "12px 14px",
        background: COLORS.creme,
        border: `1px solid ${COLORS.ligne}`,
        borderRadius: 10,
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: 1.5,
          color: "#888",
          marginBottom: 4,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 900, color, letterSpacing: -0.3 }}>
        {value}
        {suffix && (
          <span style={{ fontSize: 10, fontWeight: 700, color: "#999", marginLeft: 4 }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function SubsectionLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 2,
        color: "#999",
        textTransform: "uppercase",
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function SocialLink({
  href,
  type,
}: {
  href: string;
  type: "linkedin" | "twitter" | "facebook";
}) {
  const CONFIG = {
    linkedin: { label: "LinkedIn", color: "#0A66C2", icon: <LinkedInIcon /> },
    twitter: { label: "Twitter / X", color: "#000", icon: <TwitterIcon /> },
    facebook: { label: "Facebook", color: "#1877F2", icon: <FacebookIcon /> },
  };
  const c = CONFIG[type];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        padding: "10px 16px",
        borderRadius: 10,
        background: COLORS.blanc,
        border: `1px solid ${COLORS.ligne}`,
        color: c.color,
        textDecoration: "none",
        fontWeight: 700,
        fontSize: 12,
        transition: "all 0.15s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = c.color;
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.borderColor = c.color;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = COLORS.blanc;
        e.currentTarget.style.color = c.color;
        e.currentTarget.style.borderColor = COLORS.ligne;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <span style={{ display: "grid", placeItems: "center", width: 16, height: 16 }}>
        {c.icon}
      </span>
      {c.label}
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ICÔNES SVG RÉSEAUX SOCIAUX
   ═══════════════════════════════════════════════════════════════ */

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}