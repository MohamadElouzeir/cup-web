import { useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  onConfirm: () => void;
  onDeny: () => void;
}

const AgeGate = ({ onConfirm, onDeny }: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDeny();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onDeny]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-title"
      className="fixed inset-0 z-[200] flex items-center justify-center px-4 sm:px-6"
      style={{ animation: "fadeIn 0.3s ease forwards" }}
    >
      <div
        className="absolute inset-0 bg-coffee-900/85 backdrop-blur-xl"
        onClick={onDeny}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-md glass-strong rounded-3xl p-7 sm:p-9 text-center border border-amber-glow/30 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
      >
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-glow/25 to-amber-glow/5 border border-amber-glow/40 flex items-center justify-center text-amber-glow mx-auto mb-5"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 sm:w-10 sm:h-10">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7 V13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="12" cy="17" r="1.3" fill="currentColor" />
          </svg>
        </div>

        <h2 id="age-title" className="h-display text-2xl sm:text-3xl text-coffee-50 mb-3 leading-tight">
          {t("age.title")}
        </h2>
        <p className="text-coffee-50/70 text-sm sm:text-base leading-relaxed mb-7">
          {t("age.sub")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onDeny} className="btn-ghost flex-1 justify-center text-sm sm:text-base">
            {t("age.no")}
          </button>
          <button onClick={onConfirm} className="btn-primary flex-1 justify-center text-sm sm:text-base">
            {t("age.yes")} →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.85) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AgeGate;
