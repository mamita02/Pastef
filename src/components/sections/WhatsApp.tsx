import { motion } from "framer-motion";

/**
 * ═══════════════════════════════════════════════════════════════
 *  WhatsApp — Bouton FAB (Floating Action Button)
 * ═══════════════════════════════════════════════════════════════
 *
 *  Bouton vert WhatsApp fixé en bas à droite, toujours visible.
 *  Anime à l'apparition (scale 0 → 1 avec ressort) puis pulse
 *  légèrement au hover (scale 1.1 + rotation 10°).
 *
 *  Numéro à mettre à jour avec le vrai contact PASTEF.
 *  TODO : extraire dans `@/lib/config.ts` quand la configuration
 *  globale sera centralisée.
 * ═══════════════════════════════════════════════════════════════
 */

// Numéro WhatsApp officiel (placeholder pour l'instant)
const WHATSAPP_PHONE = "221770000000";

export function WhatsApp() {
  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_PHONE}`}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      // Délai de 1s pour ne pas distraire avant que le hero soit lu
      transition={{ delay: 1, type: "spring" }}
      whileHover={{ scale: 1.1, rotate: 10 }}
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: "#25D366", // Couleur officielle WhatsApp
        display: "grid",
        placeItems: "center",
        boxShadow: "0 8px 32px rgba(37,211,102,0.5)",
        zIndex: 99,
        cursor: "pointer",
      }}
    >
      {/* Icône SVG WhatsApp (2 paths pour le combiné + l'enveloppe ronde) */}
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
        <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" />
        <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.2.8.8-3.1-.2-.3c-.9-1.3-1.3-2.9-1.3-4.5 0-4.5 3.7-8.2 8.2-8.2 4.5 0 8.2 3.7 8.2 8.2 0 4.6-3.7 8.5-8.2 8.5z" />
      </svg>
    </motion.a>
  );
}
