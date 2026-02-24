"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <Card className="mx-auto mt-12 max-w-md text-center">
          <div className="mb-4 text-4xl">!</div>
          <h2 className="mb-2 text-lg font-semibold text-white">
            Something went wrong
          </h2>
          <p className="mb-4 text-sm text-gray-400">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <Button
            variant="primary"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}
