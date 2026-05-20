import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useTranslation } from "@/hooks/useTranslation";

const HeroSection = () => {
  const { t, locale } = useTranslation();
  const rootRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const splitLetters = (el: HTMLElement | null, text: string) => {
        if (!el) return [];
        el.innerHTML = "";
        const spans: HTMLSpanElement[] = [];
        Array.from(text).forEach((ch) => {
          const s = document.createElement("span");
          s.className = "hero-letter";
          s.textContent = ch === " " ? " " : ch;
          el.appendChild(s);
          spans.push(s);
        });
        return spans;
      };

      const l1 = splitLetters(line1Ref.current, t("hero.title.line1"));
      const l2 = splitLetters(line2Ref.current, t("hero.title.line2"));

      gsap.set([tagRef.current, subRef.current, ctaRef.current], { opacity: 0, y: 30 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(tagRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.1)
        .to(l1, { opacity: 1, y: 0, rotateX: 0, duration: 0.85, stagger: 0.04 }, 0.25)
        .to(l2, { opacity: 1, y: 0, rotateX: 0, duration: 0.85, stagger: 0.04 }, 0.45)
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.85)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.7 }, 1.0);
    }, rootRef);

    return () => ctx.revert();
  }, [t, locale]);

  return (
    <section
      ref={rootRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero-kiosk.jpg"
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero-coffee.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-coffee-900/65 via-coffee-900/45 to-coffee-900" />
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(245,166,35,0.35), transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 container-page px-5 md:px-8 text-center">
        <div
          ref={tagRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-strong text-xs md:text-sm font-semibold text-amber-glow tracking-widest uppercase mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-glow animate-pulse" />
          {t("hero.tag")}
        </div>

        <h1 className="h-display text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-coffee-50 mb-3 leading-[0.95]">
          <span ref={line1Ref} className="block" />
          <span ref={line2Ref} className="block shimmer-text" />
        </h1>

        <p
          ref={subRef}
          className="text-base md:text-xl text-coffee-50/75 max-w-2xl mx-auto leading-relaxed mt-6 px-2"
        >
          {t("hero.sub")}
        </p>

        <div ref={ctaRef} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link to="/menu" className="btn-primary text-base md:text-lg">
            {t("hero.cta.menu")} →
          </Link>
          <Link to="/locations" className="btn-ghost text-base md:text-lg">
            {t("hero.cta.locations")}
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-coffee-50/55 z-10">
        <span className="text-[10px] tracking-[0.3em] font-semibold uppercase">Scroll</span>
        <div className="w-[2px] h-10 bg-gradient-to-b from-amber-glow/80 to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
