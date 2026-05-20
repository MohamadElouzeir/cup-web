import { useEffect, useRef } from "react";

/**
 * Premium amber-orb cursor: bright dot + soft trailing ring with lag.
 * Disabled on touch devices and when prefers-reduced-motion is set.
 */
const CustomCursor = () => {
  const orbRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduce) return;

    document.body.classList.add("has-custom-cursor");
    const orb = orbRef.current!;
    const ring = ringRef.current!;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        orb.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const onLeave = () => {
      visible = false;
      orb.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onEnter = () => {
      visible = true;
      orb.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest('a, button, [role="button"], .menu-card, input, textarea, select, label')) {
        document.body.classList.add("cursor-hovering");
      }
    };

    const onOut = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest('a, button, [role="button"], .menu-card, input, textarea, select, label')) {
        document.body.classList.remove("cursor-hovering");
      }
    };

    const tick = () => {
      // orb sticks to cursor (1:1)
      orb.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      // ring lags ~ 18%
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("mouseout", onOut, true);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover", onOver, true);
      document.removeEventListener("mouseout", onOut, true);
      document.body.classList.remove("has-custom-cursor", "cursor-hovering");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={orbRef} className="cursor-orb" style={{ opacity: 0 }} aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
