import { PatrioteCard } from "@/components/shared/PatrioteCard";
import { COLORS } from "@/lib/constants/colors";
import { PATRIOTES } from "@/lib/data/patriotes";
import { useState } from "react";
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
  const [selectedPatriote, setSelectedPatriote] = useState<any>(null);
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
          style={{ display: "flex", gap: 32, width: "fit-content" }}
        >
          {[...PATRIOTES, ...PATRIOTES].map((p, i) => (
                  <div
        key={i}
        onClick={() => setSelectedPatriote(p)}
        style={{
          cursor: "pointer",
        }}
      >
        <PatrioteCard p={p} />
      </div>
          ))}
        </div>
      </div>
      {selectedPatriote && (
  <div
    onClick={() => setSelectedPatriote(null)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      padding: 20,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        maxWidth: 700,
        background: "#fff",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 40px 100px rgba(0,0,0,0.3)",
      }}
    >
      {/* Photo */}
      <div
        style={{
          height: 260,
          overflow: "hidden",
        }}
      >
        <img
          src={selectedPatriote.photo}
          alt={selectedPatriote.nom}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <div
        style={{
          padding: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              color: COLORS.noir,
            }}
          >
            {selectedPatriote.nom}
          </h2>

          <div
            style={{
              background: COLORS.vert,
              color: "#fff",
              padding: "8px 14px",
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            #{selectedPatriote.classement}
          </div>
        </div>

        <div
          style={{
            color: COLORS.rouge,
            fontWeight: 700,
            marginBottom: 15,
          }}
        >
          {selectedPatriote.fonction}
        </div>

        <div
          style={{
            fontStyle: "italic",
            fontSize: 18,
            marginBottom: 20,
            color: COLORS.vert,
          }}
        >
          "{selectedPatriote.slogan}"
        </div>

        <div
          style={{
            lineHeight: 1.8,
            color: "#444",
            marginBottom: 24,
          }}
        >
          {selectedPatriote.oeuvre}
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {selectedPatriote.linkedin && (
            <a
              href={selectedPatriote.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          )}

          {selectedPatriote.twitter && (
            <a
              href={selectedPatriote.twitter}
              target="_blank"
              rel="noreferrer"
            >
              Twitter
            </a>
          )}

          {selectedPatriote.facebook && (
            <a
              href={selectedPatriote.facebook}
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
)}
    </section>
  );
}
