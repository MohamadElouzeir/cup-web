import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  variant: "brewery" | "bar";
}

const ComingSoonPage = ({ variant }: Props) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".cs-icon", { opacity: 0, scale: 0.6, rotate: -15, duration: 0.9, ease: "back.out(1.6)" });
      gsap.from(".cs-tag", { opacity: 0, y: 15, duration: 0.6, delay: 0.15, ease: "power2.out" });
      gsap.from(".cs-title", { opacity: 0, y: 30, duration: 0.8, delay: 0.25, ease: "expo.out" });
      gsap.from(".cs-desc", { opacity: 0, y: 20, duration: 0.7, delay: 0.45, ease: "power2.out" });
      gsap.from(".cs-links", { opacity: 0, y: 15, duration: 0.7, delay: 0.6, ease: "power2.out" });
    }, el);
    return () => ctx.revert();
  }, [variant]);

  const icon =
    variant === "brewery" ? (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14 sm:w-16 sm:h-16">
        <path d="M18 18 H44 V50 C 44 53, 41 56, 38 56 H24 C 21 56, 18 53, 18 50 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M44 24 H50 C 53 24, 54 27, 54 30 V38 C 54 41, 53 44, 50 44 H44" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="26" cy="32" r="2.5" fill="currentColor" />
        <circle cx="34" cy="38" r="2" fill="currentColor" />
        <circle cx="30" cy="44" r="2" fill="currentColor" />
        <path d="M22 12 Q22 16 26 16 Q26 12 30 12 Q30 16 34 16 Q34 12 38 12 Q38 16 42 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
      </svg>
    ) : (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14 sm:w-16 sm:h-16">
        <path d="M14 14 H50 L36 34 V52 H42 V56 H22 V52 H28 V34 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        <line x1="20" y1="22" x2="44" y2="22" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      </svg>
    );

  const title = variant === "brewery" ? t("shops.brewery.title") : t("shops.bar.title");
  const body = variant === "brewery" ? t("soon.brewery") : t("soon.bar");

  return (
    <section
      ref={ref}
      className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-24 sm:py-28 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(245,166,35,0.12), transparent 70%)",
        }}
      />

      <div className="relative z-10 text-center max-w-xl w-full">
        <div
          className="cs-icon w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-glow/20 to-amber-glow/5 border border-amber-glow/35 flex items-center justify-center text-amber-glow mx-auto mb-8 shadow-[0_20px_60px_-20px_rgba(245,166,35,0.45)]"
          aria-hidden="true"
        >
          {icon}
        </div>

        <p className="cs-tag text-amber-glow uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold mb-3">
          {title}
        </p>
        <h1 className="cs-title h-display text-5xl sm:text-6xl md:text-7xl text-coffee-50 mb-5 shimmer-text leading-tight">
          {t("soon.title")}
        </h1>
        <p className="cs-desc text-coffee-50/70 text-base sm:text-lg leading-relaxed mb-9 sm:mb-10 max-w-md mx-auto">
          {body}
        </p>

        <div className="cs-links flex flex-wrap items-center justify-center gap-3">
          <Link to="/menu" className="btn-ghost text-sm sm:text-base">
            ← {t("nav.menu")}
          </Link>
          <Link to="/" className="btn-primary text-sm sm:text-base">
            {t("nav.home")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonPage;
