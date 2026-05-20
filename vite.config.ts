import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    target: "es2019",
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ["gsap"],
          leaflet: ["leaflet"],
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
  server: { port: 5173, host: true },
});
