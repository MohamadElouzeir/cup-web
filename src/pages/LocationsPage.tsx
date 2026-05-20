import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "@/hooks/useTranslation";
import { LOCATIONS } from "@/lib/config";

const STATUS_COLOR: Record<string, string> = {
  running: "#22c55e",
  deploying: "#f59e0b",
  offline: "#ef4444",
};

const STATUS_LABEL: Record<string, { en: string; ar: string }> = {
  running: { en: "Open", ar: "مفتوح" },
  deploying: { en: "Coming soon", ar: "قريباً" },
  offline: { en: "Closed", ar: "مغلق" },
};

const pinIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 40' width='30' height='42'>
      <path d='M14 0C6.268 0 0 6.268 0 14c0 9.333 14 26 14 26S28 23.333 28 14C28 6.268 21.732 0 14 0z'
        fill='${color}' stroke='white' stroke-width='2.5' stroke-linejoin='round'/>
      <circle cx='14' cy='14' r='5.5' fill='white' opacity='0.96'/>
    </svg>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
  });

const LocationsPage = () => {
  const { t, locale } = useTranslation();
  const mapHostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedId, setSelectedId] = useState<string>(LOCATIONS[0]?.id ?? "");

  useEffect(() => {
    const host = mapHostRef.current;
    if (!host || mapRef.current) return;

    const map = L.map(host, {
      center: [33.95, 35.85],
      zoom: 8,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    });
    mapRef.current = map;

    // Dark, sleek tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    LOCATIONS.forEach((loc) => {
      const m = L.marker(loc.coords, { icon: pinIcon(STATUS_COLOR[loc.status] || "#f5a623") })
        .addTo(map)
        .bindPopup(
          `<div style='min-width:180px;font-family:Inter,sans-serif'>
            <div style='font-weight:700;font-size:14px;color:#f5a623;margin-bottom:4px'>${
              locale === "ar" ? loc.nameAr : loc.name
            }</div>
            <div style='color:#f6efe7;opacity:0.7;font-size:12px;margin-bottom:6px'>${
              locale === "ar" ? loc.addressAr : loc.address
            }</div>
            <div style='color:${STATUS_COLOR[loc.status]};font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.1em'>${
              STATUS_LABEL[loc.status][locale]
            }</div>
          </div>`
        );
      m.on("click", () => setSelectedId(loc.id));
      markersRef.current.push(m);
    });

    // Fit bounds
    const group = L.featureGroup(markersRef.current);
    map.fitBounds(group.getBounds().pad(0.4));

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const focusLocation = (id: string) => {
    const loc = LOCATIONS.find((l) => l.id === id);
    if (!loc || !mapRef.current) return;
    setSelectedId(id);
    mapRef.current.flyTo(loc.coords, 13, { duration: 1.1 });
    const m = markersRef.current.find((mk) =>
      mk.getLatLng().equals(L.latLng(loc.coords[0], loc.coords[1]))
    );
    if (m) m.openPopup();
  };

  return (
    <section className="pt-32 pb-16 md:pt-40 px-4 md:px-8">
      <div className="container-page mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-amber-glow uppercase tracking-[0.3em] text-xs font-bold mb-3">
            {t("nav.locations")}
          </p>
          <h1 className="h-display text-5xl md:text-7xl text-coffee-50 mb-3 shimmer-text">
            {t("loc.title")}
          </h1>
          <p className="text-coffee-50/65 text-lg">{t("loc.sub")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          {/* List */}
          <div className="space-y-3 lg:max-h-[600px] lg:overflow-y-auto lg:pr-2 no-scrollbar order-2 lg:order-1">
            {LOCATIONS.map((loc) => {
              const active = loc.id === selectedId;
              return (
                <button
                  key={loc.id}
                  onClick={() => focusLocation(loc.id)}
                  className={`w-full text-left glass rounded-2xl p-4 md:p-5 border transition-all ${
                    active
                      ? "border-amber-glow/60 bg-amber-glow/5"
                      : "border-white/8 hover:border-amber-glow/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-coffee-50 text-base md:text-lg">
                        {locale === "ar" ? loc.nameAr : loc.name}
                      </h3>
                      <p className="text-coffee-50/55 text-sm mt-1">
                        {locale === "ar" ? loc.addressAr : loc.address}
                      </p>
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full whitespace-nowrap"
                      style={{
                        background: `${STATUS_COLOR[loc.status]}22`,
                        color: STATUS_COLOR[loc.status],
                        border: `1px solid ${STATUS_COLOR[loc.status]}55`,
                      }}
                    >
                      {STATUS_LABEL[loc.status][locale]}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-coffee-50/55">{t("loc.hours")}</span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${loc.coords[0]},${loc.coords[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-amber-glow font-semibold hover:underline"
                    >
                      {t("loc.directions")} →
                    </a>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map */}
          <div className="order-1 lg:order-2 rounded-2xl overflow-hidden border border-white/10 glass min-h-[420px] md:min-h-[600px]">
            <div ref={mapHostRef} className="w-full h-[420px] md:h-[600px]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsPage;
