import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { COLORS } from "@/lib/constants/colors";
import { Nav } from "@/components/sections/Nav";
import { Classement } from "@/components/sections/Classement";

export const Route = createFileRoute("/pastef")({
  component: AProposPage,
});

/* ═══════════════════════════════════════════════════════════════
   DONNÉES
   ═══════════════════════════════════════════════════════════════ */

interface Leader {
  id: string; nom: string; poste: string; initiales: string;
  photo?: string; bio: string; naissance?: string;
  profession?: string; region?: string; fait?: string;
  parcours?: string[];
}

const PRESIDENT: Leader = {
  id: "sonko", nom: "Ousmane Sonko", poste: "Président du Parti", initiales: "OS",
  photo: "/images/president.webp",
  naissance: "15 juillet 1974, Thiès",
  profession: "Inspecteur des impôts · Premier Ministre du Sénégal",
  region: "Ziguinchor / Dakar",
  fait: "Fondateur de PASTEF en 2014. Premier Ministre depuis avril 2024.",
  bio: "Ousmane Sonko a fondé PASTEF en janvier 2014 après sa radiation de la fonction publique. Inspecteur des impôts de formation, il s'est imposé comme la figure principale de l'opposition sénégalaise grâce à son discours anti-système et panafricaniste. Élu député de Dakar en 2017, troisième à la présidentielle de 2019 avec 15% des voix, il a subi arrestations et dissolution de son parti en 2023. Après la victoire de Bassirou Diomaye Faye à la présidentielle de mars 2024, il est nommé Premier Ministre.",
  parcours: [
    "1974 — Naissance à Thiès",
    "2001 — Diplômé ENA, Inspecteur des impôts",
    "2014 — Fonde le parti PASTEF",
    "2017 — Élu député de Dakar",
    "2019 — 3e à la présidentielle (15%)",
    "2023 — Arrestation, dissolution du parti",
    "2024 — Nommé Premier Ministre",
  ],
};

const VICE_PRESIDENTS: Leader[] = [
  { id: "ndiaye",photo: "/images/elmalik.jpg", nom: "Malick Ndiaye", poste: "Vice-Président", initiales: "MN", naissance: "24 juillet 1982, Dahra", profession: "Ancien Pdt de l'Assemblée nationale", region: "Linguère", fait: "Membre PASTEF depuis 2015. Président de l'Assemblée nationale (déc. 2024).", bio: "Malick Ndiaye a rejoint PASTEF en 2015. Nommé Ministre des Infrastructures en avril 2024, il est élu Président de l'Assemblée nationale le 2 décembre 2024 avec 134 voix lors de l'installation de la 15e législature.", parcours: ["1982 — Naissance à Dahra", "2015 — Adhère à PASTEF", "Avr. 2024 — Ministre des Infrastructures", "Déc. 2024 — Président de l'Assemblée nationale", "Avr. 2026 — Vice-Président du parti"] },
  { id: "fall",photo: "/images/abassfall.jpg", nom: "Abass Fall", poste: "Vice-Président", initiales: "AF", profession: "Député · Cadre historique", region: "Dakar", fait: "Militant de la première heure du parti.", bio: "Abass Fall est l'un des cadres historiques du parti. Militant de la première heure, il a joué un rôle clé dans l'organisation territoriale de PASTEF à Dakar. Nommé vice-président en avril 2026.", parcours: ["Militant historique PASTEF", "Cadre territorial à Dakar", "Élu député en 2024", "Avr. 2026 — Vice-Président"] },
  { id: "ngom", photo: "/images/daouda.webp",nom: "Daouda Ngom", poste: "Vice-Président", initiales: "DN", profession: "Cadre · Homme politique", fait: "Membre du Comité exécutif depuis 2026.", bio: "Daouda Ngom fait partie des responsables stratégiques du parti. Nommé vice-président et membre du Comité exécutif lors de la restructuration d'avril 2026.", parcours: ["Cadre du parti", "Avr. 2026 — Vice-Président"] },
  { id: "sarre", photo: "/images/sarre.jfif",nom: "Moustapha Sarré", poste: "Vice-Président", initiales: "MS", profession: "Homme politique", bio: "Moustapha Sarré est promu vice-président du parti en avril 2026, consolidant la direction collégiale voulue par Ousmane Sonko.", parcours: ["Militant PASTEF", "Avr. 2026 — Vice-Président"] },
];

const SECRETAIRES: Leader[] = [
  { id: "kebe",photo: "/images/bassirou.jfif", nom: "Bassirou Kébé", poste: "Secrétaire Général", initiales: "BK", profession: "Homme politique", bio: "Bassirou Kébé est nommé au secrétariat général lors de la restructuration d'avril 2026.", parcours: ["Cadre PASTEF", "Avr. 2026 — Secrétaire Général"] },
  { id: "fkeita",photo: "/images/fadilou.jfif", nom: "Fadilou Keita", poste: "Secrétaire Général", initiales: "FK", profession: "Ancien DG CENA", fait: "Homme de confiance de Sonko.", bio: "Fadilou Keita est l'une des figures de confiance de la direction du parti. Ancien Directeur Général de la CENA, il est nommé au secrétariat général en avril 2026.", parcours: ["Ancien DG CENA", "Cadre stratégique PASTEF", "Avr. 2026 — Secrétaire Général"] },
  { id: "kdiop", photo: "/images/khadidiatou.jpg",nom: "Khadidiatou Diop", poste: "Secrétaire Générale", initiales: "KD", profession: "Femme politique", fait: "Connue sous le nom de Khadija Mahecor Diouf.", bio: "Khadidiatou Diop, dite Khadija Mahecor Diouf, est nommée au secrétariat général en avril 2026.", parcours: ["Militante PASTEF", "Avr. 2026 — Secrétaire Générale"] },
  { id: "kgaye",photo: "/images/diene.jfif", nom: "Khady Diène Gaye", poste: "Secrétaire Générale", initiales: "KG", profession: "Ancienne Ministre", bio: "Khady Diène Gaye est nommée au secrétariat général lors de la restructuration d'avril 2026.", parcours: ["Ancienne Ministre", "Avr. 2026 — Secrétaire Générale"] },
];

interface Mouvement {
  sigle: string; nom: string; desc: string; cible: string;
  color: string; comment: string;
  /** Photo de fond illustrant le mouvement */
  image: string;
}

const MOUVEMENTS: Mouvement[] = [
  { sigle: "JPS", nom: "Jeunesse Patriotique du Sénégal", desc: "Fer de lance auprès de la jeunesse. Actions médico-sociales, forums d'emploi, massification et sensibilisation citoyenne.", cible: "Jeunes de 18 à 35 ans", color: COLORS.vert, comment: "Contacter le coordinateur JPS de votre commune ou la cellule PASTEF la plus proche.", image: "/images/JPS.png" },
  { sigle: "MOJIP", nom: "Mouvement des Jigeeni PASTEF", desc: "Mouvement des femmes du parti. Leadership féminin, autonomisation économique, participation politique.", cible: "Femmes patriotes", color: COLORS.rouge, comment: "Adhésion via la coordinatrice départementale MOJIP.", image: "/images/mojip.jpg" },
  { sigle: "MONEP", nom: "Mouvement National des Enseignants", desc: "Réflexion sur la réforme éducative, formation idéologique, amélioration du système scolaire sénégalais.", cible: "Enseignants et formateurs", color: "#2563EB", comment: "Inscription auprès du responsable MONEP de votre académie.", image: "/images/monep.jfif" },
  { sigle: "MONCAP", nom: "Mouvement National des Cadres", desc: "Expertise technique au service du parti et du gouvernement. Think tank interne, échange entre professionnels.", cible: "Cadres et experts", color: "#7C3AED", comment: "Manifester son intérêt via le Bureau Politique ou le SN Formation.", image: "/images/moncap.jfif" },
  { sigle: "MAGUI", nom: "Mouvement des Anciens et Guides", desc: "Expérience des aînés, conseil, médiation, interface avec les chefs religieux et coutumiers.", cible: "Anciens et guides", color: "#6B7280", comment: "Prise de contact via les responsables locaux du parti.", image: "/images/magui.jfif" },
  { sigle: "MODDAP", nom: "Diplômés de la Diaspora", desc: "Mobilisation des compétences de la diaspora diplômée. Transfert de connaissances, mentorat, co-développement.", cible: "Diplômés diaspora", color: "#0891B2", comment: "Inscription en ligne ou via les coordinateurs diaspora.", image: "/images/moddap.jfif" },
  { sigle: "MONAP", nom: "Mouvement National des Artisans", desc: "Promotion de l'artisanat local, formation professionnelle, accès aux marchés publics pour les corps de métiers.", cible: "Artisans et ouvriers", color: "#D97706", comment: "Adhésion via la cellule locale ou le coordinateur communal.", image: "/images/monap.jfif" },
  { sigle: "MONAPH", nom: "Personnes Handicapées", desc: "Inclusion, accessibilité, défense des droits, intégration professionnelle et représentation politique.", cible: "Personnes en situation de handicap", color: "#059669", comment: "Contacter le responsable MONAPH départemental.", image: "/images/monaph.jpg" },
];

interface Slide {
  num: string; titre: string; sousTitre: string; texte: string;
  highlights?: { label: string; valeur: string }[];
  color: string; bg: string;
}

const SLIDES: Slide[] = [
  {
    num: "01", titre: "Le Projet", sousTitre: "Vision Sénégal 2050",
    texte: "Un plan intergénérationnel de 25 ans pour transformer le Sénégal en une nation souveraine, juste et prospère. Le successeur du Plan Sénégal Émergent.",
    highlights: [
      { label: "Horizon", valeur: "2050" },
      { label: "Budget 4 ans", valeur: "18 000 Mds FCFA" },
      { label: "Pôles économiques", valeur: "8 régionaux" },
    ],
    color: COLORS.vert, bg: "",
  },
  {
    num: "02", titre: "Souveraineté", sousTitre: "Reprendre le contrôle",
    texte: "Réappropriation des ressources naturelles (pétrole, gaz, mines), souveraineté alimentaire par l'autosuffisance, souveraineté monétaire et révision des accords de défense.",
    highlights: [
      { label: "Ressources", valeur: "Pétrole · Gaz · Mines" },
      { label: "Cible", valeur: "Autosuffisance alimentaire" },
    ],
    color: COLORS.vert, bg: "",
  },
  {
    num: "03", titre: "Justice sociale", sousTitre: "Personne ne reste de côté",
    texte: "Couverture maladie universelle, accès gratuit à l'école, réforme foncière, politique massive de l'emploi jeune. La République des droits réels.",
    highlights: [
      { label: "Santé", valeur: "Couverture universelle" },
      { label: "Éducation", valeur: "Accès gratuit" },
    ],
    color: COLORS.vert, bg: "",
  },
  {
    num: "04", titre: "Transformation économique", sousTitre: "L'industrialisation locale",
    texte: "Privilégier la transformation locale des matières premières. Émergence de 8 pôles économiques régionaux pour rééquilibrer la croissance hors de Dakar.",
    highlights: [
      { label: "Pôles régionaux", valeur: "8" },
      { label: "Stratégie", valeur: "Import-substitution" },
    ],
    color: COLORS.vert, bg: "",
  },
  {
    num: "05", titre: "Panafricanisme", sousTitre: "L'Afrique d'abord",
    texte: "Intégration africaine renforcée, coopération Sud-Sud, soutien à l'Alliance des États du Sahel, réforme des institutions internationales.",
    highlights: [
      { label: "Priorité", valeur: "Intégration AES" },
      { label: "Vision", valeur: "Sud-Sud" },
    ],
    color: COLORS.vert, bg: "",
  },
  {
    num: "06", titre: "Feuille de route", sousTitre: "3 étapes vers 2050",
    texte: "Redresser (2024-2029), Impulser (2030-2035), Accélérer (2036-2050). Une trajectoire claire, mesurable, intergénérationnelle.",
    highlights: [
      { label: "2024-2029", valeur: "Redresser" },
      { label: "2030-2035", valeur: "Impulser" },
      { label: "2036-2050", valeur: "Accélérer" },
    ],
    color: COLORS.vert, bg: "",
  },
];

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */

function AProposPage() {
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [mvtIndex, setMvtIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  // Auto-rotation carrousel mouvements toutes les 5s
  useEffect(() => {
    const t = setInterval(() => setMvtIndex((i) => (i + 1) % MOUVEMENTS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", background: "#fff" }}>
      {/* CSS global pour le carrousel auto-défilant du Classement */}
      <style>{`
        @keyframes scrollCarousel {
          from { transform: translateX(0) }
          to { transform: translateX(-50%) }
        }
        .carousel-track { animation: scrollCarousel 60s linear infinite; }
        .carousel-wrap:hover .carousel-track { animation-play-state: paused; }
      `}</style>

      <Nav scrolled={false} />

      {/* ═══════════ HERO ═══════════ */}
      <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "#F8F7F4" }}>
        {/* Photo (côté droit) */}
        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0, width: "60%",
          backgroundImage: "url(/images/hero-rally.jpg)",
          backgroundSize: "cover", backgroundPosition: "center center",
        }} />
        {/* Dégradé blanc */}
        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0, width: "65%",
          background: "linear-gradient(to right, #F8F7F4 15%, rgba(248,247,244,0.85) 35%, rgba(248,247,244,0.3) 60%, transparent 100%)",
        }} />

        {/* Contenu hero */}
        <div style={{ position: "relative", zIndex: 1, height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 48px", maxWidth: 700 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, margin: "0 0 18px" }}>
              <span style={{ color: COLORS.vert }}>PASTEF</span>{" "}
              <span style={{ color: COLORS.rouge }}>LES PATRIOTES</span>
            </h1>
            <p style={{ fontSize: 20, color: "#555", margin: "0 0 40px", fontWeight: 500, fontStyle: "italic", letterSpacing: 0.3 }}>
              Le don de soi pour la Patrie.
            </p>
            <a href="#adhesion"
              onClick={(e) => { e.preventDefault(); document.getElementById("adhesion")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "16px 36px", borderRadius: 999,
                background: COLORS.rouge, color: "#fff",
                fontWeight: 800, fontSize: 14, letterSpacing: 1.5,
                textDecoration: "none", cursor: "pointer",
                boxShadow: `0 8px 24px ${COLORS.rouge}40`,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${COLORS.rouge}55`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 8px 24px ${COLORS.rouge}40`; }}
            >
              ADHÉRER AU PARTI →
            </a>
          </motion.div>
        </div>

        {/* Indicateur de scroll */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.5 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#666" }}>DÉCOUVRIR</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: 20, color: "#666" }}>↓</motion.div>
        </div>
      </div>

      {/* ═══════════ SECTION DIRECTION ═══════════ */}
      <section id="organigramme" style={{
        padding: "100px 48px", position: "relative", overflow: "hidden",
        backgroundImage: "url(/images/bg-arcs.png)",
        backgroundSize: "cover", backgroundPosition: "center",
        backgroundColor: "#E8F0EC",
      }}>
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
          <SectionEyebrow color={COLORS.vert}>La direction</SectionEyebrow>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px" }}>Le Bureau Politique</h2>
          <p style={{ fontSize: 15, color: "#888", margin: "0 0 56px", maxWidth: 600 }}>
            Restructuration du 19 avril 2026 — Cliquez sur un membre pour découvrir son parcours.
          </p>

          {/* Président */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <LeaderCard leader={PRESIDENT} tier="president" onClick={setSelectedLeader} />
          </div>
          <TreeLine color={COLORS.vert} />

          <TierLabel label="Vice-Présidents" color={COLORS.rouge} />
          <div style={{ display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap", marginBottom: 12 }}>
            {VICE_PRESIDENTS.map(vp => (
              <LeaderCard key={vp.id} leader={vp} tier="vp" onClick={setSelectedLeader} />
            ))}
          </div>
          <TreeLine color="#2563EB" />

          <TierLabel label="Secrétaires Généraux" color="#2563EB" />
          <div style={{ display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>
            {SECRETAIRES.map(sg => (
              <LeaderCard key={sg.id} leader={sg} tier="sg" onClick={setSelectedLeader} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION MOUVEMENTS ═══════════ */}
      <section id="mouvements" style={{ padding: "100px 48px 60px", background: "#0a0a0a", color: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionEyebrow color="#fff">Les mouvements</SectionEyebrow>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px", color: "#fff" }}>8 mouvements, une seule famille</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", margin: "0 0 48px", maxWidth: 600 }}>
            Des structures spécialisées pour chaque catégorie de patriotes. Trouvez la vôtre.
          </p>

          {/* Carrousel */}
          <MouvementCarousel mouvements={MOUVEMENTS} index={mvtIndex} onIndexChange={setMvtIndex} />
        </div>
      </section>

      {/* ═══════════ SECTION PROJET — SLIDE DECK ═══════════ */}
      <section id="projet" style={{
        padding: "100px 48px",
        backgroundImage: "url(/images/bg-arcs.png)",
        backgroundSize: "cover", backgroundPosition: "center",
        backgroundColor: "#E8F0EC",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionEyebrow color={COLORS.vert}>Le projet</SectionEyebrow>
          <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px", color: "#1a3a2a" }}>Vision Sénégal 2050</h2>
          <p style={{ fontSize: 15, color: "#5a7068", margin: "0 0 48px", maxWidth: 600 }}>
            Naviguez à travers les axes stratégiques du projet PASTEF.
          </p>

          <SlideDeck slides={SLIDES} index={slideIndex} onIndexChange={setSlideIndex} />
        </div>
      </section>

      {/* ═══════════ SECTION CLASSEMENT — Top Patriotes ═══════════ */}
      <Classement />

      {/* ═══════════ SECTION ADHÉSION ═══════════ */}
      <section id="adhesion" style={{ padding: "100px 48px", background: `linear-gradient(135deg, ${COLORS.vert}, #0d4d2c)`, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/pattern-sn.png)", backgroundSize: "100px auto", opacity: 0.05, pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 16px" }}>Rejoignez les Patriotes</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.85)", margin: "0 0 32px", lineHeight: 1.6 }}>
            Devenez membre du parti et participez à la transformation du Sénégal. Carte de membre, accès aux cellules locales, formations.
          </p>
          <a href="https://pastef.org" target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-block", padding: "16px 36px", borderRadius: 999,
              background: "#fff", color: COLORS.vert, fontWeight: 800, fontSize: 14,
              letterSpacing: 1.5, textDecoration: "none",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            DEVENIR PATRIOTE →
          </a>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer style={{ background: "#0a0a0a", color: "rgba(255,255,255,0.5)", padding: "48px 48px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, backgroundImage: "url(/images/pattern-sn.png)", backgroundSize: "80px auto", backgroundRepeat: "repeat-y", opacity: 0.04 }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 6 }}>PASTEF</div>
              <p style={{ fontSize: 12, margin: 0, lineHeight: 1.6, maxWidth: 280 }}>Patriotes Africains du Sénégal pour le Travail, l'Éthique et la Fraternité.</p>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>CONTACT</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
                <span>37 voie de Dégagement N, Dakar</span>
                <span>pastef.org</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11 }}>© 2026 PASTEF — Les Patriotes.</span>
            <div style={{ display: "flex", gap: 4 }}>
              <div style={{ width: 28, height: 4, borderRadius: 2, background: COLORS.vert }} />
              <div style={{ width: 28, height: 4, borderRadius: 2, background: "#D4A017" }} />
              <div style={{ width: 28, height: 4, borderRadius: 2, background: COLORS.rouge }} />
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════ POPUP LEADER ═══════════ */}
      <AnimatePresence>
        {selectedLeader && <LeaderPopup leader={selectedLeader} onClose={() => setSelectedLeader(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CARROUSEL MOUVEMENTS — Auto-play 5s avec photos en background
   ═══════════════════════════════════════════════════════════════ */

function MouvementCarousel({ mouvements, index, onIndexChange }: {
  mouvements: Mouvement[]; index: number; onIndexChange: (i: number) => void;
}) {
  const m = mouvements[index];
  return (
    <div>
      {/* Carrousel principal */}
      <div style={{ position: "relative", height: 480, borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={m.sigle}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${m.image})`,
              backgroundSize: "cover", backgroundPosition: "center",
            }}
          />
        </AnimatePresence>
        {/* Overlay sombre */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)" }} />
        {/* Bande couleur côté gauche */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: m.color }} />

        {/* Contenu */}
        <div style={{ position: "absolute", inset: 0, padding: "56px 64px", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 600 }}>
          <AnimatePresence mode="wait">
            <motion.div key={m.sigle}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, color: m.color, marginBottom: 12 }}>
                MOUVEMENT NATIONAL · {String(index + 1).padStart(2, "0")} / {String(mouvements.length).padStart(2, "0")}
              </div>
              <h3 style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2, margin: "0 0 8px", color: "#fff", lineHeight: 1 }}>
                {m.sigle}
              </h3>
              <div style={{ fontSize: 18, fontWeight: 700, color: m.color, margin: "0 0 20px" }}>{m.nom}</div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", margin: "0 0 24px", lineHeight: 1.6 }}>
                {m.desc}
              </p>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 12 }}>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 4, fontWeight: 700, letterSpacing: 0.5 }}>CIBLE</div>
                  <div style={{ color: "#fff", fontWeight: 700 }}>{m.cible}</div>
                </div>
                <div style={{ maxWidth: 320 }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 4, fontWeight: 700, letterSpacing: 0.5 }}>ADHÉSION</div>
                  <div style={{ color: "#fff", fontWeight: 500, lineHeight: 1.5 }}>{m.comment}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Flèches */}
        <button onClick={() => onIndexChange((index - 1 + mouvements.length) % mouvements.length)}
          style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", cursor: "pointer", fontSize: 18, backdropFilter: "blur(8px)" }}
          aria-label="Précédent">‹</button>
        <button onClick={() => onIndexChange((index + 1) % mouvements.length)}
          style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", cursor: "pointer", fontSize: 18, backdropFilter: "blur(8px)" }}
          aria-label="Suivant">›</button>
      </div>

      {/* Indicateurs (dots avec progression) */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 24 }}>
        {mouvements.map((mv, i) => (
          <button key={mv.sigle} onClick={() => onIndexChange(i)}
            style={{
              width: i === index ? 32 : 8, height: 8, borderRadius: 4,
              background: i === index ? mv.color : "rgba(255,255,255,0.2)",
              border: "none", cursor: "pointer", transition: "all 0.4s",
            }}
            aria-label={`Aller au mouvement ${mv.sigle}`}
          />
        ))}
      </div>

      {/* Mini liste des 8 sigles */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32, flexWrap: "wrap" }}>
        {mouvements.map((mv, i) => (
          <button key={mv.sigle} onClick={() => onIndexChange(i)}
            style={{
              padding: "8px 14px", borderRadius: 8, border: "none",
              background: i === index ? mv.color : "rgba(255,255,255,0.05)",
              color: i === index ? "#fff" : "rgba(255,255,255,0.6)",
              fontWeight: 800, fontSize: 12, cursor: "pointer", letterSpacing: 0.5,
              transition: "all 0.3s",
            }}>
            {mv.sigle}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE DECK — Style présentation Canva
   ═══════════════════════════════════════════════════════════════ */

function SlideDeck({ slides, index, onIndexChange }: {
  slides: Slide[]; index: number; onIndexChange: (i: number) => void;
}) {
  const s = slides[index];

  return (
    <div>
      {/* Conteneur slide (ratio 16:9) — split blanc + vert PASTEF */}
      <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.18)", background: "#fff" }}>
        <AnimatePresence mode="wait">
          <motion.div key={s.num}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ position: "absolute", inset: 0, display: "flex" }}
          >
            {/* ── MOITIÉ GAUCHE — BLANC + pattern à droite ── */}
            <div style={{ flex: 1, background: "#fff", position: "relative", padding: "56px 64px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {/* Pattern bande verticale à droite */}
              <div style={{
                position: "absolute", right: 0, top: 0, bottom: 0, width: 56,
                backgroundImage: "url(/images/pattern-sn.png)",
                backgroundSize: "56px auto", backgroundRepeat: "repeat-y",
              }} />

              {/* Numéro grand format en filigrane */}
              <div style={{ position: "absolute", top: 24, right: 80, fontSize: 180, fontWeight: 900, color: `${COLORS.vert}08`, lineHeight: 1, letterSpacing: -8 }}>
                {s.num}
              </div>

              <div style={{ position: "relative", paddingRight: 48 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, color: COLORS.rouge, marginBottom: 14 }}>
                  CHAPITRE {s.num} · SUR {String(slides.length).padStart(2, "0")}
                </div>
                <h3 style={{ fontSize: 48, fontWeight: 900, letterSpacing: -2, margin: "0 0 8px", lineHeight: 1.05, color: COLORS.vert }}>
                  {s.titre}
                </h3>
                <p style={{ fontSize: 17, color: "#666", fontStyle: "italic", margin: "0 0 12px", fontWeight: 400 }}>
                  {s.sousTitre}
                </p>
              </div>
            </div>

            {/* ── MOITIÉ DROITE — VERT FONCÉ PASTEF ── */}
            <div style={{ flex: 1, background: COLORS.vert, color: "#fff", padding: "56px 64px", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              {/* Petit motif décoratif en haut */}
              <div style={{
                position: "absolute", top: 0, right: 0, width: 36, height: "100%",
                backgroundImage: "url(/images/pattern-sn.png)",
                backgroundSize: "36px auto", backgroundRepeat: "repeat-y",
                opacity: 0.08,
              }} />

              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, opacity: 0.6, marginBottom: 14 }}>
                  L'AXE STRATÉGIQUE
                </div>
                <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.95, margin: 0 }}>
                  {s.texte}
                </p>
              </div>

              {/* Highlights stats */}
              {s.highlights && (
                <div style={{ position: "relative", display: "flex", gap: 0, marginTop: 28, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.18)" }}>
                  {s.highlights.map((h, i) => (
                    <div key={i} style={{
                      flex: 1, paddingRight: 16,
                      borderRight: i < s.highlights!.length - 1 ? "1px solid rgba(255,255,255,0.18)" : "none",
                      paddingLeft: i > 0 ? 16 : 0,
                    }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, opacity: 0.55, marginBottom: 5, textTransform: "uppercase" }}>
                        {h.label}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: -0.3, lineHeight: 1.2 }}>
                        {h.valeur}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Contrôles */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
        <button onClick={() => onIndexChange((index - 1 + slides.length) % slides.length)}
          style={{ padding: "12px 24px", borderRadius: 999, background: "#fff", border: `1px solid ${COLORS.ligne}`, cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#555", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
          ← Précédent
        </button>

        {/* Indicateur slides */}
        <div style={{ display: "flex", gap: 8 }}>
          {slides.map((sl, i) => (
            <button key={i} onClick={() => onIndexChange(i)}
              style={{
                width: i === index ? 28 : 8, height: 8, borderRadius: 4,
                background: i === index ? sl.color : COLORS.ligne,
                border: "none", cursor: "pointer", transition: "all 0.4s",
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <button onClick={() => onIndexChange((index + 1) % slides.length)}
          style={{ padding: "12px 24px", borderRadius: 999, background: COLORS.vert, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#fff", boxShadow: `0 4px 12px ${COLORS.vert}30` }}>
          Suivant →
        </button>
      </div>

      {/* Mini-aperçu des slides */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, marginTop: 32 }}>
        {slides.map((sl, i) => (
          <button key={i} onClick={() => onIndexChange(i)}
            style={{
              aspectRatio: "16 / 9", borderRadius: 8, border: "none",
              cursor: "pointer", padding: 0, overflow: "hidden",
              display: "flex",
              opacity: i === index ? 1 : 0.45,
              outline: i === index ? `2px solid ${COLORS.vert}` : "1px solid rgba(0,0,0,0.08)",
              outlineOffset: i === index ? 2 : 0,
              transition: "opacity 0.3s",
              fontFamily: "inherit",
            }}>
            {/* Mini moitié blanche */}
            <div style={{ flex: 1, background: "#fff", padding: "8px 10px", textAlign: "left" }}>
              <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1, color: COLORS.rouge }}>{sl.num}</div>
              <div style={{ fontSize: 11, fontWeight: 900, color: COLORS.vert, marginTop: 2, lineHeight: 1.2 }}>{sl.titre}</div>
            </div>
            {/* Mini moitié verte */}
            <div style={{ flex: 1, background: COLORS.vert }} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   POPUP LEADER (modal centré)
   ═══════════════════════════════════════════════════════════════ */

function LeaderPopup({ leader, onClose }: { leader: Leader; onClose: () => void }) {
  // Fermer avec Échap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
        display: "grid", placeItems: "center", padding: 24,
      }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, overflow: "hidden",
          maxWidth: 720, width: "100%", maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
          fontFamily: "'Outfit', system-ui, sans-serif",
        }}>

        {/* Header avec photo en bandeau */}
        <div style={{
          position: "relative", height: 200,
          background: `linear-gradient(135deg, ${COLORS.vert}, ${COLORS.rouge})`,
          backgroundImage: leader.photo ? `url(${leader.photo})` : undefined,
          backgroundSize: "cover", backgroundPosition: "center 25%",
        }}>
          {/* Overlay gradient */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))" }} />

          {/* Close */}
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16,
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)", color: "#fff",
            border: "none", cursor: "pointer", fontSize: 16,
            backdropFilter: "blur(8px)", display: "grid", placeItems: "center",
          }} aria-label="Fermer">✕</button>

          {/* Nom + poste en bas */}
          <div style={{ position: "absolute", bottom: 24, left: 32, right: 32, color: "#fff" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, opacity: 0.9, marginBottom: 4 }}>
              {leader.poste.toUpperCase()}
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, margin: 0, lineHeight: 1.1 }}>
              {leader.nom}
            </h2>
          </div>
        </div>

        {/* Contenu */}
        <div style={{ padding: "28px 32px" }}>

          {/* Avatar (chevauche le bandeau) */}
          <div style={{ marginTop: -64, marginBottom: 20 }}>
            <div style={{
              width: 96, height: 96, borderRadius: "50%",
              background: leader.photo ? `url(${leader.photo}) center 25% / cover` : `linear-gradient(135deg, ${COLORS.vert}, ${COLORS.rouge})`,
              color: "#fff", display: "grid", placeItems: "center",
              fontWeight: 900, fontSize: 32,
              border: "4px solid #fff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}>
              {!leader.photo && leader.initiales}
            </div>
          </div>

          {/* Infos rapides */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
            {leader.profession && <InfoChip icon="💼" label={leader.profession} />}
            {leader.naissance && <InfoChip icon="📅" label={leader.naissance} />}
            {leader.region && <InfoChip icon="📍" label={leader.region} />}
          </div>

          {/* Fait marquant */}
          {leader.fait && (
            <div style={{ padding: "14px 18px", borderRadius: 12, background: `${COLORS.vert}08`, border: `1px solid ${COLORS.vert}15`, marginBottom: 20, fontSize: 13, color: "#444", fontWeight: 600, lineHeight: 1.6 }}>
              💡 {leader.fait}
            </div>
          )}

          {/* Biographie */}
          <div style={{ marginBottom: 24 }}>
            <SubsectionTitle>Biographie</SubsectionTitle>
            <p style={{ fontSize: 14, color: "#444", margin: 0, lineHeight: 1.8 }}>{leader.bio}</p>
          </div>

          {/* Parcours / timeline */}
          {leader.parcours && (
            <div>
              <SubsectionTitle>Parcours</SubsectionTitle>
              <div style={{ position: "relative", paddingLeft: 20 }}>
                <div style={{ position: "absolute", left: 5, top: 4, bottom: 4, width: 2, background: COLORS.ligne }} />
                {leader.parcours.map((etape, i) => (
                  <div key={i} style={{ position: "relative", paddingBottom: 12, fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                    <div style={{ position: "absolute", left: -19, top: 6, width: 10, height: 10, borderRadius: "50%", background: COLORS.vert, border: "2px solid #fff", boxShadow: `0 0 0 2px ${COLORS.vert}40` }} />
                    {etape}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PETITS COMPOSANTS
   ═══════════════════════════════════════════════════════════════ */

function SectionEyebrow({ children, color }: { children: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 28, height: 2, background: color, borderRadius: 1 }} />
      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2.5, color, textTransform: "uppercase" }}>{children}</span>
    </div>
  );
}

function TreeLine({ color }: { color: string }) {
  return <div style={{ width: 2, height: 32, background: color, opacity: 0.25, margin: "0 auto 12px" }} />;
}

function TierLabel({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 18 }}>
      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color, background: `${color}10`, padding: "6px 16px", borderRadius: 8, border: `1px solid ${color}20` }}>
        {label.toUpperCase()}
      </span>
    </div>
  );
}

function LeaderCard({ leader, tier, onClick }: {
  leader: Leader; tier: "president" | "vp" | "sg"; onClick: (l: Leader) => void;
}) {
  const isPres = tier === "president";
  const photoSize = isPres ? 90 : 64;
  const cardW = isPres ? 280 : 160;
  const tc = isPres ? COLORS.vert : tier === "vp" ? COLORS.rouge : "#2563EB";

  return (
    <motion.div whileHover={{ y: -6, boxShadow: `0 12px 32px ${tc}25` }} whileTap={{ scale: 0.97 }} onClick={() => onClick(leader)}
      style={{
        width: cardW, padding: isPres ? "28px 24px 22px" : "16px 14px 14px",
        borderRadius: 18, cursor: "pointer", textAlign: "center",
        background: "#fff",
        border: `1px solid ${COLORS.ligne}`,
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.25s",
      }}>
      <div style={{
        width: photoSize, height: photoSize, borderRadius: "50%", margin: "0 auto",
        background: leader.photo ? `url(${leader.photo}) center 20% / cover` : `linear-gradient(135deg, ${tc}, ${tc}AA)`,
        color: "#fff", display: "grid", placeItems: "center",
        fontWeight: 900, fontSize: isPres ? 28 : 18,
        border: isPres ? "4px solid #fff" : "3px solid #fff",
        boxShadow: `0 6px 20px ${tc}30`,
        marginBottom: isPres ? 16 : 10,
      }}>
        {!leader.photo && leader.initiales}
      </div>
      <div style={{ fontSize: isPres ? 18 : 14, fontWeight: 900, color: "#1a1a1a", lineHeight: 1.2 }}>{leader.nom}</div>
      <div style={{ fontSize: isPres ? 12 : 10, fontWeight: 700, color: tc, marginTop: 5, letterSpacing: 0.3 }}>{leader.poste}</div>
      {isPres && leader.profession && (
        <div style={{ fontSize: 11, color: "#999", marginTop: 8, lineHeight: 1.4 }}>{leader.profession}</div>
      )}
    </motion.div>
  );
}

function InfoChip({ icon, label }: { icon: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: COLORS.creme, fontSize: 12, fontWeight: 600, color: "#555" }}>
      {icon} {label}
    </span>
  );
}

function SubsectionTitle({ children }: { children: string }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: "#999", textTransform: "uppercase", marginBottom: 10 }}>
      {children}
    </div>
  );
}