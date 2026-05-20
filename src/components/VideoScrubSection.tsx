import { useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Sticky scenic section showing the kiosk booth exterior.
 * Replaces the previous scrubbed video. Uses native CSS `position: sticky`
 * so nothing survives a route change — the DOM cleans itself up on unmount.
 * Adds a parallax zoom on the image driven by scroll progress.
 */
const VideoScrubSection = () => {
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;
    if (!wrapper || !image) return;

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
        // Subtle zoom + slight translate for cinematic parallax
        const scale = 1 + p * 0.12;
        const translateY = (p - 0.5) * 60;
        image.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
        if (overlay) overlay.style.opacity = String(0.25 + p * 0.55);
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
    <div ref={wrapperRef} className="relative h-[180vh] bg-coffee-900">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <img
          ref={imageRef}
          src="/images/booth-exterior.webp"
          alt="Cup S kiosk booth exterior"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          loading="lazy"
          decoding="async"
        />
        {/* Top + bottom darkening so text always reads cleanly */}
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-900 via-coffee-900/30 to-coffee-900/60" />
        {/* Center spotlight — strength grows with scroll progress */}
        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(245,166,35,0.18), transparent 70%)",
            opacity: 0.25,
          }}
        />

        <div className="relative z-10 h-full flex items-center justify-center px-6 text-center">
          <div className="max-w-3xl">
            <p className="text-amber-glow uppercase tracking-[0.3em] text-xs font-bold mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
              Our booth
            </p>
            <h2 className="h-display text-4xl md:text-7xl text-coffee-50 mb-5 drop-shadow-[0_4px_18px_rgba(0,0,0,0.8)]">
              {t("how.s2.title")}
            </h2>
            <p className="text-coffee-50/85 text-lg md:text-xl max-w-xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              {t("how.s2.desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoScrubSection;
