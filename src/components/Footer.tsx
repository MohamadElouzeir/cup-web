import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { CONTACT } from "@/lib/config";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-white/5 bg-coffee-900/60">
      <div className="container-page mx-auto px-5 md:px-8 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <Link to="/" className="inline-block text-coffee-50" aria-label="Cup S">
            <img
              src="/images/logo.png"
              alt="Cup S logo"
              className="h-20 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 text-coffee-50/60 text-sm leading-relaxed max-w-xs">
            {t("footer.tag")}
          </p>
        </div>

        <div>
          <h4 className="text-amber-glow font-bold mb-4 text-sm uppercase tracking-widest">
            {t("footer.quick")}
          </h4>
          <ul className="space-y-2 text-coffee-50/75">
            <li><Link to="/" className="hover:text-amber-glow transition-colors">{t("nav.home")}</Link></li>
            <li><Link to="/menu" className="hover:text-amber-glow transition-colors">{t("nav.menu")}</Link></li>
            <li><Link to="/locations" className="hover:text-amber-glow transition-colors">{t("nav.locations")}</Link></li>
            <li><Link to="/contact" className="hover:text-amber-glow transition-colors">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-amber-glow font-bold mb-4 text-sm uppercase tracking-widest">
            {t("footer.contact")}
          </h4>
          <ul className="space-y-2 text-coffee-50/75">
            <li>
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-amber-glow transition-colors"
              >
                <svg viewBox="0 0 32 32" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                  <path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.5L4 29l7.7-1.9c1.9.9 4 1.4 6.3 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm5.6 14.3c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.3 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.7 1.2 2.9.1.2 2 3.1 4.9 4.4 1.8.7 2.5.8 3.4.6.5-.1 1.8-.7 2-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.3z" />
                </svg>
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <Link to="/contact" className="hover:text-amber-glow transition-colors">
                {t("nav.contact")} →
              </Link>
            </li>
            <li className="text-coffee-50/55 text-sm pt-1">{CONTACT.locationLabel}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-page mx-auto px-5 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-coffee-50/45">
          <span>© {year} Cup S. {t("footer.rights")}</span>
          <span className="shimmer-text font-bold tracking-widest text-xs">BREWED FOR TASTE</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
