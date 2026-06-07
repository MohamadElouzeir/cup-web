import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const BOOTHS = [
  { src: "/images/booth.jpg", alt: "Cup S kiosk booth exterior" },
  { src: "/images/other-booth.jpg", alt: "Cup S kiosk booth — night design" },
];
const SLIDE_INTERVAL = 5000;

const VideoScrubSection = () => {
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % BOOTHS.length),
      SLIDE_INTERVAL
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const images = imagesRef.current;
    const overlay = overlayRef.current;
    if (!wrapper || !images) return;

    let rafScheduled = false;
    let visible = false;

    const onScroll = () => {
      if (rafScheduled) return;
      rafScheduled = true;
      requestAnimationFrame(() => {
        rafScheduled = false;
        if (!visible) return;
        const rect = wrapper.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        if (total <= 0) return;
        const raw = -rect.top / total;
        const p = Math.min(1, Math.max(0, raw));
        const scale = 1 + p * 0.06;
        images.style.transform = `scale(${scale})`;
        if (overlay) overlay.style.opacity = String(0.2 + p * 0.4);
      });
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (visible = e.isIntersecting)),
      { threshold: 0 }
    );
    io.observe(wrapper);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-[160vh]" style={{ background: "#111" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: "#111" }}>
        {/* Images — contain so full booth always visible, dark bg fills sides */}
        <div ref={imagesRef} className="absolute inset-0 will-change-transform">
          {BOOTHS.map((b, i) => (
            <img
              key={b.src}
              src={b.src}
              alt={b.alt}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>

        {/* Subtle top/bottom vignette so it blends into the page */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />

        {/* Center spotlight */}
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(177,117,87,0.15), transparent 70%)",
            opacity: 0.2,
          }}
        />

        {/* Text overlay */}
        <div className="relative z-10 h-full flex items-end justify-center pb-20 px-6 text-center">
          <div className="max-w-3xl">
            <p className="text-amber-soft uppercase tracking-[0.3em] text-xs font-bold mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              Our booth
            </p>
            <h2 className="h-display text-4xl md:text-7xl text-white mb-5 drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)]">
              {t("how.s2.title")}
            </h2>
            <p className="text-white/80 text-lg md:text-xl max-w-xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              {t("how.s2.desc")}
            </p>
          </div>
        </div>

        {/* Slideshow dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5">
          {BOOTHS.map((b, i) => (
            <button
              key={b.src}
              onClick={() => setActive(i)}
              aria-label={`Show booth ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-7 bg-amber-glow"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoScrubSection;
