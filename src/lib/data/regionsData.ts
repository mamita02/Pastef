/**
 * Données par région du Sénégal — carte interactive PresenceMap
 * À terme : charger depuis Supabase
 */

export interface Coordinateur {
  nom: string;
  telephone: string;
  profession: string;
  photo?: string;
}

export interface RegionInfo {
  taux: number;
  membres: number;
  cellules: number;
  responsable: string;
  coordinateur: Coordinateur;
  cartesVendues: number;
  braceletsVendus: number;
  cotisationTaux: number;
  nouveauxMois: number;
  projetsActifs: number;
}

export const REGION_DATA: Record<string, RegionInfo> = {
  Dakar: {
    taux: 92, membres: 18420, cellules: 245, responsable: "Abdou Sall",
    coordinateur: { nom: "Abdou Sall", telephone: "+221 77 123 45 67", profession: "Ingénieur informatique" },
    cartesVendues: 14200, braceletsVendus: 8900, cotisationTaux: 78, nouveauxMois: 342, projetsActifs: 23,
  },
  Thiès: {
    taux: 78, membres: 9840, cellules: 128, responsable: "Fatou Diop",
    coordinateur: { nom: "Fatou Diop", telephone: "+221 76 234 56 78", profession: "Enseignante" },
    cartesVendues: 7100, braceletsVendus: 4200, cotisationTaux: 72, nouveauxMois: 187, projetsActifs: 14,
  },
  "Saint-Louis": {
    taux: 72, membres: 5890, cellules: 74, responsable: "Awa Ndiaye",
    coordinateur: { nom: "Awa Ndiaye", telephone: "+221 78 345 67 89", profession: "Commerçante" },
    cartesVendues: 4200, braceletsVendus: 2800, cotisationTaux: 68, nouveauxMois: 98, projetsActifs: 9,
  },
  Diourbel: {
    taux: 65, membres: 3870, cellules: 52, responsable: "Ibrahima Gueye",
    coordinateur: { nom: "Ibrahima Gueye", telephone: "+221 77 456 78 90", profession: "Agriculteur" },
    cartesVendues: 2800, braceletsVendus: 1600, cotisationTaux: 61, nouveauxMois: 64, projetsActifs: 7,
  },
  Fatick: {
    taux: 58, membres: 2980, cellules: 41, responsable: "Cheikh Sarr",
    coordinateur: { nom: "Cheikh Sarr", telephone: "+221 76 567 89 01", profession: "Pêcheur / Élu local" },
    cartesVendues: 2100, braceletsVendus: 1100, cotisationTaux: 55, nouveauxMois: 43, projetsActifs: 6,
  },
  Kaolack: {
    taux: 68, membres: 4950, cellules: 65, responsable: "Moussa Faye",
    coordinateur: { nom: "Moussa Faye", telephone: "+221 78 678 90 12", profession: "Commerçant grossiste" },
    cartesVendues: 3600, braceletsVendus: 2200, cotisationTaux: 65, nouveauxMois: 78, projetsActifs: 8,
  },
  Kaffrine: {
    taux: 52, membres: 1870, cellules: 29, responsable: "Mame Binta Diallo",
    coordinateur: { nom: "Mame Binta Diallo", telephone: "+221 77 789 01 23", profession: "Sage-femme" },
    cartesVendues: 1200, braceletsVendus: 680, cotisationTaux: 48, nouveauxMois: 26, projetsActifs: 4,
  },
  Louga: {
    taux: 64, membres: 2540, cellules: 38, responsable: "Modou Fall",
    coordinateur: { nom: "Modou Fall", telephone: "+221 76 890 12 34", profession: "Éleveur" },
    cartesVendues: 1800, braceletsVendus: 1050, cotisationTaux: 60, nouveauxMois: 38, projetsActifs: 5,
  },
  Matam: {
    taux: 48, membres: 3210, cellules: 48, responsable: "Amadou Bâ",
    coordinateur: { nom: "Amadou Bâ", telephone: "+221 78 901 23 45", profession: "Enseignant retraité" },
    cartesVendues: 2100, braceletsVendus: 980, cotisationTaux: 44, nouveauxMois: 31, projetsActifs: 3,
  },
  Tambacounda: {
    taux: 45, membres: 2310, cellules: 35, responsable: "Papa Demba Sy",
    coordinateur: { nom: "Papa Demba Sy", telephone: "+221 77 012 34 56", profession: "Transporteur" },
    cartesVendues: 1500, braceletsVendus: 720, cotisationTaux: 42, nouveauxMois: 22, projetsActifs: 5,
  },
  Kédougou: {
    taux: 38, membres: 2140, cellules: 32, responsable: "Aïssatou Diallo",
    coordinateur: { nom: "Aïssatou Diallo", telephone: "+221 76 123 45 67", profession: "Infirmière" },
    cartesVendues: 1100, braceletsVendus: 480, cotisationTaux: 35, nouveauxMois: 18, projetsActifs: 2,
  },
  Ziguinchor: {
    taux: 71, membres: 6720, cellules: 86, responsable: "Ousmane Diatta",
    coordinateur: { nom: "Ousmane Diatta", telephone: "+221 78 234 56 78", profession: "Juriste" },
    cartesVendues: 4800, braceletsVendus: 3100, cotisationTaux: 70, nouveauxMois: 112, projetsActifs: 11,
  },
  Sédhiou: {
    taux: 55, membres: 1650, cellules: 27, responsable: "Mariama Cissé",
    coordinateur: { nom: "Mariama Cissé", telephone: "+221 77 345 67 89", profession: "Agronome" },
    cartesVendues: 1050, braceletsVendus: 580, cotisationTaux: 50, nouveauxMois: 19, projetsActifs: 4,
  },
  Kolda: {
    taux: 60, membres: 3100, cellules: 44, responsable: "Lamine Baldé",
    coordinateur: { nom: "Lamine Baldé", telephone: "+221 76 456 78 90", profession: "Comptable" },
    cartesVendues: 2200, braceletsVendus: 1200, cotisationTaux: 58, nouveauxMois: 48, projetsActifs: 5,
  },
};

/** Données diaspora enrichies */
export interface DiasporaInfo {
  ville: string;
  pays: string;
  lat: number;
  lng: number;
  membres: number;
  big?: boolean;
  coordinateur: Coordinateur;
  cartesVendues: number;
  braceletsVendus: number;
  cotisationTaux: number;
  nouveauxMois: number;
  projetsActifs: number;
  cellules: number;
}

export const DIASPORA_DATA: DiasporaInfo[] = [
  { ville: "Paris",        pays: "France",         lat: 48.8566,  lng: 2.3522,   membres: 42800, big: true,  cellules: 48, coordinateur: { nom: "Mamadou Diop", telephone: "+33 6 12 34 56 78", profession: "Ingénieur BTP" },          cartesVendues: 32000, braceletsVendus: 18500, cotisationTaux: 82, nouveauxMois: 520, projetsActifs: 8 },
  { ville: "Milan",        pays: "Italie",         lat: 45.4642,  lng: 9.19,     membres: 28500, big: true,  cellules: 32, coordinateur: { nom: "Serigne Mbaye", telephone: "+39 320 123 4567", profession: "Entrepreneur textile" },    cartesVendues: 21000, braceletsVendus: 12400, cotisationTaux: 76, nouveauxMois: 310, projetsActifs: 5 },
  { ville: "Madrid",       pays: "Espagne",        lat: 40.4168,  lng: -3.7038,  membres: 21400, big: true,  cellules: 24, coordinateur: { nom: "Cheikh Guèye", telephone: "+34 612 345 678", profession: "Commerçant" },               cartesVendues: 15800, braceletsVendus: 9200,  cotisationTaux: 71, nouveauxMois: 245, projetsActifs: 4 },
  { ville: "New York",     pays: "USA",            lat: 40.7128,  lng: -74.006,  membres: 18200, big: true,  cellules: 18, coordinateur: { nom: "Fatou Ndiaye", telephone: "+1 212 555 0123", profession: "Avocate" },                  cartesVendues: 14200, braceletsVendus: 8100,  cotisationTaux: 85, nouveauxMois: 198, projetsActifs: 6 },
  { ville: "Bruxelles",    pays: "Belgique",       lat: 50.8503,  lng: 4.3517,   membres: 9800,             cellules: 12, coordinateur: { nom: "Abdoulaye Fall", telephone: "+32 478 12 34 56", profession: "Fonctionnaire UE" },       cartesVendues: 7200,  braceletsVendus: 4100,  cotisationTaux: 79, nouveauxMois: 87,  projetsActifs: 3 },
  { ville: "Montréal",     pays: "Canada",         lat: 45.5017,  lng: -73.5673, membres: 8400,             cellules: 10, coordinateur: { nom: "Sokhna Dieng", telephone: "+1 514 555 0456", profession: "Médecin" },                  cartesVendues: 6400,  braceletsVendus: 3800,  cotisationTaux: 84, nouveauxMois: 72,  projetsActifs: 3 },
  { ville: "Londres",      pays: "UK",             lat: 51.5074,  lng: -0.1278,  membres: 7600,             cellules: 9,  coordinateur: { nom: "Oumar Sow", telephone: "+44 7911 123456", profession: "Financier" },                   cartesVendues: 5800,  braceletsVendus: 3200,  cotisationTaux: 81, nouveauxMois: 65,  projetsActifs: 2 },
  { ville: "Genève",       pays: "Suisse",         lat: 46.2044,  lng: 6.1432,   membres: 4200,             cellules: 5,  coordinateur: { nom: "Awa Thiam", telephone: "+41 79 123 45 67", profession: "Diplomate" },                  cartesVendues: 3400,  braceletsVendus: 2100,  cotisationTaux: 88, nouveauxMois: 34,  projetsActifs: 2 },
  { ville: "Berlin",       pays: "Allemagne",      lat: 52.52,    lng: 13.405,   membres: 5900,             cellules: 7,  coordinateur: { nom: "Pape Diouf", telephone: "+49 170 1234567", profession: "Développeur web" },             cartesVendues: 4200,  braceletsVendus: 2600,  cotisationTaux: 77, nouveauxMois: 48,  projetsActifs: 2 },
  { ville: "Lisbonne",     pays: "Portugal",       lat: 38.7223,  lng: -9.1393,  membres: 3800,             cellules: 4,  coordinateur: { nom: "Ibou Niang", telephone: "+351 912 345 678", profession: "Restaurateur" },               cartesVendues: 2600,  braceletsVendus: 1400,  cotisationTaux: 68, nouveauxMois: 32,  projetsActifs: 1 },
  { ville: "Dubaï",        pays: "EAU",            lat: 25.2048,  lng: 55.2708,  membres: 6200,             cellules: 6,  coordinateur: { nom: "Aliou Cissé", telephone: "+971 50 123 4567", profession: "Import-Export" },             cartesVendues: 4800,  braceletsVendus: 3000,  cotisationTaux: 74, nouveauxMois: 56,  projetsActifs: 2 },
  { ville: "Djeddah",      pays: "Arabie S.",       lat: 21.4858,  lng: 39.1925,  membres: 7800,             cellules: 8,  coordinateur: { nom: "Mbacké Seck", telephone: "+966 55 123 4567", profession: "Guide religieux" },          cartesVendues: 5600,  braceletsVendus: 3400,  cotisationTaux: 70, nouveauxMois: 62,  projetsActifs: 2 },
  { ville: "Abidjan",      pays: "Côte d'Ivoire",  lat: 5.36,     lng: -4.0083,  membres: 11200,            cellules: 14, coordinateur: { nom: "Babacar Ndiaye", telephone: "+225 07 12 34 56 78", profession: "Commerçant" },          cartesVendues: 8400,  braceletsVendus: 5100,  cotisationTaux: 66, nouveauxMois: 134, projetsActifs: 4 },
  { ville: "Libreville",   pays: "Gabon",          lat: 0.4162,   lng: 9.4673,   membres: 5400,             cellules: 6,  coordinateur: { nom: "Souleymane Ba", telephone: "+241 06 12 34 56", profession: "Entrepreneur" },            cartesVendues: 3800,  braceletsVendus: 2000,  cotisationTaux: 62, nouveauxMois: 42,  projetsActifs: 2 },
  { ville: "Nouakchott",   pays: "Mauritanie",     lat: 18.0735,  lng: -15.9582, membres: 8900,             cellules: 10, coordinateur: { nom: "Demba Diallo", telephone: "+222 36 12 34 56", profession: "Éleveur / Commerçant" },    cartesVendues: 6200,  braceletsVendus: 3800,  cotisationTaux: 64, nouveauxMois: 76,  projetsActifs: 3 },
  { ville: "Casablanca",   pays: "Maroc",          lat: 33.5731,  lng: -7.5898,  membres: 4800,             cellules: 5,  coordinateur: { nom: "Modou Gaye", telephone: "+212 6 12 34 56 78", profession: "Ingénieur" },               cartesVendues: 3200,  braceletsVendus: 1800,  cotisationTaux: 72, nouveauxMois: 38,  projetsActifs: 2 },
  { ville: "Johannesburg", pays: "Afrique du Sud", lat: -26.2041, lng: 28.0473,  membres: 3200,             cellules: 3,  coordinateur: { nom: "Ndèye Sarr", telephone: "+27 82 123 4567", profession: "Pharmacienne" },              cartesVendues: 2100,  braceletsVendus: 1100,  cotisationTaux: 69, nouveauxMois: 24,  projetsActifs: 1 },
  { ville: "São Paulo",    pays: "Brésil",         lat: -23.5505, lng: -46.6333, membres: 2400,             cellules: 2,  coordinateur: { nom: "Lamine Diagne", telephone: "+55 11 9 1234 5678", profession: "Chef cuisinier" },       cartesVendues: 1400,  braceletsVendus: 680,   cotisationTaux: 58, nouveauxMois: 18,  projetsActifs: 1 },
];

/** Normalisation des noms GeoJSON → noms internes (réexport depuis senegalGeoJSON) */
export { normName } from "./senegalGeoJSON";

export const chorColor = (t: number): string =>
  t >= 70 ? "#1B7F3E" : t >= 55 ? "#D4900A" : "#C61C3E";

export const chorStatus = (t: number): string =>
  t >= 70 ? "Forte activité" : t >= 55 ? "Activité moyenne" : "À développer";