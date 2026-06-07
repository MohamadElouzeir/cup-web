import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const BOOTHS = [
  { src: "/images/booth.jpg", alt: "Cup S kiosk booth exterior" },
  { src: "/images/other-booth.jpg", alt: "Cup S kiosk booth — night design" },
];
const SLIDE_INTERVAL = 5000;

/**
 * Scenic showcase of the kiosk booth.
 * The booth photos are wide landscape shots, so they live inside a centered
 * card with a matching aspect ratio — `object-cover` then fills the frame with
 * the whole booth visible (no awkward viewport cropping). Crossfades between
 * photos on a timer, with a gentle scroll-driven zoom kept inside the frame.
 */
const VideoScrubSection = () => {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Auto-advance the booth slideshow.
  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % BOOTHS.length),
      SLIDE_INTERVAL
    );
    return () => clearInterval(id);
  }, []);

  // Gentle parallax zoom as the card moves through the viewport.
  useEffect(() => {
    const card = cardRef.current;
    const images = imagesRef.current;
    if (!card || !images) return;

    let rafScheduled = false;
    let visible = false;

    const onScroll = () => {
      if (rafScheduled) return;
      rafScheduled = true;
      requestAnimationFrame(() => {
        rafScheduled = false;
        if (!visible) return;
        const rect = card.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const raw = 1 - center / window.innerHeight; // ~ -0.5 .. 0.5 across screen
        const p = Math.min(1, Math.max(0, raw + 0.5));
        const scale = 1.04 + p * 0.06;
        images.style.transform = `scale(${scale})`;
      });
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (visible = e.isIntersecting)),
      { threshold: 0 }
    );
    io.observe(card);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="section">
      <div className="container-page mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-amber-glow uppercase tracking-[0.3em] text-xs font-bold mb-3">
            Our booth
          </p>
          <h2 className="h-display text-4xl md:text-6xl text-coffee-50 mb-4">
            {t("how.s2.title")}
          </h2>
          <p className="text-coffee-50/65 text-lg">{t("how.s2.desc")}</p>
        </div>

        {/* Showcase card — aspect ratio matches the wide booth photos */}
        <div
          ref={cardRef}
          className="relative mx-auto max-w-5xl rounded-3xl overflow-hidden border border-coffee-50/10 shadow-[0_30px_80px_-30px_rgba(75,74,73,0.45)] aspect-[16/10] bg-coffee-900"
        >
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

          {/* Soft vignette so the frame edges feel intentional */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.35)]" />

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
