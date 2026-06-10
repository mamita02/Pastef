import { Footer, Nav } from "@/components/sections";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { login } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [{ title: "Connexion Patriote — PASTEF" }],
  }),
});

const styles = `
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@1,500;1,600&display=swap");

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#root, #app, #__next {
  height: 100%;
}

.pastef-root {
  --pastef-green: #006B3F;
  --pastef-green-dark: #00532F;
  --pastef-green-soft: #E8F1EC;
  --pastef-yellow: #F4C400;
  --pastef-red: #E30613;
  --bg-card: #FFFFFF;
  --text-dark: #111111;
  --text-muted: #6B7280;
  --text-label: #374151;
  --border-soft: #E5E7EB;

  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--text-dark);
  -webkit-font-smoothing: antialiased;
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.pastef-root *, .pastef-root *::before, .pastef-root *::after { box-sizing: border-box; }

.pastef-main-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--bg-card);
  overflow: hidden;
  min-height: 100vh;
  width: 100%;
}

.pastef-hero {
  position: relative;
  background:
    linear-gradient(180deg, rgba(0,40,20,0.55) 0%, rgba(0,40,20,0.75) 100%),
    var(--hero-bg) center/cover no-repeat;
  padding: 48px 56px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}

.pastef-logo { display: flex; align-items: center; gap: 12px; }
.pastef-logo-mark {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 22px;
  color: var(--pastef-red);
  box-shadow: 0 0 0 3px var(--pastef-green), 0 0 0 5px var(--pastef-yellow);
}
.pastef-logo-text { line-height: 1.1; }
.pastef-logo-text strong { font-size: 26px; font-weight: 800; letter-spacing: 0.5px; display: block; }
.pastef-logo-text span { font-size: 12px; opacity: 0.9; font-weight: 400; }

.pastef-flag-bars { display: flex; gap: 8px; margin: 36px 0 24px; }
.pastef-flag-bars span { width: 36px; height: 4px; border-radius: 2px; }
.pastef-flag-bars span:nth-child(1) { background: var(--pastef-green); }
.pastef-flag-bars span:nth-child(2) { background: var(--pastef-yellow); }
.pastef-flag-bars span:nth-child(3) { background: var(--pastef-red); }

.pastef-hero-title {
  font-size: 44px; line-height: 1.1; font-weight: 700;
  letter-spacing: -1px; margin: 0 0 24px;
}
.pastef-hero-title .pastef-accent-y { color: var(--pastef-yellow); display: block; }
.pastef-yellow-rule { width: 60px; height: 3px; background: var(--pastef-yellow); margin-bottom: 20px; }
.pastef-hero-desc { font-size: 15px; line-height: 1.6; max-width: 360px; opacity: 0.92; margin: 0; }

.pastef-quote { position: relative; max-width: 440px; margin: 0; }
.pastef-quote-mark {
  font-family: 'Playfair Display', serif;
  font-size: 56px; font-weight: 600;
  color: var(--pastef-yellow);
  line-height: 0.6; display: block; margin-bottom: 12px;
}
.pastef-quote p {
  font-family: 'Playfair Display', serif;
  font-style: italic; font-size: 22px;
  line-height: 1.4; font-weight: 500; margin: 0 0 16px;
}
.pastef-quote-source { font-size: 11px; letter-spacing: 2px; font-weight: 600; opacity: 0.85; }
.pastef-quote-source::before { content: "— "; }

.pastef-form-side {
  padding: 36px 64px 48px;
  display: flex; flex-direction: column;
  justify-content: center;
  position: relative; background: #fff;
  overflow-y: auto;
}
.pastef-back-link {
  position: absolute;
  top: 36px; right: 64px;
  color: var(--pastef-green);
  text-decoration: none; font-weight: 600; font-size: 14px;
  display: inline-flex; align-items: center; gap: 6px;
  transition: opacity 0.15s ease;
}
.pastef-back-link:hover { opacity: 0.7; }

.pastef-form-header { text-align: center; }
.pastef-user-icon {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: var(--pastef-green-soft);
  display: inline-flex; align-items: center; justify-content: center;
  margin-bottom: 20px;
  color: var(--pastef-green);
}
.pastef-form-title { font-size: 36px; font-weight: 700; line-height: 1.1; margin: 0 0 14px; }
.pastef-form-title .pastef-accent-g { color: var(--pastef-green); display: block; }
.pastef-form-subtitle {
  color: var(--text-muted); font-size: 15px;
  line-height: 1.5; max-width: 340px; margin: 0 auto 36px;
}

.pastef-field { margin-bottom: 22px; }
.pastef-field-label {
  display: block; font-size: 11px; font-weight: 700;
  letter-spacing: 1.2px; color: var(--text-label); margin-bottom: 10px;
}

.pastef-input-wrap {
  display: flex; align-items: stretch;
  border: 1px solid var(--border-soft);
  border-radius: 10px; background: #fff; overflow: hidden;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.pastef-input-wrap:focus-within {
  border-color: var(--pastef-green);
  box-shadow: 0 0 0 3px rgba(0,107,63,0.08);
}
.pastef-input-prefix {
  background: var(--pastef-green-soft);
  color: var(--text-dark);
  padding: 14px 16px; font-size: 14px; font-weight: 500;
  display: flex; align-items: center; gap: 4px;
  border-right: 1px solid var(--border-soft);
}
.pastef-input-prefix small { color: var(--text-muted); font-weight: 400; }
.pastef-input-icon { display: flex; align-items: center; padding-left: 14px; color: var(--pastef-green); }
.pastef-input-wrap input {
  flex: 1; border: none; outline: none;
  padding: 14px 16px; font-size: 15px;
  font-family: inherit; background: transparent;
  color: var(--text-dark); width: 100%;
}
.pastef-input-wrap input::placeholder { color: #9CA3AF; }

.pastef-btn-primary {
  width: 100%;
  background: var(--pastef-green); color: #fff;
  border: none; padding: 16px 20px; border-radius: 10px;
  font-size: 15px; font-weight: 600; font-family: inherit;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  gap: 12px; position: relative;
  transition: background 0.15s ease, transform 0.05s ease;
  margin-top: 6px;
}
.pastef-btn-primary::before {
  content: ""; width: 28px; height: 28px;
  border-radius: 50%; background: rgba(0,0,0,0.25);
  position: absolute; left: 14px;
}
.pastef-btn-primary .pastef-lock {
  position: absolute; left: 22px; top: 50%;
  transform: translateY(-50%);
  width: 14px; height: 14px; color: #fff;
}
.pastef-btn-primary:hover:not(:disabled) { background: var(--pastef-green-dark); }
.pastef-btn-primary:active { transform: translateY(1px); }
.pastef-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

.pastef-divider {
  display: flex; align-items: center; gap: 14px;
  margin: 26px 0; color: var(--text-muted);
  font-size: 12px; font-weight: 600; letter-spacing: 1.5px;
}
.pastef-divider::before, .pastef-divider::after {
  content: ""; flex: 1; height: 1px; background: var(--border-soft);
}

.pastef-qr-card {
  border: 1px solid var(--pastef-green-soft);
  background: #FAFCFB; border-radius: 12px;
  padding: 18px 20px;
  display: flex; align-items: center; gap: 16px;
}
.pastef-qr-icon { width: 42px; height: 42px; color: var(--pastef-green); flex-shrink: 0; }
.pastef-qr-text { flex: 1; line-height: 1.35; }
.pastef-qr-text strong {
  display: block; color: var(--pastef-green);
  font-weight: 700; font-size: 15px; margin-bottom: 2px;
}
.pastef-qr-text span { font-size: 13px; color: var(--text-muted); }
.pastef-btn-outline {
  background: transparent; color: var(--pastef-green);
  border: 1.5px solid var(--pastef-green);
  padding: 10px 18px; border-radius: 8px;
  font-size: 14px; font-weight: 600; cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease, color 0.15s ease;
}
.pastef-btn-outline:hover { background: var(--pastef-green); color: #fff; }

.pastef-form-footer { text-align: center; margin-top: 30px; font-size: 14px; color: var(--text-muted); }
.pastef-form-footer a { color: var(--pastef-green); font-weight: 700; text-decoration: none; }
.pastef-form-footer a:hover { text-decoration: underline; }

/* ═══════════════════════════════════════════════════════════
   SECTION AVANTAGES
   ═══════════════════════════════════════════════════════════ */

.pastef-benefits {
  background: #FAFAF7;
  padding: 100px 48px;
  position: relative;
  overflow: hidden;
}
.pastef-benefits::before {
  content: "";
  position: absolute;
  top: -120px; right: -120px;
  width: 400px; height: 400px;
  border-radius: 50%;
  background: rgba(0,107,63,0.04);
  filter: blur(80px);
}

.pastef-benefits-inner {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.pastef-benefits-header {
  text-align: center;
  margin-bottom: 72px;
}
.pastef-benefits-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 999px;
  background: var(--pastef-green-soft);
  color: var(--pastef-green);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
  margin-bottom: 24px;
}
.pastef-benefits-title {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1.5px;
  margin: 0 0 18px;
  color: var(--text-dark);
}
.pastef-benefits-title em {
  font-style: normal;
  color: var(--pastef-green);
}
.pastef-benefits-subtitle {
  max-width: 580px;
  margin: 0 auto;
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-muted);
}

.pastef-benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 72px;
}

.pastef-benefit-card {
  background: #fff;
  border-radius: 20px;
  padding: 36px 30px;
  border: 1px solid #F0F0EC;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}
.pastef-benefit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.06);
}
.pastef-benefit-card::after {
  content: "";
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 3px;
}
.pastef-benefit-card:nth-child(1)::after,
.pastef-benefit-card:nth-child(4)::after { background: var(--pastef-green); }
.pastef-benefit-card:nth-child(2)::after,
.pastef-benefit-card:nth-child(5)::after { background: var(--pastef-yellow); }
.pastef-benefit-card:nth-child(3)::after,
.pastef-benefit-card:nth-child(6)::after { background: var(--pastef-red); }

.pastef-benefit-icon {
  width: 56px; height: 56px;
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  font-size: 26px;
  margin-bottom: 22px;
}
.pastef-benefit-card:nth-child(1) .pastef-benefit-icon,
.pastef-benefit-card:nth-child(4) .pastef-benefit-icon {
  background: rgba(0,107,63,0.1);
}
.pastef-benefit-card:nth-child(2) .pastef-benefit-icon,
.pastef-benefit-card:nth-child(5) .pastef-benefit-icon {
  background: rgba(244,196,0,0.15);
}
.pastef-benefit-card:nth-child(3) .pastef-benefit-icon,
.pastef-benefit-card:nth-child(6) .pastef-benefit-icon {
  background: rgba(227,6,19,0.1);
}

.pastef-benefit-card h3 {
  font-size: 18px;
  font-weight: 800;
  margin: 0 0 10px;
  color: var(--text-dark);
  letter-spacing: -0.3px;
}
.pastef-benefit-card p {
  font-size: 14px;
  line-height: 1.65;
  color: var(--text-muted);
  margin: 0;
}

/* ── Bannière CTA ── */
.pastef-benefits-cta {
  background: var(--pastef-green);
  border-radius: 20px;
  padding: 48px 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  color: #fff;
  position: relative;
  overflow: hidden;
}
.pastef-benefits-cta::before {
  content: "";
  position: absolute;
  top: -60px; right: -60px;
  width: 200px; height: 200px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
}
.pastef-benefits-cta::after {
  content: "";
  position: absolute;
  bottom: -40px; left: 30%;
  width: 160px; height: 160px;
  border-radius: 50%;
  background: rgba(255,255,255,0.04);
}
.pastef-benefits-cta-text {
  position: relative; z-index: 1;
}
.pastef-benefits-cta-text h3 {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
}
.pastef-benefits-cta-text p {
  margin: 0;
  font-size: 15px;
  opacity: 0.85;
  line-height: 1.5;
}
.pastef-benefits-cta-btn {
  position: relative; z-index: 1;
  background: #fff;
  color: var(--pastef-green);
  border: none;
  padding: 16px 36px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.pastef-benefits-cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

@media (max-width: 980px) {
  .pastef-main-card { grid-template-columns: 1fr; }
  .pastef-hero { min-height: 480px; padding: 36px 32px; }
  .pastef-form-side { padding: 32px 28px 40px; }
  .pastef-back-link { top: 32px; right: 28px; }
  .pastef-hero-title { font-size: 34px; }
  .pastef-benefits-grid { grid-template-columns: repeat(2, 1fr); }
  .pastef-benefits { padding: 72px 28px; }
  .pastef-benefits-cta { flex-direction: column; text-align: center; padding: 36px 28px; }
}
@media (max-width: 600px) {
  .pastef-benefits-grid { grid-template-columns: 1fr; }
  .pastef-benefits-title { font-size: 30px; }
  .pastef-form-title { font-size: 28px; }
}
`;

const AVANTAGES = [
  {
    icon: "📊",
    titre: "Tableau de bord personnel",
    desc: "Suis ton engagement en temps réel : points patriote, rang national, contributions financières et badges obtenus.",
  },
  {
    icon: "🎓",
    titre: "Académie PASTEF",
    desc: "Accède à des formations exclusives sur la souveraineté économique, la gouvernance locale et le leadership citoyen.",
  },
  {
    icon: "💰",
    titre: "Co-développement",
    desc: "Contribue directement aux projets territoriaux de ta région et suis l'impact de chaque franc investi.",
  },
  {
    icon: "🏆",
    titre: "Classement & Mérite",
    desc: "Grimpe dans le classement national grâce à ton engagement. Les patriotes les plus actifs sont mis en avant.",
  },
  {
    icon: "🤝",
    titre: "Réseau des talents",
    desc: "Connecte-toi avec les patriotes de ta région et de la diaspora. Propose tes compétences pour les projets du parti.",
  },
  {
    icon: "📅",
    titre: "Événements & Congrès",
    desc: "Sois informé en priorité des rencontres, congrès et activités. Inscris-toi directement depuis ton espace.",
  },
];

function LoginPage() {
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onS);
    return () => window.removeEventListener("scroll", onS);
  }, []);

 const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const user = login(phone, cardNumber);

      if (user) {
        window.location.href = "/dashboard";
      } else {
        alert("Numéro ou carte membre invalide.");
      }

      setLoading(false);
    }, 600);
  };

  const handleScan = () => {
    alert("Ouverture du scanner QR…");
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="pastef-root">
        {/* ═══ NAVBAR ═══ */}
        <Nav scrolled={scrolled} />

        {/* ═══ SECTION CONNEXION ═══ */}
        <div className="pastef-main-card">
          <section className="pastef-hero" style={{ "--hero-bg": "url('/images/carte.png')" } as React.CSSProperties}>
            <div>
              <div className="pastef-logo">
                <div className="pastef-logo-mark">P</div>
                <div className="pastef-logo-text">
                  <strong>PASTEF</strong>
                  <span>Patriotes du Sénégal</span>
                </div>
              </div>
              <div className="pastef-flag-bars">
                <span />
                <span />
                <span />
              </div>
              <h1 className="pastef-hero-title">
                Ton engagement,
                <span className="pastef-accent-y">notre avenir.</span>
              </h1>
              <div className="pastef-yellow-rule" />
              <p className="pastef-hero-desc">
                Connecte-toi à ton espace pour suivre ton engagement,
                contribuer aux projets territoriaux et participer à la vie du parti.
              </p>
            </div>
            <blockquote className="pastef-quote">
              <span className="pastef-quote-mark">&ldquo;</span>
              <p>
                Organiser la souveraineté.
                <br />
                Transformer l&apos;État.
                <br />
                Servir le peuple.
              </p>
              <div className="pastef-quote-source">PREMIER CONGRÈS DE DIAMNIADIO</div>
            </blockquote>
          </section>

          <section className="pastef-form-side">
            <a href="/" className="pastef-back-link">← Retour au site</a>
            <div className="pastef-form-header">
              <div className="pastef-user-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h2 className="pastef-form-title">
                Connexion
                <span className="pastef-accent-g">patriote</span>
              </h2>
              <p className="pastef-form-subtitle">
                Entre ton numéro et ta carte membre pour accéder à ton espace.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="pastef-field">
                <label className="pastef-field-label" htmlFor="phone">NUMÉRO DE TÉLÉPHONE</label>
                <div className="pastef-input-wrap">
                  <div className="pastef-input-prefix">
                    <small>SN</small> <strong>+221</strong>
                  </div>
                  <input type="tel" id="phone" placeholder="77 123 45 67" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
              </div>

              <div className="pastef-field">
                <label className="pastef-field-label" htmlFor="card">NUMÉRO DE CARTE MEMBRE</label>
                <div className="pastef-input-wrap">
                  <div className="pastef-input-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <input type="text" id="card" placeholder="PASTEF-YYYY-XXXXXX" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
                </div>
              </div>

              <button type="submit" className="pastef-btn-primary" disabled={loading}>
                <svg className="pastef-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                {loading ? "Connexion…" : "Se connecter →"}
              </button>
            </form>

            <div className="pastef-divider">OU</div>

            <div className="pastef-qr-card">
              <svg className="pastef-qr-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <line x1="14" y1="14" x2="14" y2="17" />
                <line x1="17" y1="14" x2="21" y2="14" />
                <line x1="14" y1="20" x2="21" y2="20" />
                <line x1="20" y1="17" x2="20" y2="20" />
              </svg>
              <div className="pastef-qr-text">
                <strong>Connexion rapide</strong>
                <span>Scanne le QR code de ta carte membre</span>
              </div>
              <button type="button" className="pastef-btn-outline" onClick={handleScan}>Scanner</button>
            </div>

            <div className="pastef-form-footer">
              Pas encore membre ? <a href="/register">Rejoindre PASTEF</a>
            </div>
          </section>
        </div>

        {/* ═══ SECTION AVANTAGES ═══ */}
        <section className="pastef-benefits">
          <div className="pastef-benefits-inner">
            <div className="pastef-benefits-header">
              <div className="pastef-benefits-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                Avantages de la carte membre
              </div>
              <h2 className="pastef-benefits-title">
                Ta carte, ton accès à<br />
                <em>tout l&apos;écosystème PASTEF</em>
              </h2>
              <p className="pastef-benefits-subtitle">
                Avec ta carte membre et ton tableau de bord, tu ne fais pas que soutenir
                — tu participes activement à la construction du Sénégal de demain.
              </p>
            </div>

            <div className="pastef-benefits-grid">
              {AVANTAGES.map((a) => (
                <div key={a.titre} className="pastef-benefit-card">
                  <div className="pastef-benefit-icon">{a.icon}</div>
                  <h3>{a.titre}</h3>
                  <p>{a.desc}</p>
                </div>
              ))}
            </div>

            <div className="pastef-benefits-cta">
              <div className="pastef-benefits-cta-text">
                <h3>Tu n&apos;as pas encore ta carte ?</h3>
                <p>Rejoins les 25 000+ patriotes qui construisent le Sénégal de demain.</p>
              </div>
              <button
                className="pastef-benefits-cta-btn"
                onClick={() => { window.location.href = "/register"; }}
              >
                Devenir membre →
              </button>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <Footer />
      </div>
    </>
  );
}