import { COLORS } from "@/lib/constants/colors";
import { MARTYRS } from "@/lib/data/martyrs";
import { motion } from "framer-motion";

/**
 * ═══════════════════════════════════════════════════════════════
 *  Martyrs — Mémoire & hommage
 * ═══════════════════════════════════════════════════════════════
 *
 *  Section solennelle rendant hommage aux patriotes tombés.
 *
 *  Fond : drapeau du Sénégal en parallax fixed + overlay sombre
 *  (le `background-attachment: fixed` crée un effet "vitrail"
 *  immobile pendant le scroll de la page).
 *
 *  Pour l'instant on n'affiche que les 3 premiers martyrs
 *  (`MARTYRS.slice(0, 3)`). Le bouton "Découvrir" mènera plus tard
 *  vers la page complète /martyrs (à créer dans src/pages/).
 *
 *  Ton visuel : sombre, respectueux, contrasté.
 * ═══════════════════════════════════════════════════════════════
 */

export function Martyrs() {
  return (
    <section
      id="martyrs"
      style={{
        padding: "80px 32px",
        background: `linear-gradient(180deg, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0.40) 100%), url(/images/main.png) center/cover no-repeat fixed`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Trait tricolore en haut de section */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${COLORS.vert}, ${COLORS.noir}, ${COLORS.rouge})`,
        }}
      />

      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* ═══ Header ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 45 }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 999,
              background: COLORS.blanc,
              border: `1px solid ${COLORS.noir}`,
              color: COLORS.noir,
              fontSize: 11,
              letterSpacing: 3,
              fontWeight: 800,
              marginBottom: 20,
            }}
          >
            MÉMOIRE & HOMMAGE
          </div>

          <h2
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              fontWeight: 900,
              color: COLORS.blanc,
              letterSpacing: -1.5,
              marginBottom: 16,
            }}
          >
            <span style={{ color: COLORS.blanc }}>Nos </span>
            <span style={{ color: COLORS.rouge }}>Martyrs</span>
          </h2>

          <p
            style={{
              color: COLORS.blanc,
              fontSize: 17,
              maxWidth: 680,
              margin: "0 auto",
              fontWeight: 500,
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            Ils ont donné leur vie pour la démocratie et la dignité du peuple
            sénégalais. Leur mémoire guide chacun de nos pas.
          </p>
        </motion.div>

        {/* ═══ Grille des 3 premiers martyrs ═══ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {MARTYRS.slice(0, 3).map((m, i) => (
            <motion.div
              key={m.nom}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
                background: "rgba(0,0,0,0.35)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 24,
                padding: 22,
                textAlign: "center",
                color: "#fff",
                boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
              }}
            >
              {/* Médaillon avec initiales */}
              <div
                style={{
                  width: 90,
                  height: 90,
                  margin: "0 auto 16px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${COLORS.vert}, ${COLORS.rouge})`,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 34,
                  fontWeight: 900,
                  color: "#fff",
                  border: "4px solid rgba(255,255,255,0.15)",
                }}
              >
                {m.initiales}
              </div>

              {/* Nom du martyr */}
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  marginBottom: 6,
                  color: "#fff",
                }}
              >
                {m.nom}
              </h3>

              {/* Âge (en rouge, symbole de la vie sacrifiée) */}
              <div
                style={{
                  color: COLORS.rouge,
                  fontWeight: 800,
                  marginBottom: 10,
                  fontSize: 14,
                }}
              >
                {m.age} ans
              </div>

              {/* Lieu + date */}
              <div
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 12,
                  marginBottom: 14,
                }}
              >
                📍 {m.lieu} • 🕯️ {m.date}
              </div>

              {/* Trait dégradé séparateur */}
              <div
                style={{
                  width: 50,
                  height: 2,
                  margin: "0 auto 14px",
                  background: `linear-gradient(90deg, ${COLORS.vert}, ${COLORS.rouge})`,
                }}
              />

              {/* Cause / circonstances */}
              <p
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 13,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {m.cause}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ═══ CTA "Découvrir tous les martyrs" ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginTop: 35 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "16px 36px",
              borderRadius: 14,
              border: "none",
              background: `linear-gradient(135deg, ${COLORS.noir}, #2a2a2a)`,
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 1,
              cursor: "pointer",
              boxShadow: `0 14px 36px rgba(0,0,0,0.25)`,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            Découvrir
            <span style={{ fontSize: 18 }}>→</span>
          </motion.button>

          <div
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 12,
              marginTop: 14,
              fontWeight: 600,
            }}
          >
            Accéder à la mémoire complète des martyrs du PASTEF
          </div>
        </motion.div>
      </div>
    </section>
  );
}
