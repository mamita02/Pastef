
import { COLORS } from "@/lib/constants/colors";
import { PILIERS } from "@/lib/data/piliers";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";

/**
 * ═══════════════════════════════════════════════════════════════
 *  Nav — Barre de navigation fixe (header sticky)
 * ═══════════════════════════════════════════════════════════════
 *
 *  Position : fixed top, fond vert PASTEF avec blur (effet glass).
 *  Contenu  :
 *    • Logo "P" animé (rotation 360° au hover)
 *    • Liens principaux : Accueil, Président
 *    • Sous-menu "Piliers" (hover) listant les 4 piliers
 *    • Liens : Martyrs, Classement
 *    • Bouton CTA "Accéder →"
 *
 *  Props :
 *    • scrolled — reçu du parent (Landing) pour réagir au scroll.
 *      Préfixé `_` ici car non utilisé visuellement pour l'instant
 *      (on pourra l'exploiter plus tard : variation d'opacité, etc.).
 * ═══════════════════════════════════════════════════════════════
 */

type NavProps = {
  scrolled: boolean;
};

export function Nav({ scrolled: _scrolled }: NavProps) {
  // État local : ouverture du sous-menu Piliers au hover
  const [openPiliers, setOpenPiliers] = useState(false);

  // Liste des liens principaux (autres que Piliers qui a son sous-menu)
  const links: { label: string; href: string }[] = [
    { label: "Accueil", href: "#accueil" },
    { label: "Président", href: "#president" },
    { label: "Martyrs", href: "#martyrs" },
    { label: "Actualites", href: "#Actualites" },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
       background: "rgba(15,15,15,0.15)",
backdropFilter: "blur(4px)",
borderBottom: "1px solid rgba(255,255,255,0.08)",
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "14px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* ═══ LOGO + Nom du parti ═══ */}
        {/* ═══ LOGO PASTEF ═══ */}
<div
  style={{
    display: "flex",
    alignItems: "center",
  }}
>
  <a
    href="#accueil"
    style={{
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
    }}
  >
    <motion.img
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      src="/images/logoPastef.png"
      alt="PASTEF"
      style={{
        height: 60,
        width: "auto",
        objectFit: "contain",
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.35))",
      }}
    />
  </a>
</div>

        {/* ═══ Liens + CTA ═══ */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <a
            href="#accueil"
            style={{
              color: "#fff",
              fontSize: 14,
              padding: "8px 14px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Accueil
          </a>
          <a
            href="#president"
            style={{
              color: "#fff",
              fontSize: 14,
              padding: "8px 14px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Président
          </a>

          {/* ─── Sous-menu Piliers (déclenché au hover) ─── */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setOpenPiliers(true)}
            onMouseLeave={() => setOpenPiliers(false)}
          >
            <a
              href="#piliers"
              style={{
                color: "#fff",
                fontSize: 14,
                padding: "8px 14px",
                textDecoration: "none",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Piliers <span style={{ fontSize: 10 }}>▾</span>
            </a>

            {openPiliers && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  minWidth: 320,
                  background: "#0a0a0a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: 8,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                }}
              >
                {PILIERS.map((p) => (
                  <a
                    key={p.num}
                    href="#piliers"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: 8,
                      textDecoration: "none",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.06)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)`,
                        display: "grid",
                        placeItems: "center",
                        fontSize: 14,
                      }}
                    >
                      {p.icon}
                    </span>
                    <span>
                      <span
                        style={{
                          color: p.color,
                          fontSize: 10,
                          letterSpacing: 2,
                          fontWeight: 800,
                          display: "block",
                        }}
                      >
                        {p.tag}
                      </span>
                      {p.title}
                    </span>
                  </a>
                ))}
                <div
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    marginTop: 6,
                    padding: "8px 12px",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 11,
                    fontStyle: "italic",
                  }}
                >
                  → Tableau de bord (bientôt disponible)
                </div>
              </motion.div>
            )}
          </div>

          {/* ─── Autres liens (Martyrs, Classement) ─── */}
          {links.slice(2).map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                color: "#fff",
                fontSize: 14,
                padding: "8px 14px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              {l.label}
            </a>
          ))}

         <Link
        to="/dashboard"
        style={{
          padding: "10px 22px",
          borderRadius: 999,
          background: COLORS.vert,
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.2s",
          marginLeft: 8,
        }}
      >
        Accéder →
      </Link>
        </div>
      </div>
    </motion.nav>
  );
}
