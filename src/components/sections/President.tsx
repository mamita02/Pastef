import { motion } from "framer-motion";
import { COLORS } from "@/lib/constants/colors";

/**
 * ═══════════════════════════════════════════════════════════════
 *  President — Mot du Président Ousmane Sonko
 * ═══════════════════════════════════════════════════════════════
 *
 *  Section hommage au Président du PASTEF / Premier Ministre.
 *  Layout 2 colonnes :
 *   • GAUCHE : Photo encadrée avec léger tilt (-4deg) et halo
 *   • DROITE : Titre, citation, signature, bouton, mini-stats
 *
 *  Détails graphiques :
 *   • Le mot "SONKO" en filigrane derrière le contenu
 *   • Guillemets géants (240px) en décoration
 *   • Barre verticale bicolore (vert → rouge) alignée au titre
 *   • Grille responsive (passe en 1 colonne < 900px via CSS global)
 * ═══════════════════════════════════════════════════════════════
 */

export function President() {
  return (
    <section
      id="président"
      style={{
        position: "relative",
        padding: "140px 32px",
        background: COLORS.creme,
        overflow: "hidden",
      }}
    >
      {/* Halo radial vert en arrière-plan */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.vert}22 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "620px 1fr",
          gap: 40,
          alignItems: "center",
        }}
        className="president-grid"
      >
        {/* ═══ LEFT — Photo du Président ═══ */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            position: "relative",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          {/* Rotation -4deg pour donner un effet "polaroïd" */}
          <div
            style={{
              position: "relative",
              transform: "rotate(-4deg)",
              transformOrigin: "center center",
            }}
          >
            {/* Fond dégradé vert→rouge décalé (effet de profondeur) */}
            <div
              style={{
                position: "absolute",
                inset: -20,
                borderRadius: 34,
                background: `linear-gradient(135deg, ${COLORS.vert}, ${COLORS.rouge})`,
                boxShadow: "0 30px 80px rgba(0,0,0,0.18)",
              }}
            />

            {/* Carte photo */}
            <div
              style={{
                position: "relative",
                borderRadius: 28,
                overflow: "hidden",
                aspectRatio: "3.8 / 5",
                background: "#fff",
                boxShadow: "0 30px 80px rgba(0,0,0,0.20)",
              }}
            >
              <img
                src="/images/president.webp"
                alt="Ousmane Sonko"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Bandeau légende en bas (dégradé noir) */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "40px 28px 24px",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                }}
              >
                <div style={{ color: "#fff", fontWeight: 900, fontSize: 22 }}>
                  Ousmane Sonko
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  Président du PASTEF · Premier Ministre du Sénégal
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ RIGHT — Mot du président ═══ */}
        <div style={{ position: "relative" }}>
          {/* Filigrane "SONKO" en très gros, en arrière-plan */}
          <div
            style={{
              position: "absolute",
              top: -100,
              left: -20,
              fontSize: 180,
              fontWeight: 900,
              color: "rgba(0,0,0,0.03)",
              letterSpacing: 8,
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 0,
            }}
          >
            SONKO
          </div>

          {/* Guillemets géants décoratifs */}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: -40,
              fontSize: 240,
              fontWeight: 900,
              color: "rgba(0,0,0,0.04)",
              lineHeight: 1,
              zIndex: 0,
              userSelect: "none",
            }}
          >
            "
          </div>

          {/* Contenu textuel (z-index 2 pour passer devant les déco) */}
          <div style={{ position: "relative", zIndex: 2 }}>
            {/* Pill "MOT DU PRÉSIDENT" */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                display: "inline-block",
                padding: "8px 18px",
                borderRadius: 999,
                background: COLORS.blanc,
                border: `1px solid ${COLORS.vert}55`,
                color: COLORS.vert,
                fontSize: 11,
                letterSpacing: 3,
                fontWeight: 800,
                marginBottom: 24,
              }}
            >
              MOT DU PRÉSIDENT
            </motion.div>

            <div
              style={{
                display: "flex",
                gap: 24,
                alignItems: "stretch",
              }}
            >
              {/* Barre verticale bicolore (vert ↘ rouge) */}
              <div
                style={{
                  width: 5,
                  borderRadius: 999,
                  background: `linear-gradient(180deg, ${COLORS.vert}, ${COLORS.vert}, ${COLORS.rouge})`,
                }}
              />

              <div>
                {/* Titre principal */}
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  style={{
                    fontSize: "clamp(42px, 5vw, 72px)",
                    fontWeight: 900,
                    color: COLORS.noir,
                    lineHeight: 1,
                    letterSpacing: -2,
                    marginBottom: 20,
                  }}
                >
                  La voix d'une
                  <br />
                  <span style={{ color: COLORS.vert }}>génération</span>
                  <br />
                  <span style={{ color: COLORS.rouge }}>debout.</span>
                </motion.h2>

                {/* Petits traits bicolores sous le titre */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 4,
                      borderRadius: 999,
                      background: COLORS.vert,
                    }}
                  />
                  <div
                    style={{
                      width: 50,
                      height: 4,
                      borderRadius: 999,
                      background: COLORS.rouge,
                    }}
                  />
                </div>

                {/* Paragraphe de citation */}
                <p
                  style={{
                    color: COLORS.noir,
                    fontSize: 22,
                    lineHeight: 1.7,
                    fontWeight: 500,
                    maxWidth: 700,
                    marginBottom: 28,
                  }}
                >
                  Le PASTEF n'est pas qu'un parti, c'est un mouvement de
                  citoyens engagés pour la{" "}
                  <span style={{ color: COLORS.vert, fontWeight: 800 }}>
                    transparence
                  </span>
                  , le{" "}
                  <span style={{ color: COLORS.noir, fontWeight: 800 }}>
                    travail
                  </span>{" "}
                  et la{" "}
                  <span style={{ color: COLORS.rouge, fontWeight: 800 }}>
                    dignité
                  </span>
                  .
                </p>

                {/* Signature visuelle (drapeau tricolore + identité) */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 32,
                  }}
                >
                  <div style={{ display: "flex", gap: 3 }}>
                    {[COLORS.vert, COLORS.noir, COLORS.rouge].map((c, i) => (
                      <div
                        key={i}
                        style={{
                          width: 5,
                          height: 30,
                          background: c,
                          borderRadius: 2,
                        }}
                      />
                    ))}
                  </div>

                  <div>
                    <div
                      style={{
                        color: COLORS.noir,
                        fontWeight: 900,
                        fontSize: 18,
                      }}
                    >
                      Ousmane Sonko
                    </div>
                    <div style={{ color: "#666", fontSize: 13, fontWeight: 600 }}>
                      Président du PASTEF · Premier Ministre
                    </div>
                  </div>
                </div>

                {/* Bouton "Découvrir sa vision" */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "18px 34px",
                    borderRadius: 999,
                    border: "none",
                    background: `linear-gradient(135deg, ${COLORS.vert}, ${COLORS.vertClair})`,
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 16,
                    cursor: "pointer",
                    boxShadow: `0 12px 30px ${COLORS.vert}44`,
                  }}
                >
                  Découvrir sa vision →
                </motion.button>
              </div>
            </div>

            {/* Mini-stats du parti (3 chiffres clés) */}
            <div
              style={{
                marginTop: 50,
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(10px)",
                borderRadius: 24,
                padding: 28,
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 24,
                boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{ fontSize: 42, fontWeight: 900, color: COLORS.vert }}
                >
                  2014
                </div>
                <div>Création du PASTEF</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{ fontSize: 42, fontWeight: 900, color: COLORS.rouge }}
                >
                  2024
                </div>
                <div>Premier Ministre</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{ fontSize: 42, fontWeight: 900, color: COLORS.vert }}
                >
                  54
                </div>
                <div>Départements engagés</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
