import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * ═══════════════════════════════════════════════════════════════
 *  TiltCard — Carte avec effet 3D parallaxe au survol
 * ═══════════════════════════════════════════════════════════════
 *
 *  Composant générique réutilisé par :
 *   • Piliers (les 4 cartes de l'architecture)
 *   • Valeurs (les 6 cartes des principes)
 *   • (potentiellement d'autres sections à venir)
 *
 *  Comment ça marche :
 *   1. On capte la position de la souris (onMouseMove)
 *   2. On la normalise entre -0.5 et +0.5 par rapport au centre
 *   3. On transforme en rotation X/Y (max ±10deg)
 *   4. useSpring lisse l'animation pour un rendu naturel
 *   5. Le contenu enfant est légèrement "remonté" (translateZ)
 *      pour renforcer la perception de profondeur.
 *
 *  Props :
 *   • children   — Contenu à afficher (JSX libre)
 *   • className  — Classes CSS additionnelles
 *   • style      — Styles inline additionnels
 *   • glow       — Couleur du halo au survol (rgba conseillé)
 * ═══════════════════════════════════════════════════════════════
 */

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glow?: string;
};

export function TiltCard({
  children,
  className = "",
  style,
  glow = "rgba(27,127,62,0.25)",
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Valeurs réactives représentant la position normalisée de la souris
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Conversion position → rotation, lissée par useSpring
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 200,
    damping: 20,
  });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 200,
    damping: 20,
  });

  // Suivi de la souris : on normalise par rapport au cadre du composant
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  // Retour à la position neutre quand la souris quitte la carte
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        ...style,
        rotateX: rx,
        rotateY: ry,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      whileHover={{ boxShadow: `0 30px 70px -20px ${glow}` }}
    >
      {/* Couche enfant légèrement avancée en Z pour la profondeur */}
      <div
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </motion.div>
  );
}
