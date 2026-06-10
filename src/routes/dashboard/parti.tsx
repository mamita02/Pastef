import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { COLORS } from "@/lib/constants/colors";
import { PILIERS } from "@/lib/data/piliers";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/parti")({
  component: PartiPage,
});

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

type TabKey = "actualites" | "engagement" | "memoire" | "consultations";
type EventType = "reunion" | "webinaire" | "meeting" | "formation" | "commemoration";
type CotisationStatus = "payee" | "en_retard" | "a_venir";

interface Evenement {
  id: string;
  date: string;
  heure: string;
  titre: string;
  lieu: string;
  type: EventType;
  inscrits: number;
  cellule?: string;
  enligne: boolean;
}

interface Actualite {
  id: string;
  titre: string;
  extrait: string;
  source: string;
  date: string;
  important: boolean;
  categorie: "communique" | "decision" | "nomination" | "terrain" | "international";
}

interface Cotisation {
  mois: string;
  montant: number;
  status: CotisationStatus;
  datePaiement?: string;
  methode?: string;
}

interface Martyr {
  nom: string;
  date: string;
  lieu: string;
  description: string;
  avatar: string;
}

interface Consultation {
  id: string;
  titre: string;
  description: string;
  participants: number;
  fin: string;
  options: { label: string; votes: number }[];
  aVote: boolean;
}

interface CelluleInfo {
  region: string;
  cellules: number;
  membres: number;
  responsable: string;
}

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════ */

const pilier = PILIERS[3];

const EVENT_CONFIG: Record<EventType, { icon: string; color: string; label: string }> = {
  reunion:        { icon: "🏛️", color: COLORS.vert, label: "Réunion" },
  webinaire:      { icon: "💻", color: "#2563EB", label: "Webinaire" },
  meeting:        { icon: "📢", color: COLORS.rouge, label: "Meeting" },
  formation:      { icon: "🎓", color: "#7C3AED", label: "Formation" },
  commemoration:  { icon: "🕯️", color: "#6B7280", label: "Commémoration" },
};

const MOCK_EVENTS: Evenement[] = [
  { id: "ev1", date: "12 JUIN", heure: "18h00", titre: "Réunion de cellule — Dakar Plateau", lieu: "Maison du Parti, Dakar", type: "reunion", inscrits: 45, cellule: "Cellule Plateau", enligne: false },
  { id: "ev2", date: "14 JUIN", heure: "20h00", titre: "Webinaire Diaspora : Bilan 100 jours Congrès", lieu: "Zoom (lien envoyé par email)", type: "webinaire", inscrits: 312, enligne: true },
  { id: "ev3", date: "18 JUIN", heure: "10h00", titre: "Formation : Animation de cellule (module 3)", lieu: "Centre de formation, Thiès", type: "formation", inscrits: 28, enligne: false },
  { id: "ev4", date: "21 JUIN", heure: "15h00", titre: "Meeting populaire — Place de l'Indépendance", lieu: "Dakar, Place de l'Indépendance", type: "meeting", inscrits: 2400, enligne: false },
  { id: "ev5", date: "25 JUIN", heure: "09h00", titre: "Hommage aux Martyrs de la Lutte Démocratique", lieu: "Place de la Nation, Dakar", type: "commemoration", inscrits: 890, enligne: false },
  { id: "ev6", date: "28 JUIN", heure: "19h00", titre: "Réunion de cellule — Diaspora Paris", lieu: "Foyer sénégalais, 18e arrondissement", type: "reunion", inscrits: 67, cellule: "Cellule Paris Nord", enligne: false },
  { id: "ev7", date: "02 JUIL", heure: "14h00", titre: "Atelier : Rédiger un projet Co-Dev (Pilier 3)", lieu: "En ligne + présentiel Kaolack", type: "formation", inscrits: 156, enligne: true },
];

const MOCK_ACTUS: Actualite[] = [
  { id: "a1", titre: "Résolution générale du Premier Congrès adoptée à l'unanimité", extrait: "Le Premier Congrès ordinaire de PASTEF-LES PATRIOTES, tenu à Diamniadio le 6 juin 2026, a adopté à l'unanimité la Résolution générale fixant les sept directives stratégiques du parti.", source: "Direction Nationale", date: "6 juin 2026", important: true, categorie: "decision" },
  { id: "a2", titre: "Lancement officiel de la Plateforme Numérique de Souveraineté", extrait: "Le Secrétariat au Numérique annonce le déploiement progressif de la plateforme à partir du 15 juin 2026. Les 4 piliers seront activés par vagues.", source: "Secrétariat au Numérique", date: "8 juin 2026", important: true, categorie: "communique" },
  { id: "a3", titre: "42 nouvelles cellules créées en Casamance", extrait: "La coordination régionale de Ziguinchor, Sédhiou et Kolda annonce la structuration de 42 nouvelles cellules de base, portant le total à 186 pour les trois régions.", source: "Coordination Casamance", date: "5 juin 2026", important: false, categorie: "terrain" },
  { id: "a4", titre: "Nomination de 3 coordinateurs diaspora", extrait: "Le Bureau National a nommé les coordinateurs diaspora pour l'Amérique du Nord, l'Europe du Sud et l'Afrique de l'Ouest. Ils sont chargés de structurer les cellules locales.", source: "Bureau National", date: "3 juin 2026", important: false, categorie: "nomination" },
  { id: "a5", titre: "PASTEF au Forum panafricain de Kigali", extrait: "Une délégation de 5 cadres a représenté le parti au Forum panafricain de la jeunesse à Kigali, Rwanda. Thème : souveraineté numérique et coopération Sud-Sud.", source: "Secrétariat International", date: "1 juin 2026", important: false, categorie: "international" },
];

const MOCK_COTISATIONS: Cotisation[] = [
  { mois: "Juin 2026", montant: 2000, status: "a_venir" },
  { mois: "Mai 2026", montant: 2000, status: "payee", datePaiement: "3 mai 2026", methode: "Wave" },
  { mois: "Avril 2026", montant: 2000, status: "payee", datePaiement: "1 avril 2026", methode: "Orange Money" },
  { mois: "Mars 2026", montant: 2000, status: "payee", datePaiement: "5 mars 2026", methode: "Wave" },
  { mois: "Février 2026", montant: 2000, status: "payee", datePaiement: "2 février 2026", methode: "Wave" },
  { mois: "Janvier 2026", montant: 2000, status: "en_retard" },
];

const MOCK_MARTYRS: Martyr[] = [
  { nom: "Abdoulaye Diallo", date: "Mars 2021", lieu: "Dakar", description: "Tombé lors des manifestations pour la démocratie. Étudiant en droit à l'UCAD, militant actif de la cellule Université.", avatar: "AD" },
  { nom: "Mariama Sow", date: "Juin 2023", lieu: "Ziguinchor", description: "Victime de la répression lors des marches pacifiques. Enseignante et mère de 3 enfants, figure de la résistance en Casamance.", avatar: "MS" },
  { nom: "Ibrahima Ndiaye", date: "Février 2024", lieu: "Saint-Louis", description: "Disparu lors des arrestations massives. Commerçant au marché Sor, responsable de cellule depuis 2019.", avatar: "IN" },
];

const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: "c1", titre: "Réforme du système éducatif : quelle priorité ?", description: "Le parti consulte les militants sur les axes prioritaires de la réforme éducative à proposer au gouvernement.", participants: 12450, fin: "Dans 4 jours", aVote: false,
    options: [
      { label: "Formation des enseignants et revalorisation salariale", votes: 4820 },
      { label: "Rénovation des infrastructures scolaires", votes: 3210 },
      { label: "Intégration des langues nationales dans le cursus", votes: 2890 },
      { label: "Programme numérique dans toutes les écoles", votes: 1530 },
    ],
  },
  {
    id: "c2", titre: "Stratégie diaspora 2027–2030", description: "Définir les priorités d'organisation de la diaspora pour les 3 prochaines années.", participants: 8732, fin: "Dans 11 jours", aVote: true,
    options: [
      { label: "Renforcement des cellules existantes", votes: 3200 },
      { label: "Ouverture de 15 nouveaux pays", votes: 2100 },
      { label: "Fonds d'investissement diaspora", votes: 2432 },
      { label: "Programme de retour et réinsertion", votes: 1000 },
    ],
  },
  {
    id: "c3", titre: "Position du parti sur la monnaie unique CEDEAO", description: "Faut-il soutenir le projet ECO ou défendre une monnaie nationale souveraine ?", participants: 15230, fin: "Dans 2 jours", aVote: false,
    options: [
      { label: "Soutenir l'ECO avec conditions", votes: 6120 },
      { label: "Monnaie nationale souveraine", votes: 7340 },
      { label: "Monnaie ouest-africaine alternative hors CEDEAO", votes: 1770 },
    ],
  },
];

const MOCK_CELLULES: CelluleInfo[] = [
  { region: "Dakar", cellules: 245, membres: 18420, responsable: "Abdou Sall" },
  { region: "Thiès", cellules: 128, membres: 9840, responsable: "Fatou Diop" },
  { region: "Ziguinchor", cellules: 86, membres: 6720, responsable: "Ousmane Diatta" },
  { region: "Saint-Louis", cellules: 74, membres: 5890, responsable: "Awa Ndiaye" },
  { region: "Kaolack", cellules: 65, membres: 4950, responsable: "Moussa Faye" },
  { region: "Diourbel", cellules: 52, membres: 3870, responsable: "Ibrahima Gueye" },
  { region: "Matam", cellules: 48, membres: 3210, responsable: "Amadou Bâ" },
  { region: "Kédougou", cellules: 32, membres: 2140, responsable: "Aïssatou Diallo" },
  { region: "Fatick", cellules: 41, membres: 2980, responsable: "Cheikh Sarr" },
  { region: "Kaffrine", cellules: 29, membres: 1870, responsable: "Mame Binta" },
  { region: "Louga", cellules: 38, membres: 2540, responsable: "Modou Fall" },
  { region: "Kolda", cellules: 44, membres: 3100, responsable: "Lamine Baldé" },
  { region: "Sédhiou", cellules: 27, membres: 1650, responsable: "Mariama Cissé" },
  { region: "Tambacounda", cellules: 35, membres: 2310, responsable: "Papa Demba" },
  { region: "Diaspora", cellules: 156, membres: 42800, responsable: "Coordination Internationale" },
];

const COTISATION_STATUS: Record<CotisationStatus, { label: string; color: string; icon: string }> = {
  payee:    { label: "Payée", color: "#059669", icon: "✅" },
  en_retard:{ label: "En retard", color: COLORS.rouge, icon: "⚠️" },
  a_venir:  { label: "À payer", color: "#D97706", icon: "🔔" },
};

const ACTU_COLORS: Record<string, { color: string; label: string }> = {
  communique:    { color: COLORS.vert, label: "Communiqué" },
  decision:      { color: "#2563EB", label: "Décision" },
  nomination:    { color: "#7C3AED", label: "Nomination" },
  terrain:       { color: "#D97706", label: "Terrain" },
  international: { color: "#0891B2", label: "International" },
};

/* ═══════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
   ═══════════════════════════════════════════════════════════════ */

function PartiPage() {
  const user = getUser();
  const [activeTab, setActiveTab] = useState<TabKey>("actualites");

  const totalPatriotes = MOCK_CELLULES.reduce((s, c) => s + c.membres, 0);
  const totalCellules = MOCK_CELLULES.reduce((s, c) => s + c.cellules, 0);
  const cotisationsPayees = MOCK_COTISATIONS.filter((c) => c.status === "payee").length;
  const totalCotise = MOCK_COTISATIONS.filter((c) => c.status === "payee").reduce((s, c) => s + c.montant, 0);

  return (
    <>
      <PilierHeader pilier={pilier} />

      {/* Stats globales */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <StatChip icon="🌍" value={totalPatriotes.toLocaleString()} label="Patriotes dans le monde" color={COLORS.vert} />
        <StatChip icon="🏛️" value={totalCellules.toString()} label="Cellules actives" color="#2563EB" />
        <StatChip icon="🏆" value={`#${user?.rang ?? 42}`} label="Mon rang national" color="#D97706" />
        <StatChip icon="📊" value={`${user?.engagement ?? 87}%`} label="Mon engagement" color={COLORS.rouge} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, background: COLORS.blanc, borderRadius: 14, border: `1px solid ${COLORS.ligne}`, overflow: "hidden", width: "fit-content", flexWrap: "wrap" }}>
        {([
          { key: "actualites" as TabKey, icon: "📰", label: "Actualités & Agenda" },
          { key: "engagement" as TabKey, icon: "📊", label: "Mon engagement" },
          { key: "memoire" as TabKey, icon: "🕯️", label: "Mémoire & Bibliothèque" },
          { key: "consultations" as TabKey, icon: "🗳️", label: "Consultations" },
        ]).map((t) => (
          <TabBtn key={t.key} active={activeTab === t.key} onClick={() => setActiveTab(t.key)} icon={t.icon} label={t.label} />
        ))}
      </div>

      {activeTab === "actualites" && <ActualitesTab />}
      {activeTab === "engagement" && <EngagementTab user={user} cotisationsPayees={cotisationsPayees} totalCotise={totalCotise} />}
      {activeTab === "memoire" && <MemoireTab />}
      {activeTab === "consultations" && <ConsultationsTab />}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ONGLET ACTUALITÉS & AGENDA
   ═══════════════════════════════════════════════════════════════ */

function ActualitesTab() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, alignItems: "start" }}>
      {/* Fil d'actualités */}
      <div>
        <SectionHeader icon="📰" title="Fil d'actualités" subtitle="Communications officielles du parti" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MOCK_ACTUS.map((a) => {
            const cat = ACTU_COLORS[a.categorie];
            return (
              <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ background: COLORS.blanc, borderRadius: 14, padding: "16px 20px", border: `1px solid ${COLORS.ligne}`, borderLeft: a.important ? `4px solid ${COLORS.rouge}` : `1px solid ${COLORS.ligne}`, cursor: "pointer", transition: "all 0.15s ease" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, background: `${cat.color}15`, color: cat.color, padding: "2px 10px", borderRadius: 6 }}>{cat.label}</span>
                  {a.important && <span style={{ fontSize: 10, fontWeight: 800, background: `${COLORS.rouge}15`, color: COLORS.rouge, padding: "2px 10px", borderRadius: 6 }}>🔴 Important</span>}
                  <span style={{ fontSize: 10, color: "#999", marginLeft: "auto" }}>{a.date}</span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 4px", color: COLORS.noir, lineHeight: 1.4 }}>{a.titre}</h3>
                <p style={{ fontSize: 12, color: "#888", margin: "0 0 6px", lineHeight: 1.5 }}>{a.extrait}</p>
                <div style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>Source : {a.source}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Agenda */}
      <div>
        <SectionHeader icon="📅" title="Agenda" subtitle="Prochains événements" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MOCK_EVENTS.map((e) => {
            const cfg = EVENT_CONFIG[e.type];
            return (
              <motion.div key={e.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ background: COLORS.blanc, borderRadius: 12, padding: "14px 16px", border: `1px solid ${COLORS.ligne}`, display: "flex", gap: 12 }}>
                {/* Date bloc */}
                <div style={{ width: 50, flexShrink: 0, textAlign: "center", padding: "6px 0", borderRadius: 10, background: `${cfg.color}10` }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: cfg.color, lineHeight: 1 }}>{e.date.split(" ")[0]}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: cfg.color, letterSpacing: 1, marginTop: 2 }}>{e.date.split(" ")[1]}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, background: `${cfg.color}15`, color: cfg.color, padding: "2px 8px", borderRadius: 4 }}>{cfg.icon} {cfg.label}</span>
                    {e.enligne && <span style={{ fontSize: 9, fontWeight: 700, background: "#2563EB15", color: "#2563EB", padding: "2px 8px", borderRadius: 4 }}>En ligne</span>}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.noir, marginBottom: 2 }}>{e.titre}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>📍 {e.lieu} · 🕐 {e.heure}</div>
                  <div style={{ fontSize: 10, color: "#aaa", marginTop: 4 }}>👥 {e.inscrits} inscrits</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ONGLET MON ENGAGEMENT
   ═══════════════════════════════════════════════════════════════ */

function EngagementTab({ user, cotisationsPayees, totalCotise }: { user: ReturnType<typeof getUser>; cotisationsPayees: number; totalCotise: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
      {/* Colonne gauche */}
      <div>
        {/* Carte profil engagement */}
        <div style={{ background: COLORS.blanc, borderRadius: 16, border: `1px solid ${COLORS.ligne}`, padding: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.vert}, ${COLORS.rouge})`, color: "#fff", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 20 }}>{user?.avatar ?? "P"}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: COLORS.noir }}>{user?.nom ?? "Patriote"}</div>
              <div style={{ fontSize: 13, color: "#888" }}>{user?.fonction ?? "Militant"}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.vert, marginTop: 2 }}>🏆 Rang national : #{user?.rang ?? 42}</div>
            </div>
          </div>

          {/* Score d'engagement */}
          <div style={{ padding: "16px 18px", borderRadius: 14, background: `${COLORS.vert}08`, border: `1px solid ${COLORS.vert}20`, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#555" }}>Score d'engagement</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: COLORS.vert }}>{user?.engagement ?? 87}%</span>
            </div>
            <div style={{ height: 8, background: COLORS.ligne, borderRadius: 4, overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${user?.engagement ?? 87}%` }} transition={{ duration: 1 }} style={{ height: "100%", background: COLORS.vert, borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>Basé sur : cotisations, présence aux réunions, formations, contributions Co-Dev</div>
          </div>

          {/* Points */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <MiniStat label="Points patriote" value={(user?.points ?? 8540).toLocaleString()} color={COLORS.vert} icon="⭐" />
            <MiniStat label="Cotisations payées" value={`${cotisationsPayees}/6`} color="#2563EB" icon="💳" />
            <MiniStat label="Total cotisé" value={`${(totalCotise / 1000).toFixed(0)}K`} color="#D97706" icon="💰" />
          </div>
        </div>

        {/* Suivi des cotisations */}
        <SectionHeader icon="💳" title="Suivi des cotisations" subtitle="Historique mensuel — 2 000 FCFA/mois" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {MOCK_COTISATIONS.map((c, i) => {
            const st = COTISATION_STATUS[c.status];
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: COLORS.blanc, borderRadius: 12, border: `1px solid ${COLORS.ligne}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${st.color}12`, display: "grid", placeItems: "center", fontSize: 16, flexShrink: 0 }}>{st.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.noir }}>{c.mois}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>
                    {c.datePaiement ? `Payé le ${c.datePaiement} via ${c.methode}` : c.status === "en_retard" ? "Paiement en retard" : "Échéance à venir"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: st.color }}>{c.montant.toLocaleString()} FCFA</div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: st.color, background: `${st.color}12`, padding: "2px 8px", borderRadius: 4 }}>{st.label}</span>
                </div>
                {c.status !== "payee" && (
                  <button onClick={() => alert(`Paiement de ${c.montant} FCFA pour ${c.mois} — Orange Money / Wave`)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: COLORS.vert, color: "#fff", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                    Payer
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Colonne droite — Cellules */}
      <div>
        <SectionHeader icon="🏛️" title={`Cellules du parti (${MOCK_CELLULES.reduce((s, c) => s + c.cellules, 0)})`} subtitle="Présence par région" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {MOCK_CELLULES.sort((a, b) => b.membres - a.membres).map((c, i) => {
            const isDiaspora = c.region === "Diaspora";
            const maxMembres = MOCK_CELLULES[0].membres;
            const barWidth = (c.membres / maxMembres) * 100;
            return (
              <div key={c.region} style={{ background: COLORS.blanc, borderRadius: 12, padding: "12px 16px", border: `1px solid ${COLORS.ligne}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "#999", width: 20 }}>#{i + 1}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: isDiaspora ? "#D97706" : COLORS.noir }}>{isDiaspora ? "🌍 " : ""}{c.region}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 14, fontWeight: 900, color: COLORS.vert }}>{c.cellules}</span>
                    <span style={{ fontSize: 11, color: "#999", marginLeft: 4 }}>cellules</span>
                  </div>
                </div>
                <div style={{ height: 4, background: COLORS.ligne, borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
                  <div style={{ height: "100%", width: `${barWidth}%`, background: isDiaspora ? "#D97706" : COLORS.vert, borderRadius: 2, transition: "width 0.6s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#999" }}>
                  <span>👥 {c.membres.toLocaleString()} membres</span>
                  <span>Resp. : {c.responsable}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Classement engagement */}
        <div style={{ marginTop: 20, background: COLORS.blanc, borderRadius: 16, border: `1px solid ${COLORS.ligne}`, padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: "#999", marginBottom: 14 }}>🏆 TOP 5 PATRIOTES — CLASSEMENT NATIONAL</div>
          {[
            { rang: 1, nom: "Fatou Sow", points: 15420, region: "Thiès" },
            { rang: 2, nom: "Ousmane Ndiaye", points: 14890, region: "Dakar" },
            { rang: 3, nom: "Awa Diallo", points: 13750, region: "Diaspora Paris" },
            { rang: 4, nom: "Moussa Faye", points: 12980, region: "Kaolack" },
            { rang: 5, nom: "Ibrahima Gueye", points: 12340, region: "Saint-Louis" },
          ].map((p) => (
            <div key={p.rang} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${COLORS.ligne}` }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: p.rang <= 3 ? `linear-gradient(135deg, #D97706, #E8B847)` : COLORS.ligne, color: p.rang <= 3 ? "#fff" : "#999", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 12 }}>{p.rang}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.noir }}>{p.nom}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{p.region}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.vert }}>⭐ {p.points.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ONGLET MÉMOIRE & BIBLIOTHÈQUE
   ═══════════════════════════════════════════════════════════════ */

function MemoireTab() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
      {/* Mémoire des Martyrs */}
      <div>
        <SectionHeader icon="🕯️" title="Mémoire des Martyrs" subtitle="Hommage aux héros de la lutte démocratique 2021–2024" />
        <div style={{ background: COLORS.blanc, borderRadius: 16, border: `1px solid ${COLORS.ligne}`, overflow: "hidden" }}>
          {/* Bandeau solennel */}
          <div style={{ background: `linear-gradient(135deg, ${COLORS.noir}, #1a1a2e)`, padding: "24px 20px", color: "#fff", textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, opacity: 0.6, marginBottom: 8 }}>EN MÉMOIRE</div>
            <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.4, marginBottom: 6 }}>« Ceux qui sont morts ne sont jamais partis »</div>
            <div style={{ fontSize: 12, opacity: 0.5, fontStyle: "italic" }}>Birago Diop</div>
          </div>

          <div style={{ padding: 20 }}>
            {MOCK_MARTYRS.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < MOCK_MARTYRS.length - 1 ? `1px solid ${COLORS.ligne}` : "none" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: COLORS.noir, color: "#fff", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 13, flexShrink: 0 }}>{m.avatar}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.noir }}>{m.nom}</div>
                  <div style={{ fontSize: 11, color: COLORS.rouge, fontWeight: 700, marginBottom: 4 }}>🕯️ {m.date} · {m.lieu}</div>
                  <p style={{ fontSize: 12, color: "#666", margin: 0, lineHeight: 1.5 }}>{m.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "0 20px 20px" }}>
            <div style={{ padding: "14px 16px", borderRadius: 12, background: `${COLORS.rouge}08`, border: `1px solid ${COLORS.rouge}15`, fontSize: 12, color: "#666", lineHeight: 1.6, textAlign: "center" }}>
              📅 <strong>Prochaine commémoration :</strong> 25 juin 2026 — Journée nationale des Martyrs, Place de la Nation
            </div>
          </div>
        </div>
      </div>

      {/* Bibliothèque */}
      <div>
        <SectionHeader icon="📚" title="Bibliothèque numérique" subtitle="Centre de recherche et production de pensée" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { titre: "Résolution générale du Premier Congrès", type: "PDF", pages: 20, date: "Juin 2026", color: COLORS.vert, icon: "📜" },
            { titre: "Projet de Société PASTEF — Version intégrale", type: "PDF", pages: 145, date: "2024", color: "#2563EB", icon: "📘" },
            { titre: "Rapport d'audit du Fonds Co-Développement Q1 2026", type: "PDF", pages: 32, date: "Avril 2026", color: "#D97706", icon: "📊" },
            { titre: "Note d'analyse : Renégociation des contrats pétroliers", type: "PDF", pages: 18, date: "Mai 2026", color: COLORS.rouge, icon: "⛽" },
            { titre: "Guide du responsable de cellule (2e édition)", type: "PDF", pages: 56, date: "Mars 2026", color: "#059669", icon: "📋" },
            { titre: "Étude : Impact économique de la diaspora sénégalaise", type: "PDF", pages: 74, date: "2025", color: "#7C3AED", icon: "🌍" },
          ].map((doc, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: COLORS.blanc, borderRadius: 12, border: `1px solid ${COLORS.ligne}`, cursor: "pointer", transition: "all 0.15s ease" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${doc.color}12`, display: "grid", placeItems: "center", fontSize: 18, flexShrink: 0 }}>{doc.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.noir, lineHeight: 1.3 }}>{doc.titre}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{doc.type} · {doc.pages} pages · {doc.date}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: doc.color, cursor: "pointer" }}>Lire →</span>
            </div>
          ))}
        </div>

        {/* Dates commémoratives */}
        <div style={{ marginTop: 20 }}>
          <SectionHeader icon="📅" title="Dates commémoratives" subtitle="" />
          <div style={{ background: COLORS.blanc, borderRadius: 14, border: `1px solid ${COLORS.ligne}`, padding: 16 }}>
            {[
              { date: "8 mars", titre: "Journée des femmes patriotes" },
              { date: "23 juin", titre: "Anniversaire de la fondation (2014)" },
              { date: "25 juin", titre: "Journée nationale des Martyrs" },
              { date: "24 mars", titre: "Victoire présidentielle 2024" },
              { date: "6 juin", titre: "Premier Congrès de Diamniadio" },
            ].map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 4 ? `1px solid ${COLORS.ligne}` : "none" }}>
                <div style={{ width: 60, fontSize: 12, fontWeight: 800, color: COLORS.rouge }}>{d.date}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.noir }}>{d.titre}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ONGLET CONSULTATIONS CITOYENNES
   ═══════════════════════════════════════════════════════════════ */

function ConsultationsTab() {
  const [voted, setVoted] = useState<Record<string, number>>({});

  return (
    <div>
      <SectionHeader icon="🗳️" title="Consultations citoyennes" subtitle="Participe aux décisions stratégiques du parti — ton vote compte" />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {MOCK_CONSULTATIONS.map((c) => {
          const totalVotes = c.options.reduce((s, o) => s + o.votes, 0);
          const hasVoted = c.aVote || voted[c.id] !== undefined;
          const myVote = voted[c.id];

          return (
            <div key={c.id} style={{ background: COLORS.blanc, borderRadius: 16, border: `1px solid ${COLORS.ligne}`, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 4px", color: COLORS.noir }}>{c.titre}</h3>
                  <p style={{ fontSize: 13, color: "#888", margin: 0 }}>{c.description}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.rouge }}>⏱ {c.fin}</div>
                  <div style={{ fontSize: 11, color: "#999" }}>👥 {c.participants.toLocaleString()} votes</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {c.options.map((o, i) => {
                  const pctVal = totalVotes > 0 ? Math.round((o.votes / totalVotes) * 100) : 0;
                  const isMyVote = myVote === i;
                  const isWinning = pctVal === Math.max(...c.options.map((x) => Math.round((x.votes / totalVotes) * 100)));

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (!hasVoted) setVoted((prev) => ({ ...prev, [c.id]: i }));
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: `1px solid ${isMyVote ? COLORS.vert : COLORS.ligne}`,
                        background: isMyVote ? `${COLORS.vert}08` : COLORS.blanc,
                        cursor: hasVoted ? "default" : "pointer",
                        width: "100%",
                        fontFamily: "inherit",
                        textAlign: "left",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {/* Barre de résultat (visible après vote) */}
                      {hasVoted && (
                        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pctVal}%`, background: isWinning ? `${COLORS.vert}12` : `${COLORS.noir}05`, transition: "width 0.6s ease", zIndex: 0 }} />
                      )}
                      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12, width: "100%", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${isMyVote ? COLORS.vert : "#ddd"}`, background: isMyVote ? COLORS.vert : "transparent", display: "grid", placeItems: "center", fontSize: 10, color: "#fff", flexShrink: 0 }}>
                            {isMyVote ? "✓" : ""}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: isMyVote ? 800 : 600, color: COLORS.noir }}>{o.label}</span>
                        </div>
                        {hasVoted && (
                          <span style={{ fontSize: 13, fontWeight: 900, color: isWinning ? COLORS.vert : "#999" }}>{pctVal}%</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {hasVoted && (
                <div style={{ marginTop: 10, fontSize: 11, color: "#888", textAlign: "center" }}>
                  {c.aVote ? "Tu as déjà voté pour cette consultation." : "✅ Vote enregistré — merci pour ta participation !"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MICRO-COMPOSANTS
   ═══════════════════════════════════════════════════════════════ */

function PilierHeader({ pilier }: { pilier: (typeof PILIERS)[number] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24, padding: "20px 24px", borderRadius: 16, background: `linear-gradient(135deg, ${pilier.color}10, ${pilier.color}03)`, borderLeft: `4px solid ${pilier.color}` }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, color: pilier.color, marginBottom: 6 }}>{pilier.tag}</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, margin: 0, color: COLORS.noir }}>{pilier.title}</h1>
    </motion.div>
  );
}

function StatChip({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: COLORS.blanc, border: `1px solid ${COLORS.ligne}`, borderRadius: 12, padding: "10px 16px", flex: "1 1 140px", minWidth: 140 }}>
      <span style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: "grid", placeItems: "center", fontSize: 16, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 18, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: active ? 800 : 600, fontFamily: "inherit", color: active ? COLORS.vert : "#666", background: active ? `${COLORS.vert}10` : "transparent", borderBottom: active ? `2px solid ${COLORS.vert}` : "2px solid transparent", whiteSpace: "nowrap", transition: "all 0.15s ease" }}>
      <span>{icon}</span>{label}
    </button>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.noir, display: "flex", alignItems: "center", gap: 8 }}>
        <span>{icon}</span>{title}
      </div>
      {subtitle && <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{subtitle}</div>}
    </div>
  );
}

function MiniStat({ label, value, color, icon }: { label: string; value: string; color: string; icon: string }) {
  return (
    <div style={{ padding: "12px 14px", borderRadius: 12, background: `${color}08`, border: `1px solid ${color}20`, textAlign: "center" }}>
      <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 10, color: "#888", fontWeight: 600, marginTop: 2 }}>{label}</div>
    </div>
  );
}