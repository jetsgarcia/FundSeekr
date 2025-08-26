import React from "react";

interface ErrorPageProps {
  error?: string;
  onRetry?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  error = "Something went wrong.",
  onRetry,
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto bg-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-destructive/20">
        <div className="text-center py-8 px-6">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-lg border border-destructive text-destructive bg-transparent hover:bg-destructive/10 transition-colors font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ErrorPage;