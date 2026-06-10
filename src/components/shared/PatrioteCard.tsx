import { motion } from "framer-motion";
import { COLORS } from "@/lib/constants/colors";
import type { Patriote } from "@/lib/data/patriotes";

/**
 * ═══════════════════════════════════════════════════════════════
 *  PatrioteCard — Carte d'un patriote dans le classement
 * ═══════════════════════════════════════════════════════════════
 *
 *  Carte affichée dans le carrousel "Top Patriotes" (Classement.tsx).
 *  Isolée ici pour pouvoir être réutilisée dans :
 *   • la future page /classement (vue complète)
 *   • la future page profil d'un patriote
 *   • le tableau de bord administrateur
 *
 *  Effets visuels :
 *   • Bande verticale gauche aux motifs traditionnels sénégalais
 *     (pattern-sn.png + mixBlendMode pour effacer le fond blanc)
 *   • Hover : translation vers le haut + halo coloré + bordure verte
 *   • Barre d'engagement animée à l'apparition (whileInView)
 *   • Badge drapeau positionné en absolu sur le médaillon
 *
 *  ⚠️  Dépendance asset : /public/images/pattern-sn.png
 * ═══════════════════════════════════════════════════════════════
 */

type PatrioteCardProps = {
  p: Patriote;
};

export function PatrioteCard({ p }: PatrioteCardProps) {
  return (
    <div
      style={{
        flex: "0 0 300px",
        background: COLORS.blanc,
        border: `1px solid ${COLORS.ligne}`,
        borderRadius: 18,
        // padding-left élargi pour laisser respirer la bande de motifs
        padding: "22px 22px 22px 44px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
        transition: "all 0.3s",
        // Indispensables pour positionner la bande de motifs en absolu
        position: "relative",
        overflow: "hidden",
      }}
      // Effets de hover gérés en JS pour permettre des transitions
      // multi-propriétés (transform + bordure + ombre) synchronisées.
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.borderColor = COLORS.vert;
        e.currentTarget.style.boxShadow = `0 20px 40px ${COLORS.vert}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = COLORS.ligne;
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.04)";
      }}
    >
      {/* ═══ Bande de motifs sénégalais (gauche) ═══ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 28,
          backgroundImage: "url(/images/pattern-sn.png)",
          backgroundRepeat: "repeat-y",
          backgroundSize: "28px auto",
          backgroundPosition: "center top",
          mixBlendMode: "multiply", // efface le fond blanc du PNG
          zIndex: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      {/* ═══ Fin trait dégradé pour séparer la bande du contenu ═══ */}
      <div
        style={{
          position: "absolute",
          top: 14,
          bottom: 14,
          left: 32,
          width: 1,
          background: `linear-gradient(180deg, transparent 0%, ${COLORS.ligne} 20%, ${COLORS.ligne} 80%, transparent 100%)`,
          zIndex: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      {/* ═══ Contenu de la carte ═══ */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ─── En-tête : médaillon + identité ─── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${COLORS.vert}, ${COLORS.vertClair})`,
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontWeight: 900,
              fontSize: 16,
              position: "relative",
              boxShadow: `0 8px 22px ${COLORS.vert}44`,
              flexShrink: 0,
            }}
          >
            {p.photo}
            {/* Badge drapeau (SN ou diaspora) */}
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                fontSize: 18,
                background: COLORS.blanc,
                borderRadius: "50%",
                padding: 2,
                border: `1px solid ${COLORS.ligne}`,
              }}
            >
              {p.flag}
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: COLORS.noir,
                fontWeight: 900,
                fontSize: 14,
                lineHeight: 1.2,
              }}
            >
              {p.name}
            </div>
            <div
              style={{
                color: "#666",
                fontSize: 11,
                marginTop: 2,
                fontWeight: 600,
              }}
            >
              {p.fonction}
            </div>
          </div>
        </div>

        {/* ─── Localisation ─── */}
        <div
          style={{
            color: "#666",
            fontSize: 12,
            marginBottom: 14,
            fontWeight: 600,
          }}
        >
          📍 {p.region}
        </div>

        {/* ─── Montant de contribution ─── */}
        <div
          style={{
            background: COLORS.creme,
            borderRadius: 10,
            padding: 10,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              color: "#888",
              fontSize: 10,
              letterSpacing: 1.5,
              fontWeight: 700,
            }}
          >
            CONTRIBUTION
          </div>
          <div style={{ color: COLORS.vert, fontWeight: 900, fontSize: 18 }}>
            {p.contribution} FCFA
          </div>
        </div>

        {/* ─── Barre d'engagement (animée à l'entrée du viewport) ─── */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "#666",
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            <span>Engagement</span>
            <span
              style={{
                color: p.engagement >= 95 ? COLORS.vert : COLORS.rouge,
                fontWeight: 800,
              }}
            >
              {p.engagement}%
            </span>
          </div>
          <div
            style={{
              height: 5,
              background: COLORS.ligne,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${p.engagement}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              style={{
                height: "100%",
                background:
                  p.engagement >= 95
                    ? `linear-gradient(90deg, ${COLORS.vert}, ${COLORS.vertClair})`
                    : COLORS.rouge,
                borderRadius: 3,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}