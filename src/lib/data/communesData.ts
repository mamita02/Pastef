/**
 * Communes du Sénégal — données de cellules pour la carte interactive
 * À terme : charger depuis Supabase (table communes + cellules)
 */

export interface Commune {
  name: string;
  region: string;
  lat: number;
  lng: number;
  cellules: number;
  membres: number;
}

export interface Cellule {
  lat: number;
  lng: number;
  id: string;
  membres: number;
  commune: string;
}

export const COMMUNES: Commune[] = [
  // ─── DAKAR ───
  { name: "Dakar-Plateau",        region: "Dakar",       lat: 14.668, lng: -17.435, cellules: 42, membres: 3200 },
  { name: "Grand-Yoff",           region: "Dakar",       lat: 14.732, lng: -17.462, cellules: 38, membres: 2800 },
  { name: "Parcelles Assainies",  region: "Dakar",       lat: 14.768, lng: -17.430, cellules: 56, membres: 4100 },
  { name: "Pikine",               region: "Dakar",       lat: 14.755, lng: -17.396, cellules: 64, membres: 4800 },
  { name: "Guédiawaye",           region: "Dakar",       lat: 14.783, lng: -17.406, cellules: 48, membres: 3600 },
  { name: "Rufisque",             region: "Dakar",       lat: 14.715, lng: -17.274, cellules: 31, membres: 2200 },
  // ─── THIÈS ───
  { name: "Thiès",                region: "Thiès",       lat: 14.791, lng: -16.926, cellules: 34, membres: 2400 },
  { name: "Mbour",                region: "Thiès",       lat: 14.419, lng: -16.966, cellules: 28, membres: 1900 },
  { name: "Tivaouane",            region: "Thiès",       lat: 14.950, lng: -16.817, cellules: 22, membres: 1500 },
  // ─── DIOURBEL ───
  { name: "Diourbel",             region: "Diourbel",    lat: 14.655, lng: -16.231, cellules: 26, membres: 1800 },
  { name: "Touba",                region: "Diourbel",    lat: 14.852, lng: -15.879, cellules: 44, membres: 3300 },
  { name: "Bambey",               region: "Diourbel",    lat: 14.700, lng: -16.456, cellules: 18, membres: 1200 },
  // ─── SAINT-LOUIS ───
  { name: "Saint-Louis",          region: "Saint-Louis", lat: 16.030, lng: -16.489, cellules: 30, membres: 2100 },
  { name: "Dagana",               region: "Saint-Louis", lat: 16.516, lng: -15.503, cellules: 16, membres: 1000 },
  { name: "Podor",                region: "Saint-Louis", lat: 16.652, lng: -14.962, cellules: 14, membres: 850 },
  // ─── LOUGA ───
  { name: "Louga",                region: "Louga",       lat: 15.614, lng: -16.228, cellules: 24, membres: 1600 },
  { name: "Kébémer",              region: "Louga",       lat: 15.371, lng: -16.451, cellules: 15, membres: 900 },
  { name: "Linguère",             region: "Louga",       lat: 15.394, lng: -15.119, cellules: 12, membres: 700 },
  // ─── FATICK ───
  { name: "Fatick",               region: "Fatick",      lat: 14.339, lng: -16.411, cellules: 19, membres: 1100 },
  { name: "Foundiougne",          region: "Fatick",      lat: 14.133, lng: -16.470, cellules: 13, membres: 750 },
  { name: "Gossas",               region: "Fatick",      lat: 14.494, lng: -16.071, cellules: 11, membres: 600 },
  // ─── KAOLACK ───
  { name: "Kaolack",              region: "Kaolack",     lat: 14.151, lng: -16.073, cellules: 32, membres: 2300 },
  { name: "Nioro du Rip",         region: "Kaolack",     lat: 13.748, lng: -15.798, cellules: 14, membres: 800 },
  { name: "Guinguinéo",           region: "Kaolack",     lat: 14.266, lng: -15.952, cellules: 10, membres: 550 },
  // ─── KAFFRINE ───
  { name: "Kaffrine",             region: "Kaffrine",    lat: 14.105, lng: -15.550, cellules: 13, membres: 700 },
  { name: "Birkelane",            region: "Kaffrine",    lat: 14.130, lng: -15.723, cellules: 9,  membres: 450 },
  { name: "Koungheul",            region: "Kaffrine",    lat: 13.980, lng: -14.800, cellules: 8,  membres: 400 },
  // ─── MATAM ───
  { name: "Matam",                region: "Matam",       lat: 15.656, lng: -13.255, cellules: 11, membres: 600 },
  { name: "Kanel",                region: "Matam",       lat: 15.492, lng: -13.182, cellules: 8,  membres: 380 },
  { name: "Ranérou",              region: "Matam",       lat: 15.300, lng: -13.970, cellules: 5,  membres: 220 },
  // ─── TAMBACOUNDA ───
  { name: "Tambacounda",          region: "Tambacounda", lat: 13.771, lng: -13.667, cellules: 17, membres: 1000 },
  { name: "Bakel",                region: "Tambacounda", lat: 14.901, lng: -12.460, cellules: 9,  membres: 480 },
  { name: "Goudiry",              region: "Tambacounda", lat: 14.182, lng: -12.720, cellules: 6,  membres: 280 },
  // ─── KÉDOUGOU ───
  { name: "Kédougou",             region: "Kédougou",    lat: 12.557, lng: -12.180, cellules: 8,  membres: 420 },
  { name: "Salémata",             region: "Kédougou",    lat: 12.633, lng: -12.830, cellules: 4,  membres: 180 },
  { name: "Saraya",               region: "Kédougou",    lat: 12.843, lng: -11.780, cellules: 3,  membres: 120 },
  // ─── KOLDA ───
  { name: "Kolda",                region: "Kolda",       lat: 12.889, lng: -14.941, cellules: 18, membres: 1100 },
  { name: "Vélingara",            region: "Kolda",       lat: 13.150, lng: -14.120, cellules: 11, membres: 600 },
  { name: "Médina Yoro Foulah",   region: "Kolda",       lat: 13.150, lng: -14.650, cellules: 7,  membres: 320 },
  // ─── SÉDHIOU ───
  { name: "Sédhiou",              region: "Sédhiou",     lat: 12.708, lng: -15.557, cellules: 13, membres: 700 },
  { name: "Bounkiling",           region: "Sédhiou",     lat: 13.050, lng: -15.700, cellules: 8,  membres: 380 },
  { name: "Goudomp",              region: "Sédhiou",     lat: 12.580, lng: -15.880, cellules: 7,  membres: 340 },
  // ─── ZIGUINCHOR ───
  { name: "Ziguinchor",           region: "Ziguinchor",  lat: 12.568, lng: -16.273, cellules: 29, membres: 2000 },
  { name: "Bignona",              region: "Ziguinchor",  lat: 12.810, lng: -16.227, cellules: 16, membres: 950 },
  { name: "Oussouye",             region: "Ziguinchor",  lat: 12.485, lng: -16.546, cellules: 9,  membres: 480 },
];

/**
 * Génère des points de cellules dispersés autour d'une commune (déterministe).
 * Utilisé pour l'affichage au zoom maximal.
 */
export function generateCellules(commune: Commune): Cellule[] {
  const points: Cellule[] = [];
  let seed = commune.name.charCodeAt(0) + commune.name.charCodeAt(commune.name.length - 1);
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const n = Math.min(commune.cellules, 50);
  for (let i = 0; i < n; i++) {
    const angle = rand() * Math.PI * 2;
    const dist = rand() * 0.035 + 0.004;
    points.push({
      lat: commune.lat + Math.sin(angle) * dist,
      lng: commune.lng + Math.cos(angle) * dist,
      id: `${commune.name}-C${i + 1}`,
      membres: Math.floor(rand() * 60 + 20),
      commune: commune.name,
    });
  }
  return points;
}
