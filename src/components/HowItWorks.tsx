import { useTranslation } from "@/hooks/useTranslation";
import { useReveal } from "@/hooks/useReveal";

const HowItWorks = () => {
  const { t } = useTranslation();
  const ref = useReveal<HTMLElement>();

  const steps = [
    {
      n: "01",
      title: t("how.s1.title"),
      desc: t("how.s1.desc"),
      icon: (
        <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
          <rect x="10" y="6" width="44" height="52" rx="8" stroke="currentColor" strokeWidth="3" />
          <rect x="16" y="14" width="32" height="20" rx="3" fill="currentColor" opacity="0.2" />
          <circle cx="32" cy="46" r="5" stroke="currentColor" strokeWidth="3" />
        </svg>
      ),
    },
    {
      n: "02",
      title: t("how.s2.title"),
      desc: t("how.s2.desc"),
      icon: (
        <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
          <path d="M14 28 L14 50 H50 V28 L40 18 H24 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="32" cy="38" r="6" fill="currentColor" opacity="0.6" />
          <path d="M24 10 V18 M40 10 V18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      n: "03",
      title: t("how.s3.title"),
      desc: t("how.s3.desc"),
      icon: (
        <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
          <path d="M18 22 H46 L44 52 H20 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <path d="M46 26 C 52 26, 54 32, 50 36 L44 38" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M24 10 Q28 18 24 22 M32 10 Q36 18 32 22 M40 10 Q44 18 40 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
        </svg>
      ),
    },
  ];

  return (
    <section ref={ref} className="section">
      <div className="container-page mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="reveal-up text-amber-glow uppercase tracking-[0.3em] text-xs font-bold mb-3">
            Process
          </p>
          <h2 className="reveal-up h-display text-4xl md:text-6xl text-coffee-50 mb-4">
            {t("how.title")}
          </h2>
          <p className="reveal-up text-coffee-50/65 text-lg">{t("how.sub")}</p>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="reveal-up group relative glass rounded-2xl p-7 md:p-9 overflow-hidden hover:border-amber-glow/30 transition-all duration-500 hover:-translate-y-1"
            >
              <div
                className="absolute -top-8 -right-6 text-[7rem] md:text-[9rem] font-display font-black text-amber-glow/8 leading-none pointer-events-none select-none"
                aria-hidden="true"
              >
                {s.n}
              </div>
              <div className="text-amber-glow mb-5">{s.icon}</div>
              <h3 className="h-display text-2xl md:text-3xl text-coffee-50 mb-3">{s.title}</h3>
              <p className="text-coffee-50/65 leading-relaxed text-sm md:text-base">{s.desc}</p>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-glow/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
