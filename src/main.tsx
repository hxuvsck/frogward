import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme from localStorage before render
const stored = localStorage.getItem('frogward-theme');
if (stored) {
  try {
    const { state } = JSON.parse(stored);
    document.documentElement.classList.toggle('dark', state?.theme === 'dark');
  } catch {}
} else {
  // Default dark
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById("root")!).render(<App />);
