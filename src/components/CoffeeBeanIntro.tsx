import { useEffect, useRef, useState } from "react";

/**
 * Full-screen brand loader — shown ONCE per browser session on first visit.
 * - Falling coffee beans with gravity
 * - "Cup S" wordmark + progress bar
 * - Hard fail-safe: forces dismissal after 4s no matter what
 */

const BEAN_COLORS = ["#c8a96e", "#a0784a", "#d4b07c", "#8b5e3c", "#e8c080", "#b8895a", "#f0c878", "#c89060"];
const SESSION_KEY = "cups_intro_done";

function drawBean(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rot: number,
  scale: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.ellipse(0, 0, 9, 14, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.bezierCurveTo(4, -5, 4, 5, 0, 12);
  ctx.strokeStyle = "rgba(0,0,0,0.32)";
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.restore();
}

interface FallingBean {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  rotV: number;
  scale: number;
  color: string;
  delay: number;
  active: boolean;
}

const CoffeeBeanIntro = () => {
  // Only show on first page-load of the browser session
  const [shouldShow] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem(SESSION_KEY);
    } catch {
      return true;
    }
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(!shouldShow);

  useEffect(() => {
    if (!shouldShow) return;

    // Hard fail-safe: dismiss after 4 seconds no matter what
    const hardTimeout = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setDone(true);
    }, 4000);

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) {
      return () => window.clearTimeout(hardTimeout);
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return () => window.clearTimeout(hardTimeout);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const BAR_W = Math.min(W * 0.55, 440);
    const BAR_H = 3;
    let BAR_X = (W - BAR_W) / 2;
    let BAR_Y = H * 0.6;
    let FLOOR = H * 0.82;

    const BEAN_COUNT = 38;
    const GRAVITY = 0.32;
    const FRICTION = 0.985;

    const beans: FallingBean[] = Array.from({ length: BEAN_COUNT }, (_, i) => ({
      x: Math.random() * W,
      y: -30 - Math.random() * H * 0.4,
      vx: (Math.random() - 0.5) * 3,
      vy: 1 + Math.random() * 2.5,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.15,
      scale: 0.55 + Math.random() * 0.85,
      color: BEAN_COLORS[i % BEAN_COLORS.length],
      delay: Math.floor(Math.random() * 45),
      active: false,
    }));

    let progress = 0;
    const SPEED = 2.0;
    let barBeanAngle = 0;
    let frame = 0;
    let phase: "loading" | "hold" | "fadeout" = "loading";
    let holdFrames = 0;
    let fadeAlpha = 1;
    let rafId = 0;

    const finish = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setDone(true);
    };

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      frame++;

      if (phase === "fadeout") {
        fadeAlpha -= 0.06;
        if (fadeAlpha <= 0) {
          cancelAnimationFrame(rafId);
          finish();
          return;
        }
        wrap.style.opacity = String(Math.max(0, fadeAlpha));
        return;
      }

      if (phase === "hold") {
        holdFrames++;
        if (holdFrames > 18) phase = "fadeout";
        return;
      }

      progress = Math.min(100, progress + SPEED);
      const frac = progress / 100;
      barBeanAngle += 0.05;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#D7D1C1";
      ctx.fillRect(0, 0, W, H);

      const glow = ctx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, W * 0.6);
      glow.addColorStop(0, "rgba(177,117,87,0.12)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      let allSettled = true;
      beans.forEach((b) => {
        if (!b.active) {
          if (frame >= b.delay) b.active = true;
          else return;
        }
        b.vy += GRAVITY;
        b.vx *= FRICTION;
        b.vy *= FRICTION;
        b.x += b.vx;
        b.y += b.vy;
        b.rot += b.rotV;

        if (b.x < -20) b.x = W + 20;
        if (b.x > W + 20) b.x = -20;

        const floor = FLOOR + Math.sin(b.x * 0.01) * 12;
        if (b.y > floor) {
          b.y = floor;
          b.vy = -b.vy * 0.3;
          b.rotV *= 0.65;
        }
        if (Math.abs(b.vy) > 0.5 || b.y < floor - 3) allSettled = false;

        drawBean(ctx, b.x, b.y, b.rot, b.scale, b.color);
      });

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(177,117,87,0.95)";
      ctx.font = `700 ${Math.min(W * 0.09, 72)}px 'Playfair Display', Georgia, serif`;
      ctx.fillText("Cup S", W / 2, H * 0.38);

      ctx.fillStyle = "rgba(75,74,73,0.60)";
      ctx.font = `600 ${Math.min(W * 0.022, 12)}px 'Inter', sans-serif`;
      ctx.fillText("BREWED FOR TASTE", W / 2, H * 0.44);
      ctx.restore();

      ctx.fillStyle = "rgba(75,74,73,0.12)";
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(BAR_X, BAR_Y, BAR_W, BAR_H, 2);
      else ctx.rect(BAR_X, BAR_Y, BAR_W, BAR_H);
      ctx.fill();

      const fillW = frac * BAR_W;
      if (fillW > 0) {
        const grad = ctx.createLinearGradient(BAR_X, 0, BAR_X + BAR_W, 0);
        grad.addColorStop(0, "#8f5a40");
        grad.addColorStop(0.5, "#B17557");
        grad.addColorStop(1, "#c98f74");
        ctx.fillStyle = grad;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(BAR_X, BAR_Y, fillW, BAR_H, 2);
        else ctx.rect(BAR_X, BAR_Y, fillW, BAR_H);
        ctx.fill();
      }

      if (fillW > 10) {
        const bx = BAR_X + fillW;
        const by = BAR_Y + BAR_H / 2;
        const pulse = Math.sin(performance.now() * 0.007) * 2.5;

        const halo = ctx.createRadialGradient(bx, by, 0, bx, by, 30);
        halo.addColorStop(0, "rgba(177,117,87,0.3)");
        halo.addColorStop(1, "transparent");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(bx, by, 30, 0, Math.PI * 2);
        ctx.fill();

        drawBean(ctx, bx, by - 16 + pulse, barBeanAngle, 0.85, "#f0c878");
      }

      const count = Math.floor(progress);
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(177,117,87,0.85)";
      ctx.font = `500 ${Math.min(W * 0.024, 14)}px 'Inter', sans-serif`;
      ctx.fillText(`${count}%`, BAR_X + fillW, BAR_Y + 22);
      ctx.restore();

      if (progress >= 100 && allSettled) phase = "hold";
      else if (progress >= 100) {
        holdFrames++;
        if (holdFrames > 60) phase = "hold";
      }
    };

    const startId = window.setTimeout(() => tick(), 30);

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      BAR_X = (W - BAR_W) / 2;
      BAR_Y = H * 0.6;
      FLOOR = H * 0.82;
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(hardTimeout);
      clearTimeout(startId);
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [shouldShow]);

  if (done) return null;

  return (
    <div
      ref={wrapRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        pointerEvents: "none",
        opacity: 1,
        background: "#0a0807",
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
};

export default CoffeeBeanIntro;
