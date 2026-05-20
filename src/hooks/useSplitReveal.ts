import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Splits text into per-letter spans and animates them in.
 * Used for hero headings.
 */
export function useSplitReveal(text: string, deps: unknown[] = []) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.innerHTML = "";
    const letters: HTMLSpanElement[] = [];

    // Split by character, preserving spaces
    Array.from(text).forEach((ch) => {
      const span = document.createElement("span");
      span.className = "hero-letter";
      span.textContent = ch === " " ? " " : ch;
      el.appendChild(span);
      letters.push(span);
    });

    const tween = gsap.to(letters, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.85,
      ease: "expo.out",
      stagger: 0.035,
      delay: 0.15,
    });

    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, ...deps]);

  return ref;
}
