import { AnimatePresence, motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useRef, useState } from "react";

import { COLORS } from "@/lib/constants/colors";
import { COMMUNES, generateCellules } from "@/lib/data/communesData";
import {
    DIASPORA_DATA,
    REGION_DATA,
    chorColor,
    chorStatus,
    type DiasporaInfo,
    type RegionInfo,
} from "@/lib/data/regionsData";
import { SENEGAL_GEOJSON, normName } from "@/lib/data/senegalGeoJSON";

/* ═══════════════════════════════════════════════════════════
   Types pour le panneau de détails
   ═══════════════════════════════════════════════════════════ */

type DetailType = "region" | "diaspora" | "commune";

interface DetailData {
  type: DetailType;
  nom: string;
  sousTitre: string;
  membres: number;
  cellules: number;
  coordinateur: { nom: string; telephone: string; profession: string };
  cartesVendues: number;
  braceletsVendus: number;
  cotisationTaux: number;
  nouveauxMois: number;
  projetsActifs: number;
  engagement?: number;
}

/* ═══════════════════════════════════════════════════════════
   Seuils de zoom
   ═══════════════════════════════════════════════════════════ */

const ZOOM = {
  WORLD: 6,
  COMMUNE: 9,
  CELLULE: 10,
} as const;

/* ═══════════════════════════════════════════════════════════
   Composant principal
   ═══════════════════════════════════════════════════════════ */

interface PresenceMapProps {
  height?: number;
}

export default function PresenceMap({ height = 480 }: PresenceMapProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [detail, setDetail] = useState<DetailData | null>(null);

  const openDetail = useCallback((d: DetailData) => setDetail(d), []);
  const closeDetail = useCallback(() => setDetail(null), []);

  useEffect(() => {
    if (mapRef.current || !elRef.current) return;

    const map = L.map(elRef.current, {
      zoomControl: false,
      attributionControl: false,
      minZoom: 2,
      maxZoom: 14,
      worldCopyJump: true,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      { maxZoom: 14, subdomains: "abcd" },
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapRef.current = map;

    /* ─── Layer RÉGIONS ─── */
    const regionLayer = L.geoJSON(
      SENEGAL_GEOJSON as unknown as GeoJSON.GeoJsonObject,
      {
        style: (f) => {
          const nm = normName(f?.properties?.NAME_1 ?? "");
          const d = REGION_DATA[nm];
          return {
            fillColor: chorColor(d?.taux ?? 50),
            weight: 2,
            color: "#fff",
            fillOpacity: 0.8,
            opacity: 1,
          };
        },
        onEachFeature: (f, layer) => {
          const nm = normName(f.properties?.NAME_1 ?? "");
          const d = REGION_DATA[nm];
          if (!d) return;

          layer.bindTooltip(
            `<b>${nm}</b><br/>Engagement : ${d.taux}% · ${chorStatus(d.taux)}<br/>Membres : ${d.membres.toLocaleString("fr-FR")}<br/>Cellules : ${d.cellules}`,
            { sticky: true, className: "pmap-tip" },
          );

          layer.on("mouseover", () =>
            (layer as L.Path).setStyle({ weight: 3, fillOpacity: 0.92 }),
          );
          layer.on("mouseout", () => regionLayer.resetStyle(layer));
          layer.on("click", () => {
            map.flyToBounds((layer as L.Polygon).getBounds(), {
              padding: [30, 30],
              maxZoom: 8,
            });
            openDetail(regionToDetail(nm, d));
          });
        },
      },
    );

    /* ─── Layer DIASPORA ─── */
    const diasporaLayer = L.layerGroup();
    DIASPORA_DATA.forEach((d) => {
      const size = Math.max(16, Math.min(40, Math.sqrt(d.membres) / 5));
      const icon = L.divIcon({
        className: "",
        html: `<div class="pmap-diaspora ${d.big ? "big" : ""}" style="width:${size}px;height:${size}px"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
      L.marker([d.lat, d.lng], { icon })
        .bindTooltip(
          `<b>${d.ville}, ${d.pays}</b><br/>🇸🇳 ${d.membres.toLocaleString("fr-FR")} patriotes`,
          { sticky: true, className: "pmap-tip" },
        )
        .on("click", () => {
          map.flyTo([d.lat, d.lng], Math.max(map.getZoom(), 5), {
            duration: 1,
          });
          openDetail(diasporaToDetail(d));
        })
        .addTo(diasporaLayer);
    });

    /* ─── Layer COMMUNES ─── */
    const communeLayer = L.layerGroup();
    COMMUNES.forEach((c) => {
      const icon = L.divIcon({
        className: "",
        html: `<div class="pmap-commune">
                 <div class="pmap-commune-badge">${c.cellules}</div>
                 <div class="pmap-commune-label">${c.name}</div>
               </div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });
      L.marker([c.lat, c.lng], { icon })
        .bindTooltip(
          `<b>${c.name}</b><br/>🏛️ ${c.cellules} cellules · ${c.membres.toLocaleString("fr-FR")} patriotes`,
          { sticky: true, className: "pmap-tip" },
        )
        .on("click", () => {
          map.flyTo([c.lat, c.lng], 11, { duration: 1 });
          const r = REGION_DATA[c.region];
          if (r) {
            openDetail({
              type: "commune",
              nom: c.name,
              sousTitre: `Commune — Région de ${c.region}`,
              membres: c.membres,
              cellules: c.cellules,
              coordinateur: r.coordinateur,
              cartesVendues: Math.round(
                r.cartesVendues * (c.membres / r.membres),
              ),
              braceletsVendus: Math.round(
                r.braceletsVendus * (c.membres / r.membres),
              ),
              cotisationTaux: r.cotisationTaux,
              nouveauxMois: Math.round(
                r.nouveauxMois * (c.membres / r.membres),
              ),
              projetsActifs: Math.max(
                1,
                Math.round(r.projetsActifs * (c.membres / r.membres)),
              ),
              engagement: r.taux,
            });
          }
        })
        .addTo(communeLayer);
    });

    /* ─── Layer CELLULES ─── */
    const celluleLayer = L.layerGroup();
    COMMUNES.forEach((c) => {
      generateCellules(c).forEach((cell) => {
        L.circleMarker([cell.lat, cell.lng], {
          radius: 5,
          fillColor: COLORS.rouge,
          color: "#fff",
          weight: 1.5,
          fillOpacity: 0.9,
        })
          .bindTooltip(
            `<b>Cellule ${cell.id}</b><br/>👥 ${cell.membres} patriotes`,
            { sticky: true, className: "pmap-tip" },
          )
          .addTo(celluleLayer);
      });
    });

    /* ─── Gestion du zoom ─── */
    function updateLayers() {
      const z = map.getZoom();
      if (z < ZOOM.CELLULE) {
        if (!map.hasLayer(regionLayer)) regionLayer.addTo(map);
        regionLayer.setStyle({ fillOpacity: z <= ZOOM.WORLD ? 0.8 : 0.35 });
      } else if (map.hasLayer(regionLayer)) {
        regionLayer.setStyle({ fillOpacity: 0.15 });
      }
      if (z <= ZOOM.WORLD) {
        if (!map.hasLayer(diasporaLayer)) diasporaLayer.addTo(map);
      } else if (map.hasLayer(diasporaLayer)) {
        map.removeLayer(diasporaLayer);
      }
      if (z > ZOOM.WORLD && z < ZOOM.CELLULE) {
        if (!map.hasLayer(communeLayer)) communeLayer.addTo(map);
      } else if (map.hasLayer(communeLayer)) {
        map.removeLayer(communeLayer);
      }
      if (z >= ZOOM.CELLULE) {
        if (!map.hasLayer(celluleLayer)) celluleLayer.addTo(map);
      } else if (map.hasLayer(celluleLayer)) {
        map.removeLayer(celluleLayer);
      }
    }

    map.on("zoomend", updateLayers);
    map.fitBounds(regionLayer.getBounds(), { padding: [20, 20] });
    updateLayers();

    return () => {
      map.off("zoomend", updateLayers);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* Carte */}
      <div
        ref={elRef}
        style={{
          width: "100%",
          height,
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
          zIndex: 0,
        }}
      />

      {/* Hint zoom */}
      <div className="pmap-hint">
        🔍 Zoomez : Régions → Communes → Cellules
      </div>

      {/* Panneau de détails — glisse depuis la droite */}
      <AnimatePresence>
        {detail && (
          <DetailPanel detail={detail} onClose={closeDetail} mapHeight={height} />
        )}
      </AnimatePresence>

      {/* Légende */}
      <div
        style={{
          display: "flex",
          gap: 14,
          justifyContent: "center",
          flexWrap: "wrap",
          padding: "12px 0 0",
        }}
      >
        {[
          { color: "#1B7F3E", label: "Forte activité (≥70%)" },
          { color: "#D4900A", label: "Activité moyenne (55-69%)" },
          { color: "#C61C3E", label: "À développer (<55%)" },
          { color: "#D4900A", label: "Diaspora", border: true },
        ].map((l, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "#666",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: l.border ? "50%" : 3,
                background: l.color,
                opacity: 0.85,
                border: l.border ? "2px solid #fff" : "none",
                boxShadow: l.border ? `0 0 6px ${l.color}60` : "none",
              }}
            />
            {l.label}
          </div>
        ))}
      </div>

      <MapStyles />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Panneau de détails (slide-in)
   ═══════════════════════════════════════════════════════════ */

function DetailPanel({
  detail,
  onClose,
  mapHeight,
}: {
  detail: DetailData;
  onClose: () => void;
  mapHeight: number;
}) {
  const typeIcon =
    detail.type === "diaspora"
      ? "🌍"
      : detail.type === "commune"
        ? "🏘️"
        : "🗺️";
  const engColor =
    (detail.engagement ?? 0) >= 70
      ? COLORS.vert
      : (detail.engagement ?? 0) >= 55
        ? "#D4900A"
        : COLORS.rouge;

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 340,
        maxWidth: "85%",
        height: mapHeight,
        background: "#fff",
        borderRadius: "0 16px 16px 0",
        borderLeft: `3px solid ${COLORS.vert}`,
        boxShadow: "-8px 0 32px rgba(0,0,0,0.15)",
        zIndex: 500,
        overflow: "auto",
        fontFamily: "'Outfit', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 18px 12px",
          borderBottom: `1px solid ${COLORS.ligne}`,
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 1.5,
                color: "#999",
                marginBottom: 4,
              }}
            >
              {typeIcon}{" "}
              {detail.type === "region"
                ? "RÉGION"
                : detail.type === "diaspora"
                  ? "DIASPORA"
                  : "COMMUNE"}
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 900,
                margin: 0,
                color: COLORS.noir,
              }}
            >
              {detail.nom}
            </h3>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
              {detail.sousTitre}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: `1px solid ${COLORS.ligne}`,
              background: "#fff",
              cursor: "pointer",
              fontSize: 14,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>
      </div>

      <div style={{ padding: "14px 18px 18px" }}>
        {/* Stats principales (2x2) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <StatBox
            icon="👥"
            value={detail.membres.toLocaleString("fr-FR")}
            label="Patriotes"
            color={COLORS.vert}
          />
          <StatBox
            icon="🏛️"
            value={detail.cellules.toString()}
            label="Cellules"
            color="#2563EB"
          />
          <StatBox
            icon="🪪"
            value={detail.cartesVendues.toLocaleString("fr-FR")}
            label="Cartes vendues"
            color="#7C3AED"
          />
          <StatBox
            icon="📿"
            value={detail.braceletsVendus.toLocaleString("fr-FR")}
            label="Bracelets vendus"
            color="#D97706"
          />
        </div>

        {/* Engagement (si région) */}
        {detail.engagement !== undefined && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: `${engColor}08`,
              border: `1px solid ${engColor}20`,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>
                Engagement
              </span>
              <span
                style={{ fontSize: 18, fontWeight: 900, color: engColor }}
              >
                {detail.engagement}%
              </span>
            </div>
            <div
              style={{
                height: 6,
                background: COLORS.ligne,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${detail.engagement}%`,
                  background: engColor,
                  borderRadius: 3,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* Indicateurs secondaires */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <MiniTag
            icon="💳"
            label={`Cotisation : ${detail.cotisationTaux}%`}
            color={detail.cotisationTaux >= 70 ? COLORS.vert : "#D97706"}
          />
          <MiniTag
            icon="📈"
            label={`+${detail.nouveauxMois} ce mois`}
            color="#2563EB"
          />
          <MiniTag
            icon="📋"
            label={`${detail.projetsActifs} projets actifs`}
            color="#7C3AED"
          />
        </div>

        {/* Coordinateur */}
        <div
          style={{
            padding: "14px 16px",
            borderRadius: 12,
            background: COLORS.creme,
            border: `1px solid ${COLORS.ligne}`,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1.5,
              color: "#999",
              marginBottom: 10,
            }}
          >
            👤 COORDINATEUR
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${COLORS.vert}, ${COLORS.rouge})`,
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {detail.coordinateur.nom
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: COLORS.noir,
                }}
              >
                {detail.coordinateur.nom}
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>
                {detail.coordinateur.profession}
              </div>
            </div>
          </div>
          <a
            href={`tel:${detail.coordinateur.telephone.replace(/\s/g, "")}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 10,
              background: COLORS.vert,
              color: "#fff",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: 13,
              justifyContent: "center",
            }}
          >
            📞 {detail.coordinateur.telephone}
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Petits composants utilitaires
   ═══════════════════════════════════════════════════════════ */

function StatBox({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        background: `${color}08`,
        border: `1px solid ${color}18`,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 14 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 900, color, marginTop: 2 }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: "#888", fontWeight: 600 }}>
        {label}
      </div>
    </div>
  );
}

function MiniTag({
  icon,
  label,
  color,
}: {
  icon: string;
  label: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 10px",
        borderRadius: 8,
        background: `${color}10`,
        fontSize: 11,
        fontWeight: 700,
        color,
      }}
    >
      {icon} {label}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Helpers de conversion data → DetailData
   ═══════════════════════════════════════════════════════════ */

function regionToDetail(nom: string, d: RegionInfo): DetailData {
  return {
    type: "region",
    nom,
    sousTitre: `Région du Sénégal`,
    membres: d.membres,
    cellules: d.cellules,
    coordinateur: d.coordinateur,
    cartesVendues: d.cartesVendues,
    braceletsVendus: d.braceletsVendus,
    cotisationTaux: d.cotisationTaux,
    nouveauxMois: d.nouveauxMois,
    projetsActifs: d.projetsActifs,
    engagement: d.taux,
  };
}

function diasporaToDetail(d: DiasporaInfo): DetailData {
  return {
    type: "diaspora",
    nom: `${d.ville}, ${d.pays}`,
    sousTitre: `Communauté diaspora`,
    membres: d.membres,
    cellules: d.cellules,
    coordinateur: d.coordinateur,
    cartesVendues: d.cartesVendues,
    braceletsVendus: d.braceletsVendus,
    cotisationTaux: d.cotisationTaux,
    nouveauxMois: d.nouveauxMois,
    projetsActifs: d.projetsActifs,
  };
}

/* ═══════════════════════════════════════════════════════════
   Styles (injectés)
   ═══════════════════════════════════════════════════════════ */

function MapStyles() {
  return (
    <style>{`
      .pmap-tip {
        background: rgba(17,17,17,0.94) !important;
        border: none !important;
        color: #fff !important;
        font-family: 'Outfit', system-ui, sans-serif !important;
        font-size: 12px !important;
        line-height: 1.5 !important;
        padding: 8px 12px !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.25) !important;
        font-weight: 500 !important;
      }
      .pmap-tip::before, .pmap-tip::after { display: none !important; }
      .pmap-tip b { font-weight: 700; }

      .pmap-hint {
        position: absolute;
        top: 14px;
        left: 14px;
        z-index: 401;
        background: rgba(17,17,17,0.85);
        color: #fff;
        backdrop-filter: blur(8px);
        padding: 8px 14px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        font-family: 'Outfit', system-ui, sans-serif;
        pointer-events: none;
      }

      .pmap-diaspora {
        background: radial-gradient(circle, rgba(212,144,10,0.95) 0%, rgba(212,144,10,0.4) 70%, transparent 100%);
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 12px rgba(212,144,10,0.6), 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      }
      .pmap-diaspora.big { animation: pmapPulse 2.5s infinite; }
      @keyframes pmapPulse {
        0%,100% { box-shadow: 0 0 12px rgba(212,144,10,0.6), 0 0 0 0 rgba(212,144,10,0.5); }
        50% { box-shadow: 0 0 18px rgba(212,144,10,0.8), 0 0 0 12px rgba(212,144,10,0); }
      }

      .pmap-commune { display: flex; flex-direction: column; align-items: center; cursor: pointer; }
      .pmap-commune-badge {
        width: 36px; height: 36px; border-radius: 50%;
        background: linear-gradient(135deg, ${COLORS.vert}, #145F2E);
        border: 2.5px solid #fff; color: #fff; font-weight: 800; font-size: 13px;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 3px 10px rgba(0,0,0,0.25);
        font-family: 'Outfit', system-ui, sans-serif;
      }
      .pmap-commune-label {
        margin-top: 3px; background: #fff; padding: 1px 7px; border-radius: 6px;
        font-size: 10px; font-weight: 700; color: #111; white-space: nowrap;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        font-family: 'Outfit', system-ui, sans-serif;
      }

      .leaflet-container { z-index: 0 !important; }
      .leaflet-pane, .leaflet-top, .leaflet-bottom { z-index: 400 !important; }
    `}</style>
  );
}