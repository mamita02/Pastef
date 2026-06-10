import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

import { COLORS } from "@/lib/constants/colors";
import { PILIERS } from "@/lib/data/piliers";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/academie")({
  component: AcademiePage,
});

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

type Filiere = "ideologique" | "organisationnelle" | "professionnelle";

interface Formateur {
  nom: string;
  avatar: string;
  titre: string;
  modules: number;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number; // index de la bonne réponse
}

interface Lesson {
  id: string;
  title: string;
  duration: string; // ex: "45 min"
  type: "video" | "pdf" | "atelier" | "quiz";
  completed: boolean;
  quiz?: QuizQuestion[];
}

interface Module {
  id: string;
  filiere: Filiere;
  title: string;
  subtitle: string;
  description: string;
  cover: string; // emoji ou icône
  formateurs: Formateur[];
  totalHours: number;
  totalLessons: number;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  language: string;
  enrolled: number;
  rating: number;
  progress: number; // 0–100
  lessons: Lesson[];
  certificatPrice: number; // en FCFA
  hasCertificat: boolean;
  tags: string[];
}

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════ */

const FORMATEURS: Record<string, Formateur> = {
  ousmane: { nom: "Ousmane Sonko", avatar: "OS", titre: "Secrétaire Général — Doctrine & Stratégie", modules: 4 },
  aminata: { nom: "Aminata Diallo", avatar: "AD", titre: "Cadre politique — Cellule Idéologie", modules: 3 },
  fatou: { nom: "Fatou Sow", avatar: "FS", titre: "Mentor Académie · Diaspora Canada", modules: 5 },
  ibrahima: { nom: "Ibrahima Ndiaye", avatar: "IN", titre: "Consultant Gouvernance Locale", modules: 2 },
  mame: { nom: "Mame Fatou Wade", avatar: "MW", titre: "Ingénieure IA & Big Data — ESP Dakar", modules: 6 },
  moussa: { nom: "Moussa Faye", avatar: "MF", titre: "Expert Agro-économie · ISRA", modules: 3 },
  awa: { nom: "Awa Cissé", avatar: "AC", titre: "Designer UX/UI · Cowork Dakar", modules: 2 },
  cheikh: { nom: "Cheikh Bâ", avatar: "CB", titre: "Auditeur financier · ONECCA", modules: 2 },
};

const MOCK_MODULES: Module[] = [
  /* ═══ FILIÈRE IDÉOLOGIQUE ═══ */
  {
    id: "ideo-1",
    filiere: "ideologique",
    title: "Histoire du PASTEF et du mouvement souverainiste",
    subtitle: "De 2014 à 2026 : les racines d'un projet de société",
    description:
      "Ce module retrace la genèse du PASTEF, depuis sa fondation en 2014 jusqu'au Premier Congrès de Diamniadio. Vous y découvrirez les étapes clés du mouvement souverainiste sénégalais, les luttes fondatrices, et les principes qui structurent le projet politique du parti. Chaque leçon combine analyse historique, témoignages et documents d'époque.",
    cover: "📜",
    formateurs: [FORMATEURS.ousmane, FORMATEURS.aminata],
    totalHours: 12,
    totalLessons: 8,
    level: "Débutant",
    language: "Français · Wolof",
    enrolled: 3842,
    rating: 4.9,
    progress: 78,
    certificatPrice: 3000,
    hasCertificat: false,
    tags: ["Histoire", "Souveraineté", "PASTEF"],
    lessons: [
      { id: "l1", title: "La fondation : 2014, un acte de rupture", duration: "1h 20min", type: "video", completed: true },
      { id: "l2", title: "Les premières luttes (2014–2019)", duration: "1h 30min", type: "video", completed: true },
      { id: "l3", title: "Document : Le Manifeste fondateur", duration: "45 min", type: "pdf", completed: true },
      { id: "l4", title: "La répression et la résistance (2021–2024)", duration: "1h 45min", type: "video", completed: true },
      { id: "l5", title: "La victoire de 2024 : analyse politique", duration: "1h 15min", type: "video", completed: true },
      { id: "l6", title: "Le Projet de Société : lecture détaillée", duration: "2h", type: "video", completed: true },
      { id: "l7", title: "Le Premier Congrès de Diamniadio (2026)", duration: "1h 30min", type: "video", completed: false },
      {
        id: "l8", title: "Quiz final — Histoire du PASTEF", duration: "30 min", type: "quiz", completed: false,
        quiz: [
          { question: "En quelle année le PASTEF a-t-il été fondé ?", options: ["2012", "2014", "2016", "2018"], correct: 1 },
          { question: "Quel événement marque la résolution du Premier Congrès ?", options: ["Élection présidentielle", "Congrès de Diamniadio", "Marche de la liberté", "Assemblée constituante"], correct: 1 },
          { question: "Quelle est la doctrine centrale du parti ?", options: ["Libéralisme économique", "Souveraineté nationale", "Fédéralisme", "Monarchie constitutionnelle"], correct: 1 },
        ],
      },
    ],
  },
  {
    id: "ideo-2",
    filiere: "ideologique",
    title: "Doctrine de souveraineté économique et monétaire",
    subtitle: "Comprendre les fondements d'un Sénégal souverain",
    description:
      "Analyse approfondie de la doctrine économique du PASTEF : sortie de la dépendance monétaire (FCFA), renégociation des contrats miniers et pétroliers, industrialisation endogène, coopération Sud-Sud. Ce module forme les militants à argumenter sur les enjeux de souveraineté économique dans le débat public.",
    cover: "💰",
    formateurs: [FORMATEURS.ousmane, FORMATEURS.fatou],
    totalHours: 15,
    totalLessons: 10,
    level: "Intermédiaire",
    language: "Français",
    enrolled: 2156,
    rating: 4.8,
    progress: 30,
    certificatPrice: 3000,
    hasCertificat: false,
    tags: ["Économie", "Monnaie", "Souveraineté", "Pétrole"],
    lessons: [
      { id: "l1", title: "Le FCFA : histoire d'une dépendance", duration: "1h 30min", type: "video", completed: true },
      { id: "l2", title: "Les alternatives monétaires africaines", duration: "1h 20min", type: "video", completed: true },
      { id: "l3", title: "Contrats miniers : état des lieux", duration: "1h 45min", type: "video", completed: true },
      { id: "l4", title: "Document : Rapport sur les hydrocarbures sénégalais", duration: "1h", type: "pdf", completed: false },
      { id: "l5", title: "Industrialisation endogène : modèles asiatiques", duration: "1h 30min", type: "video", completed: false },
      { id: "l6", title: "La coopération Sud-Sud comme levier", duration: "1h 15min", type: "video", completed: false },
      { id: "l7", title: "Atelier : Argumenter la souveraineté en débat", duration: "2h", type: "atelier", completed: false },
      { id: "l8", title: "Agriculture et autosuffisance alimentaire", duration: "1h 30min", type: "video", completed: false },
      { id: "l9", title: "Politique énergétique souveraine", duration: "1h 20min", type: "video", completed: false },
      { id: "l10", title: "Quiz final — Souveraineté économique", duration: "30 min", type: "quiz", completed: false },
    ],
  },
  {
    id: "ideo-3",
    filiere: "ideologique",
    title: "Valeurs sénégalaises et panafricanisme renouvelé",
    subtitle: "Jom, Ngor, Kersa, Teranga : notre identité politique",
    description:
      "Ce module explore les valeurs traditionnelles sénégalaises comme socle du projet politique PASTEF et les inscrit dans le courant du panafricanisme renouvelé. De Cheikh Anta Diop à la Résolution du Congrès, redécouvrez le fil conducteur d'une pensée africaine souveraine.",
    cover: "🌍",
    formateurs: [FORMATEURS.aminata],
    totalHours: 8,
    totalLessons: 6,
    level: "Débutant",
    language: "Français · Wolof · Pulaar",
    enrolled: 4201,
    rating: 4.9,
    progress: 0,
    certificatPrice: 3000,
    hasCertificat: false,
    tags: ["Culture", "Panafricanisme", "Valeurs", "Identité"],
    lessons: [
      { id: "l1", title: "Jom, Ngor, Kersa : définitions et portée politique", duration: "1h 20min", type: "video", completed: false },
      { id: "l2", title: "Mbokk, Burok, Teddungal, Teranga : le lien social", duration: "1h 15min", type: "video", completed: false },
      { id: "l3", title: "Cheikh Anta Diop et la Renaissance africaine", duration: "1h 30min", type: "video", completed: false },
      { id: "l4", title: "Le panafricanisme renouvelé au XXIe siècle", duration: "1h 20min", type: "video", completed: false },
      { id: "l5", title: "Décolonisation des imaginaires", duration: "1h 15min", type: "video", completed: false },
      { id: "l6", title: "Quiz final — Valeurs et Panafricanisme", duration: "30 min", type: "quiz", completed: false },
    ],
  },

  /* ═══ FILIÈRE ORGANISATIONNELLE ═══ */
  {
    id: "orga-1",
    filiere: "organisationnelle",
    title: "Animation de cellule et organisation de meeting",
    subtitle: "Le guide complet du responsable de cellule",
    description:
      "Formation pratique à l'animation d'une cellule territoriale PASTEF. De la convocation d'une réunion à la rédaction d'un compte-rendu, en passant par la gestion des conflits internes et la mobilisation terrain. Ce module est obligatoire pour tout futur responsable de cellule.",
    cover: "📋",
    formateurs: [FORMATEURS.ibrahima, FORMATEURS.aminata],
    totalHours: 10,
    totalLessons: 7,
    level: "Intermédiaire",
    language: "Français · Wolof",
    enrolled: 1876,
    rating: 4.7,
    progress: 100,
    certificatPrice: 3000,
    hasCertificat: true,
    tags: ["Organisation", "Cellule", "Leadership", "Terrain"],
    lessons: [
      { id: "l1", title: "Structure d'une cellule PASTEF", duration: "1h", type: "video", completed: true },
      { id: "l2", title: "Convoquer et animer une réunion", duration: "1h 30min", type: "video", completed: true },
      { id: "l3", title: "Rédiger un compte-rendu structuré", duration: "45 min", type: "pdf", completed: true },
      { id: "l4", title: "Mobilisation terrain : les fondamentaux", duration: "1h 45min", type: "video", completed: true },
      { id: "l5", title: "Atelier : Simulation de meeting local", duration: "2h", type: "atelier", completed: true },
      { id: "l6", title: "Gestion des conflits et discipline militante", duration: "1h 30min", type: "video", completed: true },
      { id: "l7", title: "Quiz final — Animation de cellule", duration: "30 min", type: "quiz", completed: true },
    ],
  },
  {
    id: "orga-2",
    filiere: "organisationnelle",
    title: "Lutte anti-corruption et éthique publique",
    subtitle: "Former les cadres à une gouvernance irréprochable",
    description:
      "Ce module forme les militants et cadres aux mécanismes de la corruption, aux outils juridiques de contrôle et aux bonnes pratiques de transparence. Conforme au mandat du Congrès sur la lutte rigoureuse contre la corruption et les logiques de rente.",
    cover: "⚖️",
    formateurs: [FORMATEURS.cheikh],
    totalHours: 8,
    totalLessons: 6,
    level: "Avancé",
    language: "Français",
    enrolled: 987,
    rating: 4.8,
    progress: 50,
    certificatPrice: 3000,
    hasCertificat: false,
    tags: ["Anti-corruption", "Éthique", "Gouvernance", "Audit"],
    lessons: [
      { id: "l1", title: "Anatomie de la corruption au Sénégal", duration: "1h 30min", type: "video", completed: true },
      { id: "l2", title: "Le cadre juridique : OFNAC, Cour des Comptes", duration: "1h 20min", type: "video", completed: true },
      { id: "l3", title: "Les outils de transparence budgétaire", duration: "1h 15min", type: "video", completed: true },
      { id: "l4", title: "Document : Guide de passation des marchés publics", duration: "1h", type: "pdf", completed: false },
      { id: "l5", title: "Atelier : Auditer un budget communal", duration: "2h", type: "atelier", completed: false },
      { id: "l6", title: "Quiz final — Anti-corruption", duration: "30 min", type: "quiz", completed: false },
    ],
  },

  /* ═══ FILIÈRE PROFESSIONNELLE ═══ */
  {
    id: "pro-1",
    filiere: "professionnelle",
    title: "Intelligence Artificielle & Data Science",
    subtitle: "De Python aux modèles NLP : la formation complète",
    description:
      "Formation intensive couvrant les fondamentaux de la Data Science et de l'Intelligence Artificielle. Du nettoyage de données à la mise en production de modèles NLP, ce module prépare les patriotes aux métiers du futur et aux challenges techniques de la Sandbox PASTEF.",
    cover: "🤖",
    formateurs: [FORMATEURS.mame],
    totalHours: 40,
    totalLessons: 16,
    level: "Avancé",
    language: "Français",
    enrolled: 1243,
    rating: 4.9,
    progress: 12,
    certificatPrice: 3000,
    hasCertificat: false,
    tags: ["IA", "Python", "NLP", "Data Science", "Machine Learning"],
    lessons: [
      { id: "l1", title: "Introduction à Python pour la Data", duration: "2h", type: "video", completed: true },
      { id: "l2", title: "Numpy, Pandas : manipulation de données", duration: "2h 30min", type: "video", completed: true },
      { id: "l3", title: "Visualisation : Matplotlib & Seaborn", duration: "1h 45min", type: "video", completed: false },
      { id: "l4", title: "Statistiques descriptives et inférentielles", duration: "2h", type: "video", completed: false },
      { id: "l5", title: "Machine Learning supervisé (scikit-learn)", duration: "3h", type: "video", completed: false },
      { id: "l6", title: "Machine Learning non-supervisé", duration: "2h 30min", type: "video", completed: false },
      { id: "l7", title: "Atelier : Prédire le taux d'engagement militant", duration: "3h", type: "atelier", completed: false },
      { id: "l8", title: "Introduction au NLP", duration: "2h", type: "video", completed: false },
      { id: "l9", title: "Sentence Transformers & embeddings", duration: "2h 30min", type: "video", completed: false },
      { id: "l10", title: "Matching sémantique : offres ↔ profils", duration: "2h", type: "video", completed: false },
      { id: "l11", title: "Atelier : Construire un moteur de matching", duration: "3h", type: "atelier", completed: false },
      { id: "l12", title: "Deep Learning : réseaux de neurones", duration: "2h 30min", type: "video", completed: false },
      { id: "l13", title: "Document : Architectures Transformer (PDF)", duration: "1h", type: "pdf", completed: false },
      { id: "l14", title: "Déploiement d'un modèle (Docker + API)", duration: "2h 30min", type: "video", completed: false },
      { id: "l15", title: "Projet final : IA souveraine en Wolof", duration: "4h", type: "atelier", completed: false },
      { id: "l16", title: "Quiz final — IA & Data Science", duration: "45 min", type: "quiz", completed: false },
    ],
  },
  {
    id: "pro-2",
    filiere: "professionnelle",
    title: "Développement Web et Mobile",
    subtitle: "React, Node.js, React Native : du frontend au mobile",
    description:
      "Formation complète au développement web moderne et mobile. Stack React + Node.js + React Native, avec un focus sur les bonnes pratiques de performance adaptées aux connexions mobiles sénégalaises. Prépare aux offres d'emploi du Pilier 1.",
    cover: "💻",
    formateurs: [FORMATEURS.mame, FORMATEURS.fatou],
    totalHours: 35,
    totalLessons: 14,
    level: "Intermédiaire",
    language: "Français",
    enrolled: 2087,
    rating: 4.8,
    progress: 0,
    certificatPrice: 3000,
    hasCertificat: false,
    tags: ["React", "Node.js", "Mobile", "TypeScript", "Web"],
    lessons: [
      { id: "l1", title: "HTML, CSS, JS : les fondamentaux", duration: "2h 30min", type: "video", completed: false },
      { id: "l2", title: "TypeScript : typage et bonnes pratiques", duration: "2h", type: "video", completed: false },
      { id: "l3", title: "React : composants, state, hooks", duration: "3h", type: "video", completed: false },
      { id: "l4", title: "React avancé : context, routing, performance", duration: "2h 30min", type: "video", completed: false },
      { id: "l5", title: "Node.js & Express : API REST", duration: "3h", type: "video", completed: false },
      { id: "l6", title: "Supabase : auth, database, realtime", duration: "2h", type: "video", completed: false },
      { id: "l7", title: "Atelier : Cloner un mini Job Board", duration: "4h", type: "atelier", completed: false },
      { id: "l8", title: "React Native : introduction au mobile", duration: "2h 30min", type: "video", completed: false },
      { id: "l9", title: "Navigation, listes et performance mobile", duration: "2h", type: "video", completed: false },
      { id: "l10", title: "Atelier : App mobile de suivi de projets", duration: "3h", type: "atelier", completed: false },
      { id: "l11", title: "Testing : Jest, React Testing Library", duration: "1h 30min", type: "video", completed: false },
      { id: "l12", title: "CI/CD et déploiement (Vercel, Railway)", duration: "1h 30min", type: "video", completed: false },
      { id: "l13", title: "Document : Cheat sheet React + Node", duration: "30 min", type: "pdf", completed: false },
      { id: "l14", title: "Quiz final — Développement Web & Mobile", duration: "45 min", type: "quiz", completed: false },
    ],
  },
  {
    id: "pro-3",
    filiere: "professionnelle",
    title: "Entrepreneuriat et Gestion de Projet",
    subtitle: "Lancer, financer et piloter un projet au Sénégal",
    description:
      "De l'idée au business plan, du financement à la gestion quotidienne. Ce module couvre le parcours complet de l'entrepreneur sénégalais : NINEA, registre de commerce, accès au crédit, gestion financière, et méthodes agiles de pilotage de projet.",
    cover: "🚀",
    formateurs: [FORMATEURS.moussa, FORMATEURS.cheikh],
    totalHours: 18,
    totalLessons: 10,
    level: "Intermédiaire",
    language: "Français · Wolof",
    enrolled: 1654,
    rating: 4.7,
    progress: 60,
    certificatPrice: 3000,
    hasCertificat: false,
    tags: ["Entrepreneuriat", "Business Plan", "Finance", "Agile"],
    lessons: [
      { id: "l1", title: "De l'idée au projet : valider son concept", duration: "1h 30min", type: "video", completed: true },
      { id: "l2", title: "Business Model Canvas adapté au Sénégal", duration: "1h 45min", type: "video", completed: true },
      { id: "l3", title: "Rédiger un business plan convaincant", duration: "2h", type: "video", completed: true },
      { id: "l4", title: "Document : Modèle de business plan PASTEF", duration: "1h", type: "pdf", completed: true },
      { id: "l5", title: "Formalités : NINEA, RCCM, OHADA", duration: "1h 30min", type: "video", completed: true },
      { id: "l6", title: "Accès au financement : banques, MFI, diaspora", duration: "1h 45min", type: "video", completed: true },
      { id: "l7", title: "Gestion financière et comptabilité de base", duration: "2h", type: "video", completed: false },
      { id: "l8", title: "Méthodes agiles pour PME", duration: "1h 30min", type: "video", completed: false },
      { id: "l9", title: "Atelier : Pitcher devant un jury", duration: "2h", type: "atelier", completed: false },
      { id: "l10", title: "Quiz final — Entrepreneuriat", duration: "30 min", type: "quiz", completed: false },
    ],
  },
  {
    id: "pro-4",
    filiere: "professionnelle",
    title: "Design UX/UI et Création Graphique",
    subtitle: "Concevoir des interfaces pour le Sénégal réel",
    description:
      "Formation au design d'interface centré sur les usages africains : mobile first, performances sur réseaux lents, accessibilité multilingue. De Figma à la livraison, en passant par les tests utilisateurs terrain.",
    cover: "🎨",
    formateurs: [FORMATEURS.awa],
    totalHours: 20,
    totalLessons: 10,
    level: "Débutant",
    language: "Français",
    enrolled: 892,
    rating: 4.6,
    progress: 0,
    certificatPrice: 3000,
    hasCertificat: false,
    tags: ["UX", "UI", "Figma", "Design", "Mobile First"],
    lessons: [
      { id: "l1", title: "Introduction au Design Thinking", duration: "1h 30min", type: "video", completed: false },
      { id: "l2", title: "UX Research : comprendre ses utilisateurs", duration: "2h", type: "video", completed: false },
      { id: "l3", title: "Wireframing et architecture de l'information", duration: "1h 45min", type: "video", completed: false },
      { id: "l4", title: "Figma : prise en main complète", duration: "2h 30min", type: "video", completed: false },
      { id: "l5", title: "Systèmes de design et composants", duration: "2h", type: "video", completed: false },
      { id: "l6", title: "Typographie et couleurs pour l'Afrique", duration: "1h 30min", type: "video", completed: false },
      { id: "l7", title: "Atelier : Redesigner une app sénégalaise", duration: "3h", type: "atelier", completed: false },
      { id: "l8", title: "Tests utilisateurs terrain", duration: "1h 30min", type: "video", completed: false },
      { id: "l9", title: "Handoff développeur et spécifications", duration: "1h 15min", type: "video", completed: false },
      { id: "l10", title: "Quiz final — UX/UI Design", duration: "30 min", type: "quiz", completed: false },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   CONSTANTES
   ═══════════════════════════════════════════════════════════════ */

const pilier = PILIERS[1];

const FILIERE_CONFIG: Record<Filiere, { label: string; icon: string; color: string; desc: string }> = {
  ideologique: {
    label: "Filière Idéologique",
    icon: "📜",
    color: COLORS.vert,
    desc: "Doctrine, souveraineté, panafricanisme, valeurs sénégalaises",
  },
  organisationnelle: {
    label: "Filière Organisationnelle",
    icon: "📋",
    color: COLORS.rouge,
    desc: "Animation de cellule, gouvernance, anti-corruption, leadership",
  },
  professionnelle: {
    label: "Filière Professionnelle",
    icon: "💻",
    color: "#2563EB",
    desc: "IA, développement, entrepreneuriat, design, finance",
  },
};

const LESSON_TYPE_ICON: Record<string, { icon: string; label: string }> = {
  video: { icon: "▶️", label: "Vidéo" },
  pdf: { icon: "📄", label: "Document" },
  atelier: { icon: "🛠️", label: "Atelier" },
  quiz: { icon: "❓", label: "Quiz" },
};

const LEVEL_COLORS: Record<string, string> = {
  Débutant: "#059669",
  Intermédiaire: "#D97706",
  Avancé: "#DC2626",
};

/* ═══════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
   ═══════════════════════════════════════════════════════════════ */

function AcademiePage() {
  const user = getUser();
  const [activeFiliere, setActiveFiliere] = useState<Filiere | "all">("all");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [showInProgress, setShowInProgress] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_MODULES.filter((m) => {
      if (activeFiliere !== "all" && m.filiere !== activeFiliere) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !m.title.toLowerCase().includes(q) &&
          !m.tags.some((t) => t.toLowerCase().includes(q)) &&
          !m.formateurs.some((f) => f.nom.toLowerCase().includes(q))
        )
          return false;
      }
      if (filterLevel !== "all" && m.level !== filterLevel) return false;
      if (showInProgress && m.progress === 0) return false;
      return true;
    });
  }, [activeFiliere, searchQuery, filterLevel, showInProgress]);

  const totalCertifs = MOCK_MODULES.filter((m) => m.hasCertificat).length;
  const totalInProgress = MOCK_MODULES.filter((m) => m.progress > 0 && m.progress < 100).length;

  return (
    <>
      <PilierHeader pilier={pilier} />

      {/* ── Stats rapides ── */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <StatChip icon="📚" value={MOCK_MODULES.length.toString()} label="Modules disponibles" color={COLORS.vert} />
        <StatChip icon="📖" value={totalInProgress.toString()} label="En cours" color="#D97706" />
        <StatChip icon="🏅" value={totalCertifs.toString()} label="Certificats obtenus" color="#2563EB" />
        <StatChip
          icon="⏱"
          value={MOCK_MODULES.reduce((s, m) => s + m.totalHours, 0) + "h"}
          label="De formation au total"
          color={COLORS.rouge}
        />
      </div>

      {/* ── Onglets filières ── */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 20,
          background: COLORS.blanc,
          borderRadius: 14,
          border: `1px solid ${COLORS.ligne}`,
          overflow: "hidden",
          width: "fit-content",
          flexWrap: "wrap",
        }}
      >
        <FiliereTab
          active={activeFiliere === "all"}
          onClick={() => setActiveFiliere("all")}
          icon="🎓"
          label="Toutes les filières"
          color={pilier.color}
          count={MOCK_MODULES.length}
        />
        {(Object.entries(FILIERE_CONFIG) as [Filiere, (typeof FILIERE_CONFIG)[Filiere]][]).map(
          ([key, cfg]) => (
            <FiliereTab
              key={key}
              active={activeFiliere === key}
              onClick={() => setActiveFiliere(key)}
              icon={cfg.icon}
              label={cfg.label}
              color={cfg.color}
              count={MOCK_MODULES.filter((m) => m.filiere === key).length}
            />
          ),
        )}
      </div>

      {/* ── Barre de recherche + Filtres ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div
          style={{
            flex: 1,
            minWidth: 240,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: COLORS.blanc,
            border: `1px solid ${COLORS.ligne}`,
            borderRadius: 10,
            padding: "10px 16px",
          }}
        >
          <span style={{ fontSize: 16, opacity: 0.5 }}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher un module, une compétence, un formateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 13,
              fontFamily: "inherit",
              color: COLORS.noir,
              background: "transparent",
            }}
          />
        </div>

        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: `1px solid ${COLORS.ligne}`,
            background: COLORS.blanc,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "inherit",
            color: "#444",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="all">Tous les niveaux</option>
          <option value="Débutant">Débutant</option>
          <option value="Intermédiaire">Intermédiaire</option>
          <option value="Avancé">Avancé</option>
        </select>

        <button
          onClick={() => setShowInProgress(!showInProgress)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 16px",
            borderRadius: 10,
            border: showInProgress ? `2px solid ${COLORS.vert}` : `1px solid ${COLORS.ligne}`,
            background: showInProgress ? `${COLORS.vert}12` : COLORS.blanc,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "inherit",
            color: showInProgress ? COLORS.vert : "#666",
            transition: "all 0.15s ease",
          }}
        >
          📖 En cours uniquement
        </button>
      </div>

      {/* ── Layout grille + détail ── */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* Grille des modules */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: selectedModule
                  ? "1fr"
                  : "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 16,
              }}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((mod) => (
                  <ModuleCard
                    key={mod.id}
                    module={mod}
                    selected={selectedModule?.id === mod.id}
                    onClick={() => setSelectedModule(mod)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Panel détail */}
        <AnimatePresence>
          {selectedModule && (
            <ModuleDetail
              module={selectedModule}
              userName={user?.nom ?? "Patriote"}
              onClose={() => setSelectedModule(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPOSANTS
   ═══════════════════════════════════════════════════════════════ */

function PilierHeader({ pilier }: { pilier: (typeof PILIERS)[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        marginBottom: 24,
        padding: "20px 24px",
        borderRadius: 16,
        background: `linear-gradient(135deg, ${pilier.color}10, ${pilier.color}03)`,
        borderLeft: `4px solid ${pilier.color}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, color: pilier.color, marginBottom: 6 }}>
            {pilier.tag}
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, margin: 0, color: COLORS.noir }}>
            {pilier.title}
          </h1>
        </div>
        <div style={{ fontSize: 13, color: "#666", maxWidth: 400 }}>{pilier.desc}</div>
      </div>
    </motion.div>
  );
}

function StatChip({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: COLORS.blanc,
        border: `1px solid ${COLORS.ligne}`,
        borderRadius: 12,
        padding: "10px 16px",
        flex: "1 1 140px",
        minWidth: 140,
      }}
    >
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${color}15`,
          display: "grid",
          placeItems: "center",
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <div>
        <div style={{ fontSize: 20, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
}

function FiliereTab({
  active,
  onClick,
  icon,
  label,
  color,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  color: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 20px",
        border: "none",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: active ? 800 : 600,
        fontFamily: "inherit",
        color: active ? color : "#666",
        background: active ? `${color}10` : "transparent",
        transition: "all 0.15s ease",
        borderBottom: active ? `2px solid ${color}` : "2px solid transparent",
        whiteSpace: "nowrap",
      }}
    >
      <span>{icon}</span>
      {label}
      <span
        style={{
          fontSize: 10,
          fontWeight: 800,
          background: active ? color : "#ddd",
          color: active ? "#fff" : "#666",
          padding: "2px 7px",
          borderRadius: 99,
        }}
      >
        {count}
      </span>
    </button>
  );
}

/* ── Carte Module (style Udemy) ── */

function ModuleCard({
  module: mod,
  selected,
  onClick,
}: {
  module: Module;
  selected: boolean;
  onClick: () => void;
}) {
  const cfg = FILIERE_CONFIG[mod.filiere];
  const completedLessons = mod.lessons.filter((l) => l.completed).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      onClick={onClick}
      style={{
        background: COLORS.blanc,
        border: selected ? `2px solid ${cfg.color}` : `1px solid ${COLORS.ligne}`,
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
      whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.07)" }}
    >
      {/* Bandeau couleur filière */}
      <div
        style={{
          height: 4,
          background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)`,
        }}
      />

      <div style={{ padding: "18px 20px" }}>
        {/* Badges */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              background: `${cfg.color}15`,
              color: cfg.color,
              padding: "3px 10px",
              borderRadius: 6,
            }}
          >
            {cfg.icon} {cfg.label}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              background: `${LEVEL_COLORS[mod.level]}15`,
              color: LEVEL_COLORS[mod.level],
              padding: "3px 10px",
              borderRadius: 6,
            }}
          >
            {mod.level}
          </span>
          {mod.hasCertificat && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                background: "#2563EB15",
                color: "#2563EB",
                padding: "3px 10px",
                borderRadius: 6,
              }}
            >
              ✅ Certifié
            </span>
          )}
        </div>

        {/* Cover + titre */}
        <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: `${cfg.color}12`,
              display: "grid",
              placeItems: "center",
              fontSize: 26,
              flexShrink: 0,
            }}
          >
            {mod.cover}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: 15,
                fontWeight: 800,
                margin: "0 0 3px",
                color: COLORS.noir,
                lineHeight: 1.3,
              }}
            >
              {mod.title}
            </h3>
            <p style={{ fontSize: 12, color: "#888", margin: 0, lineHeight: 1.4 }}>{mod.subtitle}</p>
          </div>
        </div>

        {/* Formateurs */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <div style={{ display: "flex" }}>
            {mod.formateurs.slice(0, 3).map((f, i) => (
              <div
                key={f.nom}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: `${cfg.color}25`,
                  color: cfg.color,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 9,
                  fontWeight: 900,
                  border: `2px solid ${COLORS.blanc}`,
                  marginLeft: i > 0 ? -8 : 0,
                  zIndex: 3 - i,
                  position: "relative",
                }}
              >
                {f.avatar}
              </div>
            ))}
          </div>
          <span style={{ fontSize: 11, color: "#666" }}>
            {mod.formateurs.map((f) => f.nom.split(" ")[0]).join(", ")}
          </span>
        </div>

        {/* Métadonnées */}
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#888", fontWeight: 600, marginBottom: 14 }}>
          <span>📚 {mod.totalLessons} cours</span>
          <span>⏱ {mod.totalHours}h</span>
          <span>👥 {mod.enrolled.toLocaleString()}</span>
          <span>⭐ {mod.rating}</span>
        </div>

        {/* Progression */}
        {mod.progress > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#555" }}>
                {completedLessons}/{mod.totalLessons} cours terminés
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, color: cfg.color }}>{mod.progress}%</span>
            </div>
            <div style={{ height: 5, background: COLORS.ligne, borderRadius: 3, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${mod.progress}%` }}
                transition={{ duration: 0.8 }}
                style={{
                  height: "100%",
                  background: mod.progress === 100 ? "#059669" : cfg.color,
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 12 }}>
          {mod.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              style={{
                fontSize: 10,
                fontWeight: 600,
                background: `${COLORS.noir}08`,
                color: "#666",
                padding: "3px 10px",
                borderRadius: 6,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Panel détail du module (style Udemy) ── */

function ModuleDetail({
  module: mod,
  userName,
  onClose,
}: {
  module: Module;
  userName: string;
  onClose: () => void;
}) {
  const cfg = FILIERE_CONFIG[mod.filiere];
  const completedLessons = mod.lessons.filter((l) => l.completed).length;
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const isComplete = mod.progress === 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      style={{
        width: 440,
        flexShrink: 0,
        background: COLORS.blanc,
        border: `1px solid ${COLORS.ligne}`,
        borderRadius: 16,
        position: "sticky",
        top: 100,
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
        boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${cfg.color}18, ${cfg.color}06)`,
          padding: "20px 24px",
          borderBottom: `1px solid ${COLORS.ligne}`,
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.06)",
            cursor: "pointer",
            fontSize: 14,
            display: "grid",
            placeItems: "center",
            color: "#666",
          }}
        >
          ✕
        </button>

        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, fontWeight: 800, background: `${cfg.color}20`, color: cfg.color, padding: "3px 10px", borderRadius: 6 }}>
            {cfg.label}
          </span>
          <span style={{ fontSize: 10, fontWeight: 800, background: `${LEVEL_COLORS[mod.level]}15`, color: LEVEL_COLORS[mod.level], padding: "3px 10px", borderRadius: 6 }}>
            {mod.level}
          </span>
          {mod.hasCertificat && (
            <span style={{ fontSize: 10, fontWeight: 800, background: "#059669" + "20", color: "#059669", padding: "3px 10px", borderRadius: 6 }}>
              ✅ Certifié
            </span>
          )}
        </div>

        <div style={{ fontSize: 32, marginBottom: 10 }}>{mod.cover}</div>

        <h2 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 6px", lineHeight: 1.3, color: COLORS.noir }}>
          {mod.title}
        </h2>
        <p style={{ fontSize: 13, color: "#666", margin: 0 }}>{mod.subtitle}</p>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px" }}>
        {/* Infos clés */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          <InfoBlock label="Cours" value={`${mod.totalLessons} leçons`} />
          <InfoBlock label="Durée totale" value={`${mod.totalHours}h`} />
          <InfoBlock label="Inscrits" value={mod.enrolled.toLocaleString()} />
          <InfoBlock label="Note" value={`⭐ ${mod.rating} / 5`} />
          <InfoBlock label="Langue" value={mod.language} />
          <InfoBlock label="Certificat" value={mod.hasCertificat ? "✅ Obtenu" : `${mod.certificatPrice.toLocaleString()} FCFA`} />
        </div>

        {/* Progression */}
        <div
          style={{
            marginBottom: 20,
            padding: "14px 16px",
            borderRadius: 12,
            background: mod.progress === 100 ? "#05966910" : `${cfg.color}08`,
            border: `1px solid ${mod.progress === 100 ? "#05966930" : `${cfg.color}20`}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>
              {completedLessons}/{mod.totalLessons} cours terminés
            </span>
            <span style={{ fontSize: 12, fontWeight: 800, color: mod.progress === 100 ? "#059669" : cfg.color }}>
              {mod.progress}%
            </span>
          </div>
          <div style={{ height: 6, background: COLORS.ligne, borderRadius: 3, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${mod.progress}%` }}
              transition={{ duration: 0.8 }}
              style={{ height: "100%", background: mod.progress === 100 ? "#059669" : cfg.color, borderRadius: 3 }}
            />
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>À propos de ce module</SectionTitle>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "#444", margin: 0 }}>{mod.description}</p>
        </div>

        {/* Formateurs */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>Formateur{mod.formateurs.length > 1 ? "s" : ""}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mod.formateurs.map((f) => (
              <div
                key={f.nom}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: COLORS.creme,
                  border: `1px solid ${COLORS.ligne}`,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}88)`,
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 900,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {f.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.noir }}>{f.nom}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{f.titre}</div>
                  <div style={{ fontSize: 10, color: cfg.color, fontWeight: 700, marginTop: 2 }}>
                    {f.modules} modules sur l'Académie
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Programme des cours */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>Programme ({mod.totalLessons} cours · {mod.totalHours}h)</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {mod.lessons.map((lesson, i) => {
              const typeInfo = LESSON_TYPE_ICON[lesson.type];
              const isQuiz = lesson.type === "quiz";
              const isExpanded = expandedQuiz === lesson.id;

              return (
                <div key={lesson.id}>
                  <div
                    onClick={isQuiz && lesson.quiz ? () => setExpandedQuiz(isExpanded ? null : lesson.id) : undefined}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 10,
                      background: lesson.completed ? `${COLORS.vert}08` : isQuiz ? "#7C3AED08" : "transparent",
                      border: `1px solid ${lesson.completed ? `${COLORS.vert}20` : isExpanded ? "#7C3AED30" : "transparent"}`,
                      cursor: isQuiz && lesson.quiz ? "pointer" : "default",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {/* Numéro / Check */}
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: lesson.completed ? COLORS.vert : COLORS.ligne,
                        color: lesson.completed ? "#fff" : "#999",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 11,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {lesson.completed ? "✓" : i + 1}
                    </div>

                    {/* Infos */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: lesson.completed ? 600 : 700,
                          color: lesson.completed ? "#888" : COLORS.noir,
                          textDecoration: lesson.completed ? "none" : "none",
                          lineHeight: 1.3,
                        }}
                      >
                        {lesson.title}
                      </div>
                      <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                        {typeInfo.icon} {typeInfo.label} · {lesson.duration}
                      </div>
                    </div>

                    {/* Flèche pour quiz */}
                    {isQuiz && lesson.quiz && (
                      <span style={{ fontSize: 12, color: "#7C3AED", fontWeight: 800 }}>
                        {isExpanded ? "▼" : "▶"}
                      </span>
                    )}
                  </div>

                  {/* Quiz inline */}
                  <AnimatePresence>
                    {isQuiz && isExpanded && lesson.quiz && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{
                          overflow: "hidden",
                          background: "#7C3AED08",
                          borderRadius: "0 0 10px 10px",
                          margin: "0 0 4px",
                        }}
                      >
                        <div style={{ padding: "14px 16px" }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "#7C3AED", marginBottom: 12 }}>
                            ❓ Quiz — {lesson.quiz.length} questions
                          </div>
                          {lesson.quiz.map((q, qi) => {
                            const key = `${lesson.id}-${qi}`;
                            const answered = quizAnswers[key] !== undefined;
                            const isCorrect = quizAnswers[key] === q.correct;

                            return (
                              <div key={qi} style={{ marginBottom: 14 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.noir, marginBottom: 8 }}>
                                  {qi + 1}. {q.question}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  {q.options.map((opt, oi) => {
                                    const isSelected = quizAnswers[key] === oi;
                                    const showCorrect = answered && oi === q.correct;
                                    const showWrong = answered && isSelected && !isCorrect;

                                    return (
                                      <button
                                        key={oi}
                                        onClick={() => {
                                          if (!answered) {
                                            setQuizAnswers((prev) => ({ ...prev, [key]: oi }));
                                          }
                                        }}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 8,
                                          padding: "8px 12px",
                                          borderRadius: 8,
                                          border: `1px solid ${showCorrect ? "#059669" : showWrong ? COLORS.rouge : isSelected ? "#7C3AED" : COLORS.ligne}`,
                                          background: showCorrect ? "#05966912" : showWrong ? `${COLORS.rouge}10` : isSelected ? "#7C3AED10" : COLORS.blanc,
                                          cursor: answered ? "default" : "pointer",
                                          fontSize: 12,
                                          fontWeight: 600,
                                          fontFamily: "inherit",
                                          color: COLORS.noir,
                                          textAlign: "left",
                                          transition: "all 0.1s ease",
                                          width: "100%",
                                        }}
                                      >
                                        <span
                                          style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: "50%",
                                            border: `2px solid ${showCorrect ? "#059669" : showWrong ? COLORS.rouge : "#ddd"}`,
                                            background: showCorrect ? "#059669" : showWrong ? COLORS.rouge : isSelected ? "#7C3AED" : "transparent",
                                            display: "grid",
                                            placeItems: "center",
                                            fontSize: 10,
                                            color: "#fff",
                                            flexShrink: 0,
                                          }}
                                        >
                                          {showCorrect ? "✓" : showWrong ? "✗" : isSelected ? "●" : ""}
                                        </span>
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                                {answered && (
                                  <div
                                    style={{
                                      marginTop: 6,
                                      fontSize: 11,
                                      fontWeight: 700,
                                      color: isCorrect ? "#059669" : COLORS.rouge,
                                    }}
                                  >
                                    {isCorrect ? "✅ Bonne réponse !" : "❌ Mauvaise réponse — la bonne réponse est surlignée en vert."}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Certificat */}
        <div
          style={{
            marginBottom: 20,
            padding: "18px 20px",
            borderRadius: 14,
            background: isComplete
              ? mod.hasCertificat
                ? "#05966910"
                : "linear-gradient(135deg, #2563EB10, #7C3AED08)"
              : COLORS.creme,
            border: `1px solid ${isComplete ? (mod.hasCertificat ? "#05966930" : "#2563EB30") : COLORS.ligne}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 24 }}>🏅</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.noir }}>Certificat PASTEF</div>
              <div style={{ fontSize: 11, color: "#888" }}>
                {mod.hasCertificat
                  ? "Obtenu — visible sur ton profil Talents"
                  : isComplete
                    ? `Termine le quiz final pour débloquer (${mod.certificatPrice.toLocaleString()} FCFA)`
                    : `Disponible après 100% de complétion (${mod.certificatPrice.toLocaleString()} FCFA)`}
              </div>
            </div>
          </div>

          {mod.hasCertificat ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                background: COLORS.blanc,
                borderRadius: 10,
                border: `1px solid #05966930`,
              }}
            >
              <span style={{ fontSize: 20 }}>✅</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#059669" }}>Certificat obtenu</div>
                <div style={{ fontSize: 11, color: "#888" }}>
                  Ton profil Talents affiche désormais la certification « {mod.title} ».
                  Les recruteurs peuvent le voir.
                </div>
              </div>
            </div>
          ) : isComplete ? (
            <button
              onClick={() =>
                alert(
                  `Paiement de ${mod.certificatPrice.toLocaleString()} FCFA pour le certificat "${mod.title}".\n\nAprès paiement, ton profil Talents (Pilier 1) sera automatiquement mis à jour avec le badge "Certifié — ${mod.title}".`,
                )
              }
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 800,
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              🏅 Obtenir mon certificat — {mod.certificatPrice.toLocaleString()} FCFA
            </button>
          ) : (
            <div
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: 12,
                background: COLORS.ligne,
                textAlign: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#999",
              }}
            >
              🔒 Complète tous les cours et le quiz final pour débloquer
            </div>
          )}

          {!mod.hasCertificat && (
            <div style={{ marginTop: 10, fontSize: 11, color: "#888", lineHeight: 1.5 }}>
              💡 Après paiement, ton certificat sera ajouté automatiquement à ton profil sur l'onglet <strong>Talents & Marchés</strong> (Pilier 1). Les recruteurs et mairies verront la mention <strong>« Certifié »</strong> sur ta fiche.
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        {mod.progress === 0 ? (
          <button
            onClick={() => alert(`Inscription au module "${mod.title}" confirmée !`)}
            style={{
              width: "100%",
              padding: "14px 20px",
              borderRadius: 12,
              border: "none",
              background: cfg.color,
              color: "#fff",
              fontSize: 14,
              fontWeight: 800,
              fontFamily: "inherit",
              cursor: "pointer",
              marginBottom: 10,
            }}
          >
            S'inscrire à ce module →
          </button>
        ) : !isComplete ? (
          <button
            onClick={() => alert("Reprise du cours...")}
            style={{
              width: "100%",
              padding: "14px 20px",
              borderRadius: 12,
              border: "none",
              background: cfg.color,
              color: "#fff",
              fontSize: 14,
              fontWeight: 800,
              fontFamily: "inherit",
              cursor: "pointer",
              marginBottom: 10,
            }}
          >
            ▶ Reprendre le cours
          </button>
        ) : null}

        <div style={{ marginTop: 12, textAlign: "center", fontSize: 11, color: "#999" }}>
          Signaler un problème · Contacter le formateur
        </div>
      </div>
    </motion.div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: COLORS.creme, borderRadius: 10, padding: "10px 12px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#999", letterSpacing: 0.5, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.noir }}>{value}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 1.5,
        color: "#999",
        marginBottom: 10,
        textTransform: "uppercase" as const,
      }}
    >
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        textAlign: "center",
        padding: "60px 20px",
        background: COLORS.blanc,
        borderRadius: 16,
        border: `1px solid ${COLORS.ligne}`,
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
      <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>Aucun module trouvé</h3>
      <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Essaie d'ajuster tes filtres ou ta recherche.</p>
    </motion.div>
  );
}