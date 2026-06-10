import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { parseCSV } from "@/lib/csv";
import MenuWheel, { MenuItem } from "@/components/MenuWheel";

type CategoryKey = "hot" | "cold" | "soft";

interface CategoryDef {
  key: CategoryKey;
  csvName: string;
  label: string;
  banner: { type: "image"; src: string } | { type: "video"; src: string; poster?: string };
}

const CoffeeMenuPage = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [category, setCategory] = useState<CategoryKey>("hot");
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const categories: CategoryDef[] = [
    {
      key: "hot",
      csvName: "Hot Coffee",
      label: t("menu.hot"),
      banner: { type: "image", src: "/menu/banners/hot.png" },
    },
    {
      key: "cold",
      csvName: "Cold Drinks",
      label: t("menu.cold"),
      banner: { type: "video", src: "/menu/banners/cold.mp4", poster: "/menu/banners/refresher.png" },
    },
    {
      key: "soft",
      csvName: "Soft Drinks",
      label: t("menu.soft"),
      banner: { type: "image", src: "/menu/banners/soft.png" },
    },
  ];

  useEffect(() => {
    let cancelled = false;
    fetch("./menu.csv", { cache: "no-cache" })
      .then((r) => {
        if (!r.ok) throw new Error("CSV not found");
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        const rows = parseCSV(text);
        const parsed: MenuItem[] = rows.map((r) => ({
          id: r.id,
          category: r.category || "Other",
          name: r.name || "",
          description: r.description || "",
          image: r.image || "/menu/placeholder.png",
          logo: r.logo || undefined,
        }));
        setItems(parsed);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(String(e?.message || e));
        setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Play/pause banner video based on whether it's visible
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (category === "cold") {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [category]);

  const activeCat = categories.find((c) => c.key === category)!;

  const filtered = useMemo(() => {
    if (!items) return [];
    return items.filter((i) => i.category === activeCat.csvName);
  }, [items, activeCat]);

  return (
    <section className="pt-20 sm:pt-24 md:pt-28 pb-12 md:pb-16">
      {/* Banner header — full width, ample height, lots of breathing room */}
      <div className="relative w-full h-[42vh] sm:h-[46vh] md:h-[52vh] min-h-[280px] max-h-[520px] overflow-hidden">
        {/* Hot banner (image) */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            category === "hot" ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src="/menu/banners/hot.png"
            alt={t("menu.hot")}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Cold banner (video) */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            category === "cold" ? "opacity-100" : "opacity-0"
          }`}
        >
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            poster="/menu/banners/refresher.png"
            className="w-full h-full object-cover"
          >
            <source src="/menu/banners/cold.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Soft drinks banner (image) */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            category === "soft" ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src="/menu/banners/soft.png"
            alt={t("menu.soft")}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-coffee-900 via-coffee-900/40 to-coffee-900/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-coffee-900/65 via-transparent to-transparent" />

        <div className="relative z-10 h-full flex items-end justify-center pb-8 sm:pb-10 md:pb-12 px-4">
          <div className="text-center max-w-2xl">
            <p className="text-amber-glow uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold mb-2 sm:mb-3">
              Intelligent Coffee
            </p>
            <h1 className="h-display text-4xl sm:text-5xl md:text-7xl text-coffee-50 leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)]">
              {activeCat.label}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-page mx-auto px-4 sm:px-6 md:px-8 mt-14 sm:mt-16 md:mt-20">
        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                category === c.key
                  ? "bg-gradient-to-r from-amber-glow to-amber-deep text-white shadow-[0_10px_30px_-10px_rgba(177,117,87,0.55)]"
                  : "glass text-coffee-50/80 hover:text-amber-glow hover:border-amber-glow/40"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Wheel */}
        {items === null ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 rounded-full border-2 border-amber-glow/30 border-t-amber-glow animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-coffee-50/55">
            {error ? error : t("menu.empty")}
          </div>
        ) : (
          <MenuWheel key={`${category}-${filtered.length}`} items={filtered} />
        )}
      </div>
    </section>
  );
};

export default CoffeeMenuPage;
