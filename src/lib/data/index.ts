/**
 * Barrel export — toutes les données statiques du site.
 *
 * Import simplifié :
 *   import { PILIERS, VALUES, PATRIOTES, MARTYRS } from "@/lib/data";
 *
 * Quand un dataset sera fetché depuis l'API, on remplacera l'export
 * statique par un hook (ex: `usePatriotes()`), sans casser l'import.
 */
export * from "./piliers";
export * from "./valeurs";
export * from "./patriotes";
export * from "./martyrs";
