/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        // Small-phone breakpoint. `xs:` classes are already used across the
        // hero + menu wheel; without this they were silently dropped.
        xs: "400px",
      },
      colors: {
        // NOTE: scale is intentionally light->dark so existing usages flip
        // to a light theme. `coffee-50` (used as primary text) is now dark,
        // `coffee-900` (used as page background) is now light beige.
        coffee: {
          50: "#4B4A49",  // primary text — dark grey
          100: "#5a5856", // muted dark
          200: "#8a8782",
          300: "#a39e96",
          400: "#B17557", // brand brown (mid accent)
          500: "#b9b3a6",
          600: "#c7c1b4",
          700: "#cfc9bb",
          800: "#d2ccbe",
          900: "#D7D1C1", // page background — beige
        },
        amber: {
          glow: "#B17557", // brand brown (was gold)
          deep: "#8f5a40", // darker brown
          soft: "#c98f74", // lighter brown
        },
        cedar: "#B17557",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        arabic: ['"Cairo"', '"Noto Naskh Arabic"', "system-ui", "sans-serif"],
        // Forte-like casual script for the "Member of Houmani Group" brand mark.
        // Real Forte is used if installed; otherwise Pacifico (web-loaded).
        script: ['"Forte"', '"Pacifico"', "cursive"],
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "spin-slow": "spin 18s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 24px rgba(177,117,87,0.35)" },
          "50%": { boxShadow: "0 0 60px rgba(177,117,87,0.65)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
