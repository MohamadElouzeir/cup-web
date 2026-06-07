import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const Navbar = () => {
  const { t, locale, setLocale } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/menu", label: t("nav.menu") },
    { to: "/locations", label: t("nav.locations") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div
          className={`container-page mx-auto flex items-center justify-between px-4 md:px-6 ${
            scrolled ? "glass-strong" : ""
          } rounded-full transition-all duration-300`}
          style={
            scrolled
              ? { padding: "0.6rem 1rem" }
              : { padding: "0.6rem 1rem", background: "transparent", border: "1px solid transparent" }
          }
        >
          <Link to="/" className="flex items-center gap-2" aria-label="Cup S">
            <img
              src="/images/logo-bold.png"
              alt="Cup S logo"
              className="h-14 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                    isActive ? "text-amber-glow" : "text-coffee-50/85 hover:text-amber-glow"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{l.label}</span>
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-amber-glow" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocale(locale === "en" ? "ar" : "en")}
              className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15 text-coffee-50/90 hover:border-amber-glow/60 hover:text-amber-glow transition-all text-sm font-bold"
              aria-label="Toggle language"
              title={locale === "en" ? "Switch to Arabic" : "Switch to English"}
            >
              {locale === "en" ? "ع" : "EN"}
            </button>

            <Link to="/menu" className="hidden lg:inline-flex btn-primary text-sm">
              {t("nav.menu")} →
            </Link>

            <button
              onClick={() => setOpen((s) => !s)}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full glass-strong text-coffee-50"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span className="relative block w-5 h-4">
                <span
                  className={`absolute left-0 right-0 h-[2px] bg-current rounded-full transition-all ${
                    open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 right-0 h-[2px] bg-current rounded-full top-1/2 -translate-y-1/2 transition-all ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 right-0 h-[2px] bg-current rounded-full transition-all ${
                    open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 z-[99] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-coffee-900/85 backdrop-blur-xl" onClick={() => setOpen(false)} />
        <div
          className={`absolute right-0 top-0 bottom-0 w-[82%] max-w-sm bg-gradient-to-b from-coffee-800 to-coffee-900 border-l border-amber-glow/20 transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          } pt-24 px-6 flex flex-col`}
          style={{ ["--rtl-flip" as never]: "1" }}
        >
          <nav className="flex flex-col gap-2">
            {links.map((l, i) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-2xl font-display font-bold py-3 px-2 border-b border-white/5 transition-colors ${
                    isActive ? "text-amber-glow" : "text-coffee-50"
                  }`
                }
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pb-10 flex items-center gap-3">
            <button
              onClick={() => setLocale(locale === "en" ? "ar" : "en")}
              className="btn-ghost text-sm"
            >
              {locale === "en" ? "العربية" : "English"}
            </button>
            <Link to="/menu" className="btn-primary text-sm flex-1 justify-center">
              {t("nav.menu")} →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
