import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Atelier Error Boundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#01173C] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white border border-[#D4AF37]/40 p-8 shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37] text-2xl font-serif">
              🏛️
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif text-[#01173C] font-bold">House of Seetah</h2>
              <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Atelier Masterpiece Experience</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-light">
              We encountered a temporary session error loading the gallery experience. Clicking below will reset the local session cache and reload the atelier.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full py-3.5 bg-[#01173C] hover:bg-[#032254] text-white font-semibold text-xs uppercase tracking-widest transition duration-300 shadow-md border border-[#D4AF37]/40"
            >
              Reset Cache & Reload Atelier
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
