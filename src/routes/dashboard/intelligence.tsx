import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { getUser } from "@/lib/auth";
import { COLORS } from "@/lib/constants/colors";

/**
 * ═══════════════════════════════════════════════════════════════
 *  /dashboard/intelligence — IA MASSIFICATION (prototype visuel)
 * ═══════════════════════════════════════════════════════════════
 *
 *  Module d'analyse stratégique propulsé par l'IA pour identifier
 *  les zones à fort potentiel de massification.
 *
 *  ⚠️ PROTOTYPE — Toutes les données sont MOCK et figées.
 *  En production, alimenter par :
 *   - Embeddings + clustering des profils militants
 *   - Données géo INSEE/ANSD + densité militante
 *   - Historique d'événements et taux de conversion
 *   - Modèle de scoring (XGBoost / régression logistique)
 * ═══════════════════════════════════════════════════════════════
 */

export const Route = createFileRoute("/dashboard/intelligence")({
  component: IntelligencePage,
});

// ─── Couleurs IA (cohérent avec AIChatbot) ───
const AI_GRADIENT = "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)";
const AI_PURPLE = "#7C3AED";
const AI_CYAN = "#06B6D4";

// ─── Types ───
type Priority = "critique" | "haute" | "moyenne" | "stable";
type ActionType = "evenement" | "recrutement" | "communication" | "formation" | "presence";

interface Zone {
  id: string;
  nom: string;
  region: string;
  type: "senegal" | "diaspora";
  flag: string;
  // Position approximative sur la "carte" stylisée (% du conteneur)
  x: number;
  y: number;
  patriotes: number;
  populationCible: number;
  scorePotentiel: number; // 0-100
  scoreCouverture: number; // 0-100 (taux d'adhésion vs population cible)
  priorite: Priority;
  opportunites: string[];
  blocages: string[];
  tendance: "hausse" | "baisse" | "stable";
}

interface Recommandation {
  id: string;
  zone: string;
  action: ActionType;
  titre: string;
  description: string;
  confiance: number; // 0-100
  impactEstime: string;
  coutEstime: string;
  delaiJours: number;
}

// ─── MOCK DATA — Zones du Sénégal + diaspora ───
const ZONES: Zone[] = [
  {
    id: "z1",
    nom: "Ziguinchor",
    region: "Casamance",
    type: "senegal",
    flag: "🇸🇳",
    x: 12,
    y: 78,
    patriotes: 1850,
    populationCible: 18000,
    scorePotentiel: 87,
    scoreCouverture: 31,
    priorite: "critique",
    opportunites: [
      "Forte sympathie historique inexploitée",
      "Diaspora ziguinchoroise active à Paris/Bruxelles",
      "Jeunesse mobilisable autour des questions agricoles",
    ],
    blocages: ["Manque de coordination locale", "Faible présence digitale"],
    tendance: "hausse",
  },
  {
    id: "z2",
    nom: "Thiès",
    region: "Thiès",
    type: "senegal",
    flag: "🇸🇳",
    x: 38,
    y: 42,
    patriotes: 8420,
    populationCible: 22000,
    scorePotentiel: 72,
    scoreCouverture: 64,
    priorite: "haute",
    opportunites: [
      "Hub universitaire (UCAD-Thiès)",
      "Réseau syndical favorable",
    ],
    blocages: ["Saturation événementielle"],
    tendance: "stable",
  },
  {
    id: "z3",
    nom: "Diourbel",
    region: "Diourbel",
    type: "senegal",
    flag: "🇸🇳",
    x: 48,
    y: 50,
    patriotes: 3200,
    populationCible: 19500,
    scorePotentiel: 78,
    scoreCouverture: 38,
    priorite: "haute",
    opportunites: [
      "Bassin économique mouride dynamique",
      "Jeunes entrepreneurs en demande de formation",
    ],
    blocages: ["Concurrence politique locale forte"],
    tendance: "hausse",
  },
  {
    id: "z4",
    nom: "Dakar",
    region: "Dakar",
    type: "senegal",
    flag: "🇸🇳",
    x: 22,
    y: 55,
    patriotes: 18500,
    populationCible: 38000,
    scorePotentiel: 65,
    scoreCouverture: 82,
    priorite: "stable",
    opportunites: ["Base solide pour campagnes nationales"],
    blocages: ["Effet plateau, croissance ralentie"],
    tendance: "stable",
  },
  {
    id: "z5",
    nom: "Saint-Louis",
    region: "Saint-Louis",
    type: "senegal",
    flag: "🇸🇳",
    x: 32,
    y: 22,
    patriotes: 2100,
    populationCible: 12000,
    scorePotentiel: 69,
    scoreCouverture: 45,
    priorite: "moyenne",
    opportunites: ["Tradition intellectuelle et universitaire"],
    blocages: ["Population vieillissante, jeunes en exode"],
    tendance: "stable",
  },
  {
    id: "z6",
    nom: "Tambacounda",
    region: "Tambacounda",
    type: "senegal",
    flag: "🇸🇳",
    x: 68,
    y: 62,
    patriotes: 480,
    populationCible: 9500,
    scorePotentiel: 81,
    scoreCouverture: 14,
    priorite: "critique",
    opportunites: [
      "Zone enclavée, peu de concurrence politique",
      "Demande forte d'infrastructures et de représentation",
    ],
    blocages: ["Distance, logistique coûteuse", "Réseau internet limité"],
    tendance: "hausse",
  },
  {
    id: "z7",
    nom: "Paris",
    region: "France",
    type: "diaspora",
    flag: "🇫🇷",
    x: 78,
    y: 18,
    patriotes: 4200,
    populationCible: 9000,
    scorePotentiel: 76,
    scoreCouverture: 71,
    priorite: "moyenne",
    opportunites: ["Capacité de financement élevée", "Réseau associatif dense"],
    blocages: ["Fatigue militante"],
    tendance: "stable",
  },
  {
    id: "z8",
    nom: "Milan",
    region: "Italie",
    type: "diaspora",
    flag: "🇮🇹",
    x: 88,
    y: 28,
    patriotes: 1450,
    populationCible: 6500,
    scorePotentiel: 79,
    scoreCouverture: 47,
    priorite: "haute",
    opportunites: ["Diaspora jeune et active", "Forte intention de contribution"],
    blocages: ["Manque de coordinateur dédié"],
    tendance: "hausse",
  },
];

// ─── MOCK DATA — Recommandations IA générées ───
const RECOMMANDATIONS: Recommandation[] = [
  {
    id: "r1",
    zone: "Tambacounda",
    action: "presence",
    titre: "Caravane de présence terrain (3 semaines)",
    description:
      "Déployer une équipe mobile de 5 patriotes expérimentés pour structurer 3 sections locales et identifier les leaders potentiels. L'IA a détecté une demande latente forte mais un déficit critique de coordination.",
    confiance: 92,
    impactEstime: "+1 200 patriotes en 90 jours",
    coutEstime: "4,5M FCFA",
    delaiJours: 21,
  },
  {
    id: "r2",
    zone: "Ziguinchor",
    action: "evenement",
    titre: "Forum « Casamance Souveraine » à Ziguinchor",
    description:
      "Organiser un forum sur 2 jours autour de l'agriculture vivrière et de la jeunesse casamançaise. Inviter 3 figures locales reconnues. Modèle de mobilisation similaire à celui réussi à Kolda en mars.",
    confiance: 88,
    impactEstime: "+800 patriotes, +12M FCFA cotisations",
    coutEstime: "8M FCFA",
    delaiJours: 45,
  },
  {
    id: "r3",
    zone: "Milan",
    action: "recrutement",
    titre: "Nommer un coordinateur régional Italie",
    description:
      "L'IA identifie 3 candidats potentiels parmi les patriotes actifs (engagement >85, ancienneté >2 ans). Le profil de Fatou S. ressort comme optimal selon le matching compétences/disponibilité.",
    confiance: 84,
    impactEstime: "+600 patriotes diaspora Italie",
    coutEstime: "300K FCFA / mois",
    delaiJours: 14,
  },
  {
    id: "r4",
    zone: "Diourbel",
    action: "formation",
    titre: "Module Académie « Entrepreneuriat Mouride »",
    description:
      "Lancer un parcours de formation Académie ciblé sur les jeunes entrepreneurs mourides. La corrélation entre formation et engagement long-terme est de 0.73 dans nos données historiques.",
    confiance: 79,
    impactEstime: "+450 inscrits, conversion 38%",
    coutEstime: "2,8M FCFA",
    delaiJours: 60,
  },
  {
    id: "r5",
    zone: "Thiès",
    action: "communication",
    titre: "Campagne digitale ciblée 18-35 ans",
    description:
      "Saturation événementielle détectée → bascule sur stratégie digitale. Contenus courts WhatsApp/TikTok autour des projets de codéveloppement Thiès, avec testimonials de patriotes locaux.",
    confiance: 71,
    impactEstime: "+900 patriotes, coût/acquisition divisé par 4",
    coutEstime: "1,5M FCFA",
    delaiJours: 30,
  },
];

// ─── Mapping couleurs par priorité ───
const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  critique: { label: "Critique", color: "#fff", bg: COLORS.rouge },
  haute: { label: "Haute", color: "#fff", bg: "#F59E0B" },
  moyenne: { label: "Moyenne", color: "#fff", bg: AI_CYAN },
  stable: { label: "Stable", color: "#fff", bg: "#10B981" },
};

const ACTION_CONFIG: Record<ActionType, { icon: string; label: string }> = {
  evenement: { icon: "🎪", label: "Événement" },
  recrutement: { icon: "👥", label: "Recrutement" },
  communication: { icon: "📢", label: "Communication" },
  formation: { icon: "🎓", label: "Formation" },
  presence: { icon: "📍", label: "Présence terrain" },
};

// ═══════════════════════════════════════════════════════════════
//  COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════
function IntelligencePage() {
  const user = getUser();
  const [analyzing, setAnalyzing] = useState(true);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [filter, setFilter] = useState<"all" | "senegal" | "diaspora">("all");

  // Effet "IA analyse en cours" au chargement (1.6s)
  useEffect(() => {
    const t = setTimeout(() => setAnalyzing(false), 1600);
    return () => clearTimeout(t);
  }, []);

  // ─── Stats globales calculées ───
  const stats = useMemo(() => {
    const totalPatriotes = ZONES.reduce((sum, z) => sum + z.patriotes, 0);
    const totalCible = ZONES.reduce((sum, z) => sum + z.populationCible, 0);
    const scoreMoyen = Math.round(
      ZONES.reduce((sum, z) => sum + z.scorePotentiel, 0) / ZONES.length,
    );
    const critiques = ZONES.filter((z) => z.priorite === "critique").length;
    return {
      totalPatriotes,
      totalCible,
      couverture: Math.round((totalPatriotes / totalCible) * 100),
      scoreMoyen,
      critiques,
      recos: RECOMMANDATIONS.length,
    };
  }, []);

  const filteredZones = useMemo(
    () => (filter === "all" ? ZONES : ZONES.filter((z) => z.type === filter)),
    [filter],
  );

  // ─── Écran d'analyse au chargement ───
  if (analyzing) {
    return <AnalyzingScreen />;
  }

  return (
    <div style={{ padding: "24px 32px 64px", maxWidth: 1400, margin: "0 auto" }}>
      {/* ═══ HEADER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: AI_GRADIENT,
              display: "grid",
              placeItems: "center",
              boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
              <circle cx="19" cy="5" r="1.5" />
              <circle cx="5" cy="19" r="1.5" />
            </svg>
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 800,
                color: COLORS.noir,
                letterSpacing: "-0.02em",
              }}
            >
              Intelligence Massification
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#666" }}>
              Analyse IA des zones à fort potentiel de mobilisation patriote 🇸🇳
            </p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#22C55E",
              }}
            />
            <span style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>
              Analyse temps réel · {new Date().toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ═══ KPIs ═══ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <KPICard
          icon="🎯"
          label="Score moyen potentiel"
          value={`${stats.scoreMoyen}/100`}
          accent={AI_PURPLE}
          delay={0}
        />
        <KPICard
          icon="📍"
          label="Zones analysées"
          value={ZONES.length.toString()}
          accent={AI_CYAN}
          delay={0.05}
        />
        <KPICard
          icon="🚨"
          label="Zones critiques"
          value={stats.critiques.toString()}
          accent={COLORS.rouge}
          delay={0.1}
        />
        <KPICard
          icon="💡"
          label="Recommandations IA"
          value={stats.recos.toString()}
          accent={COLORS.vert}
          delay={0.15}
        />
      </div>

      {/* ═══ Filtres ═══ */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { id: "all" as const, label: "Toutes les zones" },
          { id: "senegal" as const, label: "🇸🇳 Sénégal" },
          { id: "diaspora" as const, label: "🌍 Diaspora" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: `1.5px solid ${filter === f.id ? AI_PURPLE : COLORS.ligne}`,
              background: filter === f.id ? AI_PURPLE : COLORS.blanc,
              color: filter === f.id ? "#fff" : COLORS.noir,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ═══ CARTE STYLISÉE ═══ */}
      <div
        style={{
          background: COLORS.blanc,
          borderRadius: 20,
          padding: 24,
          marginBottom: 32,
          border: `1px solid ${COLORS.ligne}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <SectionTitle
          icon="🗺️"
          title="Carte de chaleur — Potentiel par zone"
          subtitle="Cliquez sur un point pour afficher l'analyse détaillée"
        />
        <HeatmapView zones={filteredZones} onSelect={setSelectedZone} selected={selectedZone} />
        <Legend />
      </div>

      {/* ═══ ZONES PRIORITAIRES (cards) ═══ */}
      <div style={{ marginBottom: 32 }}>
        <SectionTitle
          icon="⚡"
          title="Zones prioritaires"
          subtitle={`${filteredZones.length} zones analysées par notre IA`}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16,
            marginTop: 16,
          }}
        >
          {filteredZones
            .sort((a, b) => b.scorePotentiel - a.scorePotentiel)
            .map((zone, idx) => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                delay={idx * 0.04}
                onClick={() => setSelectedZone(zone)}
              />
            ))}
        </div>
      </div>

      {/* ═══ RECOMMANDATIONS IA ═══ */}
      <div>
        <SectionTitle
          icon="🤖"
          title="Recommandations IA"
          subtitle="Actions concrètes générées par notre modèle"
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          {RECOMMANDATIONS.map((reco, idx) => (
            <RecoCard key={reco.id} reco={reco} delay={idx * 0.05} />
          ))}
        </div>
      </div>

      {/* ═══ Modal détail zone ═══ */}
      <AnimatePresence>
        {selectedZone && (
          <ZoneDetailModal zone={selectedZone} onClose={() => setSelectedZone(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ÉCRAN "ANALYSE EN COURS"
// ═══════════════════════════════════════════════════════════════
function AnalyzingScreen() {
  const steps = [
    "Récupération des données militantes...",
    "Croisement avec les indicateurs socio-géo...",
    "Calcul des scores de potentiel...",
    "Génération des recommandations...",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, steps.length - 1));
    }, 380);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "grid",
        placeItems: "center",
        padding: 32,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        {/* Orbe IA animée */}
        <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 32px" }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 3 + i, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, delay: i * 0.3 },
              }}
              style={{
                position: "absolute",
                inset: i * 12,
                borderRadius: "50%",
                border: `2px solid ${i === 0 ? AI_PURPLE : i === 1 ? AI_CYAN : "#A855F7"}`,
                borderTopColor: "transparent",
                borderRightColor: "transparent",
              }}
            />
          ))}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              position: "absolute",
              inset: 36,
              borderRadius: "50%",
              background: AI_GRADIENT,
              boxShadow: "0 0 40px rgba(124,58,237,0.6)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
            </svg>
          </motion.div>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: COLORS.noir }}>
          Analyse IA en cours
        </h2>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
          Notre modèle croise vos données militantes avec les indicateurs socio-géographiques...
        </p>

        <div style={{ textAlign: "left" }}>
          {steps.map((s, i) => (
            <motion.div
              key={s}
              animate={{ opacity: i <= step ? 1 : 0.3 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
                fontSize: 13,
                color: i <= step ? COLORS.noir : "#999",
                fontWeight: i === step ? 600 : 400,
              }}
            >
              {i < step ? (
                <span style={{ color: "#22C55E", fontSize: 16 }}>✓</span>
              ) : i === step ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: 14,
                    height: 14,
                    border: `2px solid ${AI_PURPLE}`,
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <span style={{ width: 14 }}>○</span>
              )}
              {s}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CARTE STYLISÉE (heatmap fictive)
// ═══════════════════════════════════════════════════════════════
function HeatmapView({
  zones,
  onSelect,
  selected,
}: {
  zones: Zone[];
  onSelect: (z: Zone) => void;
  selected: Zone | null;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
        borderRadius: 16,
        overflow: "hidden",
        marginTop: 16,
      }}
    >
      {/* Grille de fond stylisée */}
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.15 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Séparateur Sénégal / Diaspora */}
      <div
        style={{
          position: "absolute",
          left: "65%",
          top: 0,
          bottom: 0,
          width: 1,
          background: "rgba(255,255,255,0.1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "32.5%",
          transform: "translateX(-50%)",
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
          fontWeight: 600,
          letterSpacing: "0.1em",
        }}
      >
        🇸🇳 SÉNÉGAL
      </div>
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "82.5%",
          transform: "translateX(-50%)",
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
          fontWeight: 600,
          letterSpacing: "0.1em",
        }}
      >
        🌍 DIASPORA
      </div>

      {/* Points zones */}
      {zones.map((zone, idx) => {
        const size = 14 + (zone.scorePotentiel / 100) * 28;
        const intensity = zone.scorePotentiel / 100;
        return (
          <motion.div
            key={zone.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.06, type: "spring" }}
            onClick={() => onSelect(zone)}
            style={{
              position: "absolute",
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
            }}
          >
            {/* Halo pulsant pour zones critiques */}
            {zone.priorite === "critique" && (
              <motion.div
                animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  background: COLORS.rouge,
                  filter: "blur(4px)",
                }}
              />
            )}
            <motion.div
              whileHover={{ scale: 1.3 }}
              style={{
                width: size,
                height: size,
                borderRadius: "50%",
                background:
                  zone.priorite === "critique"
                    ? COLORS.rouge
                    : zone.priorite === "haute"
                    ? "#F59E0B"
                    : zone.priorite === "moyenne"
                    ? AI_CYAN
                    : "#10B981",
                boxShadow: `0 0 ${20 * intensity}px ${
                  zone.priorite === "critique"
                    ? "rgba(198,28,62,0.8)"
                    : zone.priorite === "haute"
                    ? "rgba(245,158,11,0.8)"
                    : zone.priorite === "moyenne"
                    ? "rgba(6,182,212,0.8)"
                    : "rgba(16,185,129,0.8)"
                }`,
                border: selected?.id === zone.id ? "3px solid #fff" : "2px solid rgba(255,255,255,0.4)",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                fontSize: size > 30 ? 14 : 11,
                fontWeight: 800,
              }}
            >
              {zone.scorePotentiel}
            </motion.div>
            {/* Label */}
            <div
              style={{
                position: "absolute",
                top: size + 4,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 10,
                color: "rgba(255,255,255,0.85)",
                fontWeight: 600,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              {zone.nom}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function Legend() {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        marginTop: 12,
        flexWrap: "wrap",
        fontSize: 12,
        color: "#666",
      }}
    >
      {(Object.entries(PRIORITY_CONFIG) as [Priority, (typeof PRIORITY_CONFIG)[Priority]][]).map(
        ([key, cfg]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: cfg.bg,
              }}
            />
            {cfg.label}
          </div>
        ),
      )}
      <div style={{ marginLeft: "auto", fontStyle: "italic" }}>
        Taille du point = potentiel de massification
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CARDS
// ═══════════════════════════════════════════════════════════════
function KPICard({
  icon,
  label,
  value,
  accent,
  delay,
}: {
  icon: string;
  label: string;
  value: string;
  accent: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: COLORS.blanc,
        borderRadius: 16,
        padding: 20,
        border: `1px solid ${COLORS.ligne}`,
        borderLeft: `4px solid ${accent}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.noir, lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{label}</div>
    </motion.div>
  );
}

function ZoneCard({
  zone,
  delay,
  onClick,
}: {
  zone: Zone;
  delay: number;
  onClick: () => void;
}) {
  const cfg = PRIORITY_CONFIG[zone.priorite];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      onClick={onClick}
      style={{
        background: COLORS.blanc,
        borderRadius: 16,
        padding: 18,
        border: `1px solid ${COLORS.ligne}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>
            {zone.flag} {zone.region}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.noir }}>{zone.nom}</div>
        </div>
        <div
          style={{
            padding: "4px 10px",
            borderRadius: 999,
            background: cfg.bg,
            color: cfg.color,
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {cfg.label}
        </div>
      </div>

      {/* Score circulaire stylisé */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <CircleScore value={zone.scorePotentiel} color={AI_PURPLE} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "#666", marginBottom: 2 }}>Couverture actuelle</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.noir }}>
            {zone.patriotes.toLocaleString("fr-FR")} / {zone.populationCible.toLocaleString("fr-FR")}
          </div>
          <div
            style={{
              marginTop: 4,
              height: 6,
              background: COLORS.ligne,
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${zone.scoreCouverture}%` }}
              transition={{ delay: delay + 0.2, duration: 0.8 }}
              style={{
                height: "100%",
                background: AI_GRADIENT,
                borderRadius: 999,
              }}
            />
          </div>
          <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>
            {zone.scoreCouverture}% • Tendance{" "}
            {zone.tendance === "hausse" ? "↗ hausse" : zone.tendance === "baisse" ? "↘ baisse" : "→ stable"}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: AI_PURPLE, fontWeight: 600 }}>
        Voir l'analyse détaillée →
      </div>
    </motion.div>
  );
}

function CircleScore({ value, color }: { value: number; color: string }) {
  const radius = 26;
  const circ = 2 * Math.PI * radius;
  return (
    <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke={COLORS.ligne} strokeWidth="5" />
        <motion.circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (circ * value) / 100 }}
          transition={{ duration: 1, ease: "easeOut" }}
          transform="rotate(-90 32 32)"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontSize: 16,
          fontWeight: 800,
          color: COLORS.noir,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function RecoCard({ reco, delay }: { reco: Recommandation; delay: number }) {
  const cfg = ACTION_CONFIG[reco.action];
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ x: 4 }}
      style={{
        background: COLORS.blanc,
        borderRadius: 16,
        padding: 20,
        border: `1px solid ${COLORS.ligne}`,
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: 16,
        alignItems: "start",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: AI_GRADIENT,
          display: "grid",
          placeItems: "center",
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        {cfg.icon}
      </div>

      <div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              background: `${AI_PURPLE}15`,
              color: AI_PURPLE,
              padding: "2px 8px",
              borderRadius: 999,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {cfg.label}
          </span>
          <span style={{ fontSize: 11, color: "#666" }}>📍 {reco.zone}</span>
        </div>
        <h4 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: COLORS.noir }}>
          {reco.titre}
        </h4>
        <p style={{ margin: 0, fontSize: 13, color: "#666", lineHeight: 1.5 }}>{reco.description}</p>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 10,
            fontSize: 11,
            color: "#666",
            flexWrap: "wrap",
          }}
        >
          <span>📈 <strong style={{ color: COLORS.vert }}>{reco.impactEstime}</strong></span>
          <span>💰 {reco.coutEstime}</span>
          <span>⏱ {reco.delaiJours} jours</span>
        </div>
      </div>

      <div style={{ textAlign: "center", flexShrink: 0 }}>
        <div style={{ fontSize: 9, color: "#999", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Confiance IA
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: reco.confiance >= 85 ? COLORS.vert : reco.confiance >= 70 ? "#F59E0B" : "#999",
          }}
        >
          {reco.confiance}%
        </div>
      </div>
    </motion.div>
  );
}

function SectionTitle({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <h3
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 700,
          color: COLORS.noir,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>{icon}</span>
        {title}
      </h3>
      <p style={{ margin: "4px 0 0", fontSize: 12, color: "#666" }}>{subtitle}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MODAL DÉTAIL ZONE
// ═══════════════════════════════════════════════════════════════
function ZoneDetailModal({ zone, onClose }: { zone: Zone; onClose: () => void }) {
  const cfg = PRIORITY_CONFIG[zone.priorite];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 1000,
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.blanc,
          borderRadius: 20,
          padding: 28,
          maxWidth: 560,
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
              {zone.flag} {zone.region}
            </div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{zone.nom}</h2>
            <span
              style={{
                display: "inline-block",
                marginTop: 8,
                padding: "4px 10px",
                borderRadius: 999,
                background: cfg.bg,
                color: cfg.color,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {cfg.label.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: COLORS.ligne,
              border: "none",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          <MiniStat label="Score potentiel" value={`${zone.scorePotentiel}/100`} accent={AI_PURPLE} />
          <MiniStat label="Couverture" value={`${zone.scoreCouverture}%`} accent={AI_CYAN} />
          <MiniStat label="Patriotes" value={zone.patriotes.toLocaleString("fr-FR")} accent={COLORS.vert} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: COLORS.vert, marginBottom: 8 }}>
            ✓ Opportunités détectées
          </h4>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#444", fontSize: 13, lineHeight: 1.7 }}>
            {zone.opportunites.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: COLORS.rouge, marginBottom: 8 }}>
            ⚠ Blocages identifiés
          </h4>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#444", fontSize: 13, lineHeight: 1.7 }}>
            {zone.blocages.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 12,
        background: COLORS.creme,
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.noir, marginTop: 4 }}>{value}</div>
    </div>
  );
}