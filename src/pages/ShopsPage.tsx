import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useReveal } from "@/hooks/useReveal";
import AgeGate from "@/components/AgeGate";

type ShopKey = "coffee" | "brewery" | "bar";

interface Shop {
  key: ShopKey;
  title: string;
  desc: string;
  available: boolean;
  href: string;
  ageGated?: boolean;
  icon: JSX.Element;
}

const ShopsPage = () => {
  const { t } = useTranslation();
  const ref = useReveal<HTMLElement>();
  const navigate = useNavigate();
  const [showAgeGate, setShowAgeGate] = useState(false);

  const shops: Shop[] = [
    {
      key: "coffee",
      title: t("shops.coffee.title"),
      desc: t("shops.coffee.desc"),
      available: true,
      href: "/menu/coffee",
      icon: (
        <svg viewBox="0 0 64 64" fill="none" className="w-9 h-9 sm:w-10 sm:h-10">
          <path d="M14 26 H46 L43 50 H17 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <path d="M46 30 C 52 30, 54 36, 50 40 L43 41" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M22 14 Q26 22 22 26 M32 14 Q36 22 32 26 M42 14 Q46 22 42 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
        </svg>
      ),
    },
    {
      key: "brewery",
      title: t("shops.brewery.title"),
      desc: t("shops.brewery.desc"),
      available: false,
      href: "/menu/brewery",
      icon: (
        <svg viewBox="0 0 64 64" fill="none" className="w-9 h-9 sm:w-10 sm:h-10">
          <path d="M18 18 H44 V50 C 44 53, 41 56, 38 56 H24 C 21 56, 18 53, 18 50 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <path d="M44 24 H50 C 53 24, 54 27, 54 30 V38 C 54 41, 53 44, 50 44 H44" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="26" cy="32" r="2.5" fill="currentColor" />
          <circle cx="34" cy="38" r="2" fill="currentColor" />
          <circle cx="30" cy="44" r="2" fill="currentColor" />
          <path d="M22 12 Q22 16 26 16 Q26 12 30 12 Q30 16 34 16 Q34 12 38 12 Q38 16 42 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
        </svg>
      ),
    },
    {
      key: "bar",
      title: t("shops.bar.title"),
      desc: t("shops.bar.desc"),
      available: false,
      ageGated: true,
      href: "/menu/bar",
      icon: (
        <svg viewBox="0 0 64 64" fill="none" className="w-9 h-9 sm:w-10 sm:h-10">
          <path d="M14 14 H50 L36 34 V52 H42 V56 H22 V52 H28 V34 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          <line x1="20" y1="22" x2="44" y2="22" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        </svg>
      ),
    },
  ];

  const onShopClick = (shop: Shop) => {
    if (shop.ageGated) {
      setShowAgeGate(true);
    } else {
      navigate(shop.href);
    }
  };

  const confirmAge = () => {
    setShowAgeGate(false);
    try {
      localStorage.setItem("cups_age_ok", "1");
    } catch {
      /* ignore */
    }
    navigate("/menu/bar");
  };

  return (
    <>
      <section
        ref={ref}
        className="pt-28 sm:pt-32 md:pt-40 pb-16 md:pb-20 px-4 sm:px-6 md:px-8"
      >
        <div className="container-page mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
            <p className="reveal-up text-amber-glow uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold mb-3">
              {t("nav.menu")}
            </p>
            <h1 className="reveal-up h-display text-4xl sm:text-5xl md:text-7xl text-coffee-50 mb-3 sm:mb-4 shimmer-text leading-tight">
              {t("shops.title")}
            </h1>
            <p className="reveal-up text-coffee-50/65 text-base sm:text-lg leading-relaxed">
              {t("shops.sub")}
            </p>
          </div>

          <div className="grid gap-5 sm:gap-6 md:gap-7 grid-cols-1 md:grid-cols-3">
            {shops.map((shop) => (
              <button
                key={shop.key}
                onClick={() => onShopClick(shop)}
                className="reveal-up group relative glass rounded-3xl p-7 sm:p-8 md:p-9 text-center overflow-hidden border border-white/8 hover:border-amber-glow/45 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_-20px_rgba(245,166,35,0.4)] flex flex-col items-center"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-glow/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-glow/15 to-amber-glow/5 border border-amber-glow/25 flex items-center justify-center text-amber-glow mb-5 sm:mb-6 group-hover:scale-110 group-hover:border-amber-glow/60 transition-all duration-500"
                  aria-hidden="true"
                >
                  {shop.icon}
                </div>

                <h2 className="h-display text-2xl sm:text-3xl text-coffee-50 mb-3">{shop.title}</h2>
                <p className="text-coffee-50/65 text-sm sm:text-base leading-relaxed mb-7 sm:mb-8 flex-1">
                  {shop.desc}
                </p>

                <span
                  className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-bold tracking-wide uppercase transition-all ${
                    shop.available
                      ? "bg-gradient-to-r from-amber-glow to-amber-deep text-coffee-900 group-hover:shadow-[0_10px_30px_-10px_rgba(245,166,35,0.6)] group-hover:scale-105"
                      : "bg-white/5 text-coffee-50/70 border border-white/12 group-hover:border-amber-glow/35 group-hover:text-amber-glow"
                  }`}
                >
                  {shop.available ? t("shops.explore") : t("shops.comingSoon")}
                  {shop.available && <span aria-hidden="true">→</span>}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {showAgeGate && (
        <AgeGate
          onConfirm={confirmAge}
          onDeny={() => setShowAgeGate(false)}
        />
      )}
    </>
  );
};

export default ShopsPage;
