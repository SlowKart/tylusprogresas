import React from 'react';

/**
 * Centralized error handling utilities
 */

export interface AppError {
  message: string;
  code?: string;
  details?: unknown;
  timestamp: Date;
}

export class AppErrorHandler {
  private static instance: AppErrorHandler;
  private errorReporters: Array<(error: AppError) => void> = [];

  static getInstance(): AppErrorHandler {
    if (!AppErrorHandler.instance) {
      AppErrorHandler.instance = new AppErrorHandler();
    }
    return AppErrorHandler.instance;
  }

  /**
   * Register an error reporter (console, API, etc.)
   */
  addErrorReporter(reporter: (error: AppError) => void) {
    this.errorReporters.push(reporter);
  }

  /**
   * Handle and report errors consistently
   */
  handleError(error: Error | AppError, context?: string): AppError {
    const appError: AppError = {
      message: error.message || 'An unknown error occurred',
      code: 'code' in error ? error.code : undefined,
      details: error instanceof Error ? error.stack : error,
      timestamp: new Date(),
    };

    // Add context if provided
    if (context) {
      appError.message = `${context}: ${appError.message}`;
    }

    // Report to all registered reporters
    this.errorReporters.forEach(reporter => {
      try {
        reporter(appError);
      } catch (reportingError) {
        console.error('Error reporting failed:', reportingError);
      }
    });

    return appError;
  }

  /**
   * Handle async errors with proper error boundaries
   */
  async handleAsyncError<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error as Error, context);
      return null;
    }
  }
}

// Default error reporters
const consoleReporter = (error: AppError) => {
  console.error(`[${error.timestamp.toISOString()}] ${error.message}`, error.details);
};

// Initialize singleton with default reporters
const errorHandler = AppErrorHandler.getInstance();
errorHandler.addErrorReporter(consoleReporter);

// Export convenience functions
export const handleError = (error: Error | AppError, context?: string) => 
  errorHandler.handleError(error, context);

export const handleAsyncError = <T>(operation: () => Promise<T>, context?: string) => 
  errorHandler.handleAsyncError(operation, context);

/**
 * Form-specific error handling
 */
export interface FormError {
  field?: string;
  message: string;
  type: 'validation' | 'network' | 'unknown';
}

export class FormErrorHandler {
  static createValidationError(field: string, message: string): FormError {
    return {
      field,
      message,
      type: 'validation',
    };
  }

  static createNetworkError(message: string = 'Network error occurred'): FormError {
    return {
      message,
      type: 'network',
    };
  }

  static createUnknownError(message: string = 'An unknown error occurred'): FormError {
    return {
      message,
      type: 'unknown',
    };
  }

  static handleFormError(error: unknown, defaultMessage: string = 'Form submission failed'): FormError {
    if (error instanceof Error) {
      return {
        message: error.message || defaultMessage,
        type: 'unknown',
      };
    }
    
    if (typeof error === 'string') {
      return {
        message: error || defaultMessage,
        type: 'unknown',
      };
    }

    return {
      message: defaultMessage,
      type: 'unknown',
    };
  }
}

/**
 * React hook for error handling
 */
export function useErrorHandler() {
  return React.useCallback((error: Error | AppError, context?: string) => {
    return handleError(error, context);
  }, []);
}

/**
 * Error boundary context for React components
 */
export const ErrorContext = React.createContext<{
  reportError: (error: Error | AppError, context?: string) => void;
}>({
  reportError: handleError,
});

export const useErrorReporter = () => {
  const context = React.useContext(ErrorContext);
  return context.reportError;
};