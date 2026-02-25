"use client";

import * as React from "react";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { M3Button } from "@/components/core";
import { cn } from "@/lib/utils";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Log error to console (in production, send to error tracking service)
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  handleGoHome = (): void => {
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard";
    }
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[60vh] items-center justify-center p-4">
          <div
            className={cn(
              "w-full max-w-lg rounded-3xl border",
              "bg-[color:var(--md-sys-color-surface-container)]",
              "border-[color:var(--md-sys-color-outline-variant)]",
              "p-6 sm:p-8",
            )}
          >
            {/* Error Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-error-container)]">
              <MaterialSymbol
                icon="error"
                size={28}
                className="text-[color:var(--md-sys-color-on-error-container)]"
              />
            </div>

            {/* Error Message */}
            <h2 className="text-[22px] font-semibold text-[color:var(--md-sys-color-on-surface)]">
              Something went wrong
            </h2>
            <p className="mt-2 text-[14px] text-[color:var(--md-sys-color-on-surface-variant)]">
              We encountered an unexpected error. Don&apos;t worry, your data is safe.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] p-4">
                <summary className="cursor-pointer text-[13px] font-semibold text-[color:var(--md-sys-color-on-surface-variant)]">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 max-h-48 overflow-auto text-[11px] text-[color:var(--md-sys-color-error)]">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="m3-action-row mt-6">
              <M3Button
                variant="outlined"
                onClick={this.handleReset}
                className="flex-1"
              >
                Try Again
              </M3Button>
              <M3Button
                onClick={this.handleReload}
                className="flex-1"
              >
                Reload Page
              </M3Button>
            </div>
            <div className="m3-action-row mt-2">
              <M3Button
                variant="text"
                onClick={this.handleGoHome}
                className="w-full"
              >
                Go to Dashboard
              </M3Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary for functional components
 * Returns error state and reset function
 */
export function useErrorBoundary(): {
  error: Error | null;
  showError: (error: Error) => void;
  clearError: () => void;
  hasError: boolean;
} {
  const [error, setError] = React.useState<Error | null>(null);
  const [hasError, setHasError] = React.useState(false);

  const showError = React.useCallback((err: Error) => {
    setError(err);
    setHasError(true);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
    setHasError(false);
  }, []);

  return {
    error,
    showError,
    clearError,
    hasError,
  };
}

/**
 * Async error handler wrapper
 * Wraps async functions to catch and handle errors
 */
export function withErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  onError?: (error: Error) => void,
): (...args: T) => Promise<R | null> {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("[withErrorHandling] Error:", err);
      onError?.(err);
      return null;
    }
  };
}
