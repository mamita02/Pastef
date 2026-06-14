/**
 * Barrel export — toutes les sections de la landing page.
 *
 * Permet d'importer en une seule ligne dans pages/index.tsx :
 *
 *   import {
 *     Nav, Hero, President, Piliers,
 *     Classement, Valeurs, Martyrs,
 *     CTA, Footer, WhatsApp,
 *   } from "@/components/sections";
 *
 * Ajouter une section :
 *   1. Créer le fichier `MaSection.tsx` ici
 *   2. Ajouter la ligne `export * from "./MaSection";` ci-dessous
 *   3. L'utiliser dans pages/index.tsx (ou une autre page)
 */
export * from "./Classement";
export * from "./Footer";
export * from "./Hero";
export * from "./Martyrs";
export * from "./Nav";
export * from "./Piliers";
export * from "./President";
export * from "./UpcomingEvents";
export * from "./Valeurs";
export * from "./WhatsApp";
export * from "./AIChatbot";
export { Actualites } from "./Actualites";