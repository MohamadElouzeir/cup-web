import { useEffect, useRef } from "react";

/**
 * Coffee beans that spawn behind the cursor as it moves around the page,
 * fall gently with gravity, fade out, and recycle.
 *
 * Desktop only (disabled on touch + reduced-motion).
 * Pointer-events: none — never blocks UI.
 */

const BEAN_COLORS = ["#c8a96e", "#a0784a", "#d4b07c", "#8b5e3c", "#e8c080", "#b8895a", "#f0c878"];

interface TrailBean {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  rotV: number;
  scale: number;
  color: string;
  life: number;
  maxLife: number;
}

const MAX_BEANS = 60;
const SPAWN_DISTANCE = 18; // px of cursor movement between spawns

const drawBean = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rot: number,
  scale: number,
  color: string,
  alpha: number
) => {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 11, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, -9.5);
  ctx.bezierCurveTo(3, -4, 3, 4, 0, 9.5);
  ctx.strokeStyle = "rgba(0,0,0,0.32)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.restore();
};

const CursorBeanTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduce) return;

    const ctx = canvas.getContext("2d", { alpha: true })!;
    let W = window.innerWidth;
    let H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const beans: TrailBean[] = [];
    let mx = -9999;
    let my = -9999;
    let lastSpawnX = mx;
    let lastSpawnY = my;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const dx = mx - lastSpawnX;
      const dy = my - lastSpawnY;
      const dist2 = dx * dx + dy * dy;
      if (dist2 > SPAWN_DISTANCE * SPAWN_DISTANCE) {
        if (beans.length < MAX_BEANS) {
          beans.push({
            x: mx + (Math.random() - 0.5) * 10,
            y: my + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 1.2,
            vy: 0.4 + Math.random() * 0.8,
            rot: Math.random() * Math.PI * 2,
            rotV: (Math.random() - 0.5) * 0.12,
            scale: 0.55 + Math.random() * 0.5,
            color: BEAN_COLORS[Math.floor(Math.random() * BEAN_COLORS.length)],
            life: 0,
            maxLife: 60 + Math.random() * 40,
          });
        }
        lastSpawnX = mx;
        lastSpawnY = my;
      }
    };

    const GRAVITY = 0.12;

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = beans.length - 1; i >= 0; i--) {
        const b = beans[i];
        b.life++;
        b.vy += GRAVITY;
        b.x += b.vx;
        b.y += b.vy;
        b.rot += b.rotV;

        if (b.life >= b.maxLife || b.y > H + 20) {
          beans.splice(i, 1);
          continue;
        }

        const fadeIn = Math.min(1, b.life / 6);
        const fadeOut = Math.min(1, (b.maxLife - b.life) / 18);
        const alpha = Math.min(fadeIn, fadeOut) * 0.85;

        drawBean(ctx, b.x, b.y, b.rot, b.scale, b.color, alpha);
      }
      rafId = requestAnimationFrame(tick);
    };

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9990,
      }}
      aria-hidden="true"
    />
  );
};

export default CursorBeanTrail;
