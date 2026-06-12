import { COLORS } from "@/lib/constants/colors";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/pastef")({
  component: AProposPage,
});

/* ═══════════════════════════════════════════════════════════════
   DATA — Organigramme Bureau Politique (Décision du 19 avril 2026)
   ═══════════════════════════════════════════════════════════════ */

interface Leader {
  id: string;
  nom: string;
  poste: string;
  avatar: string;
  bio: string;
  naissance?: string;
  profession?: string;
  region?: string;
  fait?: string;
  color: string;
  children?: Leader[];
}

const ORGANIGRAMME: Leader = {
  id: "sonko",
  nom: "Ousmane Sonko",
  poste: "Président du Parti",
  avatar: "OS",
  color: COLORS.vert,
  naissance: "15 juillet 1974, Thiès",
  profession: "Inspecteur des impôts · Premier Ministre du Sénégal",
  region: "Ziguinchor / Dakar",
  fait: "Fondateur de PASTEF en 2014. Auteur de « Pétrole et gaz au Sénégal » et « Solutions pour un Sénégal nouveau ». Élu député en 2017. Premier Ministre depuis avril 2024.",
  bio: "Ousmane Sonko a fondé PASTEF en janvier 2014 après avoir été radié de la fonction publique pour ses positions critiques. Inspecteur des impôts de formation, il s'est imposé comme la figure principale de l'opposition sénégalaise grâce à son discours anti-système et panafricaniste. Élu député de Dakar en 2017, troisième à la présidentielle de 2019 avec 15%, il a subi arrestations et tentatives de dissolution de son parti en 2023. Après la victoire de Bassirou Diomaye Faye à la présidentielle de mars 2024, il est nommé Premier Ministre. Le 19 avril 2026, il restructure le Bureau Politique du parti pour renforcer son ancrage territorial.",
  children: [
    {
      id: "ndiaye",
      nom: "Malick Ndiaye",
      poste: "Vice-Président",
      avatar: "MN",
      color: COLORS.rouge,
      naissance: "24 juillet 1982, Dahra",
      profession: "Homme politique · Ancien Pdt de l'Assemblée nationale",
      region: "Linguère",
      fait: "Membre PASTEF depuis 2015. Ministre des Infrastructures (avril-déc 2024). Élu Président de l'Assemblée nationale le 2 décembre 2024 avec 134 voix.",
      bio: "Malick Ndiaye a rejoint PASTEF en 2015. Nommé Ministre des Infrastructures et des Transports terrestres et aériens en avril 2024, il a ensuite été élu Président de l'Assemblée nationale lors de l'installation de la 15e législature. Il est l'un des quatre vice-présidents nommés en avril 2026.",
    },
    {
      id: "fall",
      nom: "Abass Fall",
      poste: "Vice-Président",
      avatar: "AF",
      color: COLORS.rouge,
      profession: "Homme politique · Député",
      region: "Dakar",
      bio: "Abass Fall est l'un des cadres historiques du parti. Militant de la première heure, il a joué un rôle clé dans l'organisation territoriale de PASTEF à Dakar. Nommé vice-président du Bureau Politique en avril 2026.",
    },
    {
      id: "ngom",
      nom: "Daouda Ngom",
      poste: "Vice-Président",
      avatar: "DN",
      color: COLORS.rouge,
      profession: "Cadre · Homme politique",
      bio: "Daouda Ngom fait partie des responsables stratégiques du parti. Nommé vice-président et membre du Comité exécutif lors de la restructuration d'avril 2026.",
    },
    {
      id: "sarre",
      nom: "Moustapha Sarré",
      poste: "Vice-Président",
      avatar: "MS",
      color: COLORS.rouge,
      profession: "Homme politique",
      bio: "Moustapha Sarré est promu vice-président du parti en avril 2026, consolidant la direction collégiale voulue par Ousmane Sonko.",
    },
    {
      id: "daffe",
      nom: "Mohamed Ayib Daffé",
      poste: "Secrétaire Général",
      avatar: "AD",
      color: "#2563EB",
      profession: "Homme politique · Membre du Comité exécutif",
      fait: "Ancien SG intérimaire. Pilier organisationnel du parti depuis les premières heures. A géré la période de crise 2023.",
      bio: "Mohamed Ayib Salim Daffé, dit Ayib Daffé, est le Secrétaire Général de PASTEF depuis avril 2026. Il occupait déjà ce poste de manière intérimaire. Il est considéré comme l'architecte organisationnel du parti, ayant structuré le maillage territorial à travers tout le Sénégal. Membre du Comité exécutif.",
      children: [
        { id: "kdiop", nom: "Khadidiatou Diop", poste: "SG Adjointe", avatar: "KD", color: "#7C3AED", profession: "Femme politique (dite Khadija Mahecor Diouf)", bio: "Khadidiatou Diop, connue sous le nom de Khadija Mahecor Diouf, est nommée Secrétaire Générale Adjointe en avril 2026." },
        { id: "fkeita", nom: "Fadilou Keita", poste: "SG Adjoint", avatar: "FK", color: "#7C3AED", profession: "Homme politique · Ancien DG CENA", fait: "Figure majeure du parti, proche de Sonko.", bio: "Fadilou Keita est l'un des cinq Secrétaires Généraux Adjoints nommés en avril 2026. Considéré comme l'un des hommes de confiance de Sonko." },
        { id: "kgaye", nom: "Khady Diène Gaye", poste: "SG Adjointe", avatar: "KG", color: "#7C3AED", profession: "Femme politique · Ancienne Ministre", bio: "Khady Diène Gaye est nommée Secrétaire Générale Adjointe lors de la restructuration d'avril 2026." },
        { id: "bkebe", nom: "Bassirou Kébé", poste: "SG Adjoint", avatar: "BK", color: "#7C3AED", profession: "Homme politique", bio: "Bassirou Kébé intègre le secrétariat général en tant qu'adjoint en avril 2026." },
        { id: "bba", nom: "Birom Holo Ba", poste: "SG Adjoint", avatar: "BB", color: "#7C3AED", profession: "Homme politique", bio: "Birom Holo Ba est nommé Secrétaire Général Adjoint, complétant l'équipe rapprochée de Ayib Daffé." },
      ],
    },
    {
      id: "aba",
      nom: "Amadou Ba",
      poste: "SN Communication",
      avatar: "AB",
      color: "#0891B2",
      profession: "Responsable communication du parti",
      bio: "Amadou Ba prend la tête du secrétariat national chargé de la communication. Il est assisté par Arame Ndoye Gassama. Responsable de la stratégie médiatique du parti.",
    },
    {
      id: "mbengue",
      nom: "Assane Mbengue",
      poste: "SN Organisation",
      avatar: "AM",
      color: "#0891B2",
      profession: "Responsable logistique du parti",
      bio: "Assane Mbengue hérite du pôle organisation et logistique. En charge de la structuration territoriale et de l'animation des cellules.",
    },
    {
      id: "msy",
      nom: "Malick Sy",
      poste: "SN Formation",
      avatar: "MY",
      color: "#0891B2",
      profession: "Responsable formation du parti",
      bio: "Malick Sy est nommé au secrétariat national chargé de la formation. Il supervise l'Académie du parti et les programmes de formation idéologique et organisationnelle.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   DATA — Mouvements affiliés (art. 21 des Statuts)
   ═══════════════════════════════════════════════════════════════ */

interface Mouvement {
  sigle: string;
  nom: string;
  desc: string;
  cible: string;
  icon: string;
  color: string;
  comment: string;
}

const MOUVEMENTS: Mouvement[] = [
  { sigle: "JPS", nom: "Jeunesse Patriotique du Sénégal", desc: "Fer de lance du parti auprès de la jeunesse. Organisation d'actions médico-sociales, de forums d'emploi, d'activités de massification et de sensibilisation citoyenne.", cible: "Jeunes de 18 à 35 ans", icon: "✊", color: COLORS.vert, comment: "Contacter le coordinateur JPS de votre commune ou vous rendre à la cellule PASTEF la plus proche." },
  { sigle: "MOJIP", nom: "Mouvement des Jigeeni PASTEF", desc: "Mouvement des femmes du parti. Promotion du leadership féminin, autonomisation économique, participation politique. Coordonné au niveau départemental.", cible: "Femmes patriotes", icon: "👩🏾", color: COLORS.rouge, comment: "Adhésion via la coordinatrice départementale MOJIP ou la cellule locale." },
  { sigle: "MONEP", nom: "Mouvement National des Enseignants du PASTEF", desc: "Regroupe les enseignants militants. Réflexion sur la réforme éducative, formation idéologique, amélioration du système scolaire sénégalais.", cible: "Enseignants et formateurs", icon: "🎓", color: "#2563EB", comment: "Inscription auprès du responsable MONEP de votre académie." },
  { sigle: "MONCAP", nom: "Mouvement National des Cadres du PASTEF", desc: "Espace d'échange des cadres et professionnels. Expertise technique au service du parti et du gouvernement. Think tank interne.", cible: "Cadres et experts", icon: "💼", color: "#7C3AED", comment: "Manifester son intérêt via le Bureau Politique ou le SN Formation." },
  { sigle: "MAGI PASTEF", nom: "Mouvement des Anciens et Guides PASTEF", desc: "Valorisation de l'expérience des aînés. Conseil, médiation, transmission des valeurs. Interface avec les chefs religieux et coutumiers.", cible: "Anciens et guides communautaires", icon: "🕊️", color: "#6B7280", comment: "Prise de contact via les responsables locaux du parti." },
  { sigle: "MODDAP", nom: "Mouvement des Diplômés de la Diaspora du PASTEF", desc: "Mobilisation des compétences de la diaspora diplômée. Transfert de connaissances, mentorat, co-développement.", cible: "Diplômés de la diaspora", icon: "🌍", color: "#0891B2", comment: "Inscription en ligne ou via les coordinateurs diaspora." },
  { sigle: "MONAP", nom: "Mouvement National des Artisans du PASTEF", desc: "Représentation des artisans et corps de métiers. Promotion de l'artisanat local, formation professionnelle, accès aux marchés.", cible: "Artisans et ouvriers", icon: "🔨", color: "#D97706", comment: "Adhésion via la cellule locale ou le coordinateur communal." },
  { sigle: "MONAPH", nom: "Mouvement National des Personnes Handicapées du PASTEF", desc: "Inclusion et accessibilité. Défense des droits, intégration professionnelle, représentation politique des personnes en situation de handicap.", cible: "Personnes en situation de handicap", icon: "♿", color: "#059669", comment: "Contacter le responsable MONAPH départemental." },
];

/* ═══════════════════════════════════════════════════════════════
   DATA — Vision Sénégal 2050
   ═══════════════════════════════════════════════════════════════ */

const VISION_AXES = [
  { titre: "Souveraineté nationale", desc: "Réappropriation des ressources naturelles (pétrole, gaz, mines), souveraineté alimentaire, monétaire (sortie du franc CFA) et militaire (révision des accords de défense).", icon: "🏛️", color: COLORS.vert },
  { titre: "Justice sociale", desc: "Réduction des inégalités, accès universel à la santé et à l'éducation, couverture maladie universelle, réforme foncière, politique de l'emploi jeune.", icon: "⚖️", color: COLORS.rouge },
  { titre: "Transformation économique", desc: "Industrialisation par la transformation locale des matières premières. 8 pôles économiques régionaux, politique d'import-substitution, soutien à l'entrepreneuriat.", icon: "🏭", color: "#2563EB" },
  { titre: "Panafricanisme", desc: "Intégration africaine renforcée, coopération Sud-Sud, soutien aux mouvements de libération, réforme des institutions internationales, Alliance des États du Sahel.", icon: "🌍", color: "#D97706" },
  { titre: "Bonne gouvernance", desc: "Lutte contre la corruption, transparence budgétaire, reddition des comptes, réforme constitutionnelle, décentralisation effective, indépendance de la justice.", icon: "🔍", color: "#7C3AED" },
];

const ETAPES = [
  { periode: "2024 – 2029", titre: "Redresser", desc: "Réformes institutionnelles, assainissement des finances publiques, mobilisation des acteurs.", color: COLORS.vert },
  { periode: "2030 – 2035", titre: "Impulser", desc: "Développement des secteurs clés : énergie, numérique, logistique. Transformation industrielle.", color: "#D97706" },
  { periode: "2036 – 2050", titre: "Accélérer", desc: "Maturation des pôles économiques régionaux. Sénégal pays industrialisé et prospère.", color: COLORS.rouge },
];

/* ═══════════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */

function AProposPage() {
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [expandedMvt, setExpandedMvt] = useState<string | null>(null);

  return (
    <>
      {/* En-tête */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32, padding: "28px 32px", borderRadius: 20, background: `linear-gradient(135deg, ${COLORS.vert}06, ${COLORS.rouge}04)`, border: `1px solid ${COLORS.ligne}`, borderLeft: `4px solid ${COLORS.vert}`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", fontSize: 72, opacity: 0.06 }}>🏛️</div>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2.5, color: COLORS.vert, marginBottom: 6 }}>À PROPOS</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, margin: "0 0 8px" }}>PASTEF — Les Patriotes</h1>
        <p style={{ color: "#666", fontSize: 14, margin: 0, maxWidth: 680 }}>
          Patriotes Africains du Sénégal pour le Travail, l'Éthique et la Fraternité. Fondé en janvier 2014 par Ousmane Sonko. Au pouvoir depuis mars 2024.
        </p>
        <div style={{ display: "flex", gap: 20, marginTop: 14, fontSize: 12, color: "#888" }}>
          <span><b style={{ color: COLORS.vert }}>130/165</b> députés</span>
          <span><b style={{ color: COLORS.rouge }}>14</b> régions couvertes</span>
          <span><b style={{ color: "#2563EB" }}>18</b> villes diaspora</span>
          <span>🏷️ <i>« Le don de soi pour la Patrie »</i></span>
        </div>
      </motion.div>

      {/* ═══ SECTION 1 : ORGANIGRAMME ═══ */}
      <SectionHeader icon="🌳" title="Organigramme du Bureau Politique" subtitle="Décision n°002/PASTEF/PR/2026 du 19 avril 2026 — Cliquez sur un leader pour voir sa biographie" />

      <div style={{ background: COLORS.blanc, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.ligne}`, marginBottom: 32, overflowX: "auto" }}>
        {/* Président */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <LeaderNode leader={ORGANIGRAMME} onSelect={setSelectedLeader} selected={selectedLeader?.id} size="lg" />
          <div style={{ width: 2, height: 24, background: COLORS.ligne }} />
          
          {/* Vice-Présidents + SG + SN */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", position: "relative" }}>
            {/* Ligne horizontale */}
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 2, background: COLORS.ligne }} />
            
            {ORGANIGRAMME.children?.filter(c => c.poste.startsWith("Vice")).map(c => (
              <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 2, height: 16, background: COLORS.ligne }} />
                <LeaderNode leader={c} onSelect={setSelectedLeader} selected={selectedLeader?.id} />
              </div>
            ))}

            {/* SG */}
            {ORGANIGRAMME.children?.filter(c => c.poste === "Secrétaire Général").map(c => (
              <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 2, height: 16, background: COLORS.ligne }} />
                <LeaderNode leader={c} onSelect={setSelectedLeader} selected={selectedLeader?.id} />
                {/* SG Adjoints */}
                {c.children && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ width: 2, height: 12, background: COLORS.ligne, margin: "0 auto" }} />
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                      {c.children.map(adj => (
                        <LeaderNode key={adj.id} leader={adj} onSelect={setSelectedLeader} selected={selectedLeader?.id} size="sm" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* SN */}
            {ORGANIGRAMME.children?.filter(c => c.poste.startsWith("SN ")).map(c => (
              <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 2, height: 16, background: COLORS.ligne }} />
                <LeaderNode leader={c} onSelect={setSelectedLeader} selected={selectedLeader?.id} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panneau bio */}
      <AnimatePresence>
        {selectedLeader && <BioPanel leader={selectedLeader} onClose={() => setSelectedLeader(null)} />}
      </AnimatePresence>

      {/* ═══ SECTION 2 : MOUVEMENTS ═══ */}
      <SectionHeader icon="🤝" title="Les mouvements du parti" subtitle={`${MOUVEMENTS.length} mouvements nationaux autorisés — structures spécialisées regroupant les militants sur une base sociologique ou professionnelle (art. 21 des Statuts)`} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14, marginBottom: 32 }}>
        {MOUVEMENTS.map((m) => (
          <motion.div key={m.sigle} layout
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: COLORS.blanc, borderRadius: 16, border: `1px solid ${COLORS.ligne}`, borderLeft: `4px solid ${m.color}`, overflow: "hidden", cursor: "pointer" }}
            onClick={() => setExpandedMvt(expandedMvt === m.sigle ? null : m.sigle)}>
            <div style={{ padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${m.color}12`, display: "grid", placeItems: "center", fontSize: 18 }}>{m.icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: m.color }}>{m.sigle}</div>
                  <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>{m.nom}</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 16, color: "#ccc", transition: "transform 0.2s", transform: expandedMvt === m.sigle ? "rotate(180deg)" : "none" }}>▾</div>
              </div>
              <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.5 }}>{m.desc}</p>
            </div>
            <AnimatePresence>
              {expandedMvt === m.sigle && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: "hidden", borderTop: `1px solid ${COLORS.ligne}` }}>
                  <div style={{ padding: "14px 18px", background: COLORS.creme }}>
                    <div style={{ fontSize: 12, marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, color: "#555" }}>🎯 Cible :</span>{" "}
                      <span style={{ color: m.color, fontWeight: 700 }}>{m.cible}</span>
                    </div>
                    <div style={{ fontSize: 12, marginBottom: 10 }}>
                      <span style={{ fontWeight: 800, color: "#555" }}>📝 Comment adhérer :</span>{" "}
                      <span style={{ color: "#666" }}>{m.comment}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: m.color, background: `${m.color}12`, padding: "3px 8px", borderRadius: 6, letterSpacing: 0.5 }}>MOUVEMENT NATIONAL</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#888", background: COLORS.ligne, padding: "3px 8px", borderRadius: 6 }}>ART. 24 R.I.</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* ═══ SECTION 3 : LE PROJET — VISION 2050 ═══ */}
      <SectionHeader icon="🚀" title="Le Projet — Vision Sénégal 2050" subtitle="Agenda national de transformation. Un Sénégal souverain, juste et prospère. Budget : 18 000 milliards FCFA sur les 4 premières années." />

      {/* Axes stratégiques */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginBottom: 24 }}>
        {VISION_AXES.map((a, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            style={{ background: COLORS.blanc, borderRadius: 16, padding: "18px 20px", border: `1px solid ${COLORS.ligne}`, borderTop: `3px solid ${a.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{a.icon}</span>
              <h4 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: a.color }}>{a.titre}</h4>
            </div>
            <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.6 }}>{a.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Feuille de route 3 étapes */}
      <div style={{ background: COLORS.blanc, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.ligne}`, marginBottom: 32 }}>
        <h3 style={{ fontSize: 14, fontWeight: 900, margin: "0 0 16px" }}>📅 Feuille de route</h3>
        <div style={{ display: "flex", gap: 0, position: "relative" }}>
          {/* Ligne de connexion */}
          <div style={{ position: "absolute", top: 24, left: 24, right: 24, height: 3, background: COLORS.ligne, borderRadius: 2, zIndex: 0 }} />
          {ETAPES.map((e, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: e.color, color: "#fff", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 14, margin: "0 auto 10px", border: "3px solid #fff", boxShadow: `0 0 0 2px ${e.color}40` }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: e.color, letterSpacing: 0.5, marginBottom: 4 }}>{e.periode}</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: COLORS.noir, marginBottom: 4 }}>{e.titre}</div>
              <p style={{ fontSize: 11, color: "#888", margin: 0, lineHeight: 1.5, padding: "0 8px" }}>{e.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Valeurs fondamentales */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.vert}08, ${COLORS.rouge}06)`, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.ligne}`, marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 900, margin: "0 0 14px" }}>🏷️ Valeurs fondamentales</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Travail", "Éthique", "Fraternité", "Panafricanisme", "Souveraineté", "Justice sociale", "Transparence", "Don de soi"].map(v => (
            <span key={v} style={{ padding: "8px 16px", borderRadius: 10, background: COLORS.blanc, border: `1px solid ${COLORS.ligne}`, fontSize: 13, fontWeight: 700, color: COLORS.noir }}>{v}</span>
          ))}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPOSANTS
   ═══════════════════════════════════════════════════════════════ */

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0, letterSpacing: -0.3 }}>{title}</h2>
      </div>
      <p style={{ fontSize: 12, color: "#888", margin: 0, maxWidth: 640 }}>{subtitle}</p>
    </div>
  );
}

function LeaderNode({ leader, onSelect, selected, size = "md" }: { leader: Leader; onSelect: (l: Leader) => void; selected?: string; size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? 56 : size === "sm" ? 36 : 44;
  const fs = size === "lg" ? 18 : size === "sm" ? 11 : 14;
  const isSelected = selected === leader.id;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(leader)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", padding: "8px 10px",
        borderRadius: 12, background: isSelected ? `${leader.color}12` : "transparent",
        border: isSelected ? `2px solid ${leader.color}` : "2px solid transparent",
        transition: "all 0.2s", minWidth: size === "sm" ? 80 : 100,
      }}>
      <div style={{
        width: s, height: s, borderRadius: "50%",
        background: `linear-gradient(135deg, ${leader.color}, ${leader.color}AA)`,
        color: "#fff", display: "grid", placeItems: "center",
        fontWeight: 900, fontSize: fs, flexShrink: 0,
        border: "3px solid #fff", boxShadow: `0 2px 10px ${leader.color}30`,
      }}>
        {leader.avatar}
      </div>
      <div style={{ fontSize: size === "sm" ? 10 : 12, fontWeight: 800, color: COLORS.noir, marginTop: 6, textAlign: "center", lineHeight: 1.2 }}>
        {leader.nom.split(" ").slice(-1)[0]}
      </div>
      <div style={{ fontSize: size === "sm" ? 8 : 9, fontWeight: 700, color: leader.color, textAlign: "center", letterSpacing: 0.3, marginTop: 2 }}>
        {leader.poste}
      </div>
    </motion.div>
  );
}

function BioPanel({ leader, onClose }: { leader: Leader; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
      style={{ background: COLORS.blanc, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.ligne}`, marginBottom: 24, borderLeft: `4px solid ${leader.color}`, position: "relative" }}>
      <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 30, height: 30, borderRadius: 8, border: `1px solid ${COLORS.ligne}`, background: "#fff", cursor: "pointer", fontSize: 14, display: "grid", placeItems: "center" }}>✕</button>

      <div style={{ display: "flex", gap: 18, marginBottom: 16, alignItems: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${leader.color}, ${leader.color}AA)`, color: "#fff", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 22, flexShrink: 0, border: "3px solid #fff", boxShadow: `0 3px 12px ${leader.color}30` }}>
          {leader.avatar}
        </div>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 4px" }}>{leader.nom}</h3>
          <div style={{ fontSize: 13, color: leader.color, fontWeight: 800 }}>{leader.poste}</div>
          {leader.profession && <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{leader.profession}</div>}
        </div>
      </div>

      {/* Infos rapides */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {leader.naissance && <InfoTag icon="📅" label={leader.naissance} />}
        {leader.region && <InfoTag icon="📍" label={leader.region} />}
      </div>
      {leader.fait && (
        <div style={{ padding: "10px 14px", borderRadius: 10, background: `${leader.color}08`, border: `1px solid ${leader.color}15`, marginBottom: 12, fontSize: 12, color: "#555", fontWeight: 600, lineHeight: 1.5 }}>
          💡 {leader.fait}
        </div>
      )}
      <p style={{ fontSize: 13, color: "#444", margin: 0, lineHeight: 1.7 }}>{leader.bio}</p>
    </motion.div>
  );
}

function InfoTag({ icon, label }: { icon: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: COLORS.creme, fontSize: 11, fontWeight: 600, color: "#555" }}>
      {icon} {label}
    </span>
  );
}