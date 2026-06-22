"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">An unexpected error occurred.</p>
          <Button onClick={() => this.setState({ hasError: false })}>Try again</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
