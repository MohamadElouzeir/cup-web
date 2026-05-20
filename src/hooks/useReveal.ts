import { useEffect, useRef } from "react";

/**
 * Progressive reveal — elements with `.reveal-up` fade/translate in
 * when they enter the viewport. Built to never leave anything hidden:
 * - Elements already on screen are revealed immediately
 * - IntersectionObserver reveals the rest
 * - Hard 1.5s fail-safe forces anything stuck to show
 * - On unmount, any leftover inline styles are cleared
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".reveal-up"));
    if (els.length === 0) return;

    // Apply initial hidden state to all
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition =
        "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)";
      el.style.willChange = "opacity, transform";
    });

    const show = (el: HTMLElement, idx: number) => {
      const delay = (idx % 4) * 60;
      window.setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, delay);
    };

    // Reveal anything already in (or above) the viewport immediately,
    // after the next paint (so layout is finalized first)
    const initialId = requestAnimationFrame(() => {
      els.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const visibleNow = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
        if (visibleNow) show(el, i);
      });
    });

    // Observe the rest
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = els.indexOf(entry.target as HTMLElement);
            show(entry.target as HTMLElement, idx === -1 ? 0 : idx);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" }
    );
    els.forEach((el) => io.observe(el));

    // Hard fail-safe — at 1.5s force-reveal anything still hidden
    const failsafe = window.setTimeout(() => {
      els.forEach((el, i) => {
        if (el.style.opacity === "0") show(el, i);
      });
    }, 1500);

    return () => {
      cancelAnimationFrame(initialId);
      window.clearTimeout(failsafe);
      io.disconnect();
      // Strip styles so unmounted elements don't keep residual transforms
      els.forEach((el) => {
        el.style.opacity = "";
        el.style.transform = "";
        el.style.transition = "";
        el.style.willChange = "";
      });
    };
  }, []);

  return ref;
}
