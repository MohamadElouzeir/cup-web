import { useTranslation } from "@/hooks/useTranslation";
import { useReveal } from "@/hooks/useReveal";

const Icon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-glow/20 to-amber-glow/5 border border-amber-glow/30 flex items-center justify-center text-amber-glow group-hover:scale-110 transition-transform">
    {children}
  </div>
);

const FeaturesGrid = () => {
  const { t } = useTranslation();
  const ref = useReveal<HTMLElement>();

  const feats = [
    {
      title: t("feat.1.title"),
      desc: t("feat.1.desc"),
      svg: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>
      ),
    },
    {
      title: t("feat.2.title"),
      desc: t("feat.2.desc"),
      svg: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path d="M13 3 L4 14 H11 L10 21 L20 9 H13 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
      ),
    },
    {
      title: t("feat.3.title"),
      desc: t("feat.3.desc"),
      svg: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 7 V12 L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      ),
    },
    {
      title: t("feat.4.title"),
      desc: t("feat.4.desc"),
      svg: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path d="M12 3 L20 7 V12 C20 17 12 21 12 21 C12 21 4 17 4 12 V7 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M9 12 L11 14 L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
    },
    {
      title: t("feat.5.title"),
      desc: t("feat.5.desc"),
      svg: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M8 9 H16 M8 13 H13 M8 17 H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      ),
    },
    {
      title: t("feat.6.title"),
      desc: t("feat.6.desc"),
      svg: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path d="M12 3 L14 8 H12 L16 13 H13 L18 19 H6 L11 13 H8 L12 8 H10 Z" fill="currentColor"/></svg>
      ),
    },
  ];

  return (
    <section ref={ref} className="section relative">
      <div className="container-page mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="reveal-up text-amber-glow uppercase tracking-[0.3em] text-xs font-bold mb-3">
            Why us
          </p>
          <h2 className="reveal-up h-display text-4xl md:text-6xl text-coffee-50 mb-4">
            {t("features.title")}
          </h2>
          <p className="reveal-up text-coffee-50/65 text-lg">{t("features.sub")}</p>
        </div>

        <div className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {feats.map((f) => (
            <div
              key={f.title}
              className="reveal-up group glass rounded-2xl p-6 md:p-7 hover:border-amber-glow/30 transition-all duration-500"
            >
              <Icon>{f.svg}</Icon>
              <h3 className="mt-5 text-xl font-bold text-coffee-50">{f.title}</h3>
              <p className="mt-2 text-coffee-50/65 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
