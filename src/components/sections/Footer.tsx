import { COLORS } from "@/lib/constants/colors";

/**
 * ═══════════════════════════════════════════════════════════════
 *  Footer — Pied de page du site
 * ═══════════════════════════════════════════════════════════════
 *
 *  Layout 4 colonnes :
 *   1. Logo + baseline
 *   2. Liens des 4 piliers
 *   3. Liens du parti (Vision, Valeurs, Martyrs, Contact)
 *   4. Coordonnées (email, téléphone, adresse)
 *
 *  Barre inférieure : copyright + crédit conception.
 *
 *  Note : les listes de liens sont actuellement statiques —
 *  à terme on les sortira dans `@/lib/data/navigation.ts`
 *  pour les partager avec d'autres composants (sitemap, etc.).
 * ═══════════════════════════════════════════════════════════════
 */

export function Footer() {
  // Liste des 4 piliers (libellés courts pour le footer)
  const PILIERS_LINKS = [
    "Talents & Marchés",
    "Académie & Innovation",
    "Co-Dev & Diaspora",
    "Vie du Parti",
  ];

  // Liens institutionnels
  const PARTI_LINKS = ["Notre Vision", "Nos Valeurs", "Mémoire des Martyrs", "Contact"];

  return (
    <footer
      style={{
        background: COLORS.noir,
        padding: "60px 32px 40px",
        color: "rgba(255,255,255,0.7)",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40,
          marginBottom: 40,
        }}
      >
        {/* ═══ Col 1 — Branding ═══ */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${COLORS.vert}, ${COLORS.rouge})`,
                display: "grid",
                placeItems: "center",
                color: "#fff",
                fontWeight: 900,
              }}
            >
              P
            </div>
            <div style={{ color: "#fff", fontWeight: 900 }}>PASTEF</div>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>
            Patriotes Africains du Sénégal pour le Travail, l'Éthique et la
            Fraternité.
          </p>
        </div>

        {/* ═══ Col 2 — Les 4 piliers ═══ */}
        <div>
          <h4
            style={{
              color: "#fff",
              fontSize: 13,
              marginBottom: 14,
              letterSpacing: 2,
            }}
          >
            LES 4 PILIERS
          </h4>
          {PILIERS_LINKS.map((l) => (
            <div
              key={l}
              style={{ fontSize: 13, padding: "5px 0", cursor: "pointer" }}
            >
              {l}
            </div>
          ))}
        </div>

        {/* ═══ Col 3 — Le parti ═══ */}
        <div>
          <h4
            style={{
              color: "#fff",
              fontSize: 13,
              marginBottom: 14,
              letterSpacing: 2,
            }}
          >
            LE PARTI
          </h4>
          {PARTI_LINKS.map((l) => (
            <div
              key={l}
              style={{ fontSize: 13, padding: "5px 0", cursor: "pointer" }}
            >
              {l}
            </div>
          ))}
        </div>

        {/* ═══ Col 4 — Contact ═══ */}
        <div>
          <h4
            style={{
              color: "#fff",
              fontSize: 13,
              marginBottom: 14,
              letterSpacing: 2,
            }}
          >
            CONTACT
          </h4>
          <div style={{ fontSize: 13, padding: "5px 0" }}>
            📧 contact@pastef.sn
          </div>
          <div style={{ fontSize: 13, padding: "5px 0" }}>
            📞 +221 77 000 00 00
          </div>
          <div style={{ fontSize: 13, padding: "5px 0" }}>📍 Dakar, Sénégal</div>
        </div>
      </div>

      {/* ═══ Barre inférieure ═══ */}
      <div
        style={{
          paddingTop: 28,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          fontSize: 12,
        }}
      >
        <div>© 2026 Plateforme Numérique PASTEF. Tous droits réservés.</div>
        <div>Conçue par Mame Fatou Wade — Ingénieure IA & Big Data</div>
      </div>
    </footer>
  );
}
