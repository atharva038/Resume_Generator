import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  Home,
  LifeBuoy,
  Terminal,
  ChevronDown,
} from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={() =>
            this.setState({ hasError: false, error: null, errorInfo: null })
          }
        />
      );
    }

    return this.props.children;
  }
}

// Modern Error Fallback Component
function ErrorFallback({ error, errorInfo, resetError }) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    resetError();
    navigate("/");
  };

  const handleGoBack = () => {
    resetError();
    window.history.back();
  };

  const handleReload = () => {
    resetError();
    window.location.reload();
  };

  const errorId = React.useMemo(
    () => Date.now().toString(36).toUpperCase(),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-zinc-100 flex items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Main Error Card */}
        <div className="bg-white dark:bg-zinc-900/90 rounded-3xl border border-gray-200/90 dark:border-white/[0.1] shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Header Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-rose-500/10 via-rose-600/5 to-amber-500/10 dark:from-rose-950/40 dark:via-rose-900/20 dark:to-zinc-900/40 px-6 sm:px-8 py-8 sm:py-10 border-b border-gray-100 dark:border-white/5 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-rose-500/15 dark:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 mb-4 shadow-lg shadow-rose-500/10 animate-in zoom-in-90 duration-200">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Oops! Something Went Wrong
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-300 mt-2 max-w-md mx-auto leading-relaxed">
              We encountered an unexpected rendering error. Your data is safe and our diagnostic system has recorded this issue.
            </p>
          </div>

          {/* Details & Actions */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Error Message Box */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wider">
                Error Message:
              </label>
              <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 font-mono text-xs sm:text-sm text-rose-800 dark:text-rose-300 break-words leading-relaxed">
                {error?.message || "An unknown component error occurred"}
              </div>
            </div>

            {/* Collapsible Technical Stack */}
            {import.meta.env.DEV && errorInfo && (
              <details className="group rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50/60 dark:bg-zinc-950/60 p-4">
                <summary className="cursor-pointer text-xs sm:text-sm font-bold text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-500" />
                    <span>View Technical Stack Details</span>
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/5 overflow-auto max-h-56">
                  <pre className="text-[11px] font-mono text-gray-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}

            {/* Quick Solutions */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/50 space-y-2.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-900 dark:text-blue-200">
                <LifeBuoy className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Recommended Recovery Steps:</span>
              </div>
              <ul className="text-xs sm:text-sm text-blue-800/90 dark:text-blue-300/90 space-y-1.5 list-disc list-inside leading-relaxed pl-1">
                <li>Refresh the page to reset active application state</li>
                <li>Go back to the previous working page</li>
                <li>Navigate to the homepage to restart your workflow</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleReload}
                className="flex-1 min-w-[140px] px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-md shadow-blue-500/20 active:scale-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Page</span>
              </button>

              <button
                onClick={handleGoBack}
                className="flex-1 min-w-[140px] px-5 py-3.5 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 font-bold rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xs active:scale-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>

              <button
                onClick={handleGoHome}
                className="flex-1 min-w-[140px] px-5 py-3.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 text-white font-bold rounded-2xl shadow-2xs active:scale-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </button>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="bg-gray-50/70 dark:bg-zinc-950/70 px-6 sm:px-8 py-4 border-t border-gray-100 dark:border-white/5 text-center">
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Error ID: <span className="font-mono font-bold text-gray-700 dark:text-zinc-300">{errorId}</span> • Need assistance?{" "}
              <a
                href="/contact"
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400 dark:text-zinc-500">
          This exception has been recorded to ensure continuous system reliability.
        </p>
      </div>
    </div>
  );
}

export default ErrorBoundary;
