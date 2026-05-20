import { useEffect, useRef } from "react";

/**
 * Adds a simple opacity+translate-up reveal to any descendant with the
 * `.reveal-up` class when it enters the viewport. Uses a native
 * IntersectionObserver so it works reliably even with Lenis smooth scroll
 * (no GSAP/ScrollTrigger dependency).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".reveal-up"));
    if (els.length === 0) return;

    // Set initial state
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.transition = "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)";
      el.style.willChange = "opacity, transform";
    });

    const reveal = (el: HTMLElement, idx: number) => {
      const delay = (idx % 4) * 60;
      window.setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, delay);
    };

    // Immediately reveal anything already on screen
    els.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
        reveal(el, i);
      }
    });

    // Watch the rest
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = els.indexOf(entry.target as HTMLElement);
            reveal(entry.target as HTMLElement, idx === -1 ? 0 : idx);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((el) => io.observe(el));

    // Final fail-safe — show everything after 3 seconds regardless
    const failsafe = window.setTimeout(() => {
      els.forEach((el, i) => {
        if (el.style.opacity === "0") reveal(el, i);
      });
    }, 3000);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return ref;
}
