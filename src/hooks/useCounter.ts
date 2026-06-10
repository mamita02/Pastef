import { useEffect, useState } from "react";

/**
 * ═══════════════════════════════════════════════════════════════
 *  useCounter — Compteur animé (count-up effect)
 * ═══════════════════════════════════════════════════════════════
 *
 *  Anime un nombre de 0 jusqu'à `target` sur `duration` ms,
 *  avec une courbe d'easing cubic-out (départ rapide, fin douce).
 *
 *  Implémentation : requestAnimationFrame pour rester synchrone
 *  avec le refresh-rate de l'écran et éviter le jank.
 *
 *  @param target   Valeur finale à atteindre.
 *  @param duration Durée de l'animation en ms (défaut : 2000).
 *  @param start    Démarre l'animation seulement si `true`
 *                  — utile pour ne lancer qu'après le montage
 *                  côté client (évite l'hydration mismatch SSR).
 *  @returns        La valeur courante du compteur.
 *
 *  @example
 *  const [mounted, setMounted] = useState(false);
 *  useEffect(() => setMounted(true), []);
 *  const membres = useCounter(45_000, 2200, mounted);
 * ═══════════════════════════════════════════════════════════════
 */
export function useCounter(target: number, duration = 2000, start = true) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!start) return;

    let raf = 0;
    const t0 = performance.now();

    const tick = (t: number) => {
      // Progression linéaire entre 0 et 1
      const p = Math.min(1, (t - t0) / duration);
      // Cubic ease-out : 1 - (1 - p)^3
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(target * eased));
      // Continue tant que p < 1
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    // Nettoyage : annule l'animation si le composant démonte
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return val;
}
