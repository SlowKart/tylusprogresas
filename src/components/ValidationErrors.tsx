import React, { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

interface ValidationErrorsProps {
  errors: Record<string, string>;
  onClear?: () => void;
  title?: string;
  className?: string;
}

/**
 * Component to display validation errors in a consistent format
 * Memoized to prevent unnecessary re-renders when errors haven't changed
 */
export const ValidationErrors = memo(function ValidationErrors({ 
  errors, 
  onClear, 
  title = "Validation Errors",
  className = ""
}: ValidationErrorsProps) {
  const errorEntries = Object.entries(errors);
  
  if (errorEntries.length === 0) {
    return null;
  }

  return (
    <Card className={`border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 ${className}`}>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-200 ml-2">
          {title}
        </CardTitle>
        {onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="ml-auto p-0 h-4 w-4 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {errorEntries.map(([field, message]) => (
            <CardDescription 
              key={field}
              className="text-amber-700 dark:text-amber-300 text-sm"
            >
              <span className="font-medium capitalize">
                {field.replace(/([A-Z])/g, ' $1').trim()}:
              </span>{' '}
              {message}
            </CardDescription>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

/**
 * Field-specific validation error component
 */
interface FieldErrorProps {
  error?: string;
  className?: string;
}

export const FieldError = memo(function FieldError({ error, className = "" }: FieldErrorProps) {
  if (!error) {
    return null;
  }

  return (
    <p className={`text-sm text-destructive mt-1 ${className}`}>
      {error}
    </p>
  );
});