import { COLORS } from "@/lib/constants/colors";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";

/**
 * ═══════════════════════════════════════════════════════════════
 *  Nav — Barre de navigation fixe (header sticky)
 * ═══════════════════════════════════════════════════════════════
 *
 *  Liens : Accueil · Président · Piliers · Martyrs · Actualités
 *  CTA   : "Accéder →" → /dashboard
 *
 *  Système de redirection :
 *   - Les liens scrollent vers les sections de la home avec leur ID
 *   - Si on est sur une autre route (ex. /dashboard), on est d'abord
 *     redirigé vers "/" puis scrollé vers l'ancre.
 *   - L'URL est mise à jour proprement avec le hash.
 *
 *  ⚠️ IMPORTANT — les sections de la home DOIVENT avoir ces IDs :
 *     <section id="accueil">      → Hero
 *     <section id="president">    → President  (déjà id="president")
 *     <section id="piliers">      → Piliers
 *     <section id="martyrs">      → Martyrs
 *     <section id="actualites">   → Actualites
 * ═══════════════════════════════════════════════════════════════
 */

type NavProps = {
  scrolled: boolean;
};

const NAV_LINKS: { label: string; hash: string }[] = [
  { label: "Accueil",    hash: "accueil" },
  { label: "Président",  hash: "president" },
  { label: "Piliers",    hash: "piliers" },
  { label: "Martyrs",    hash: "martyrs" },
  { label: "Actualités", hash: "actualites" },
];

export function Nav({ scrolled: _scrolled }: NavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Gestion d'un clic sur un lien de navigation interne.
   * - Si on est déjà sur "/", on scrolle directement vers la section.
   * - Sinon, on navigue vers "/#hash" puis on scrolle après un court délai
   *   pour laisser le temps au DOM de monter la home.
   */
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    hash: string,
  ) => {
    e.preventDefault();

    const scrollToHash = () => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (location.pathname === "/") {
      // Déjà sur la home : scroll direct, mise à jour de l'URL
      scrollToHash();
      window.history.replaceState(null, "", `#${hash}`);
    } else {
      // Sur une autre route : naviguer vers la home + scroller au montage
      navigate({ to: "/", hash });
      // Délai pour laisser TanStack Router monter la page d'accueil
      setTimeout(scrollToHash, 120);
    }
  };

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
        {/* ═══ LOGO PASTEF (clic → home) ═══ */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <a
            href="/#accueil"
            onClick={(e) => handleNavClick(e, "accueil")}
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
          {NAV_LINKS.map((link) => (
            <a
              key={link.hash}
              href={`/#${link.hash}`}
              onClick={(e) => handleNavClick(e, link.hash)}
              style={{
                color: "#fff",
                fontSize: 14,
                padding: "8px 14px",
                textDecoration: "none",
                fontWeight: 600,
                transition: "color 0.15s, opacity 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.75";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {link.label}
            </a>
          ))}

          {/* ═══ CTA → /dashboard ═══ */}
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
              boxShadow: `0 6px 18px ${COLORS.vert}55`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = `0 9px 22px ${COLORS.vert}77`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = `0 6px 18px ${COLORS.vert}55`;
            }}
          >
            Accéder →
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}