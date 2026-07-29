import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('digital_library_active_user');
    window.location.reload();
  };

  private handleClearAll = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">Terjadi Kesalahan Tampilan</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Aplikasi mendeteksi kendala pada data lokal atau sesi pengguna.
              </p>
              {this.state.error && (
                <div className="mt-3 p-3 bg-slate-950 rounded-xl text-[10px] font-mono text-rose-400 text-left overflow-x-auto border border-rose-900/30 max-h-32">
                  {this.state.error.toString()}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-blue-500/20"
              >
                Muat Ulang Sesi
              </button>
              
              <button
                onClick={this.handleClearAll}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-all cursor-pointer"
              >
                Reset Cache & Data Lokal
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
