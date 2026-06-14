import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";


import {
  AIChatbot,
  Actualites,
  Footer,
  Hero,
  Martyrs,
  Nav,
  Piliers,
  President,
  Valeurs,
  WhatsApp,
} from "@/components/sections";
import { UpcomingEvents } from "@/components/sections/UpcomingEvents";
import { COLORS } from "@/lib/constants/colors";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PASTEF — La souveraineté du Sénégal, par le mérite" },
      {
        name: "description",
        content:
          "Plateforme PASTEF propulsée par l'IA : structurer les talents, financer le développement local et unir la diaspora.",
      },
      { property: "og:title", content: "PASTEF — Souveraineté par le mérite" },
      {
        property: "og:description",
        content:
          "Travail · Éthique · Fraternité. 45K+ patriotes, 14 régions, 45+ pays diaspora.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onS);
    return () => window.removeEventListener("scroll", onS);
  }, []);

  return (
    <div
      style={{
        background: COLORS.blanc,
        color: COLORS.noir,
        fontFamily:
          "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #fff; }
        @keyframes scrollCarousel {
          from { transform: translateX(0) }
          to { transform: translateX(-50%) }
        }
        .carousel-track { animation: scrollCarousel 60s linear infinite; }
        .carousel-wrap:hover .carousel-track { animation-play-state: paused; }
        @media (max-width: 900px) {
          section[id="accueil"] > div > div { grid-template-columns: 1fr !important; }
          .president-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Nav scrolled={scrolled} />
      <Hero />
      <President />
      <Piliers />
      <Valeurs />
      <Martyrs />
      <Actualites />
      <UpcomingEvents />
      <Footer />
      <WhatsApp />
      <AIChatbot />  {/* ← AJOUTER */}
    </div>
  );
}