/**
 * ═══════════════════════════════════════════════════════════════
 *  CLASSEMENT — TOP PATRIOTES
 * ═══════════════════════════════════════════════════════════════
 *  Données de démonstration du carrousel "Top Patriotes".
 *  À terme, ces données seront fetchées depuis l'API back-end
 *  (TanStack Query), et ce fichier ne contiendra que le type.
 *
 *  Utilisé par : Classement.tsx, PatrioteCard.tsx
 * ═══════════════════════════════════════════════════════════════
 */

export type Patriote = {
  name: string;
  fonction: string;
  region: string;
  flag: string;
  contribution: string;
  engagement: number;
  photo: string;

  slogan?: string;
  oeuvre?: string;
  classement?: number;

  linkedin?: string;
  twitter?: string;
  facebook?: string;
};

export const PATRIOTES: Patriote[] = [
  {
    name: "Cheikh A. Mbacké",
    fonction: "Coordinateur Régional",
    region: "Dakar",
    flag: "🇸🇳",
    contribution: "2 450 000",
    engagement: 98,
    photo: "CM",
    classement: 1,
    slogan: "Le Sénégal d'abord, toujours.",
    oeuvre:
      "A coordonné plusieurs campagnes citoyennes et participé à la structuration des cellules locales de Dakar.",
    linkedin: "https://linkedin.com/in/cheikhmb",
    twitter: "https://twitter.com/cheikhmb",
    facebook: "https://facebook.com/cheikhmb",
  },

  {
    name: "Mamadou Kane",
    fonction: "Responsable Diaspora",
    region: "Paris, France",
    flag: "🌍",
    contribution: "4 200 000",
    engagement: 99,
    photo: "/images/elmalik.jpg",
    classement: 2,
    slogan: "La diaspora au service de la nation.",
    oeuvre:
      "A mobilisé les Sénégalais de France pour soutenir plusieurs projets communautaires et initiatives du parti.",
    linkedin: "https://linkedin.com/in/mamadoukane",
    twitter: "https://twitter.com/mamadoukane",
    facebook: "https://facebook.com/mamadoukane",
  },

  {
    name: "Mariama Diallo",
    fonction: "Présidente CoPaX",
    region: "Thiès",
    flag: "🇸🇳",
    contribution: "1 870 000",
    engagement: 95,
    photo: "MD",
    classement: 3,
    slogan: "Former aujourd'hui pour bâtir demain.",
    oeuvre:
      "A piloté plusieurs programmes de formation destinés aux jeunes militants et aux femmes leaders.",
    linkedin: "https://linkedin.com/in/mariamadiallo",
    twitter: "https://twitter.com/mariamadiallo",
    facebook: "https://facebook.com/mariamadiallo",
  },

  {
    name: "Fatou Sène",
    fonction: "Mobilisatrice",
    region: "Milan, Italie",
    flag: "🌍",
    contribution: "3 100 000",
    engagement: 96,
    photo: "FS",
    classement: 4,
    slogan: "Chaque voix compte.",
    oeuvre:
      "A renforcé la présence du mouvement au sein de la diaspora sénégalaise en Italie.",
    linkedin: "https://linkedin.com/in/fatousene",
    twitter: "https://twitter.com/fatousene",
    facebook: "https://facebook.com/fatousene",
  },

  {
    name: "Ibrahima Sow",
    fonction: "Secrétaire Local",
    region: "Saint-Louis",
    flag: "🇸🇳",
    contribution: "1 620 000",
    engagement: 93,
    photo: "IS",
    classement: 5,
    slogan: "L'action avant les discours.",
    oeuvre:
      "A organisé plusieurs activités de proximité et campagnes d'information citoyenne.",
    linkedin: "https://linkedin.com/in/ibrahimasow",
    twitter: "https://twitter.com/ibrahimasow",
    facebook: "https://facebook.com/ibrahimasow",
  },

  {
    name: "Abdou Diop",
    fonction: "Trésorier Section",
    region: "New York, USA",
    flag: "🌍",
    contribution: "2 750 000",
    engagement: 94,
    photo: "AD",
    classement: 6,
    slogan: "La transparence est une force.",
    oeuvre:
      "A mis en place des mécanismes de collecte et de gestion financière pour les sections de la diaspora.",
    linkedin: "https://linkedin.com/in/abdoudiop",
    twitter: "https://twitter.com/abdoudiop",
    facebook: "https://facebook.com/abdoudiop",
  },

  {
    name: "Aïda Sarr",
    fonction: "Responsable Jeunes",
    region: "Ziguinchor",
    flag: "🇸🇳",
    contribution: "1 180 000",
    engagement: 89,
    photo: "AS",
    classement: 7,
    slogan: "La jeunesse est notre avenir.",
    oeuvre:
      "A lancé plusieurs initiatives d'encadrement et d'engagement citoyen pour les jeunes.",
    linkedin: "https://linkedin.com/in/aidasarr",
    twitter: "https://twitter.com/aidasarr",
    facebook: "https://facebook.com/aidasarr",
  },

  {
    name: "Khady Ba",
    fonction: "Coordinatrice",
    region: "Montréal, Canada",
    flag: "🌍",
    contribution: "2 100 000",
    engagement: 92,
    photo: "KB",
    classement: 8,
    slogan: "Unis pour un Sénégal meilleur.",
    oeuvre:
      "A coordonné plusieurs actions de solidarité et de mobilisation de la diaspora canadienne.",
    linkedin: "https://linkedin.com/in/khadyba",
    twitter: "https://twitter.com/khadyba",
    facebook: "https://facebook.com/khadyba",
  },
];
