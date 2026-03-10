import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppRecoveryBoundary } from "./components/app/AppRecoveryBoundary.tsx";
import "./index.css";

const FROGWARD_STORAGE_KEYS = [
  "frogward-auth",
  "frogward-cart",
  "frogward-customers",
  "frogward-lang",
  "frogward-marketing",
  "frogward-orders",
  "frogward-products",
  "frogward-theme",
] as const;
const MAX_MARKETING_STORAGE_LENGTH = 4_000_000;

const validatePersistedState = () => {
  if (typeof window === "undefined") return;

  for (const key of FROGWARD_STORAGE_KEYS) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw) as { state?: unknown } | null;
      if (!parsed || typeof parsed !== "object" || !("state" in parsed)) {
        window.localStorage.removeItem(key);
      }
    } catch {
      window.localStorage.removeItem(key);
    }
  }

  const marketingRaw = window.localStorage.getItem("frogward-marketing");
  if (marketingRaw && marketingRaw.length > MAX_MARKETING_STORAGE_LENGTH) {
    window.localStorage.removeItem("frogward-marketing");
  }
};

if (typeof window !== "undefined" && typeof document !== "undefined") {
  validatePersistedState();

  // Initialize theme from localStorage before render
  const stored = window.localStorage.getItem("frogward-theme");
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      document.documentElement.classList.toggle("dark", state?.theme === "dark");
    } catch {
      document.documentElement.classList.add("dark");
    }
  } else {
    document.documentElement.classList.add("dark");
  }
}

createRoot(document.getElementById("root")!).render(
  <AppRecoveryBoundary>
    <App />
  </AppRecoveryBoundary>
);
