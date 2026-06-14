/**
 * ═══════════════════════════════════════════════════════════════
 *  auth.ts — Authentification PASTEF (mock frontend)
 * ═══════════════════════════════════════════════════════════════
 *
 *  Système d'authentification simulé basé sur :
 *   • Numéro de téléphone sénégalais (9 chiffres après +221)
 *   • Numéro de carte membre PASTEF (format PASTEF-YYYY-XXXXXX)
 *
 *  ⚠️  Mock uniquement : les credentials valides sont stockés en
 *  dur dans VALID_PATRIOTES. À remplacer par un vrai backend
 *  (Supabase, Auth0, JWT custom...) avant la mise en prod.
 *
 *  Persistance : sessionStorage (durée = onglet ouvert).
 *  Pour persister au-delà : remplacer par localStorage.
 * ═══════════════════════════════════════════════════════════════
 */

const STORAGE_KEY = "pastef_auth";

export interface AuthUser {
  phone: string;
  card: string;
  nom: string;
  fonction: string;
  region: string;
  avatar: string;
  rang: number;
  points: number;
  contribution: number;
  engagement: number;
}

/**
 * Comptes patriotes de test.
 * Pour ajouter un nouveau patriote, ajoute une entrée ici.
 */
const VALID_PATRIOTES: AuthUser[] = [
  {
    phone: "771234567",
    card: "PASTEF-2026-001234",
    nom: "Mamadou Diallo",
    fonction: "Patriote · Coordinateur Diaspora",
    region: "Dakar · France",
    avatar: "MD",
    rang: 42,
    points: 8540,
    contribution: 125000,
    engagement: 87,
  },
  {
    phone: "782950135",
    card: "PASTEF-2026-050102",
    nom: "Mamita",
    fonction: "Patriote · Mentor Académie",
    region: "Thiès",
    avatar: "FS",
    rang: 18,
    points: 12340,
    contribution: 85000,
    engagement: 96,
  },
  {
    phone: "789876543",
    card: "PASTEF-2025-009876",
    nom: "Ousmane Ba",
    fonction: "Patriote · Cellule Diaspora",
    region: "Saint-Louis · Italie",
    avatar: "OB",
    rang: 127,
    points: 4210,
    contribution: 45000,
    engagement: 73,
  },
];

/**
 * Normalise un numéro de téléphone :
 *   "+221 77 123 45 67" → "771234567"
 *   "77-123-45-67"      → "771234567"
 *   "00221771234567"    → "771234567"
 */
function normalizePhone(input: string): string {
  return input
    .replace(/\D/g, "")
    .replace(/^00221/, "")
    .replace(/^221/, "");
}

/**
 * Tente de connecter un patriote.
 * Retourne l'utilisateur si OK, null sinon.
 */
export function login(phoneInput: string, cardInput: string): AuthUser | null {
  const phone = normalizePhone(phoneInput);
  const card = cardInput.trim().toUpperCase();

  const user = VALID_PATRIOTES.find(
    (p) => p.phone === phone && p.card === card
  );

  if (user && typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  }
  return null;
}

/** Déconnecte le patriote courant. */
export function logout(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

/** Récupère le patriote connecté, ou null. SSR-safe. */
export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/** True si un patriote est connecté. SSR-safe. */
export function isAuthenticated(): boolean {
  return getUser() !== null;
}