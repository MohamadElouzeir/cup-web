import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * The drink PNGs share the same file height but the cup artwork inside has
 * varying transparent padding (e.g. the espresso cup fills ~78% of its image,
 * the cappuccino ~93%), which made cups render at visibly different sizes.
 * Measure the opaque bounding box once per image and scale/offset it so the
 * CUP itself always renders at the same height, optically centred.
 */
const CUP_TARGET = 74; // cup content height as % of the card's image box
const fitCache = new Map<string, { heightPct: number; dyPct: number }>();

const measureCupFit = (img: HTMLImageElement) => {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h) return null;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0);
  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, w, h).data;
  } catch {
    return null; // tainted canvas (cross-origin) — keep default sizing
  }
  const rowHasInk = (y: number) => {
    for (let x = 0; x < w; x++) if (data[(y * w + x) * 4 + 3] > 16) return true;
    return false;
  };
  let minY = 0;
  while (minY < h && !rowHasInk(minY)) minY++;
  if (minY === h) return null; // fully transparent
  let maxY = h - 1;
  while (maxY > minY && !rowHasInk(maxY)) maxY--;

  const contentRatio = (maxY - minY + 1) / h;
  // Render the image taller/shorter so the cup itself hits CUP_TARGET.
  const heightPct = Math.min(96, CUP_TARGET / contentRatio);
  // Shift so the cup (not the padded file) is what sits centred in the box.
  const dyPct = ((h / 2 - (minY + maxY) / 2) / h) * 100;
  return { heightPct, dyPct };
};

const useCupFit = (src: string) => {
  const [fit, setFit] = useState(() => fitCache.get(src) ?? null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img || fitCache.has(src)) {
      if (fitCache.has(src)) setFit(fitCache.get(src)!);
      return;
    }
    const m = measureCupFit(img);
    if (m) {
      fitCache.set(src, m);
      setFit(m);
    }
  }, [src]);

  // Cached images may already be complete before onLoad is attached.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth) onLoad();
  }, [onLoad]);

  return { imgRef, fit, onLoad };
};

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  image: string;
  logo?: string;
}

interface Props {
  items: MenuItem[];
  itemsPerPage?: number;
}

/**
 * 3D coverflow-style wheel carousel. Visible page sits front-center,
 * neighbor pages curve back/away with scale + rotateY + depth.
 * Drag/swipe rotates the wheel. Tapping a front card flips it to show
 * the description; tapping again flips it back.
 */
const MenuWheel = ({ items, itemsPerPage }: Props) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  const [width, setWidth] = useState(0);
  const [rotation, setRotationState] = useState(0);
  const [page, setPage] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);

  // Native touch/mouse handlers (attached in a useEffect below) need the live
  // rotation without going stale, so mirror it in a ref and update both at once.
  const rotationRef = useRef(0);
  const setRotation = useCallback((v: number) => {
    rotationRef.current = v;
    setRotationState(v);
  }, []);

  const perPage =
    itemsPerPage ??
    (typeof window === "undefined"
      ? 6
      : window.innerWidth < 640
      ? 4
      : window.innerWidth < 1024
      ? 6
      : 6);

  const pages: MenuItem[][] = [];
  for (let i = 0; i < items.length; i += perPage) {
    pages.push(items.slice(i, i + perPage));
  }
  const pageCount = pages.length || 1;
  const step = (Math.PI * 2) / pageCount;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Close any open card when wheel page changes
  useEffect(() => {
    setOpenId(null);
  }, [page]);

  const animateTo = (target: number) => {
    cancelAnimationFrame(animRef.current);
    const start = rotationRef.current;
    const startT = performance.now();
    const duration = 520;
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
    const tick = (now: number) => {
      const k = Math.min(1, (now - startT) / duration);
      const v = start + (target - start) * easeOutCubic(k);
      setRotation(v);
      if (k < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  };

  const snap = (direction: number) => {
    if (pageCount <= 1) return;
    const rawCurrent = Math.round(-rotationRef.current / step);
    const rawTarget = rawCurrent + direction;
    const target = -rawTarget * step;
    const normalized = ((rawTarget % pageCount) + pageCount) % pageCount;
    setPage(normalized);
    animateTo(target);
  };

  /**
   * Decide where to land after a swipe ends. A full page rotation requires a
   * very long drag (step / SENSITIVITY ≈ a whole screen width), so a normal
   * swipe would barely turn the wheel and snap straight back. Instead, advance
   * a page when the gesture clears a modest distance OR is a quick flick, using
   * the swipe direction rather than the (small) accumulated rotation.
   */
  const settleAfterSwipe = (dxTotal: number, velocity: number) => {
    if (pageCount <= 1) return;
    const DIST_THRESHOLD = 40; // px of horizontal travel to commit a page turn
    const VEL_THRESHOLD = 300; // px/s flick to commit even on a short swipe
    const current = Math.round(-rotationRef.current / step);
    let dir = 0;
    if (Math.abs(dxTotal) > DIST_THRESHOLD || Math.abs(velocity) > VEL_THRESHOLD) {
      // Dragging right (positive dx) rotates the wheel toward the previous page.
      dir = dxTotal < 0 ? 1 : -1;
    }
    const rawTarget = current + dir;
    const target = -rawTarget * step;
    const normalized = ((rawTarget % pageCount) + pageCount) % pageCount;
    setPage(normalized);
    animateTo(target);
  };

  const SENSITIVITY = 0.008;
  const HORIZ_LOCK = 8; // px of horizontal travel before we own the gesture
  const VERT_BAIL = 10; // px of vertical travel that releases to page scroll

  // Keep the latest settle/tap logic reachable from the (stable) native
  // listeners without re-binding them on every rotation change.
  const settleRef = useRef(settleAfterSwipe);
  settleRef.current = settleAfterSwipe;

  // Native touch + mouse interaction. We use non-passive listeners so we can
  // preventDefault() once a horizontal swipe is confirmed — this is what makes
  // the wheel actually rotate on phones (React synthetic pointer events +
  // pointer-capture were being cut short mid-swipe by pointercancel/leave).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const drag = {
      active: false,
      decided: null as null | "horizontal" | "vertical",
      startX: 0,
      startY: 0,
      lastX: 0,
      lastT: 0,
      velocity: 0,
      accRotation: 0,
      moved: false,
      startTarget: null as HTMLElement | null,
    };

    const begin = (x: number, y: number, target: EventTarget | null) => {
      const tgt = target as HTMLElement;
      if (tgt?.closest("a, input, textarea, select, button")) return false;
      cancelAnimationFrame(animRef.current);
      drag.active = true;
      drag.decided = null;
      drag.moved = false;
      drag.startX = drag.lastX = x;
      drag.startY = y;
      drag.lastT = performance.now();
      drag.velocity = 0;
      drag.accRotation = rotationRef.current;
      drag.startTarget = tgt;
      return true;
    };

    /** @returns true if the event should be preventDefault()ed (we own it). */
    const move = (x: number, y: number) => {
      if (!drag.active) return false;
      const totalDx = x - drag.startX;
      const totalDy = y - drag.startY;

      if (drag.decided === null) {
        if (Math.abs(totalDy) > VERT_BAIL && Math.abs(totalDy) > Math.abs(totalDx)) {
          drag.decided = "vertical";
          drag.active = false; // let the browser scroll the page
          return false;
        }
        if (Math.abs(totalDx) > HORIZ_LOCK) {
          drag.decided = "horizontal";
          drag.moved = true;
        } else {
          return false; // not enough movement to decide yet
        }
      }
      if (drag.decided !== "horizontal") return false;

      const now = performance.now();
      const dt = Math.max(1, now - drag.lastT);
      const dx = x - drag.lastX;
      drag.velocity = (dx / dt) * 1000;
      drag.lastX = x;
      drag.lastT = now;
      drag.accRotation += dx * SENSITIVITY;
      setRotation(drag.accRotation);
      return true; // owned → preventDefault to stop page scroll
    };

    const finish = () => {
      const decided = drag.decided;
      const startTarget = drag.startTarget;
      const dxTotal = drag.lastX - drag.startX;
      const velocity = drag.velocity;
      drag.active = false;
      drag.startTarget = null;

      // Vertical scroll gesture — the browser handled it; do nothing.
      if (decided === "vertical") return;

      if (decided === "horizontal" && drag.moved) {
        settleRef.current(dxTotal, velocity);
        return;
      }

      // No directional decision → it was a tap. Flip the card under the
      // finger, or close any open card.
      if (!startTarget) return;
      const cardEl = startTarget.closest<HTMLElement>("[data-menu-card]");
      if (cardEl) {
        const id = cardEl.getAttribute("data-menu-card");
        if (id) setOpenId((cur) => (cur === id ? null : id));
      } else {
        setOpenId(null);
      }
    };

    // ── Touch ──
    const onTouchStart = (e: TouchEvent) => {
      const tch = e.touches[0];
      if (tch) begin(tch.clientX, tch.clientY, e.target);
    };
    const onTouchMove = (e: TouchEvent) => {
      const tch = e.touches[0];
      if (!tch) return;
      if (move(tch.clientX, tch.clientY) && e.cancelable) e.preventDefault();
    };
    const onTouchEnd = () => finish();

    // ── Mouse (desktop) ──
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      begin(e.clientX, e.clientY, e.target);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (move(e.clientX, e.clientY)) e.preventDefault();
    };
    const onMouseUp = () => finish();

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRotation]);

  const radius = Math.max(280, width * 0.45);

  const cards = pages.map((slice, i) => {
    const angle = (i / pageCount) * Math.PI * 2 + rotation;
    const x = radius * Math.sin(angle);
    const z = radius * Math.cos(angle);
    const depth = (z + radius) / (2 * radius);
    // Front page lands at exactly scale 1 / no tilt. Neighbours stay visible in
    // the background but smaller and gently tilted — a 45° tilt let perspective
    // blow the near edge of side pages up to front-cup size ("right cups look
    // bigger"), so keep the tilt moderate.
    const scale = 0.52 + Math.pow(depth, 1.5) * 0.48;
    const rotateY = Math.sin(angle) * -22;
    const opacity = depth < 0.4 ? 0.2 : depth < 0.7 ? 0.45 : 1;
    const isFront =
      i === ((Math.round(-rotation / step) % pageCount) + pageCount) % pageCount;
    return { i, slice, x, z, depth, scale, rotateY, opacity, isFront };
  });
  cards.sort((a, b) => a.z - b.z);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative h-[520px] xs:h-[560px] sm:h-[620px] md:h-[680px] select-none cursor-grab active:cursor-grabbing"
        style={{ perspective: "1400px", touchAction: "pan-y" }}
      >
        {/* Drag overlay — guarantees the whole area receives pointer events */}
        <div className="absolute inset-0 z-[1]" aria-hidden="true" />

        {cards.map((c) => (
          <div
            key={c.i}
            className="absolute top-1/2 left-1/2"
            style={{
              transform: `translate3d(${c.x}px, -50%, ${(c.z - radius) * 0.15}px) translateX(-50%) rotateY(${c.rotateY}deg) scale(${c.scale})`,
              opacity: c.opacity,
              zIndex: 10 + Math.round(c.depth * 100),
              pointerEvents: c.isFront ? "auto" : "none",
              transition: "opacity 0.2s ease",
              willChange: "transform",
            }}
          >
            <PageGrid slice={c.slice} active={c.isFront} openId={openId} />
          </div>
        ))}
      </div>

      <div className="mt-10 sm:mt-12 md:mt-14 flex flex-col items-center gap-3 px-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => snap(-1)}
            disabled={pageCount <= 1}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full glass-strong flex items-center justify-center text-amber-glow hover:scale-110 transition-transform disabled:opacity-30"
            aria-label="Previous"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none">
              <path d="M15 6 L9 12 L15 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <RotationDial pageCount={pageCount} rotation={rotation} />

          <button
            onClick={() => snap(1)}
            disabled={pageCount <= 1}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full glass-strong flex items-center justify-center text-amber-glow hover:scale-110 transition-transform disabled:opacity-30"
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none">
              <path d="M9 6 L15 12 L9 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <p className="text-coffee-50/55 text-[11px] sm:text-xs tracking-widest uppercase text-center">
          {t("menu.swipe")} — {page + 1} / {pageCount}
        </p>
      </div>
    </div>
  );
};

const PageGrid = ({
  slice,
  active,
  openId,
}: {
  slice: MenuItem[];
  active: boolean;
  openId: string | null;
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-[88vw] max-w-[960px]">
    {slice.map((item) => (
      <MenuCard
        key={item.id}
        item={item}
        interactive={active}
        open={openId === item.id}
      />
    ))}
  </div>
);

/** Card — `open` controlled by the parent wheel via the tap-detection logic. */
const MenuCard = ({
  item,
  interactive,
  open,
}: {
  item: MenuItem;
  interactive: boolean;
  open: boolean;
}) => {
  const { imgRef, fit, onLoad } = useCupFit(item.image);

  return (
  <article
    data-menu-card={item.id}
    aria-expanded={open}
    className={`menu-card relative glass rounded-2xl overflow-hidden border ${
      open ? "border-amber-glow/60 shadow-[0_15px_40px_-15px_rgba(245,166,35,0.55)]" : "border-white/8"
    } ${interactive ? "cursor-pointer" : ""} transition-all`}
  >
    <div className="aspect-square bg-gradient-to-b from-coffee-700/30 to-coffee-800/40 relative overflow-hidden flex items-center justify-center">
      <img
        ref={imgRef}
        src={item.image}
        alt={item.name}
        loading="lazy"
        draggable={false}
        className="w-auto max-w-[92%] object-contain transition-all duration-500"
        style={{
          height: `${fit ? fit.heightPct : 82}%`,
          transform: `${open ? "scale(1.08) " : ""}translateY(${fit ? fit.dyPct : 0}%)`,
          filter: open ? "blur(2px)" : undefined,
          pointerEvents: "none",
        }}
        onLoad={onLoad}
        onError={(e) => {
          const tgt = e.currentTarget;
          tgt.src =
            "data:image/svg+xml;utf8," +
            encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><rect width='80' height='80' fill='#3a2618'/><text x='40' y='44' text-anchor='middle' fill='#f5a623' font-family='Inter' font-size='9' font-weight='700'>Cup S</text></svg>`
            );
        }}
      />

      {/* "Info" hint pill (visible when closed) */}
      <div
        className={`absolute top-2 right-2 px-2.5 py-1 rounded-full bg-coffee-900/85 backdrop-blur border border-amber-glow/40 text-amber-glow text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-all duration-300 pointer-events-none ${
          open ? "opacity-0 scale-90" : "opacity-100 scale-100"
        }`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="8" r="1.4" fill="currentColor" />
          <path d="M12 11 V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>info</span>
      </div>

      {/* "×" close pill (visible when open) */}
      <div
        className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-amber-glow text-coffee-900 flex items-center justify-center transition-all duration-300 pointer-events-none ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
          <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Description overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-coffee-900 via-coffee-900/95 to-coffee-900/55 transition-all duration-400 ease-out flex items-end pointer-events-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="p-3 sm:p-4">
          <p className="text-amber-glow uppercase tracking-widest text-[10px] sm:text-[11px] font-bold mb-1.5">
            {item.category}
          </p>
          <h4 className="font-bold text-coffee-50 text-sm sm:text-base mb-1.5 leading-snug">
            {item.name}
          </h4>
          <p className="text-coffee-50/85 text-[11px] sm:text-xs leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </div>

    <div className="p-2.5 sm:p-3 text-center">
      <h3 className="font-bold text-coffee-50 text-xs sm:text-sm leading-tight line-clamp-2 flex items-center justify-center gap-1.5">
        {item.logo && (
          <img
            src={item.logo}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
            style={{ pointerEvents: "none" }}
          />
        )}
        <span>{item.name}</span>
      </h3>
    </div>
  </article>
  );
};

/** Decorative rotating dial that visualizes the current page. */
const RotationDial = ({ pageCount, rotation }: { pageCount: number; rotation: number }) => {
  const size = 76;
  const r = size * 0.4;
  const step = (Math.PI * 2) / pageCount;
  const livePage = ((-rotation / step) % pageCount + pageCount) % pageCount;
  const nearestPage = Math.round(livePage) % pageCount;
  const knobAngle = -Math.PI / 2 + (Math.PI * 2) * (livePage / pageCount);
  const knobX = r * Math.cos(knobAngle);
  const knobY = r * Math.sin(knobAngle);

  return (
    <div
      className="relative rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(from 0deg, #f6efe7, #c9ced8, #7d8796, #f6efe7)`,
        boxShadow: "0 8px 22px rgba(0,0,0,0.4), inset 0 0 0 1.5px rgba(245,166,35,0.4)",
        transform: `rotate(${-rotation * 0.42}rad)`,
        transition: "transform 0.05s linear",
      }}
    >
      <div
        className="absolute inset-2 rounded-full"
        style={{
          background: "radial-gradient(circle, #16100b 40%, #261810 100%)",
          boxShadow: "inset 0 0 0 1px rgba(245,166,35,0.25)",
        }}
      />
      {Array.from({ length: pageCount }).map((_, i) => {
        const a = -Math.PI / 2 + ((Math.PI * 2) / pageCount) * i;
        const x = r * Math.cos(a);
        const y = r * Math.sin(a);
        const active = i === nearestPage;
        return (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full transition-all"
            style={{
              width: active ? 10 : 5,
              height: active ? 10 : 5,
              transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
              background: active ? "#B17557" : "rgba(75,74,73,0.30)",
              boxShadow: active ? "0 0 10px rgba(177,117,87,0.7)" : "none",
            }}
          />
        );
      })}
      <div
        className="absolute top-1/2 left-1/2 rounded-full"
        style={{
          width: 12,
          height: 12,
          transform: `translate(calc(${knobX}px - 50%), calc(${knobY}px - 50%))`,
          background: "radial-gradient(circle, #c98f74, #B17557, #8f5a40)",
          boxShadow: "0 0 12px rgba(177,117,87,0.6), inset 0 0 0 1.5px rgba(255,255,255,0.5)",
        }}
      />
    </div>
  );
};

export default MenuWheel;
