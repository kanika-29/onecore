import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled exception:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-50 text-[#D52B1E] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              !
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-[#121212]">Something went wrong</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                An unexpected issue occurred while rendering this page. You can reload or return to the homepage.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex justify-center items-center px-5 py-2.5 rounded-full bg-[#121212] text-white text-sm font-medium hover:bg-black transition-colors"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex justify-center items-center px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
