'use client';

import React, { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface FormErrorBoundaryProps {
  children: ReactNode;
  onRetry?: () => void;
}

/**
 * Form-specific error boundary with retry functionality
 */
export function FormErrorBoundary({ children, onRetry }: FormErrorBoundaryProps) {
  const fallbackUI = (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-destructive">Form Error</CardTitle>
        <CardDescription>
          There was an error with the form. Please try again.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Button onClick={onRetry} className="w-full">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ErrorBoundary fallback={fallbackUI}>
      {children}
    </ErrorBoundary>
  );
}