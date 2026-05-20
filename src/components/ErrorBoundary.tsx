import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6 text-center">
          <div className="max-w-md">
            <div className="text-6xl mb-4">☕</div>
            <h1 className="h-display text-3xl text-coffee-50 mb-3">Something spilled.</h1>
            <p className="text-coffee-50/65 text-sm mb-4">
              An unexpected error stopped this page from loading.
            </p>
            <pre className="text-left text-xs text-red-300/80 bg-coffee-900/60 border border-red-400/20 rounded-lg p-3 overflow-auto max-h-40">
              {String(this.state.error?.message || this.state.error)}
            </pre>
            <button
              onClick={() => {
                this.setState({ error: null });
                window.location.hash = "#/";
              }}
              className="btn-primary text-sm mt-5"
            >
              Back to home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
