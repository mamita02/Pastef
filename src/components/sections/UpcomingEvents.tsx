import { COLORS } from "@/lib/constants/colors";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // ── Démarrer la vidéo quand la section entre dans le viewport ──
  useEffect(() => {
    const vid = videoRef.current;
    const sec = sectionRef.current;
    if (!vid || !sec) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            vid.play().catch(() => {
              /* navigateur peut bloquer l'autoplay */
            });
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.25 },
    );

    io.observe(sec);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="evenements"
      style={{
        background: "#fff",
        fontFamily: "'Outfit','Inter',-apple-system,sans-serif",
      }}
    >
      {/* ══════════════════════════════════════════════
          HERO PLEINE LARGEUR — vidéo en arrière-plan
      ══════════════════════════════════════════════ */}
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: 520,
          marginBottom: 72,
          overflow: "hidden",
        }}
      >
        {/* ── Vidéo de fond ── */}
        <video
          ref={videoRef}
          src="/images/Film.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
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

        {/* ── Overlay dégradé blanc (transparence côté droit, opaque à gauche) ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg,
              rgba(255,255,255,1) 0%,
              rgba(255,255,255,1) 35%,
              rgba(255,255,255,0.8) 48%,
              rgba(255,255,255,0.3) 60%,
              rgba(255,255,255,0) 72%
            )`,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* ── Contenu texte ── */}
        <div
          className="events-hero-grid"
          style={{
            position: "relative",
            zIndex: 2,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            padding: "56px 48px",
            minHeight: 520,
            alignItems: "center",
            maxWidth: 1300,
            margin: "0 auto",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
              <span style={{ color: COLORS.vert, fontWeight: 700, fontSize: 13, letterSpacing: 2 }}>AGENDA</span>
              <span style={{ color: COLORS.rouge, fontWeight: 800, fontSize: 13, letterSpacing: 2 }}>PASTEF</span>
            </div>

            <h2
              style={{
                fontSize: "clamp(42px,5vw,72px)",
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

            <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
              <span style={{ width: 32, height: 4, borderRadius: 2, background: COLORS.vert }} />
              <span style={{ width: 32, height: 4, borderRadius: 2, background: "#D4A017" }} />
              <span style={{ width: 32, height: 4, borderRadius: 2, background: COLORS.rouge }} />
            </div>

            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#555", maxWidth: 380, marginBottom: 32 }}>
              Retrouvez les prochaines rencontres, conférences et activités organisées partout au Sénégal.
            </p>

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
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          CONTENU EN DESSOUS
      ══════════════════════════════════════════════ */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, color: "#888", whiteSpace: "nowrap" }}>
            AUTRES <span style={{ color: COLORS.vert }}>ÉVÉNEMENTS</span> À VENIR
          </span>
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
        </div>

        <div className="events-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginBottom: 48 }}>
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
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ textAlign: "center", flexShrink: 0, minWidth: 60 }}>
                  <div style={{ fontSize: 42, fontWeight: 900, color: evt.accent, lineHeight: 1, letterSpacing: -1 }}>{evt.day}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: COLORS.noir, letterSpacing: 1, marginTop: 2 }}>{evt.month}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#999" }}>{evt.year}</div>
                </div>
                <div style={{ width: 90, height: 90, borderRadius: 14, overflow: "hidden", flexShrink: 0, border: `2px solid ${evt.accent}20` }}>
                  <img src={evt.image} alt={evt.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: COLORS.noir, lineHeight: 1.25, margin: "0 0 6px", letterSpacing: 0.3 }}>{evt.title}</h4>
                  <p style={{ fontSize: 12, color: "#888", margin: "0 0 10px", lineHeight: 1.4 }}>{evt.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "#666", fontWeight: 600 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: evt.accent, fontSize: 13 }}>📍</span>{evt.location}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 13 }}>🕐</span>{evt.time}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: "1px solid #F0F0EC", paddingTop: 14, textAlign: "right" }}>
                <a href="#" style={{ color: evt.accent, fontWeight: 700, fontSize: 13, textDecoration: "none", letterSpacing: 1, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  DÉTAILS <span>→</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="events-notif-bar"
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
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(0,107,63,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
              📅
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: COLORS.noir, marginBottom: 2 }}>Ne manquez aucun événement important.</div>
              <div style={{ fontSize: 13, color: "#888" }}>Activez les notifications pour rester informé.</div>
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

      <style>{`
        @media (max-width: 900px) {
          .events-hero-grid { grid-template-columns: 1fr !important; }
          .events-cards-grid { grid-template-columns: 1fr !important; }
          .events-notif-bar { flex-direction: column !important; text-align: center !important; }
        }
      `}</style>

      <div style={{ height: 100 }} />
    </section>
  );
}