import { Component, type ErrorInfo, type ReactNode } from "react";

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

interface AppRecoveryBoundaryProps {
  children: ReactNode;
}

interface AppRecoveryBoundaryState {
  hasError: boolean;
}

export class AppRecoveryBoundary extends Component<
  AppRecoveryBoundaryProps,
  AppRecoveryBoundaryState
> {
  state: AppRecoveryBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppRecoveryBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App crashed", error, errorInfo);
  }

  private handleReset = () => {
    for (const key of FROGWARD_STORAGE_KEYS) {
      try {
        window.localStorage.removeItem(key);
      } catch {}
    }

    window.location.assign("/");
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="container flex min-h-screen max-w-2xl items-center justify-center px-6 py-16">
          <div className="w-full rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Frogward Recovery
            </p>
            <h1 className="mt-4 font-heading text-3xl font-bold">
              Stored browser data broke the app
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Reset local Frogward data for this browser and reload the site.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Reset Local Data
            </button>
          </div>
        </div>
      </main>
    );
  }
}
