import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (
            id.includes("react") ||
            id.includes("scheduler") ||
            id.includes("react-dom") ||
            id.includes("react-router-dom")
          ) {
            return "react-vendor";
          }

          if (
            id.includes("@radix-ui") ||
            id.includes("embla-carousel-react") ||
            id.includes("sonner") ||
            id.includes("cmdk") ||
            id.includes("vaul")
          ) {
            return "ui-vendor";
          }

          if (
            id.includes("framer-motion") ||
            id.includes("recharts") ||
            id.includes("react-day-picker")
          ) {
            return "visual-vendor";
          }

          if (
            id.includes("zustand") ||
            id.includes("@tanstack/react-query") ||
            id.includes("zod") ||
            id.includes("react-hook-form") ||
            id.includes("@hookform/resolvers") ||
            id.includes("date-fns")
          ) {
            return "data-vendor";
          }
        },
      },
    },
  },
}));
