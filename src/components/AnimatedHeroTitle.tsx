interface Props {
  text: string;
  className?: string;
  /** Stagger offset (seconds) on entrance — useful for sequencing lines */
  entranceDelay?: number;
}

const LETTER_ANIMATIONS = [
  "hero-letter-wiggle",
  "hero-letter-bounce",
  "hero-letter-glow",
  "hero-letter-scale",
];

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

const AnimatedHeroTitle = ({ text, className = "", entranceDelay = 0 }: Props) => {
  return (
    <span aria-label={text} className={className}>
      {Array.from(text).map((char, i) => {
        if (char === " ") return <span key={i}>&nbsp;</span>;

        const animClass = LETTER_ANIMATIONS[i % LETTER_ANIMATIONS.length];
        const delay = entranceDelay + 0.05 + seededRandom(i + 17) * 0.9;

        return (
          <span
            key={i}
            className={`inline-block ${animClass}`}
            style={{ animationDelay: `${delay.toFixed(2)}s` }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

export default AnimatedHeroTitle;
