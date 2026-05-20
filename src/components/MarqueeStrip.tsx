import { useTranslation } from "@/hooks/useTranslation";

const MarqueeStrip = () => {
  const { t } = useTranslation();
  const items = [
    t("marquee.1"),
    t("marquee.2"),
    t("marquee.3"),
    t("marquee.4"),
    t("marquee.5"),
  ];
  const doubled = [...items, ...items, ...items];

  return (
    <div className="relative border-y border-amber-glow/15 py-5 bg-coffee-800/40 overflow-hidden">
      <div className="marquee-track gap-10 whitespace-nowrap">
        {doubled.map((s, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-amber-glow/85 text-2xl md:text-4xl font-display font-bold tracking-tight"
          >
            {s}
            <span className="text-amber-glow/40 text-2xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeStrip;
