/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        coffee: {
          50: "#f6efe7",
          100: "#e8d8c2",
          200: "#c9a778",
          300: "#a87a45",
          400: "#7b5430",
          500: "#4f3520",
          600: "#3a2618",
          700: "#261810",
          800: "#16100b",
          900: "#0a0807",
        },
        amber: {
          glow: "#f5a623",
          deep: "#c97a16",
          soft: "#fbd38d",
        },
        cedar: "#c89c52",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        arabic: ['"Cairo"', '"Noto Naskh Arabic"', "system-ui", "sans-serif"],
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
          "0%,100%": { boxShadow: "0 0 24px rgba(245,166,35,0.35)" },
          "50%": { boxShadow: "0 0 60px rgba(245,166,35,0.65)" },
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
