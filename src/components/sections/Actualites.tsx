// src/components/sections/Actualites.tsx
import { COLORS } from "@/lib/constants/colors";
import { ACTU_COLORS, MOCK_ACTUS, type Actualite } from "@/lib/data/actualites";
import { motion } from "framer-motion";

/**
 * ═══════════════════════════════════════════════════════════════
 *  <Actualites /> — Section pour la page d'accueil
 *  À placer SOUS le composant <Classement /> (Top Patriotes).
 * ═══════════════════════════════════════════════════════════════
 */
export function Actualites() {
  return (
    <section
      id="actualites"
      style={{
        background: COLORS.creme ?? "#FAF7F0",
        padding: "80px 24px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* ─── En-tête de section ─── */}
        <SectionHeader />

        {/* ─── Article à la une (pleine largeur) ─── */}
        <FeaturedArticle article={MOCK_ACTUS[0]} />

        {/* ─── Grille d'articles secondaires (pleine largeur) ─── */}
        <div
          className="actus-secondary-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 20,
            marginTop: 24,
          }}
        >
          {MOCK_ACTUS.slice(1, 5).map((a, i) => (
            <ArticleCard key={a.id} article={a} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .actus-secondary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 500px) {
          .actus-secondary-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 800px) {
          .featured-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION HEADER
   ═══════════════════════════════════════════════════════════════ */
function SectionHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 32,
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 3,
            color: COLORS.vert,
            marginBottom: 10,
          }}
        >
          📰 ACTUALITÉS & COMMUNICATIONS
        </div>
        <h2
          style={{
            fontSize: 38,
            fontWeight: 900,
            letterSpacing: -1,
            margin: 0,
            color: COLORS.noir,
            lineHeight: 1.1,
          }}
        >
          La vie du parti, en direct.
        </h2>
        <div
          style={{
            width: 60,
            height: 3,
            background: COLORS.vert,
            marginTop: 12,
            marginBottom: 12,
            borderRadius: 2,
          }}
        />
        <p
          style={{
            fontSize: 14,
            color: "#666",
            margin: 0,
            maxWidth: 580,
          }}
        >
          Restez informé des dernières nouvelles et communications officielles
          du parti.
        </p>
      </div>
      <button
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 22px",
          background: COLORS.blanc,
          border: `1px solid ${COLORS.ligne}`,
          borderRadius: 12,
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: 13,
          fontWeight: 700,
          color: "#444",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = COLORS.vert;
          e.currentTarget.style.color = COLORS.vert;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = COLORS.ligne;
          e.currentTarget.style.color = "#444";
        }}
      >
        Voir toutes les actualités <ArrowRightSvg size={14} color="currentColor" />
      </button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ARTICLE À LA UNE
   ═══════════════════════════════════════════════════════════════ */
function FeaturedArticle({ article }: { article: Actualite }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        background: COLORS.blanc,
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${COLORS.ligne}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div
        className="featured-grid"
        style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr" }}
      >
        <ArticleImage categorie={article.categorie} large photo={article.photo} />
        <div style={{ padding: "32px 32px 28px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 13px",
                background: COLORS.rouge,
                color: "#fff",
                borderRadius: 7,
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: 1.2,
              }}
            >
              <HomeIcon size={12} color="#fff" /> À LA UNE
            </span>
            <span style={{ fontSize: 11, color: "#888", fontWeight: 700, letterSpacing: 1 }}>
              {article.date.toUpperCase()}
            </span>
          </div>
          <h3
            style={{
              fontSize: 27,
              fontWeight: 900,
              color: COLORS.noir,
              lineHeight: 1.18,
              margin: "0 0 18px",
              letterSpacing: -0.5,
            }}
          >
            {article.titre}
          </h3>
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.65, margin: "0 0 26px", flex: 1 }}>
            {article.extrait}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#888", fontWeight: 600 }}>
              <ClockIcon size={13} color="#888" /> 3 min de lecture
            </span>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 22px",
                background: COLORS.vert,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: `0 3px 10px ${COLORS.vert}40`,
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = `0 5px 14px ${COLORS.vert}55`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = `0 3px 10px ${COLORS.vert}40`;
              }}
            >
              Lire l'article <ArrowRightSvg size={14} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ARTICLE CARD (secondaire)
   ═══════════════════════════════════════════════════════════════ */
function ArticleCard({ article, index }: { article: Actualite; index: number }) {
  const cat = ACTU_COLORS[article.categorie];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.15 + index * 0.05 }}
      whileHover={{ y: -3 }}
      style={{
        background: COLORS.blanc,
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid ${COLORS.ligne}`,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ArticleImage categorie={article.categorie} photo={article.photo} />
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 6 }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: 0.8,
              background: `${cat.color}15`,
              color: cat.color,
              padding: "3px 9px",
              borderRadius: 5,
              textTransform: "uppercase",
            }}
          >
            {cat.label}
          </span>
          <span style={{ fontSize: 10, color: "#999", display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
            <CalendarIcon size={10} color="#999" /> {article.date}
          </span>
        </div>
        <h4 style={{ fontSize: 14, fontWeight: 800, color: COLORS.noir, lineHeight: 1.3, margin: "0 0 8px" }}>
          {article.titre}
        </h4>
        <p
          style={{
            fontSize: 11.5,
            color: "#777",
            lineHeight: 1.55,
            margin: "0 0 14px",
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.extrait}
        </p>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 800, color: COLORS.vert }}>
          Lire la suite <ArrowRightSvg size={12} color={COLORS.vert} />
        </span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   IMAGE / ILLUSTRATION PROCÉDURALE
   ═══════════════════════════════════════════════════════════════ */
function ArticleImage({
  categorie,
  large = false,
  photo,
}: {
  categorie: string;
  large?: boolean;
  photo?: string;
}) {
  const STYLES: Record<string, { from: string; to: string; pattern: ArticlePattern }> = {
    decision:      { from: "#0F4023", to: "#1B7F3E", pattern: "podium" },
    communique:    { from: "#0F1B3A", to: "#1e3a8a", pattern: "tech" },
    terrain:       { from: "#1B7F3E", to: "#0F4023", pattern: "crowd" },
    nomination:    { from: "#3a2a18", to: "#6b4422", pattern: "mic" },
    international: { from: "#075c75", to: "#0891B2", pattern: "flags" },
  };
  const s = STYLES[categorie] ?? { from: "#444", to: "#666", pattern: "default" as const };

  if (photo) {
    return (
      <div
        style={{
          position: "relative",
          aspectRatio: large ? "auto" : "16 / 10",
          minHeight: large ? 360 : "auto",
          overflow: "hidden",
        }}
      >
        <img
          src={photo}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(transparent, rgba(0,0,0,0.3))",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        background: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)`,
        aspectRatio: large ? "auto" : "16 / 10",
        minHeight: large ? 360 : "auto",
        overflow: "hidden",
      }}
    >
      <ArticlePatternSvg type={s.pattern} />
    </div>
  );
}

type ArticlePattern = "podium" | "tech" | "crowd" | "mic" | "flags" | "default";

function ArticlePatternSvg({ type }: { type: ArticlePattern }) {
  switch (type) {
    case "podium":
      return (
        <svg viewBox="0 0 400 280" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="podium-vignette" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
            </linearGradient>
          </defs>
          <rect width="400" height="280" fill="url(#podium-vignette)" />
          <rect x="50" y="40" width="300" height="160" fill="rgba(255,255,255,0.96)" rx="3" />
          <text x="200" y="90" fontSize="22" fontWeight="900" fill={COLORS.vert} textAnchor="middle" letterSpacing="2.5">PREMIER CONGRÈS</text>
          <text x="200" y="116" fontSize="13" fontWeight="800" fill={COLORS.rouge} textAnchor="middle" letterSpacing="1.5">PASTEF — LES PATRIOTES</text>
          <line x1="125" y1="132" x2="275" y2="132" stroke={COLORS.vert} strokeWidth="0.8" />
          <text x="200" y="152" fontSize="9" fontWeight="700" fill="#666" textAnchor="middle" letterSpacing="3">UNITÉ · TRAVAIL · JUSTICE</text>
          <circle cx="200" cy="178" r="10" fill={COLORS.vert} />
          <text x="200" y="182" fontSize="11" fontWeight="900" fill="#fff" textAnchor="middle">P</text>
        </svg>
      );
    case "tech":
    case "crowd":
    case "mic":
    case "flags":
    default:
      return null;
  }
}

/* ═══════════════════════════════════════════════════════════════
   ICÔNES SVG INLINE
   ═══════════════════════════════════════════════════════════════ */

function CalendarIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function ArrowRightSvg({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function ClockIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function HomeIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}