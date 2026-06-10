import { COLORS } from "@/lib/constants/colors";
import { PATRIOTES } from "@/lib/data/patriotes";
import { PatrioteCard } from "@/components/shared/PatrioteCard";

/**
 * ═══════════════════════════════════════════════════════════════
 *  Classement — Carrousel "Top Patriotes"
 * ═══════════════════════════════════════════════════════════════
 *
 *  Section affichant les patriotes les plus engagés du Sénégal
 *  et de la diaspora sous forme d'un carrousel auto-défilant.
 *
 *  Technique du défilement infini :
 *   • On duplique le tableau PATRIOTES (`[...PATRIOTES, ...PATRIOTES]`)
 *   • Une animation CSS `scrollCarousel` (60s, infinie, linéaire)
 *     translate la piste de 0 à -50% → seamless loop
 *   • L'animation est définie globalement dans pages/index.tsx
 *     (classe `.carousel-track`)
 *   • Pause au survol via `.carousel-wrap:hover .carousel-track`
 *
 *  Bords avec masque dégradé (crème → transparent → crème) pour
 *  un fondu visuel élégant aux extrémités.
 * ═══════════════════════════════════════════════════════════════
 */

export function Classement() {
  return (
    <section
      id="classement"
      style={{
        padding: "140px 0",
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
      <div
        className="carousel-wrap"
        style={{ overflow: "hidden", position: "relative" }}
      >
        {/* Masque fondu sur les bords gauche/droite */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            background: `linear-gradient(90deg, ${COLORS.creme} 0%, transparent 5%, transparent 95%, ${COLORS.creme} 100%)`,
          }}
        />

        {/* Piste — on duplique le tableau pour un loop sans saut */}
        <div
          className="carousel-track"
          style={{ display: "flex", gap: 20, width: "fit-content" }}
        >
          {[...PATRIOTES, ...PATRIOTES].map((p, i) => (
            <PatrioteCard key={i} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
