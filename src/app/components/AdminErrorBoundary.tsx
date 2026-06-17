import React, { Component, ErrorInfo, ReactNode } from "react";
import { ShieldAlert, RefreshCw, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class AdminErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error inside Admin Panel:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev }));
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center p-6 text-[#F0E8D0]"
          style={{ background: "#060400", fontFamily: "'DM Sans', sans-serif" }}
        >
          <div
            className="max-w-2xl w-full p-8 md:p-10 rounded-3xl space-y-6"
            style={{
              background: "linear-gradient(135deg, #100d05, #141000)",
              border: "1px solid rgba(201, 168, 76, 0.25)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
            }}
          >
            <div className="text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/25 flex items-center justify-center mb-6 text-[#C9A84C] animate-pulse">
                <ShieldAlert size={32} />
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "var(--rose-gold, #E0C87A)",
                }}
                className="text-3xl font-extrabold tracking-wide"
              >
                Control Center Glitch
              </h2>
              <p className="mt-2 text-xs uppercase tracking-widest font-semibold text-gray-500">
                A critical rendering error has occurred
              </p>
            </div>

            <div className="p-4 bg-black/60 rounded-2xl border border-red-500/20 text-xs text-[#ff5277] font-semibold flex items-start gap-2.5">
              <span className="mt-0.5">•</span>
              <p className="leading-relaxed">
                {this.state.error?.message || "An unexpected JavaScript exception occurred."}
              </p>
            </div>

            <div className="border border-[#C9A84C]/10 rounded-2xl overflow-hidden bg-black/40">
              <button
                onClick={this.toggleDetails}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
              >
                <span>Technical Error Details</span>
                {this.state.showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {this.state.showDetails && (
                <div className="px-5 pb-5 border-t border-[#C9A84C]/10 pt-4 overflow-x-auto">
                  <pre className="text-[10px] font-mono text-gray-400 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                    {this.state.error?.stack}
                    {"\n\nComponent Stack:"}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-full text-black text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #E0C87A, #C9A84C)",
                  cursor: "pointer",
                }}
              >
                <RefreshCw size={14} />
                <span>Reload Panel</span>
              </button>

              <a
                href="/"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-full border border-[#C9A84C]/35 hover:border-[#C9A84C]/60 text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C9A84C]/5 text-center"
              >
                <ArrowLeft size={14} className="text-[#C9A84C]" />
                <span>Return to Storefront</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default AdminErrorBoundary;
