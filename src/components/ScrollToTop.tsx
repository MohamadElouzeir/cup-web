import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/hooks/useLenis";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Reset native scroll
    window.scrollTo(0, 0);
    // Sync Lenis too if active
    try {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(0, { immediate: true });
    } catch {
      /* ignore */
    }
    // Recompute ScrollTrigger positions for the new page after a tick
    const id = window.setTimeout(() => {
      try {
        ScrollTrigger.refresh();
      } catch {
        /* ignore */
      }
    }, 60);
    return () => window.clearTimeout(id);
  }, [pathname]);
  return null;
};

export default ScrollToTop;
