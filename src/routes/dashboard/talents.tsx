import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

import { COLORS } from "@/lib/constants/colors";
import { PILIERS } from "@/lib/data/piliers";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/talents")({
  component: TalentsPage,
});

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

type ContractType = "CDI" | "CDD" | "Freelance" | "Stage" | "Consultation";
type OfferCategory = "emploi" | "marche";
type PublisherType = "entreprise" | "mairie" | "patriote" | "institution";

interface Offer {
  id: string;
  category: OfferCategory;
  title: string;
  publisher: string;
  publisherType: PublisherType;
  publisherAvatar: string;
  location: string;
  contractType: ContractType;
  duration: string;
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  proOnly: boolean;
  urgent: boolean;
  postedAt: string; // ex: "Il y a 2h"
  applicants: number;
  deadline?: string;
  budget?: string; // pour les marchés
  lotNumber?: string; // pour les marchés
}

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA — Offres d'emploi
   ═══════════════════════════════════════════════════════════════ */

const MOCK_OFFERS: Offer[] = [
  {
    id: "e1",
    category: "emploi",
    title: "Développeur Full-Stack React / Node.js",
    publisher: "Agence Sénégalaise du Numérique",
    publisherType: "institution",
    publisherAvatar: "ASN",
    location: "Dakar, Sénégal",
    contractType: "CDI",
    duration: "Indéterminée",
    salary: "600 000 – 900 000 FCFA / mois",
    description:
      "Nous recherchons un développeur Full-Stack expérimenté pour rejoindre notre équipe technique. Vous participerez à la conception et au développement de plateformes numériques souveraines au service de l'administration sénégalaise. Vous travaillerez en méthodologie Agile avec une équipe de 6 développeurs et un designer UX.",
    requirements: [
      "3+ ans d'expérience en React et Node.js",
      "Maîtrise de PostgreSQL et REST API",
      "Expérience avec Git et CI/CD",
      "Bon niveau en français, wolof apprécié",
    ],
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript", "Docker"],
    proOnly: false,
    urgent: false,
    postedAt: "Il y a 2h",
    applicants: 23,
  },
  {
    id: "e2",
    category: "emploi",
    title: "Designer UX/UI — Interfaces Citoyennes",
    publisher: "Mairie de Thiès",
    publisherType: "mairie",
    publisherAvatar: "MT",
    location: "Thiès, Sénégal",
    contractType: "CDD",
    duration: "12 mois renouvelables",
    salary: "450 000 – 550 000 FCFA / mois",
    description:
      "La Mairie de Thiès recrute un designer UX/UI pour concevoir les interfaces de ses services numériques citoyens : état civil en ligne, plateforme de signalement, portail participatif. Vous concevrez des maquettes accessibles adaptées aux usages mobiles sénégalais.",
    requirements: [
      "Portfolio démontrant 5+ projets UX",
      "Maîtrise de Figma",
      "Sensibilité aux contextes d'usage africains",
      "Capacité à mener des tests utilisateurs terrain",
    ],
    skills: ["Figma", "UX Research", "UI Design", "Prototypage", "Mobile First"],
    proOnly: true,
    urgent: true,
    postedAt: "Il y a 45min",
    applicants: 8,
  },
  {
    id: "e3",
    category: "emploi",
    title: "Formateur en Agriculture Moderne",
    publisher: "Coopérative Njaay Défar",
    publisherType: "patriote",
    publisherAvatar: "ND",
    location: "Kaolack, Sénégal",
    contractType: "Freelance",
    duration: "3 mois (renouvelable)",
    salary: "250 000 FCFA / mois",
    description:
      "Notre coopérative cherche un formateur pour animer des sessions de formation sur les techniques d'agriculture moderne et de maraîchage auprès de 120 jeunes dans la région de Kaolack. Les sessions sont hebdomadaires, le samedi matin.",
    requirements: [
      "Diplôme en agronomie ou équivalent",
      "Expérience terrain en milieu rural",
      "Pédagogie et capacité d'animation de groupe",
      "Parler wolof ou sérère",
    ],
    skills: ["Agriculture", "Formation", "Maraîchage", "Gestion coopérative"],
    proOnly: false,
    urgent: false,
    postedAt: "Il y a 1j",
    applicants: 15,
  },
  {
    id: "e4",
    category: "emploi",
    title: "Data Analyst — Suivi des Projets Territoriaux",
    publisher: "Secrétariat National PASTEF",
    publisherType: "institution",
    publisherAvatar: "SN",
    location: "Diamniadio, Sénégal",
    contractType: "CDD",
    duration: "18 mois",
    salary: "500 000 – 700 000 FCFA / mois",
    description:
      "Le Secrétariat au Numérique recrute un Data Analyst pour assurer le suivi analytique des projets de co-développement (Pilier 3). Vous produirez des tableaux de bord de transparence, des rapports trimestriels et des analyses prédictives sur l'impact territorial des projets financés.",
    requirements: [
      "Master en Data Science, Statistiques ou équivalent",
      "Maîtrise de Python (pandas, matplotlib, scikit-learn)",
      "Expérience avec Supabase ou PostgreSQL",
      "Capacité de vulgarisation des données complexes",
    ],
    skills: ["Python", "SQL", "Data Viz", "Supabase", "Power BI"],
    proOnly: true,
    urgent: false,
    postedAt: "Il y a 3j",
    applicants: 41,
  },
  {
    id: "e5",
    category: "emploi",
    title: "Traducteur Wolof / Français — Contenus Numériques",
    publisher: "Ibrahima Gueye",
    publisherType: "patriote",
    publisherAvatar: "IG",
    location: "À distance",
    contractType: "Freelance",
    duration: "Mission ponctuelle (2 semaines)",
    salary: "150 000 FCFA (forfait)",
    description:
      "Je cherche un traducteur pour localiser en wolof le contenu de notre application mobile destinée aux commerçants du marché Sandaga. Environ 4 000 mots à traduire, avec relecture par un second traducteur natif.",
    requirements: [
      "Wolof natif, excellent français",
      "Expérience en localisation logicielle",
      "Rigueur terminologique",
    ],
    skills: ["Traduction", "Wolof", "Localisation", "Rédaction"],
    proOnly: false,
    urgent: true,
    postedAt: "Il y a 5h",
    applicants: 6,
  },

  /* ── Marchés publics & privés ── */
  {
    id: "m1",
    category: "marche",
    title: "Construction de 3 salles de classe — École Keur Massar Nord",
    publisher: "Mairie de Keur Massar",
    publisherType: "mairie",
    publisherAvatar: "KM",
    location: "Keur Massar, Dakar",
    contractType: "Consultation",
    duration: "6 mois",
    salary: "Sur devis",
    budget: "45 000 000 FCFA",
    lotNumber: "KM-2026-EDU-003",
    description:
      "Appel d'offres pour la construction de 3 salles de classe en dur, équipées de mobilier scolaire, ventilation et panneaux solaires, dans le cadre du programme d'extension scolaire de la commune. Le prestataire assure la conception, la réalisation et la réception des travaux.",
    requirements: [
      "Entreprise de BTP enregistrée au Sénégal",
      "Expérience de 3+ projets de construction scolaire",
      "Capacité financière justifiée (caution 10%)",
      "Respect des normes parasismiques sénégalaises",
    ],
    skills: ["BTP", "Construction", "Gestion de chantier", "Solaire"],
    proOnly: true,
    urgent: false,
    postedAt: "Il y a 2j",
    applicants: 12,
    deadline: "30 juin 2026",
  },
  {
    id: "m2",
    category: "marche",
    title: "Fourniture de 500 tablettes éducatives — Programme Jàng Numérique",
    publisher: "Mairie de Ziguinchor",
    publisherType: "mairie",
    publisherAvatar: "MZ",
    location: "Ziguinchor, Sénégal",
    contractType: "Consultation",
    duration: "Livraison sous 8 semaines",
    salary: "Sur devis",
    budget: "62 500 000 FCFA",
    lotNumber: "ZIG-2026-NUM-007",
    description:
      "Marché de fourniture de 500 tablettes Android 10 pouces, préchargées avec les contenus de l'Académie PASTEF (Pilier 2), étuis renforcés et chargeurs solaires collectifs. Installation et formation des enseignants incluses.",
    requirements: [
      "Fournisseur agréé de matériel informatique",
      "Garantie constructeur 24 mois minimum",
      "Capacité de déploiement en zone rurale",
      "Service après-vente au Sénégal",
    ],
    skills: ["Fourniture IT", "Logistique", "Éducation numérique"],
    proOnly: true,
    urgent: false,
    postedAt: "Il y a 5j",
    applicants: 7,
    deadline: "15 juillet 2026",
  },
  {
    id: "m3",
    category: "marche",
    title: "Audit comptable annuel — Fonds de Co-Développement Diaspora",
    publisher: "Trésorerie Nationale PASTEF",
    publisherType: "institution",
    publisherAvatar: "TN",
    location: "Dakar, Sénégal",
    contractType: "Consultation",
    duration: "3 mois",
    salary: "Sur devis",
    budget: "8 000 000 FCFA",
    lotNumber: "TN-2026-AUD-001",
    description:
      "Mission d'audit externe des flux financiers du Fonds de Co-Développement (Pilier 3) pour l'exercice 2025-2026. L'auditeur certifie la conformité des dépenses, la traçabilité des fonds diaspora et la sincérité des rapports de transparence trimestriels publiés sur la plateforme.",
    requirements: [
      "Cabinet d'audit inscrit à l'ONECCA",
      "Expérience en audit de fonds associatifs ou politiques",
      "Méthodologie conforme aux normes ISA",
      "Indépendance certifiée (pas de lien avec PASTEF)",
    ],
    skills: ["Audit", "Comptabilité", "Conformité", "OHADA"],
    proOnly: false,
    urgent: false,
    postedAt: "Il y a 1 semaine",
    applicants: 4,
    deadline: "20 juillet 2026",
  },
  {
    id: "m4",
    category: "marche",
    title: "Aménagement d'un espace de coworking communautaire",
    publisher: "Mairie de Saint-Louis",
    publisherType: "mairie",
    publisherAvatar: "SL",
    location: "Saint-Louis, Sénégal",
    contractType: "Consultation",
    duration: "4 mois",
    salary: "Sur devis",
    budget: "28 000 000 FCFA",
    lotNumber: "STL-2026-INF-012",
    description:
      "Appel d'offres pour l'aménagement complet d'un espace de coworking de 200m² destiné aux jeunes entrepreneurs et développeurs : mobilier, câblage réseau fibre, climatisation solaire, signalétique. L'espace accueillera également les sessions de formation de l'Académie PASTEF (Pilier 2).",
    requirements: [
      "Entreprise d'aménagement intérieur / architecture",
      "Références de 2+ espaces professionnels livrés",
      "Intégration de solutions éco-responsables",
      "Respect du délai de 4 mois ferme",
    ],
    skills: ["Architecture intérieure", "Aménagement", "Réseau", "Solaire"],
    proOnly: true,
    urgent: true,
    postedAt: "Il y a 12h",
    applicants: 9,
    deadline: "25 juin 2026",
  },
];

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

const pilier = PILIERS[0];

const PUBLISHER_COLORS: Record<PublisherType, string> = {
  entreprise: "#2563EB",
  mairie: COLORS.vert ?? "#006B3F",
  patriote:  "#F4C400",
  institution: COLORS.rouge ?? "#E30613",
};

const PUBLISHER_LABELS: Record<PublisherType, string> = {
  entreprise: "Entreprise",
  mairie: "Mairie PASTEF",
  patriote: "Patriote",
  institution: "Institution",
};

const CONTRACT_COLORS: Record<ContractType, string> = {
  CDI: "#059669",
  CDD: "#2563EB",
  Freelance: "#D97706",
  Stage: "#7C3AED",
  Consultation: "#DC2626",
};

/* ═══════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
   ═══════════════════════════════════════════════════════════════ */

function TalentsPage() {
  const user = getUser();
  const [activeTab, setActiveTab] = useState<"emploi" | "marche">("emploi");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterContract, setFilterContract] = useState<ContractType | "all">("all");
  const [filterPublisher, setFilterPublisher] = useState<PublisherType | "all">("all");
  const [showProOnly, setShowProOnly] = useState(false);

  const isPro = true; // mock: l'utilisateur est Patriote Pro

  const filtered = useMemo(() => {
    return MOCK_OFFERS.filter((o) => {
      if (o.category !== activeTab) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          o.title.toLowerCase().includes(q) ||
          o.publisher.toLowerCase().includes(q) ||
          o.skills.some((s) => s.toLowerCase().includes(q)) ||
          o.location.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filterContract !== "all" && o.contractType !== filterContract) return false;
      if (filterPublisher !== "all" && o.publisherType !== filterPublisher) return false;
      if (showProOnly && !o.proOnly) return false;
      return true;
    });
  }, [activeTab, searchQuery, filterContract, filterPublisher, showProOnly]);

  return (
    <>
      {/* ── Header Pilier ── */}
      <PilierHeader pilier={pilier} />

      {/* ── Statistiques rapides ── */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <StatChip
          icon="💼"
          value={MOCK_OFFERS.filter((o) => o.category === "emploi").length.toString()}
          label="Offres d'emploi"
          color={COLORS.vert ?? "#006B3F"}
        />
        <StatChip
          icon="📑"
          value={MOCK_OFFERS.filter((o) => o.category === "marche").length.toString()}
          label="Marchés publics"
          color={COLORS.rouge ?? "#E30613"}
        />
        <StatChip icon="⭐" value="3" label="Matchs IA pour toi" color={ "#F4C400"} />
        <StatChip icon="👥" value="142" label="Candidatures totales" color="#6366F1" />
      </div>

      {/* ── Onglets Emploi / Marchés ── */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 20,
          background: COLORS.blanc ?? "#fff",
          borderRadius: 14,
          border: `1px solid ${COLORS.ligne ?? "#E5E7EB"}`,
          overflow: "hidden",
          width: "fit-content",
        }}
      >
        <TabButton
          active={activeTab === "emploi"}
          onClick={() => { setActiveTab("emploi"); setSelectedOffer(null); }}
          icon="💼"
          label="Offres d'emploi"
          count={MOCK_OFFERS.filter((o) => o.category === "emploi").length}
        />
        <TabButton
          active={activeTab === "marche"}
          onClick={() => { setActiveTab("marche"); setSelectedOffer(null); }}
          icon="📑"
          label="Marchés publics & privés"
          count={MOCK_OFFERS.filter((o) => o.category === "marche").length}
        />
      </div>

      {/* ── Barre de recherche + Filtres ── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 240,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: COLORS.blanc ?? "#fff",
            border: `1px solid ${COLORS.ligne ?? "#E5E7EB"}`,
            borderRadius: 10,
            padding: "10px 16px",
          }}
        >
          <span style={{ fontSize: 16, opacity: 0.5 }}>🔍</span>
          <input
            type="text"
            placeholder={
              activeTab === "emploi"
                ? "Rechercher par poste, compétence, lieu..."
                : "Rechercher par marché, commune, secteur..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 13,
              fontFamily: "inherit",
              color: COLORS.noir ?? "#111",
              background: "transparent",
            }}
          />
        </div>

        {activeTab === "emploi" && (
          <FilterSelect
            value={filterContract}
            onChange={(v) => setFilterContract(v as ContractType | "all")}
            options={[
              { value: "all", label: "Tous les contrats" },
              { value: "CDI", label: "CDI" },
              { value: "CDD", label: "CDD" },
              { value: "Freelance", label: "Freelance" },
              { value: "Stage", label: "Stage" },
              { value: "Consultation", label: "Consultation" },
            ]}
          />
        )}

        <FilterSelect
          value={filterPublisher}
          onChange={(v) => setFilterPublisher(v as PublisherType | "all")}
          options={[
            { value: "all", label: "Tous les émetteurs" },
            { value: "entreprise", label: "Entreprises" },
            { value: "mairie", label: "Mairies PASTEF" },
            { value: "patriote", label: "Patriotes" },
            { value: "institution", label: "Institutions" },
          ]}
        />

        <button
          onClick={() => setShowProOnly(!showProOnly)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 16px",
            borderRadius: 10,
            border: showProOnly
              ? `2px solid ${ "#F4C400"}`
              : `1px solid ${COLORS.ligne ?? "#E5E7EB"}`,
            background: showProOnly ? `${ "#F4C400"}15` : COLORS.blanc ?? "#fff",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "inherit",
            color: showProOnly ? "#92600A" : "#666",
            transition: "all 0.15s ease",
          }}
        >
          ⭐ Pro uniquement
        </button>
      </div>

      {/* ── Layout liste + détail ── */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* Liste des offres */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {filtered.length === 0 ? (
            <EmptyState activeTab={activeTab} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <AnimatePresence mode="popLayout">
                {filtered.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    selected={selectedOffer?.id === offer.id}
                    isPro={isPro}
                    onClick={() => setSelectedOffer(offer)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Panel de détail */}
        <AnimatePresence>
          {selectedOffer && (
            <OfferDetail
              offer={selectedOffer}
              isPro={isPro}
              userName={user?.nom ?? "Patriote"}
              onClose={() => setSelectedOffer(null)}
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
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 3,
              color: pilier.color,
              marginBottom: 6,
            }}
          >
            {pilier.tag}
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: -0.5,
              margin: 0,
              color: COLORS.noir ?? "#111",
            }}
          >
            {pilier.title}
          </h1>
        </div>
        <div
          style={{
            padding: "8px 18px",
            borderRadius: 10,
            background: pilier.color,
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Publier une offre
        </div>
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
        background: COLORS.blanc ?? "#fff",
        border: `1px solid ${COLORS.ligne ?? "#E5E7EB"}`,
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

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 24px",
        border: "none",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: active ? 800 : 600,
        fontFamily: "inherit",
        color: active ? COLORS.vert ?? "#006B3F" : "#666",
        background: active ? `${COLORS.vert ?? "#006B3F"}10` : "transparent",
        transition: "all 0.15s ease",
        borderBottom: active ? `2px solid ${COLORS.vert ?? "#006B3F"}` : "2px solid transparent",
      }}
    >
      <span>{icon}</span>
      {label}
      <span
        style={{
          fontSize: 11,
          fontWeight: 800,
          background: active ? COLORS.vert ?? "#006B3F" : "#ddd",
          color: active ? "#fff" : "#666",
          padding: "2px 8px",
          borderRadius: 99,
        }}
      >
        {count}
      </span>
    </button>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        border: `1px solid ${COLORS.ligne ?? "#E5E7EB"}`,
        background: COLORS.blanc ?? "#fff",
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "inherit",
        color: "#444",
        cursor: "pointer",
        outline: "none",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/* ── Carte d'une offre ── */

function OfferCard({
  offer,
  selected,
  isPro,
  onClick,
}: {
  offer: Offer;
  selected: boolean;
  isPro: boolean;
  onClick: () => void;
}) {
  const locked = offer.proOnly && !isPro;
  const pubColor = PUBLISHER_COLORS[offer.publisherType];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      onClick={locked ? undefined : onClick}
      style={{
        background: COLORS.blanc ?? "#fff",
        border: selected
          ? `2px solid ${COLORS.vert ?? "#006B3F"}`
          : `1px solid ${COLORS.ligne ?? "#E5E7EB"}`,
        borderRadius: 14,
        padding: "18px 20px",
        cursor: locked ? "not-allowed" : "pointer",
        opacity: locked ? 0.55 : 1,
        transition: "all 0.15s ease",
        position: "relative",
        overflow: "hidden",
      }}
      whileHover={locked ? {} : { y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
    >
      {/* Badges en haut à droite */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 16,
          display: "flex",
          gap: 6,
          alignItems: "center",
        }}
      >
        {offer.urgent && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              background: `${COLORS.rouge ?? "#E30613"}15`,
              color: COLORS.rouge ?? "#E30613",
              padding: "3px 10px",
              borderRadius: 6,
              letterSpacing: 0.5,
            }}
          >
            URGENT
          </span>
        )}
        {offer.proOnly && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              background: `${ "#F4C400"}20`,
              color: "#92600A",
              padding: "3px 10px",
              borderRadius: 6,
              letterSpacing: 0.5,
            }}
          >
            ⭐ PRO
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 14 }}>
        {/* Avatar éditeur */}
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: `${pubColor}15`,
            color: pubColor,
            display: "grid",
            placeItems: "center",
            fontWeight: 900,
            fontSize: 13,
            flexShrink: 0,
            letterSpacing: -0.5,
          }}
        >
          {offer.publisherAvatar}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Titre */}
          <h3
            style={{
              fontSize: 15,
              fontWeight: 800,
              margin: "0 0 4px",
              color: COLORS.noir ?? "#111",
              lineHeight: 1.3,
              paddingRight: 100,
            }}
          >
            {offer.title}
          </h3>

          {/* Éditeur + lieu */}
          <div style={{ fontSize: 13, color: "#555", marginBottom: 8, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700 }}>{offer.publisher}</span>
            <span style={{ color: "#ccc" }}>·</span>
            <span>{offer.location}</span>
          </div>

          {/* Métadonnées */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <MetaBadge color={CONTRACT_COLORS[offer.contractType]}>
              {offer.contractType}
            </MetaBadge>
            <MetaBadge color="#666">⏱ {offer.duration}</MetaBadge>
            <MetaBadge color={COLORS.vert ?? "#006B3F"}>
              {offer.budget ? `Budget : ${offer.budget}` : offer.salary}
            </MetaBadge>
            {offer.lotNumber && (
              <MetaBadge color="#888">Lot {offer.lotNumber}</MetaBadge>
            )}
          </div>

          {/* Footer : skills + infos */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 12,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {offer.skills.slice(0, 4).map((s) => (
                <span
                  key={s}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    background: `${COLORS.vert ?? "#006B3F"}08`,
                    color: "#555",
                    padding: "3px 10px",
                    borderRadius: 6,
                  }}
                >
                  {s}
                </span>
              ))}
              {offer.skills.length > 4 && (
                <span style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>
                  +{offer.skills.length - 4}
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#999", fontWeight: 600 }}>
              <span>👤 {offer.applicants} candidat{offer.applicants > 1 ? "s" : ""}</span>
              <span>{offer.postedAt}</span>
            </div>
          </div>

          {/* Deadline pour marchés */}
          {offer.deadline && (
            <div
              style={{
                marginTop: 10,
                fontSize: 11,
                fontWeight: 700,
                color: COLORS.rouge ?? "#E30613",
              }}
            >
              📅 Date limite : {offer.deadline}
            </div>
          )}

          {/* Message verrouillé */}
          {locked && (
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                fontWeight: 700,
                color: "#92600A",
                background: `${ "#F4C400"}12`,
                padding: "8px 14px",
                borderRadius: 8,
              }}
            >
              🔒 Réservé aux abonnés Patriote Pro — 2 000 FCFA/mois
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MetaBadge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color,
        background: `${color}12`,
        padding: "3px 10px",
        borderRadius: 6,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

/* ── Panel de détail (côté droit) ── */

function OfferDetail({
  offer,
  isPro,
  userName,
  onClose,
}: {
  offer: Offer;
  isPro: boolean;
  userName: string;
  onClose: () => void;
}) {
  const pubColor = PUBLISHER_COLORS[offer.publisherType];
  const canApply = !offer.proOnly || isPro;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      style={{
        width: 420,
        flexShrink: 0,
        background: COLORS.blanc ?? "#fff",
        border: `1px solid ${COLORS.ligne ?? "#E5E7EB"}`,
        borderRadius: 16,
        padding: 0,
        position: "sticky",
        top: 100,
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
        boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header couleur */}
      <div
        style={{
          background: `linear-gradient(135deg, ${pubColor}20, ${pubColor}08)`,
          padding: "20px 24px",
          borderBottom: `1px solid ${COLORS.ligne ?? "#E5E7EB"}`,
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

        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {offer.proOnly && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                background: `${ "#F4C400"}25`,
                color: "#92600A",
                padding: "3px 10px",
                borderRadius: 6,
              }}
            >
              ⭐ PATRIOTE PRO
            </span>
          )}
          {offer.urgent && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                background: `${COLORS.rouge ?? "#E30613"}15`,
                color: COLORS.rouge ?? "#E30613",
                padding: "3px 10px",
                borderRadius: 6,
              }}
            >
              URGENT
            </span>
          )}
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              background: `${pubColor}20`,
              color: pubColor,
              padding: "3px 10px",
              borderRadius: 6,
            }}
          >
            {PUBLISHER_LABELS[offer.publisherType]}
          </span>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 8px", lineHeight: 1.3, color: COLORS.noir ?? "#111" }}>
          {offer.title}
        </h2>

        <div style={{ fontSize: 13, color: "#555" }}>
          <strong>{offer.publisher}</strong> · {offer.location}
        </div>
      </div>

      {/* Corps */}
      <div style={{ padding: "20px 24px" }}>
        {/* Infos clés en grille */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <InfoBlock label="Type de contrat" value={offer.contractType} />
          <InfoBlock label="Durée" value={offer.duration} />
          <InfoBlock label={offer.budget ? "Budget" : "Rémunération"} value={offer.budget || offer.salary} />
          <InfoBlock label="Candidatures" value={`${offer.applicants} patriote${offer.applicants > 1 ? "s" : ""}`} />
          {offer.lotNumber && <InfoBlock label="N° de lot" value={offer.lotNumber} />}
          {offer.deadline && <InfoBlock label="Date limite" value={offer.deadline} />}
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>Description du poste</SectionTitle>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "#444", margin: 0 }}>{offer.description}</p>
        </div>

        {/* Prérequis */}
        <div style={{ marginBottom: 20 }}>
          <SectionTitle>Prérequis</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {offer.requirements.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#444" }}>
                <span style={{ color: COLORS.vert ?? "#006B3F", fontWeight: 700, flexShrink: 0 }}>✓</span>
                {r}
              </div>
            ))}
          </div>
        </div>

        {/* Compétences */}
        <div style={{ marginBottom: 24 }}>
          <SectionTitle>Compétences recherchées</SectionTitle>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {offer.skills.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: COLORS.vert ?? "#006B3F",
                  background: `${COLORS.vert ?? "#006B3F"}10`,
                  padding: "5px 14px",
                  borderRadius: 8,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Bouton candidature */}
        {canApply ? (
          <button
            onClick={() => alert(`Candidature envoyée par ${userName} pour : ${offer.title}`)}
            style={{
              width: "100%",
              padding: "14px 20px",
              borderRadius: 12,
              border: "none",
              background: COLORS.vert ?? "#006B3F",
              color: "#fff",
              fontSize: 14,
              fontWeight: 800,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "all 0.15s ease",
              marginBottom: 10,
            }}
          >
            Postuler maintenant →
          </button>
        ) : (
          <div
            style={{
              padding: "14px 20px",
              borderRadius: 12,
              background: `${ "#F4C400"}15`,
              border: `1px solid ${ "#F4C400"}40`,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: "#92600A", marginBottom: 4 }}>
              🔒 Réservé aux Patriotes Pro
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>
              Passe à l'abonnement Pro (2 000 FCFA/mois) pour candidater
            </div>
            <button
              style={{
                marginTop: 10,
                padding: "10px 24px",
                borderRadius: 8,
                border: "none",
                background:  "#F4C400",
                color: "#111",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Devenir Patriote Pro ⭐
            </button>
          </div>
        )}

        <button
          style={{
            width: "100%",
            padding: "12px 20px",
            borderRadius: 12,
            border: `1.5px solid ${COLORS.ligne ?? "#E5E7EB"}`,
            background: "transparent",
            color: "#666",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          🔖 Sauvegarder l'offre
        </button>

        {/* Footer info */}
        <div
          style={{
            marginTop: 16,
            padding: "12px 0 0",
            borderTop: `1px solid ${COLORS.ligne ?? "#E5E7EB"}`,
            fontSize: 11,
            color: "#999",
            textAlign: "center",
          }}
        >
          Publié {offer.postedAt} · Signaler cette offre
        </div>
      </div>
    </motion.div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: `${COLORS.creme ?? "#F9FAFB"}`,
        borderRadius: 10,
        padding: "10px 12px",
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, color: "#999", letterSpacing: 0.5, marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.noir ?? "#111" }}>{value}</div>
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

function EmptyState({ activeTab }: { activeTab: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        textAlign: "center",
        padding: "60px 20px",
        background: COLORS.blanc ?? "#fff",
        borderRadius: 16,
        border: `1px solid ${COLORS.ligne ?? "#E5E7EB"}`,
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>
        {activeTab === "emploi" ? "💼" : "📑"}
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>
        Aucun résultat trouvé
      </h3>
      <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
        Essaie d'ajuster tes filtres ou ta recherche.
      </p>
    </motion.div>
  );
}