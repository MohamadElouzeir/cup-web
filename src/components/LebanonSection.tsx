import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "@/hooks/useTranslation";

gsap.registerPlugin(ScrollTrigger);

const LebanonSection = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const video = videoRef.current;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!video) return;
          if (e.isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      },
      { threshold: 0.2 }
    );
    if (video) io.observe(video);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelector(".leb-content"),
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: { trigger: el, start: "top 70%" },
          duration: 1,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        el.querySelector(".leb-cedar"),
        { scale: 0.6, opacity: 0, rotate: -20 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          scrollTrigger: { trigger: el, start: "top 80%" },
          duration: 1.2,
          ease: "back.out(1.4)",
        }
      );
    }, el);

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative section overflow-hidden flex items-center min-h-[80vh] md:min-h-[90vh]"
    >
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          poster="/images/container-cafe.jpg"
          className="w-full h-full object-cover opacity-100"
        >
          <source src="/videos/lebanon.mp4" type="video/mp4" />
        </video>
        {/* Minimal scrim — only the very top/bottom edges fade into the page so
            text stays readable; the video shows at full brightness in between. */}
        <div className="absolute inset-0 bg-gradient-to-b from-coffee-900/90 via-transparent to-coffee-900/90" />
      </div>

      <div className="relative z-10 container-page mx-auto text-center max-w-3xl px-2">
        <div className="leb-content">
          <p className="text-amber-glow uppercase tracking-[0.4em] text-xs font-bold mb-4">
            Made in Lebanon
          </p>
          <h2 className="h-display text-4xl md:text-7xl text-coffee-50 mb-5 leading-[1.05]">
            <span className="shimmer-text">{t("leb.title")}</span>
          </h2>
          <p className="text-coffee-50/85 text-lg md:text-2xl font-light mb-6">{t("leb.sub")}</p>
          <p className="text-coffee-50/65 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("leb.body")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default LebanonSection;
