import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { COLORS } from "@/lib/constants/colors";

/**
 * ═══════════════════════════════════════════════════════════════
 *  AIChatbot — Assistant IA PASTEF
 * ═══════════════════════════════════════════════════════════════
 *
 *  Identité : couleurs Sénégal (vert/rouge) + pattern ethnique
 *  utilisé directement comme image de background :
 *   1. Dans le cercle FAB (background plein)
 *   2. Dans le header du panneau (background + overlay sombre)
 *
 *  POSITION : FAB côte à côte avec WhatsApp en bas à droite
 *   - WhatsApp à right: 28, bottom: 28 (largeur 60px)
 *   - AI à right: 100, bottom: 28 (à gauche immédiate)
 *   - Panneau ouvert à right: 28, bottom: 100
 *
 *  ⚠️ PROTOTYPE — Réponses par mots-clés.
 * ═══════════════════════════════════════════════════════════════
 */

// ─── Chemin de l'image du pattern (ajuste selon ton arbo /public) ───
const PATTERN_URL = "/images/pattern-sn2.png";

// ─── Couleurs identitaires Sénégal / PASTEF ───
const SN_GREEN = "#1B8B3A";
const SN_RED = "#C8102E";

// ─── Dimensions FAB (constantes au niveau module, hors composant) ───
const FAB_SIZE = 52;
const FAB_RIGHT = 28; // = 100 (28 marge + 60 WhatsApp + 12 gap)

type Message = {
  id: string;
  role: "ai" | "user";
  text: string;
  streaming?: boolean;
};

const STARTER_QUESTIONS = [
  "Comment rejoindre PASTEF ?",
  "Quels sont les 4 piliers ?",
  "Comment contribuer ?",
  "Offres Talents",
];

const KNOWLEDGE_BASE: Array<{ keywords: string[]; answer: string; followups?: string[] }> = [
  {
    keywords: ["rejoindre", "adhérer", "adhesion", "inscrire", "inscription", "membre"],
    answer:
      "Pour rejoindre PASTEF, c'est simple : créez votre compte depuis le bouton « Rejoindre » en haut. Vous accédez ensuite à votre tableau de bord patriote où vous pouvez choisir votre section locale, votre pilier d'engagement et commencer à contribuer. La procédure prend moins de 3 minutes. 🇸🇳",
    followups: ["Quels piliers d'engagement ?", "Combien coûte l'adhésion ?"],
  },
  {
    keywords: ["pilier", "piliers", "axe", "axes"],
    answer:
      "PASTEF s'articule autour de 4 piliers stratégiques :\n\n① Talents & Marchés — emploi et opportunités économiques\n② Académie — formation politique et civique\n③ Co-développement — projets diaspora pour le terroir\n④ Vie du Parti — engagement local et national\n\nChaque membre choisit ses piliers prioritaires selon ses compétences.",
    followups: ["Détails sur l'Académie", "Comment contribuer aux projets diaspora ?"],
  },
  {
    keywords: ["contribuer", "cotiser", "cotisation", "argent", "financier", "donner", "don"],
    answer:
      "Trois façons de contribuer financièrement :\n\n• Cotisation mensuelle (à partir de 1 000 FCFA)\n• Soutien à un projet de codéveloppement précis (Casamance, Diourbel, etc.)\n• Don ponctuel pour une campagne particulière\n\nChaque contribution est tracée, transparente, et augmente votre score de patriote sur la plateforme.",
    followups: ["Voir les projets actifs", "Comment voir mes contributions ?"],
  },
  {
    keywords: ["talent", "talents", "emploi", "job", "offre", "recrutement", "travail"],
    answer:
      "La section Talents & Marchés (pilier ①) référence les opportunités d'emploi et de marchés pour les patriotes. Notre IA de matching analyse votre profil et vous propose les offres les plus pertinentes selon vos compétences, votre localisation et vos valeurs. Connectez-vous pour y accéder.",
    followups: ["Comment fonctionne le matching IA ?", "Publier une offre"],
  },
  {
    keywords: ["matching", "ia", "intelligence", "algorithm"],
    answer:
      "Notre IA croise sémantiquement votre CV (compétences, expériences, localisation) avec les offres publiées. Elle pondère plusieurs dimensions — technique, soft skills, secteur, affinité PASTEF — et vous classe les offres par score de pertinence. Le tout dans le respect strict de votre vie privée : vos données ne quittent jamais nos serveurs.",
    followups: ["Mes compétences sont-elles vues par les autres ?"],
  },
  {
    keywords: ["academie", "académie", "formation", "cours", "apprendre"],
    answer:
      "L'Académie (pilier ②) propose des modules de formation politique, civique et professionnelle, conçus par des cadres et universitaires patriotes. Chaque module se termine par un quiz et un certificat. Un tuteur IA est disponible 24/7 pour répondre à vos questions sur le contenu.",
    followups: ["Voir les modules disponibles", "Comment obtenir un certificat ?"],
  },
  {
    keywords: ["diaspora", "codev", "co-dev", "codéveloppement", "projet", "casamance"],
    answer:
      "Le Co-développement (pilier ③) connecte la diaspora aux projets de terroir. Vous voyez chaque projet (objectif, budget, porteur, ville), vous contribuez en quelques clics, et vous suivez l'avancement en temps réel. La diaspora a déjà financé 47 projets pour un total de 380M FCFA.",
    followups: ["Voir les projets actifs", "Soumettre un projet"],
  },
  {
    keywords: ["parti", "vie", "evenement", "événement", "section", "locale", "meeting"],
    answer:
      "Le pilier ④ Vie du Parti centralise les actualités, les consultations militantes, le calendrier des événements et la mémoire de nos martyrs. C'est aussi là que vous gérez votre engagement dans votre section locale.",
    followups: ["Prochains événements", "Ma section locale"],
  },
  {
    keywords: ["bonjour", "salut", "hello", "asalamou", "asalamu", "nanga def", "namu nga"],
    answer:
      "Asalamou aleykoum 🇸🇳 Je suis l'assistant IA de PASTEF. Je peux vous aider à comprendre le mouvement, rejoindre la plateforme, ou naviguer entre les piliers. Posez-moi votre question !",
    followups: STARTER_QUESTIONS.slice(0, 3),
  },
  {
    keywords: ["merci", "djerejef"],
    answer: "Djerejef ! 🙏 N'hésitez pas si vous avez d'autres questions. Bonne continuation patriote !",
  },
];

function findAnswer(question: string): { answer: string; followups?: string[] } {
  const q = question.toLowerCase();
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some((kw) => q.includes(kw))) {
      return { answer: entry.answer, followups: entry.followups };
    }
  }
  return {
    answer:
      "Hmm, je ne suis pas encore formé sur ce sujet précis. Mais je peux vous aider sur : l'adhésion, les 4 piliers, les contributions, les offres Talents, l'Académie, le codéveloppement diaspora et la vie du parti. Reformulez ou choisissez une suggestion ci-dessous.",
    followups: STARTER_QUESTIONS,
  };
}

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentFollowups, setCurrentFollowups] = useState<string[]>(STARTER_QUESTIONS);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      text: "Asalamou aleykoum 🇸🇳 Je suis l'assistant IA de PASTEF. Posez-moi votre question sur le mouvement, l'adhésion, ou nos 4 piliers.",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setCurrentFollowups([]);
    setIsTyping(true);

    const thinkingDelay = 600 + Math.random() * 600;
    setTimeout(() => {
      const { answer, followups } = findAnswer(text);
      const aiMsgId = `ai-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        { id: aiMsgId, role: "ai", text: "", streaming: true },
      ]);
      setIsTyping(false);

      let i = 0;
      const interval = setInterval(() => {
        i++;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? { ...m, text: answer.slice(0, i), streaming: i < answer.length }
              : m,
          ),
        );
        if (i >= answer.length) {
          clearInterval(interval);
          if (followups) setCurrentFollowups(followups);
        }
      }, 15);
    }, thinkingDelay);
  };

  return (
    <>
      {/* ═══ FAB AI — à gauche de WhatsApp ═══ */}
      <motion.button
        onClick={() => setOpen(!open)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.4, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed",
          bottom: 28,
          right: FAB_RIGHT,
          width: FAB_SIZE,
          height: FAB_SIZE,
          borderRadius: "50%",
          backgroundImage: `url(${PATTERN_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "grid",
          placeItems: "center",
          boxShadow: `0 8px 28px ${SN_GREEN}66`,
          zIndex: 99,
          cursor: "pointer",
          border: `2px solid ${SN_GREEN}`,
          padding: 0,
          overflow: "hidden",
        }}
        aria-label="Ouvrir l'assistant IA"
      >
        {/* Pulse ring vert */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: SN_GREEN,
            zIndex: -1,
          }}
        />

        {/* Disque central blanc translucide pour faire ressortir l'icône */}
        <div
          style={{
            position: "relative",
            width: FAB_SIZE * 0.58,
            height: FAB_SIZE * 0.58,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={SN_GREEN}>
            <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
            <circle cx="19" cy="5" r="1.3" />
            <circle cx="5" cy="19" r="1.3" />
          </svg>
        </div>
      </motion.button>

      {/* ═══ Panneau de chat ═══ */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              bottom: 100, // au-dessus des FAB
              right: 28,
              width: "min(380px, calc(100vw - 56px))",
              height: "min(560px, calc(100vh - 140px))",
              background: COLORS.blanc,
              borderRadius: 20,
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              fontFamily:
                "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            {/* ─── Header avec pattern + overlay sombre ─── */}
            <div
              style={{
                position: "relative",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#fff",
                backgroundImage: `url(${PATTERN_URL})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.55)",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.25)",
                    display: "grid",
                    placeItems: "center",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.4)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                    <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                    }}
                  >
                    Assistant PASTEF
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.95,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                    }}
                  >
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#22C55E",
                        display: "inline-block",
                        boxShadow: "0 0 6px #22C55E",
                      }}
                    />
                    IA propulsée • En ligne
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 16,
                    display: "grid",
                    placeItems: "center",
                  }}
                  aria-label="Fermer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ─── Zone messages ─── */}
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px 16px 8px",
                background: COLORS.creme,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ alignSelf: "flex-start", marginLeft: 4 }}
                >
                  <div
                    style={{
                      background: COLORS.blanc,
                      padding: "12px 16px",
                      borderRadius: "16px 16px 16px 4px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      display: "flex",
                      gap: 4,
                      alignItems: "center",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: SN_GREEN,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* ─── Suggestions ─── */}
            {currentFollowups.length > 0 && !isTyping && (
              <div
                style={{
                  padding: "8px 16px 12px",
                  background: COLORS.creme,
                  borderTop: `1px solid ${COLORS.ligne}`,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                {currentFollowups.map((q, idx) => (
                  <motion.button
                    key={q}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => sendMessage(q)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: COLORS.blanc,
                      border: `1px solid ${SN_GREEN}55`,
                      color: SN_GREEN,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            )}

            {/* ─── Input ─── */}
            <div
              style={{
                padding: 12,
                background: COLORS.blanc,
                borderTop: `1px solid ${COLORS.ligne}`,
                display: "flex",
                gap: 8,
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Écrire un message..."
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: `1px solid ${COLORS.ligne}`,
                  outline: "none",
                  fontSize: 14,
                  fontFamily: "inherit",
                  background: COLORS.creme,
                }}
              />
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: input.trim() && !isTyping ? SN_GREEN : COLORS.ligne,
                  border: "none",
                  cursor: input.trim() && !isTyping ? "pointer" : "not-allowed",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
                aria-label="Envoyer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              </motion.button>
            </div>

            {/* ─── Footer ─── */}
            <div
              style={{
                padding: "6px 12px 10px",
                background: COLORS.blanc,
                fontSize: 10,
                color: "#999",
                textAlign: "center",
              }}
            >
              Prototype IA · Les réponses peuvent contenir des imprécisions
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Bulle de message ───
function MessageBubble({ message }: { message: Message }) {
  const isAi = message.role === "ai";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        alignSelf: isAi ? "flex-start" : "flex-end",
        maxWidth: "85%",
      }}
    >
      <div
        style={{
          background: isAi ? COLORS.blanc : SN_GREEN,
          color: isAi ? COLORS.noir : "#fff",
          padding: "10px 14px",
          borderRadius: isAi ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
          fontSize: 14,
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
          boxShadow: isAi
            ? "0 2px 8px rgba(0,0,0,0.05)"
            : `0 4px 16px ${SN_GREEN}40`,
        }}
      >
        {message.text}
        {message.streaming && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{
              display: "inline-block",
              width: 2,
              height: 14,
              background: SN_GREEN,
              marginLeft: 2,
              verticalAlign: "middle",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}