import { motion } from "framer-motion";
import { COLORS } from "@/lib/constants/colors";
import { PILIERS } from "@/lib/data/piliers";

/**
 * ═══════════════════════════════════════════════════════════════
 *  Piliers — Version compacte, cercles blancs sur fond vert
 * ═══════════════════════════════════════════════════════════════
 *
 *  Changements par rapport à la version précédente :
 *   • Cercles BLANCS (l'icône reprend la couleur du pilier)
 *   • Section ~40% plus courte (paddings & marges resserrés)
 *   • Halo conservé mais légèrement plus discret
 * ═══════════════════════════════════════════════════════════════
 */

export function Piliers() {
  return (
    <section
      id="piliers"
      style={{
        padding: "80px 32px 50px",
        background: `linear-gradient(180deg, ${COLORS.vert} 0%, #15692f 100%)`,
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* ═══ Header de section ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          {/* Badge "ARCHITECTURE V3" */}
          <div
            style={{
              display: "inline-block",
              padding: "6px 18px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              border: "1.5px solid rgba(255,255,255,0.45)",
              color: "#fff",
              fontSize: 11,
              letterSpacing: 3,
              fontWeight: 800,
              marginBottom: 18,
              backdropFilter: "blur(4px)",
            }}
          >
            ARCHITECTURE V3
          </div>

          {/* Titre principal */}
          <h2
            style={{
              fontSize: "clamp(30px, 4.5vw, 54px)",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: -1.5,
              marginBottom: 12,
              lineHeight: 1.05,
            }}
          >
            4 piliers pour transformer le{" "}
            <span style={{ color: "#FFD93D" }}>Sénégal</span>
          </h2>

          {/* Sous-titre */}
          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 15,
              maxWidth: 680,
              margin: "0 auto 18px",
              fontWeight: 500,
            }}
          >
            Un écosystème intégré aligné sur les mandats du Premier Congrès de
            Diamniadio.
          </p>

          {/* Mini drapeau du Sénégal */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 3,
              overflow: "hidden",
              width: 120,
              height: 9,
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
            aria-label="Drapeau du Sénégal"
          >
            <div style={{ flex: 1, background: "#00853F", height: "100%" }} />
            <div
              style={{
                flex: 1,
                background: "#FDEF42",
                height: "100%",
                display: "grid",
                placeItems: "center",
              }}
            >
              <span
                style={{
                  color: "#00853F",
                  fontSize: 8,
                  lineHeight: 1,
                  fontWeight: 900,
                }}
              >
                ★
              </span>
            </div>
            <div style={{ flex: 1, background: "#E1342B", height: "100%" }} />
          </div>
        </motion.div>

        {/* ═══ Grille des 4 piliers (cercles blancs + halo coloré) ═══ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 20,
            alignItems: "start",
          }}
        >
          {PILIERS.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              style={{ textAlign: "center", cursor: "default" }}
            >
              {/* ─── Cercle BLANC + halo coloré ─── */}
              <div
                style={{
                  width: 150,
                  height: 150,
                  margin: "0 auto 14px",
                  position: "relative",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {/* Halo extérieur dans la couleur du pilier */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${p.color}55 0%, ${p.color}22 45%, ${p.color}00 72%)`,
                  }}
                />

                {/* Cercle BLANC avec l'icône colorée au centre */}
                <div
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: "50%",
                    background: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 36,
                    color: p.color, // l'icône prend la couleur du pilier
                    boxShadow: `0 12px 28px rgba(0,0,0,0.18), 0 0 0 1px ${p.color}25`,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {p.icon}
                </div>
              </div>

              {/* Numéro du pilier en jaune */}
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#FFD93D",
                  lineHeight: 1,
                  marginBottom: 6,
                  textShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {p.num}
              </div>

              {/* Petit trait */}
              <div
                style={{
                  width: 24,
                  height: 2,
                  background: "rgba(255,255,255,0.6)",
                  margin: "0 auto 10px",
                  borderRadius: 2,
                }}
              />

              {/* Titre */}
              <h3
                style={{
                  color: "#fff",
                  fontSize: 17,
                  fontWeight: 800,
                  marginBottom: 8,
                  letterSpacing: -0.3,
                  lineHeight: 1.3,
                  padding: "0 8px",
                }}
              >
                {p.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  color: "rgba(255,255,255,0.78)",
                  fontSize: 13,
                  lineHeight: 1.55,
                  fontWeight: 500,
                  maxWidth: 240,
                  margin: "0 auto",
                  padding: "0 8px",
                }}
              >
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ═══ Footer "PASTEF — PATRIOTES DU SÉNÉGAL" ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            marginTop: 56,
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.15)",
            textAlign: "center",
            fontSize: 11,
            letterSpacing: 3,
            fontWeight: 700,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <span style={{ color: "#FFD93D", fontWeight: 900 }}>PASTEF</span>
          {" — PATRIOTES DU SÉNÉGAL"}
        </motion.div>
      </div>
    </section>
  );
}