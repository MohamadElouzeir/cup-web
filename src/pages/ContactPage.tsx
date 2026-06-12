import { FormEvent, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "@/hooks/useTranslation";
import { useReveal } from "@/hooks/useReveal";
import { CONTACT, EMAILJS } from "@/lib/config";
import BeanTrail from "@/components/BeanTrail";

const RECAPTCHA_SITE_KEY = "6LdPlAAsAAAAAD4VvdtMqcy-7bh_EedmnOitAyqt";

const HISTORY_KEY = "cups_contact_history";
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

const ContactPage = () => {
  const { t } = useTranslation();
  const ref = useReveal<HTMLElement>();
  const formRef = useRef<HTMLFormElement>(null);
  const captchaRef = useRef<ReCAPTCHA>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [captchaDone, setCaptchaDone] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState<string>("");

  const validate = (): string | null => {
    if (!name.trim() || !email.trim() || !message.trim()) return t("contact.fillAll");
    if (message.trim().length < 10) return t("contact.shortMsg");
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(email.trim())) return t("contact.badEmail");
    if (!captchaDone) return t("contact.captcha");

    // Rate limit
    const now = Date.now();
    let history: number[] = [];
    try {
      history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch {
      history = [];
    }
    history = history.filter((ts) => now - ts < RATE_WINDOW);
    if (history.length >= RATE_LIMIT) return t("contact.rateLimit");
    return null;
  };

  const recordSend = () => {
    const now = Date.now();
    let history: number[] = [];
    try {
      history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch {
      history = [];
    }
    history = history.filter((ts) => now - ts < RATE_WINDOW);
    history.push(now);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const err = validate();
    if (err) {
      setErrMsg(err);
      setStatus("err");
      return;
    }
    setStatus("sending");
    setErrMsg("");

    try {
      const isPlaceholder =
        EMAILJS.publicKey.startsWith("YOUR_") ||
        EMAILJS.serviceId.startsWith("YOUR_") ||
        EMAILJS.templateId.startsWith("YOUR_");

      if (isPlaceholder) {
        await new Promise((r) => setTimeout(r, 900));
      } else {
        const params = {
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        };
        await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, params, { publicKey: EMAILJS.publicKey });
        await emailjs.send(EMAILJS.serviceId, "template_n9kdo07", params, { publicKey: EMAILJS.publicKey });
      }

      recordSend();
      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
      setCaptchaDone(false);
      captchaRef.current?.reset();
    } catch (e) {
      console.error(e);
      setErrMsg(t("contact.error"));
      setStatus("err");
    }
  };

  return (
    <section ref={ref} className="relative pt-32 pb-16 md:pt-40 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <BeanTrail density={18} mode="drift" />
      </div>

      <div className="relative container-page mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <p className="reveal-up text-amber-glow uppercase tracking-[0.3em] text-xs font-bold mb-3">
            {t("nav.contact")}
          </p>
          <h1 className="reveal-up h-display text-5xl md:text-7xl text-coffee-50 mb-3 shimmer-text">
            {t("contact.title")}
          </h1>
          <p className="reveal-up text-coffee-50/65 text-lg max-w-xl mx-auto">{t("contact.sub")}</p>
        </div>

        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="reveal-up glass-strong rounded-3xl p-6 md:p-10 space-y-5"
          noValidate
        >
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-coffee-50/80 mb-2">
              {t("contact.name")}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("contact.namePh")}
              className="w-full bg-white/80 border border-coffee-50/20 focus:border-amber-glow rounded-xl px-4 py-3 text-coffee-50 placeholder-coffee-50/40 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-coffee-50/80 mb-2">
              {t("contact.email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("contact.emailPh")}
              className="w-full bg-white/80 border border-coffee-50/20 focus:border-amber-glow rounded-xl px-4 py-3 text-coffee-50 placeholder-coffee-50/40 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-coffee-50/80 mb-2">
              {t("contact.message")}
            </label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("contact.messagePh")}
              className="w-full bg-white/80 border border-coffee-50/20 focus:border-amber-glow rounded-xl px-4 py-3 text-coffee-50 placeholder-coffee-50/40 outline-none transition-colors resize-y"
              required
            />
          </div>

          <div className="flex justify-center">
            <ReCAPTCHA
              ref={captchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(token) => setCaptchaDone(!!token)}
              onExpired={() => setCaptchaDone(false)}
              theme="dark"
            />
          </div>

          {status === "err" && errMsg && (
            <div className="text-red-300 text-sm font-medium px-2">{errMsg}</div>
          )}
          {status === "ok" && (
            <div className="text-emerald-300 text-sm font-medium px-2">{t("contact.success")}</div>
          )}

          <div className="flex items-center justify-between gap-4 pt-2">
            <p className="text-coffee-50/40 text-xs">
              {RATE_LIMIT} msg / hour limit
            </p>
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-primary text-base disabled:opacity-60 disabled:cursor-wait"
            >
              {status === "sending" ? t("contact.sending") : t("contact.send")} →
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-coffee-50/55 text-sm mb-4">{t("contact.or")}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] border border-[#1da851] text-white font-semibold text-sm hover:bg-[#1da851] transition-colors shadow-md"
            >
              <svg viewBox="0 0 32 32" className="w-5 h-5" fill="currentColor">
                <path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.5L4 29l7.7-1.9c1.9.9 4 1.4 6.3 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.6c-2 0-3.9-.5-5.6-1.4l-.4-.2-4.5 1.1 1.2-4.4-.3-.4c-1-1.7-1.5-3.7-1.5-5.7 0-5.6 4.5-10.1 10.1-10.1S26.1 8.4 26.1 14 21.6 24.6 16 24.6zm5.6-7.3c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.3 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.7 1.2 2.9.1.2 2 3.1 4.9 4.4 1.8.7 2.5.8 3.4.6.5-.1 1.8-.7 2-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.3z" />
              </svg>
              <span>{t("contact.whatsapp")} — {CONTACT.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
