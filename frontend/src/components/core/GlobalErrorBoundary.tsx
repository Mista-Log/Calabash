"use client";

import * as React from "react";
import {
  AlertCircleIcon,
  RefreshIcon,
  Home01Icon,
} from "@/lib/icons/material-icons";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { M3Button } from "@/components/core/m3-button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleRestart = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface)] p-6">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-error-container)] text-[color:var(--md-sys-color-on-error-container)] mx-auto">
                <MaterialSymbol icon={AlertCircleIcon} size={48} />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Something went wrong.
              </h1>
              <p className="text-[color:var(--md-sys-color-on-surface-variant)] leading-relaxed">
                An unexpected error occurred. Don&apos;t worry, your academic
                data is safe. Let&apos;s get you back on track.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[color:var(--md-sys-color-surface-container-low)] border border-[color:var(--md-sys-color-outline-variant)] text-left overflow-auto max-h-40">
              <code className="text-[13px] text-[color:var(--md-sys-color-on-surface-variant)] font-mono">
                {this.state.error?.message || "Unknown error"}
              </code>
            </div>

            <div className="m3-action-row pt-4">
              <M3Button
                onClick={this.handleRestart}
                layout="mobile-full"
                className="gap-2"
              >
                <MaterialSymbol icon={RefreshIcon} size={18} />
                Restart Application
              </M3Button>
              <M3Button
                onClick={this.handleGoHome}
                variant="outlined"
                layout="mobile-full"
                className="gap-2"
              >
                <MaterialSymbol icon={Home01Icon} size={18} />
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
