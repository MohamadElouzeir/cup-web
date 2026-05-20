import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useReveal } from "@/hooks/useReveal";
import BeanTrail from "./BeanTrail";

const CTASection = () => {
  const { t } = useTranslation();
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="relative section overflow-hidden">
      <div className="absolute inset-0">
        <BeanTrail density={40} mode="waterfall" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(245,166,35,0.18), transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 container-page mx-auto text-center max-w-2xl px-2">
        <h2 className="reveal-up h-display text-4xl md:text-7xl text-coffee-50 mb-5">
          {t("cta.title")}
        </h2>
        <p className="reveal-up text-coffee-50/70 text-lg mb-9">{t("cta.sub")}</p>
        <div className="reveal-up flex flex-wrap items-center justify-center gap-3">
          <Link to="/locations" className="btn-primary text-base md:text-lg">
            {t("cta.locations")} →
          </Link>
          <Link to="/contact" className="btn-ghost text-base md:text-lg">
            {t("cta.contact")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
