import { COLORS } from "@/lib/constants/colors";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * ═══════════════════════════════════════════════════════════════
 *  Hero — Section d'accueil (Above-the-Fold)
 * ═══════════════════════════════════════════════════════════════
 *
 *  Composition épurée :
 *   • Image d'arrière-plan (arbre + valeurs wolof + pills + skyline)
 *     dimensionnée pour entrer entièrement dans la fenêtre
 *   • Texte sur une seule colonne à gauche
 *   • Pas d'overlay : la zone gauche de l'image est déjà claire
 *   • Parallaxe au scroll préservée
 * ═══════════════════════════════════════════════════════════════
 */

export function Hero() {
  // ─── Parallaxe au scroll ───
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="accueil"
      ref={heroRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        paddingTop: 80,

        // ═══ IMAGE EN ARRIÈRE-PLAN ═══
        // "auto 90%" → l'image prend 90% de la hauteur de la section
        //              (laisse un petit bandeau d'air en haut)
        // "right bottom" → ancrée en bas-droite, donc la skyline
        //                  touche le sol et l'arbre reste à droite
        // backgroundColor → teinte crème derrière, au cas où l'image
        //                   ne couvre pas tout (écrans très larges)
        backgroundImage: "url('/images/pastef2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center -50px",
        backgroundRepeat: "no-repeat",
        backgroundColor: COLORS.creme,
      }}
    >
      {/* Halo vert décoratif en haut à gauche */}
      <div
        style={{
          position: "absolute",
          top: -150,
          left: -150,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "rgba(27,127,62,0.18)",
          filter: "blur(120px)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Trait tricolore (vert | noir | rouge) en bas de section */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${COLORS.vert}, ${COLORS.vert} 33%, ${COLORS.noir} 33%, ${COLORS.noir} 66%, ${COLORS.rouge} 66%, ${COLORS.rouge})`,
          zIndex: 10,
        }}
      />

      {/* ═══ Wrapper avec parallaxe ═══ */}
      <motion.div
        style={{
          y: yParallax,
          opacity,
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ═══ CONTENU TEXTE — colonne UNIQUE à gauche ═══ */}
        <div
          style={{
            padding: "60px clamp(32px, 5vw, 96px) 0",
            minHeight: "calc(100vh - 80px)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ maxWidth: 560 }}>
            
            {/* Titre principal — bicolore */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              style={{
                fontSize: "clamp(36px, 4.2vw, 60px)",
                lineHeight: 1.0,
                fontWeight: 900,
                letterSpacing: -2,
                color: COLORS.noir,
                margin: 0,
                marginBottom: 22,
                textTransform: "uppercase",
              }}
            >
              La souveraineté
              <br />
              du <span style={{ color: COLORS.vert }}>Sénégal</span>,
              <br />
              par le <span style={{ color: COLORS.rouge }}>mérite</span>.
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{
                color: "#333",
                fontSize: 17,
                lineHeight: 1.7,
                maxWidth: 520,
                marginBottom: 28,
                fontWeight: 500,
              }}
            >
              Une plateforme propulsée par l'intelligence artificielle et la
              donnée pour structurer les talents, financer le développement
              local et unir la diaspora.
            </motion.p>

            {/* Citation encadrée */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 32,
                maxWidth: 520,
                padding: "14px 18px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(8px)",
                borderLeft: `4px solid ${COLORS.vert}`,
              }}
            >
              <span
                style={{
                  color: COLORS.vert,
                  fontSize: 32,
                  fontWeight: 900,
                  lineHeight: 1,
                  marginTop: -4,
                }}
              >
                "
              </span>
              <p
                style={{
                  color: COLORS.noir,
                  fontSize: 14,
                  fontStyle: "italic",
                  fontWeight: 600,
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Un peuple organisé autour de ses valeurs est un peuple capable
                de transformer son destin.
              </p>
              <span
                style={{
                  color: COLORS.vert,
                  fontSize: 32,
                  fontWeight: 900,
                  lineHeight: 1,
                  alignSelf: "flex-end",
                  marginBottom: -4,
                }}
              >
                "
              </span>
            </motion.div>

            {/* Boutons CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "14px 28px",
                  borderRadius: 12,
                  border: "none",
                  background: `linear-gradient(135deg, ${COLORS.vert}, ${COLORS.vertClair})`,
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow: `0 12px 32px ${COLORS.vert}55`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>🤝</span> Rejoindre le mouvement
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "14px 28px",
                  borderRadius: 12,
                  border: `2px solid ${COLORS.noir}`,
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(8px)",
                  color: COLORS.noir,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: `2px solid ${COLORS.noir}`,
                    display: "inline-grid",
                    placeItems: "center",
                    fontSize: 10,
                  }}
                >
                  ▶
                </span>
                Voir la mission
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}