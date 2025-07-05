import { useState, useCallback } from "react";
import { ZodSchema, ZodError } from "zod";

/**
 * Custom hook for form validation using Zod schemas
 */
export function useValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(true);

  /**
   * Validate data against a Zod schema
   */
  const validate = useCallback(<TData>(
    data: unknown,
    schema: ZodSchema<TData>
  ): { success: true; data: TData } | { success: false; errors: Record<string, string> } => {
    try {
      const validatedData = schema.parse(data);
      setErrors({});
      setIsValid(true);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const field = issue.path.join('.');
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
        setIsValid(false);
        return { success: false, errors: fieldErrors };
      }
      // Handle non-Zod errors
      const genericError = { _form: "Validation failed" };
      setErrors(genericError);
      setIsValid(false);
      return { success: false, errors: genericError };
    }
  }, []);

  /**
   * Validate a single field
   */
  const validateField = useCallback(<TData>(
    fieldName: string,
    value: unknown,
    schema: ZodSchema<TData>
  ): boolean => {
    try {
      schema.parse(value);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      setIsValid(Object.keys(errors).length <= 1); // Check if this was the last error
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues[0]?.message || "Invalid value";
        setErrors(prev => ({
          ...prev,
          [fieldName]: errorMessage
        }));
        setIsValid(false);
        return false;
      }
      return false;
    }
  }, [errors]);

  /**
   * Clear all validation errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(true);
  }, []);

  /**
   * Clear error for a specific field
   */
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    setIsValid(Object.keys(errors).length <= 1);
  }, [errors]);

  /**
   * Get error message for a specific field
   */
  const getFieldError = useCallback((fieldName: string): string | undefined => {
    return errors[fieldName];
  }, [errors]);

  /**
   * Check if a specific field has an error
   */
  const hasFieldError = useCallback((fieldName: string): boolean => {
    return fieldName in errors;
  }, [errors]);

  return {
    errors,
    isValid,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    getFieldError,
    hasFieldError
  };
}

/**
 * Hook for real-time field validation
 */
export function useFieldValidation<T>(
  fieldName: string,
  schema: ZodSchema<T>
) {
  const { validateField, getFieldError, hasFieldError, clearFieldError } = useValidation();

  const validateValue = useCallback((value: unknown) => {
    return validateField(fieldName, value, schema);
  }, [fieldName, schema, validateField]);

  return {
    validateValue,
    error: getFieldError(fieldName),
    hasError: hasFieldError(fieldName),
    clearError: () => clearFieldError(fieldName)
  };
}