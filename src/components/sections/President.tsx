import { motion } from "framer-motion";

export function President() {
  return (
    <section
      id="president"
      style={{
        background: "#F8F8F8",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        padding: "60px 40px",
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          width: "100%",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* ========================= */}
        {/* TEXTE */}
        {/* ========================= */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "12px 30px",
              borderRadius: 999,
              border: "2px solid #0B7A44",
              color: "#0B7A44",
              fontWeight: 700,
              fontSize: 18,
              marginBottom: 40,
            }}
          >
            PASTEF
          </div>

          {/* Titre */}

          <h1
            style={{
              fontSize: "clamp(60px,6vw,95px)",
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-4px",
              marginBottom: 35,
              color: "#101828",
            }}
          >
            La voix d’une
            <br />

            <span
              style={{
                color: "#00853F",
              }}
            >
              génération
            </span>

            <br />

            <span
              style={{
                color: "#D21034",
              }}
            >
              debout.
            </span>
          </h1>

          {/* Texte */}

          <p
            style={{
              fontSize: 24,
              lineHeight: 1.6,
              color: "#1F2937",
              maxWidth: 650,
              marginBottom: 45,
            }}
          >
            Pour la{" "}
            <span
              style={{
                color: "#00853F",
                fontWeight: 800,
              }}
            >
              transparence
            </span>
            , le{" "}
            <span
              style={{
                color: "#F4B400",
                fontWeight: 800,
              }}
            >
              travail
            </span>
            <br />
            et la{" "}
            <span
              style={{
                color: "#D21034",
                fontWeight: 800,
              }}
            >
              dignité
            </span>
            . Ensemble, bâtissons
            <br />
            le Sénégal de justice et de prospérité.
          </p>

          {/* Bouton */}

          <button
            style={{
              background: "#007A3D",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "22px 36px",
              fontSize: 22,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 18,
              boxShadow: "0 15px 40px rgba(0,122,61,.25)",
            }}
          >
            REJOINDRE LE MOUVEMENT
            <span style={{ fontSize: 28 }}>→</span>
          </button>

          {/* Trait Sénégal */}

          <div
            style={{
              display: "flex",
              marginTop: 45,
            }}
          >
            <div
              style={{
                width: 75,
                height: 6,
                background: "#00853F",
                borderRadius: 999,
              }}
            />

            <div
              style={{
                width: 75,
                height: 6,
                background: "#F4B400",
              }}
            />

            <div
              style={{
                width: 75,
                height: 6,
                background: "#D21034",
                borderRadius: 999,
              }}
            />
          </div>
        </motion.div>

        {/* ========================= */}
        {/* PHOTO */}
        {/* ========================= */}

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <img
            src="/images/Sonko.png"
            alt="Ousmane Sonko"
            style={{
              width: "100%",
              maxWidth: 850,
              objectFit: "contain",
              display: "block",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}