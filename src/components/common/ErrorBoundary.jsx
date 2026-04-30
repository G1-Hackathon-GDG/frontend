import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("FuelPass UI crashed", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl shadow-sm p-6">
            <p className="text-sm font-bold uppercase tracking-wider text-red-600 mb-2">
              Interface Error
            </p>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Something on this page failed to render.
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              Check the browser console for the exact error. The app stayed
              mounted so the page will not collapse into a blank screen.
            </p>
            <pre className="text-xs bg-gray-100 rounded-lg p-3 overflow-auto text-gray-700">
              {this.state.error.message}
            </pre>
            <button
              className="mt-4 px-4 py-2 rounded-lg bg-blue-900 text-white text-sm font-semibold"
              onClick={() => this.setState({ error: null })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
