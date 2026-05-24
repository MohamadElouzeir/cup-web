import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  text: string;
  className?: string;
  /** Stagger offset (seconds) on entrance — useful for sequencing lines */
  entranceDelay?: number;
}

const LETTER_ANIMATIONS = [
  "hero-letter-wiggle",
  "hero-letter-bounce",
  "hero-letter-flip",
  "hero-letter-glow",
  "hero-letter-fade",
  "hero-letter-scale",
];

const BEAN_EFFECTS = [
  "hero-bean-spin-in",
  "hero-bean-drop-in",
  "hero-bean-grow-in",
  "hero-bean-flip-in",
  "hero-bean-fade-in",
];

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

const CoffeeBeanSVG = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      width: "0.78em",
      height: "0.78em",
      display: "inline-block",
      verticalAlign: "baseline",
    }}
    aria-hidden="true"
  >
    <ellipse cx="12" cy="12" rx="8" ry="11" fill="#f5a623" />
    <path
      d="M12 1C10 6 10 18 12 23"
      stroke="#0a0807"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Animated hero title — each letter has a looping micro-animation;
 * every `O` periodically morphs into a spinning coffee bean and back.
 */
const AnimatedHeroTitle = ({ text, className = "", entranceDelay = 0 }: Props) => {
  const oIndices = useMemo(() => {
    const idx: number[] = [];
    for (let i = 0; i < text.length; i++) {
      if (text[i].toUpperCase() === "O") idx.push(i);
    }
    return idx;
  }, [text]);

  const [beanStates, setBeanStates] = useState<Record<number, { showBean: boolean; effect: string }>>({});
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setBeanStates({});

    // Only one O can show as a bean at a time to keep the word readable
    let activeIdx: number | null = null;

    const initialDelays = [2400, 4800, 7200];
    oIndices.forEach((idx, oi) => {
      const startToggle = (delay: number) => {
        const tid = setTimeout(() => {
          setBeanStates((prev) => {
            const currently = prev[idx]?.showBean;
            if (!currently && activeIdx !== null) {
              // Another O is already a bean — skip this turn
              startToggle(2000 + Math.random() * 2000);
              return prev;
            }
            const next = !currently;
            activeIdx = next ? idx : null;
            const effect = BEAN_EFFECTS[Math.floor(Math.random() * BEAN_EFFECTS.length)];
            startToggle(3500 + Math.random() * 5500);
            return { ...prev, [idx]: { showBean: next, effect } };
          });
        }, delay);
        timersRef.current.push(tid);
      };
      startToggle(initialDelays[oi % initialDelays.length]);
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [oIndices]);

  return (
    <span aria-label={text} className={className}>
      {Array.from(text).map((char, i) => {
        if (char === " ") return <span key={i}>&nbsp;</span>;

        const animClass = LETTER_ANIMATIONS[i % LETTER_ANIMATIONS.length];
        const delay = entranceDelay + 0.05 + seededRandom(i + 17) * 0.9;

        const isO = char.toUpperCase() === "O";
        const bean = beanStates[i];
        const showBean = isO && bean?.showBean;

        return (
          <span
            key={i}
            className={`inline-block relative ${animClass}`}
            style={{ animationDelay: `${delay.toFixed(2)}s` }}
          >
            <span className={showBean ? "opacity-0" : ""}>{char}</span>
            {showBean && (
              <span className={`absolute inset-0 flex items-center justify-center ${bean.effect}`}>
                <CoffeeBeanSVG />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
};

export default AnimatedHeroTitle;
