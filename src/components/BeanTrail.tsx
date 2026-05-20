import { useEffect, useRef } from "react";

interface Bean {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rot: number;
  vr: number;
  life: number;
  maxLife: number;
}

interface Props {
  /** How many beans on the canvas at peak */
  density?: number;
  /** "waterfall" beans fall from top; "drift" beans float around */
  mode?: "waterfall" | "drift";
  className?: string;
}

/**
 * Lightweight coffee-bean particle canvas.
 * - IntersectionObserver-gated (pauses when off-screen)
 * - 30 fps cap on waterfall for perf
 * - Auto-disabled when prefers-reduced-motion
 */
const BeanTrail = ({ density = 28, mode = "drift", className = "" }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = canvas.getContext("2d", { alpha: true })!;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const beans: Bean[] = [];
    let rafId = 0;
    let running = false;
    let lastT = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (initial = false) => {
      if (mode === "waterfall") {
        beans.push({
          x: Math.random() * width,
          y: initial ? Math.random() * height : -20,
          vx: (Math.random() - 0.5) * 0.4,
          vy: 0.8 + Math.random() * 1.2,
          r: 4 + Math.random() * 4,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.04,
          life: 0,
          maxLife: 1,
        });
      } else {
        beans.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: 3 + Math.random() * 4,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.01,
          life: 0,
          maxLife: 1,
        });
      }
    };

    for (let i = 0; i < density; i++) spawn(true);

    const drawBean = (b: Bean) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      // gradient body
      const g = ctx.createLinearGradient(0, -b.r, 0, b.r);
      g.addColorStop(0, "rgba(122, 70, 22, 0.85)");
      g.addColorStop(1, "rgba(60, 30, 10, 0.85)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, b.r * 0.65, b.r, 0, 0, Math.PI * 2);
      ctx.fill();
      // crease
      ctx.strokeStyle = "rgba(30, 16, 6, 0.7)";
      ctx.lineWidth = Math.max(0.8, b.r * 0.18);
      ctx.beginPath();
      ctx.moveTo(0, -b.r * 0.85);
      ctx.bezierCurveTo(b.r * 0.4, -b.r * 0.3, -b.r * 0.4, b.r * 0.3, 0, b.r * 0.85);
      ctx.stroke();
      ctx.restore();
    };

    const step = (t: number) => {
      // 30 fps cap
      const dt = t - lastT;
      if (dt < 33) {
        rafId = requestAnimationFrame(step);
        return;
      }
      lastT = t;

      ctx.clearRect(0, 0, width, height);

      for (let i = beans.length - 1; i >= 0; i--) {
        const b = beans[i];
        b.x += b.vx;
        b.y += b.vy;
        b.rot += b.vr;

        if (mode === "waterfall") {
          if (b.y - b.r > height + 10) {
            beans.splice(i, 1);
            spawn();
            continue;
          }
        } else {
          // drift mode — wrap
          if (b.x < -10) b.x = width + 10;
          if (b.x > width + 10) b.x = -10;
          if (b.y < -10) b.y = height + 10;
          if (b.y > height + 10) b.y = -10;
        }

        drawBean(b);
      }

      rafId = requestAnimationFrame(step);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastT = 0;
      rafId = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? start() : stop()));
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, [density, mode]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};

export default BeanTrail;
