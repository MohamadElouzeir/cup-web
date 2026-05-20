import { useEffect, useRef } from "react";

/**
 * Progressive-enhancement reveal: descendants with `.reveal-up`
 * fade/translate in when they scroll into view. Content stays
 * visible by default — if anything goes wrong, nothing disappears.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".reveal-up"));
    if (els.length === 0) return;

    // Only hide things that are clearly below the fold at mount time.
    const toAnimate: HTMLElement[] = [];
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isBelowFold = rect.top > window.innerHeight * 0.95;
      if (isBelowFold) {
        el.style.opacity = "0";
        el.style.transform = "translateY(28px)";
        el.style.transition =
          "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)";
        el.style.willChange = "opacity, transform";
        toAnimate.push(el);
      }
    });

    if (toAnimate.length === 0) return;

    const reveal = (el: HTMLElement, idx: number) => {
      const delay = (idx % 4) * 60;
      window.setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, delay);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = toAnimate.indexOf(entry.target as HTMLElement);
            reveal(entry.target as HTMLElement, idx === -1 ? 0 : idx);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" }
    );
    toAnimate.forEach((el) => io.observe(el));

    // Hard fail-safe — after 2s reveal anything still hidden
    const failsafe = window.setTimeout(() => {
      toAnimate.forEach((el, i) => {
        if (el.style.opacity === "0") reveal(el, i);
      });
    }, 2000);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return ref;
}
