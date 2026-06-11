import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { getUser, logout, type AuthUser } from "@/lib/auth";
import { COLORS } from "@/lib/constants/colors";
import { PILIERS } from "@/lib/data/piliers";

/**
 * ═══════════════════════════════════════════════════════════════
 *  LAYOUT DASHBOARD — /dashboard (protégé)
 * ═══════════════════════════════════════════════════════════════
 *
 *  CE FICHIER EST LE CADRE : top bar + sidebar + <Outlet />.
 *  Il ne contient JAMAIS le contenu des pages — c'est <Outlet />
 *  qui injecte la sous-page courante (index.tsx, talents.tsx, etc.).
 * ═══════════════════════════════════════════════════════════════
 */

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getUser()) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [{ title: "Dashboard — PASTEF" }],
  }),
  component: DashboardLayout,
});

// ─── Items du menu latéral ───
const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Vue d'ensemble",
    icon: "📊",
    color: COLORS.noir,
  },
  {
    to: "/dashboard/talents",
    label: "Talents & Marchés",
    icon: PILIERS[0].icon,
    color: PILIERS[0].color,
    tag: PILIERS[0].num,
  },
  {
    to: "/dashboard/academie",
    label: "Académie",
    icon: PILIERS[1].icon,
    color: PILIERS[1].color,
    tag: PILIERS[1].num,
  },
  {
    to: "/dashboard/codeveloppement",
    label: "Co-Dev & Diaspora",
    icon: PILIERS[2].icon,
    color: PILIERS[2].color,
    tag: PILIERS[2].num,
  },
  {
    to: "/dashboard/parti",
    label: "Vie du Parti",
    icon: PILIERS[3].icon,
    color: PILIERS[3].color,
    tag: PILIERS[3].num,
  },
] as const;

function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      navigate({ to: "/login" });
      return;
    }
    setUser(u);
  }, [navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.creme,
        color: COLORS.noir,
        fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
      }}
    >
      {/* ═══════════ TOP BAR ═══════════ */}
      <header
        style={{
          background: COLORS.blanc,
          borderBottom: `1px solid ${COLORS.ligne}`,
          padding: "14px 32px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: COLORS.noir,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: COLORS.vert,
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
              fontSize: 16,
            }}
          >
            P
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, lineHeight: 1 }}>
              PASTEF
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#888",
                letterSpacing: 2,
                fontWeight: 700,
                marginTop: 3,
              }}
            >
              DASHBOARD
            </div>
          </div>
        </Link>

        <div
          style={{
            flex: 1,
            maxWidth: 420,
            margin: "0 32px",
            background: COLORS.creme,
            borderRadius: 999,
            padding: "9px 18px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: `1px solid ${COLORS.ligne}`,
            fontSize: 13,
          }}
        >
          <span>🔍</span>
          <input
            placeholder="Rechercher..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 13,
              color: COLORS.noir,
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: COLORS.creme,
              border: `1px solid ${COLORS.ligne}`,
              cursor: "pointer",
              fontSize: 16,
              position: "relative",
            }}
            aria-label="Notifications"
          >
            🔔
            <span
              style={{
                position: "absolute",
                top: 6,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: COLORS.rouge,
              }}
            />
          </button>

          <div
            onClick={handleLogout}
            title="Cliquer pour se déconnecter"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "4px 12px 4px 4px",
              background: COLORS.creme,
              borderRadius: 999,
              border: `1px solid ${COLORS.ligne}`,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = COLORS.rouge;
              e.currentTarget.style.background = `${COLORS.rouge}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = COLORS.ligne;
              e.currentTarget.style.background = COLORS.creme;
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${COLORS.vert}, ${COLORS.rouge})`,
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
                fontSize: 12,
              }}
            >
              {user.avatar}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              {user.nom.split(" ")[0]}
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════ LAYOUT : SIDEBAR + CONTENU ═══════════ */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 67px)" }}>
        <aside
          className="dashboard-sidebar"
          style={{
            width: 260,
            flexShrink: 0,
            background: COLORS.blanc,
            borderRight: `1px solid ${COLORS.ligne}`,
            padding: "24px 16px",
            position: "sticky",
            top: 67,
            alignSelf: "flex-start",
            height: "calc(100vh - 67px)",
            overflowY: "auto",
          }}
        >
          {/* Profil patriote en tête */}
          <div
            style={{
              padding: "12px",
              marginBottom: 16,
              background: COLORS.creme,
              borderRadius: 12,
              border: `1px solid ${COLORS.ligne}`,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: COLORS.noir,
                marginBottom: 2,
              }}
            >
              {user.nom}
            </div>
            <div style={{ fontSize: 11, color: "#666", lineHeight: 1.3 }}>
              {user.fonction}
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 10,
                color: COLORS.vert,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              🏆 RANG #{user.rang}
            </div>
          </div>

          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 2,
              color: "#999",
              padding: "0 12px 12px",
            }}
          >
            MON ESPACE
          </div>

          <SidebarLink item={NAV_ITEMS[0]} />

          <div
            style={{
              margin: "16px 12px 12px",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 2,
              color: "#999",
            }}
          >
            LES 4 PILIERS
          </div>

          {NAV_ITEMS.slice(1).map((item) => (
            <SidebarLink key={item.to} item={item} />
          ))}

          <div
            style={{
              marginTop: 24,
              padding: "16px 12px 12px",
              borderTop: `1px solid ${COLORS.ligne}`,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Link
              to="/"
              style={{
                color: COLORS.vert,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              ← Retour au site
            </Link>

            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
                color: COLORS.rouge,
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                padding: 0,
                textAlign: "left",
                fontFamily: "inherit",
              }}
            >
              🚪 Se déconnecter
            </button>
          </div>
        </aside>

        {/* ─── ICI s'injecte le contenu de la sous-page courante ─── */}
        <main style={{ flex: 1, padding: "32px", minWidth: 0 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-sidebar {
            position: static !important;
            width: 100% !important;
            height: auto !important;
            border-right: none !important;
            border-bottom: 1px solid ${COLORS.ligne} !important;
          }
        }
      `}</style>
    </div>
  );
}

function SidebarLink({ item }: { item: (typeof NAV_ITEMS)[number] }) {
  return (
    <Link
      to={item.to}
      activeOptions={{ exact: item.to === "/dashboard" }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 10,
        textDecoration: "none",
        color: "#555",
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 4,
        transition: "all 0.2s",
      }}
      activeProps={{
        style: {
          background: `${item.color}15`,
          color: item.color,
          fontWeight: 800,
        },
      }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: `${item.color}15`,
          display: "grid",
          placeItems: "center",
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {item.icon}
      </span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {"tag" in item && item.tag && (
        <span
          style={{
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 1,
            color: item.color,
            background: `${item.color}22`,
            padding: "2px 6px",
            borderRadius: 4,
          }}
        >
          {item.tag}
        </span>
      )}
    </Link>
  );
}