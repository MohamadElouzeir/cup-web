import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const BOOTHS = [
  { src: "/images/booth.jpg", alt: "Cup S kiosk booth exterior" },
  { src: "/images/other-booth.jpg", alt: "Cup S kiosk booth — night design" },
];
const SLIDE_INTERVAL = 5000;

const VideoScrubSection = () => {
  const { t } = useTranslation();
  const imagesRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % BOOTHS.length),
      SLIDE_INTERVAL
    );
    return () => clearInterval(id);
  }, []);

  // Gentle zoom on scroll
  useEffect(() => {
    const section = sectionRef.current;
    const images = imagesRef.current;
    if (!section || !images) return;

    let raf = false;
    let visible = false;

    const onScroll = () => {
      if (raf) return;
      raf = true;
      requestAnimationFrame(() => {
        raf = false;
        if (!visible) return;
        const rect = section.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -rect.top / rect.height));
        images.style.transform = `scale(${1 + p * 0.06})`;
      });
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (visible = e.isIntersecting)),
      { threshold: 0 }
    );
    io.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <section ref={sectionRef} className="section">
      <div className="container-page mx-auto">

        {/* Text above */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-amber-glow uppercase tracking-[0.3em] text-xs font-bold mb-3">
            Our booth
          </p>
          <h2 className="h-display text-4xl md:text-6xl text-coffee-50 mb-4">
            {t("how.s2.title")}
          </h2>
          <p className="text-coffee-50/65 text-lg">{t("how.s2.desc")}</p>
        </div>

        {/* Booth image — aspect ratio matches the wide photos so cover = no crop */}
        <div className="relative w-full overflow-hidden rounded-3xl shadow-[0_30px_80px_-20px_rgba(75,74,73,0.35)]" style={{ aspectRatio: "16/9" }}>
          <div ref={imagesRef} className="absolute inset-0 will-change-transform">
            {BOOTHS.map((b, i) => (
              <img
                key={b.src}
                src={b.src}
                alt={b.alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>

          {/* Slideshow dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2.5">
            {BOOTHS.map((b, i) => (
              <button
                key={b.src}
                onClick={() => setActive(i)}
                aria-label={`Show booth ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-7 bg-amber-glow"
                    : "w-2.5 bg-white/60 hover:bg-white/90"
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default VideoScrubSection;
