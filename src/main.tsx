import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

if (typeof window !== "undefined" && typeof document !== "undefined") {
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

createRoot(document.getElementById("root")!).render(<App />);
