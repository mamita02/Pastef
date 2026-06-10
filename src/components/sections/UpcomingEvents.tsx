import { COLORS } from "@/lib/constants/colors";
import { motion } from "framer-motion";

/**
 * ═══════════════════════════════════════════════════════════════
 *  UpcomingEvents — Section Agenda / Événements à venir
 * ═══════════════════════════════════════════════════════════════
 */

const FEATURED = {
  day: "15",
  month: "JUIN",
  year: "2026",
  title: "FORUM NATIONAL\nDE LA JEUNESSE",
  subtitle: "Pour une jeunesse engagée et souveraine",
  location: "Dakar Arena",
  time: "09h00",
  image: "/images/monument.png",
};

const EVENTS = [
  {
    day: "22",
    month: "JUIN",
    year: "2026",
    title: "RENCONTRE DES MILITANTS",
    desc: "Unité · Discipline · Travail",
    location: "Thiès",
    time: "10h00",
    image: "/images/pastef1.png",
    accent: COLORS.vert,
  },
  {
    day: "05",
    month: "JUILLET",
    year: "2026",
    title: "FORUM SUR LA SOUVERAINETÉ ÉCONOMIQUE",
    desc: "Construire l'indépendance par l'économie",
    location: "Saint-Louis",
    time: "09h30",
    image: "/images/pastef2.png",
    accent: COLORS.rouge,
  },
  {
    day: "19",
    month: "JUILLET",
    year: "2026",
    title: "JOURNÉE NATIONALE DU SERVICE CITOYEN",
    desc: "Agir aujourd'hui pour le Sénégal de demain",
    location: "Ziguinchor",
    time: "08h00",
    image: "/images/pastef.png",
    accent: COLORS.vert,
  },
];

export function UpcomingEvents() {
  return (
    <section
      id="evenements"
      style={{
        padding: "100px 0 0",
        background: "#fff",
        fontFamily: "'Outfit','Inter',-apple-system,sans-serif",
      }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        {/* ═══════════════════════════════════
            HERO : IMAGE EN FOND + DÉGRADÉ + CONTENU
        ════════════════════════════════════ */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: 480,
            marginBottom: 72,
          }}
        >
          {/* Image en arrière-plan — toute la largeur */}
          <img
            src={FEATURED.image}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "right center",
              zIndex: 0,
            }}
          />

          {/* Dégradé blanc gauche → transparent droite */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 30%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.3) 62%, rgba(255,255,255,0) 78%)",
              zIndex: 1,
            }}
          />

          {/* Contenu par-dessus */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              padding: "56px 48px",
              minHeight: 480,
              alignItems: "center",
            }}
            className="events-hero-grid"
          >
            {/* ── Côté gauche : Titre ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 20,
                }}
              >
                <span style={{ color: COLORS.vert, fontWeight: 700, fontSize: 13, letterSpacing: 2 }}>
                  AGENDA
                </span>
                <span style={{ color: COLORS.rouge, fontWeight: 800, fontSize: 13, letterSpacing: 2 }}>
                  PASTEF
                </span>
              </div>

              {/* Titre principal */}
              <h2
                style={{
                  fontSize: "clamp(42px, 5vw, 72px)",
                  fontWeight: 900,
                  lineHeight: 0.95,
                  letterSpacing: -3,
                  margin: "0 0 24px",
                  color: COLORS.noir,
                }}
              >
                PROCHAINS
                <br />
                <span style={{ color: COLORS.vert }}>RENDEZ-VOUS</span>
              </h2>

              {/* Trait tricolore */}
              <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
                <span style={{ width: 32, height: 4, borderRadius: 2, background: COLORS.vert }} />
                <span style={{ width: 32, height: 4, borderRadius: 2, background: "#D4A017" }} />
                <span style={{ width: 32, height: 4, borderRadius: 2, background: COLORS.rouge }} />
              </div>

              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "#555",
                  maxWidth: 380,
                  marginBottom: 32,
                }}
              >
                Retrouvez les prochaines rencontres, conférences et
                activités organisées partout au Sénégal.
              </p>

              {/* Bouton voir tous */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px 28px",
                  borderRadius: 14,
                  border: `2px solid ${COLORS.vert}`,
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(4px)",
                  color: COLORS.vert,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 1.5,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: 18 }}>📅</span>
                VOIR TOUS LES ÉVÉNEMENTS
                <span style={{ marginLeft: 4 }}>›</span>
              </motion.button>
            </motion.div>

            {/* ── Côté droit : Infos Événement Phare ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              {/* Badge ÉVÉNEMENT PHARE */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 18px",
                  borderRadius: 999,
                  background: COLORS.vert,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: 1.5,
                  marginBottom: 24,
                }}
              >
                ★ ÉVÉNEMENT PHARE
              </div>

              {/* Date */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: 72,
                    fontWeight: 900,
                    color: COLORS.vert,
                    lineHeight: 1,
                    letterSpacing: -3,
                  }}
                >
                  {FEATURED.day}
                </span>
                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.noir, letterSpacing: 1 }}>
                    {FEATURED.month}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#666" }}>
                    {FEATURED.year}
                  </div>
                </div>
              </div>

              {/* Titre événement */}
              <h3
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: -0.5,
                  color: COLORS.noir,
                  margin: "0 0 10px",
                  whiteSpace: "pre-line",
                }}
              >
                {FEATURED.title}
              </h3>

              {/* Sous-titre */}
              <p
                style={{
                  fontSize: 15,
                  color: COLORS.vert,
                  fontStyle: "italic",
                  fontWeight: 500,
                  margin: "0 0 20px",
                }}
              >
                {FEATURED.subtitle}
              </p>

              {/* Lieu + Heure */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  fontSize: 14,
                  color: "#444",
                  fontWeight: 600,
                  marginBottom: 28,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: COLORS.rouge }}>📍</span> {FEATURED.location}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  🕐 {FEATURED.time}
                </span>
              </div>

              {/* Bouton S'inscrire */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 28px",
                  borderRadius: 10,
                  border: `2px solid ${COLORS.noir}`,
                  background: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(4px)",
                  color: COLORS.noir,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 1,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                S'INSCRIRE
                <span>›</span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Contenu en dessous avec padding latéral */}
        <div style={{ padding: "0 32px" }}>
        {/* ═══════════════════════════════════
            SÉPARATEUR
        ════════════════════════════════════ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 48,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 3,
              color: "#888",
              whiteSpace: "nowrap",
            }}
          >
            AUTRES <span style={{ color: COLORS.vert }}>ÉVÉNEMENTS</span> À VENIR
          </span>
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
        </div>

        {/* ═══════════════════════════════════
            GRILLE 3 ÉVÉNEMENTS
        ════════════════════════════════════ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            marginBottom: 48,
          }}
          className="events-cards-grid"
        >
          {EVENTS.map((evt, i) => (
            <motion.div
              key={evt.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              style={{
                background: "#fff",
                borderRadius: 20,
                border: "1px solid #F0F0EC",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                transition: "box-shadow 0.2s ease",
              }}
            >
              {/* Haut : Date + Image + Infos */}
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                {/* Date */}
                <div style={{ textAlign: "center", flexShrink: 0, minWidth: 60 }}>
                  <div
                    style={{
                      fontSize: 42,
                      fontWeight: 900,
                      color: evt.accent,
                      lineHeight: 1,
                      letterSpacing: -1,
                    }}
                  >
                    {evt.day}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: COLORS.noir,
                      letterSpacing: 1,
                      marginTop: 2,
                    }}
                  >
                    {evt.month}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#999" }}>
                    {evt.year}
                  </div>
                </div>

                {/* Image miniature */}
                <div
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 14,
                    overflow: "hidden",
                    flexShrink: 0,
                    border: `2px solid ${evt.accent}20`,
                  }}
                >
                  <img
                    src={evt.image}
                    alt={evt.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Texte */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: COLORS.noir,
                      lineHeight: 1.25,
                      margin: "0 0 6px",
                      letterSpacing: 0.3,
                    }}
                  >
                    {evt.title}
                  </h4>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#888",
                      margin: "0 0 10px",
                      lineHeight: 1.4,
                    }}
                  >
                    {evt.desc}
                  </p>
                  {/* Lieu + Heure */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontSize: 12,
                      color: "#666",
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: evt.accent, fontSize: 13 }}>📍</span>
                      {evt.location}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 13 }}>🕐</span>
                      {evt.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lien Détails */}
              <div
                style={{
                  borderTop: "1px solid #F0F0EC",
                  paddingTop: 14,
                  textAlign: "right",
                }}
              >
                <a
                  href="#"
                  style={{
                    color: evt.accent,
                    fontWeight: 700,
                    fontSize: 13,
                    textDecoration: "none",
                    letterSpacing: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  DÉTAILS <span>→</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ═══════════════════════════════════
            BANNIÈRE NOTIFICATIONS
        ════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            padding: "24px 32px",
            borderRadius: 18,
            border: "1px solid #F0F0EC",
            background: "#FAFAF7",
            marginBottom: 0,
          }}
          className="events-notif-bar"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: "rgba(0,107,63,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                flexShrink: 0,
              }}
            >
              📅
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: COLORS.noir, marginBottom: 2 }}>
                Ne manquez aucun événement important.
              </div>
              <div style={{ fontSize: 13, color: "#888" }}>
                Activez les notifications pour rester informé.
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 24px",
              borderRadius: 12,
              border: `1.5px solid ${COLORS.vert}`,
              background: "transparent",
              color: COLORS.vert,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 1.5,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            ACTIVER LES NOTIFICATIONS
            <span style={{ fontSize: 16 }}>🔔</span>
            <span>›</span>
          </motion.button>
        </motion.div>
        </div>
      </div>

      {/* ── Responsive ── */}
      <style>{`
        @media (max-width: 900px) {
          .events-hero-grid { grid-template-columns: 1fr !important; }
          .events-cards-grid { grid-template-columns: 1fr !important; }
          .events-notif-bar { flex-direction: column !important; text-align: center !important; }
        }
      `}</style>

      {/* Espacement bas */}
      <div style={{ height: 100 }} />
    </section>
  );
}