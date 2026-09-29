/**
 * @file ErrorBoundary.tsx
 * @description Robust React Error Boundary implementation conforming to enterprise resilience standards.
 * Captures unhandled JavaScript errors anywhere in the child component tree, logs diagnostic stack traces,
 * and renders a polished fallback interface with recovery mechanisms without crashing the host applet.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Copy, Check, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

export interface ErrorBoundaryProps {
  key?: React.Key;
  children: ReactNode;
  fallback?: ReactNode;
  title?: string;
  sectionName?: string;
  variant?: 'page' | 'widget' | 'inline';
  onReset?: () => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
  showDetails: boolean;
}

/**
 * Class-based Error Boundary to catch render-time lifecycle errors.
 * Implements componentDidCatch and getDerivedStateFromError.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
    showDetails: false,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log diagnostics to developer console
    console.error('[OLMS Error Boundary Caught Exception]:', {
      error,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      section: this.props.sectionName || 'Root Application',
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      showDetails: false,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleCopyDiagnostics = () => {
    const { error, errorInfo } = this.state;
    const diagnosticReport = [
      `=== OLMS Error Diagnostics ===`,
      `Section: ${this.props.sectionName || 'Application Root'}`,
      `Timestamp: ${new Date().toISOString()}`,
      `Error Message: ${error?.message || 'Unknown error'}`,
      `Stack Trace:`,
      error?.stack || 'No stack trace available',
      `Component Stack:`,
      errorInfo?.componentStack || 'No component hierarchy available',
      `==============================`,
    ].join('\n');

    navigator.clipboard.writeText(diagnosticReport).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2500);
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo, copied, showDetails } = this.state;
    const { children, fallback, title, sectionName, variant = 'page' } = this.props;

    if (!hasError) {
      return children;
    }

    if (fallback) {
      return fallback;
    }

    // Inline variant for small widgets/buttons
    if (variant === 'inline') {
      return (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>Failed to render {sectionName || 'component'}</span>
          </div>
          <button
            onClick={this.handleReset}
            className="text-xs font-semibold text-red-800 underline hover:text-red-950 cursor-pointer"
          >
            Retry
          </button>
        </div>
      );
    }

    // Widget variant for dashboard cards
    if (variant === 'widget') {
      return (
        <div className="p-5 bg-white border border-red-200 rounded-xl shadow-sm text-slate-800 flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                {title || `${sectionName || 'Widget'} Encountered an Error`}
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {error?.message || 'An unexpected rendering error occurred in this module.'}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload Widget
            </button>
          </div>
        </div>
      );
    }

    // Full page fallback (default)
    return (
      <div className="min-h-[500px] flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 mb-2">
                Resilience Boundary Active
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {title || 'Component Rendering Interrupted'}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                The application encountered an isolated runtime error in{' '}
                <strong className="text-slate-800">{sectionName || 'this view'}</strong>. The rest of the library system remains fully operational.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold uppercase tracking-wider">Error Details</span>
              <button
                onClick={this.handleCopyDiagnostics}
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Diagnostics'}</span>
              </button>
            </div>
            <code className="text-xs text-red-600 font-mono block break-words">
              {error?.name || 'Error'}: {error?.message || 'An unexpected exception was caught'}
            </code>

            {/* Toggle Full Stack Details */}
            <div className="mt-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => this.setState({ showDetails: !showDetails })}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-medium"
              >
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                <span>{showDetails ? 'Hide Stack Trace' : 'Inspect Stack Trace'}</span>
                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showDetails && (
                <div className="mt-2 text-left">
                  <pre className="text-[11px] leading-relaxed font-mono p-3 bg-slate-900 text-slate-200 rounded-lg overflow-x-auto max-h-48 whitespace-pre-wrap">
                    {error?.stack || 'No JavaScript call stack available.'}
                    {'\n\nComponent Hierarchy:'}
                    {errorInfo?.componentStack || '\nNo component stack available.'}
                  </pre>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={() => {
                this.handleReset();
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              Reload Page
            </button>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Recover & Continue
            </button>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Component used to simulate an error in the Error Boundary to demonstrate resilience.
 */
export const BuggySimulator: React.FC<{ shouldCrash: boolean }> = ({ shouldCrash }) => {
  if (shouldCrash) {
    throw new Error('Simulated runtime exception triggered by reviewer test mode (OLMS_ERR_0x9A).');
  }
  return null;
};
