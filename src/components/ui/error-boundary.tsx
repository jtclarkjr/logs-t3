"use client";

import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { Component, type ReactNode } from "react";
import { Alert, AlertDescription } from "./alert";
import { Button } from "./button";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

export class ErrorBoundary extends Component<
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
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Alert className="m-4" variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-3">
            <div>
              <strong>Something went wrong</strong>
              <p className="mt-1 text-sm">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
            </div>
            <Button
              className="w-fit"
              onClick={this.handleReset}
              size="sm"
              variant="outline"
            >
              <RefreshCwIcon className="mr-2 h-3 w-3" />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

// Simpler error display component for query errors
interface QueryErrorProps {
  error: unknown;
  onRetry?: () => void;
  title?: string;
}

export function QueryError({
  error,
  onRetry,
  title = "Failed to load data",
}: QueryErrorProps) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "An error occurred while fetching data";

  return (
    <Alert variant="destructive">
      <AlertTriangleIcon className="h-4 w-4" />
      <AlertDescription className="flex flex-col gap-3">
        <div>
          <strong>{title}</strong>
          <p className="mt-1 text-sm">{message}</p>
        </div>
        {onRetry && (
          <Button
            className="w-fit"
            onClick={onRetry}
            size="sm"
            variant="outline"
          >
            <RefreshCwIcon className="mr-2 h-3 w-3" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
