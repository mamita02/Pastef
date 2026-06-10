import { motion } from "framer-motion";
import { COLORS } from "@/lib/constants/colors";

/**
 * ═══════════════════════════════════════════════════════════════
 *  Valeurs — Les 6 principes fondamentaux PASTEF
 *  Design : texte + valeurs alignés à GAUCHE sur fond blanc,
 *           photo (Monument Renaissance + drapeau) visible à DROITE
 * ═══════════════════════════════════════════════════════════════
 *
 *  Structure :
 *   • Image de fond plein écran (valeur.png)
 *   • Overlay dégradé : blanc dense à gauche → transparent à 58%
 *   • Tout le contenu (header + 6 valeurs) cantonné à gauche
 *     dans une largeur max de 560px pour rester sur le blanc
 * ═══════════════════════════════════════════════════════════════
 */

const VALUES = [
  { icon: "🛡️", name: "Jom",       french: "Souveraineté",       c: COLORS.vert },
  { icon: "⚖️", name: "Ngor",      french: "Transparence",       c: COLORS.rouge },
  { icon: "✊", name: "Burok",     french: "Travail",            c: COLORS.vert },
  { icon: "🤝", name: "Mbokk",     french: "Fraternité",         c: COLORS.rouge },
  { icon: "🌍", name: "Teddungal", french: "Panafricanisme",     c: COLORS.vert },
  { icon: "🤖", name: "Kersa",     french: "Innovation éthique", c: COLORS.rouge },
];

export function Valeurs() {
  return (
    <section
      id="valeurs"
      style={{
        position: "relative",
        padding: "120px 32px 140px",
        overflow: "hidden",
        background: COLORS.blanc,
      }}
    >
      {/* ═══ Arrière-plan : photo Monument Renaissance + drapeau ═══ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/images/valeur.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ═══ Overlay : blanc dense à gauche → 100% transparent à 58% ═══ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(100deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 28%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 58%)",
        }}
      />

      {/* ═══ Contenu principal ═══ */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ─── Header aligné à gauche ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 50, maxWidth: 560 }}
        >
          {/* Badge "NOS VALEURS" avec ligne verte */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 40,
                height: 2,
                background: COLORS.vert,
                borderRadius: 1,
              }}
            />
            <span
              style={{
                color: COLORS.vert,
                fontSize: 13,
                letterSpacing: 4,
                fontWeight: 800,
              }}
            >
              NOS VALEURS
            </span>
          </div>

          {/* Titre principal */}
          <h2
            style={{
              fontSize: "clamp(38px, 5vw, 64px)",
              fontWeight: 900,
              color: COLORS.noir,
              letterSpacing: -2,
              lineHeight: 1.05,
              marginBottom: 20,
            }}
          >
            Six principes,
            <br />
            un <span style={{ color: COLORS.rouge }}>destin commun</span>.
          </h2>

          {/* Sous-titre */}
          <p
            style={{
              color: "#555",
              fontSize: 18,
              lineHeight: 1.6,
              fontWeight: 500,
              maxWidth: 480,
              marginBottom: 28,
            }}
          >
            Des valeurs fortes pour bâtir un Sénégal
            <br />
            souverain, juste et prospère.
          </p>

          {/* Séparateur dégradé vert/rouge avec étoile au centre */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              maxWidth: 320,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 2,
                background: `linear-gradient(90deg, ${COLORS.vert}, ${COLORS.vert}88)`,
                borderRadius: 1,
              }}
            />
            <span style={{ color: COLORS.vert, fontSize: 16 }}>★</span>
            <div
              style={{
                flex: 1,
                height: 2,
                background: `linear-gradient(90deg, ${COLORS.rouge}88, ${COLORS.rouge})`,
                borderRadius: 1,
              }}
            />
          </div>
        </motion.div>

        {/* ─── 6 valeurs en ligne horizontale (version compacte, à gauche) ─── */}
        <motion.div
          id="valeurs-grid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 20,
            maxWidth: 670,
          }}
        >
          {VALUES.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.08 }}
              whileHover={{ y: -4 }}
              style={{
                textAlign: "center",
                padding: "12px 4px",
                borderRadius: 12,
                cursor: "default",
                transition: "all 0.3s",
              }}
            >
              {/* Icône dans un cercle compact */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: `${v.c}12`,
                  border: `1.5px solid ${v.c}33`,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 22,
                  margin: "0 auto 10px",
                  transition: "all 0.3s",
                }}
              >
                {v.icon}
              </div>

              {/* Nom wolof */}
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: COLORS.noir,
                  marginBottom: 4,
                  letterSpacing: -0.2,
                }}
              >
                {v.name}
              </div>

              {/* Ligne colorée séparatrice */}
              <div
                style={{
                  width: 18,
                  height: 2,
                  background: v.c,
                  borderRadius: 2,
                  margin: "0 auto 6px",
                }}
              />

              {/* Traduction française */}
              <div
                style={{
                  fontSize: 9.5,
                  color: "#666",
                  fontWeight: 600,
                  letterSpacing: 0.2,
                  lineHeight: 1.3,
                }}
              >
                {v.french}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ═══ Responsive ═══ */}
      <style>{`
        @media (max-width: 768px) {
          #valeurs-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            max-width: 340px !important;
          }
        }
        @media (max-width: 480px) {
          #valeurs-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            max-width: 240px !important;
          }
        }
      `}</style>
    </section>
  );
}