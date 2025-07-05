// Validation utilities for program data structures

import { Program, ValidationResult, ValidationError, ValidationWarning } from '../types/program';

export function validateProgram(program: Program): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Validate required metadata
  if (!program.metadata.name) {
    errors.push({
      field: 'metadata.name',
      message: 'Program name is required',
      severity: 'error'
    });
  }

  if (!program.metadata.duration || program.metadata.duration < 1) {
    errors.push({
      field: 'metadata.duration',
      message: 'Program duration must be at least 1 week',
      severity: 'error'
    });
  }

  if (!program.metadata.difficulty) {
    errors.push({
      field: 'metadata.difficulty',
      message: 'Program difficulty is required',
      severity: 'error'
    });
  }

  if (!program.metadata.type) {
    errors.push({
      field: 'metadata.type',
      message: 'Program type is required',
      severity: 'error'
    });
  }

  // Validate weeks structure
  if (!program.weeks || program.weeks.length === 0) {
    errors.push({
      field: 'weeks',
      message: 'Program must have at least one week',
      severity: 'error'
    });
  } else {
    // Check week numbering
    const weekNumbers = program.weeks.map(w => w.number).sort((a, b) => a - b);
    const expectedWeeks = Array.from({ length: program.metadata.duration }, (_, i) => i + 1);
    
    if (weekNumbers.length !== expectedWeeks.length) {
      warnings.push({
        field: 'weeks',
        message: `Expected ${expectedWeeks.length} weeks but found ${weekNumbers.length}`,
        suggestion: 'Ensure all weeks are defined for the program duration'
      });
    }

    // Validate individual weeks
    program.weeks.forEach((week, index) => {
      if (!week.workouts || week.workouts.length === 0) {
        warnings.push({
          field: `weeks[${index}].workouts`,
          message: `Week ${week.number} has no workouts`,
          suggestion: 'Add at least one workout or mark as rest week'
        });
      }

      // Validate workouts
      week.workouts?.forEach((workout, workoutIndex) => {
        if (!workout.name) {
          errors.push({
            field: `weeks[${index}].workouts[${workoutIndex}].name`,
            message: 'Workout name is required',
            severity: 'error'
          });
        }

        if (!workout.type) {
          errors.push({
            field: `weeks[${index}].workouts[${workoutIndex}].type`,
            message: 'Workout type is required',
            severity: 'error'
          });
        }

        if (workout.day < 1 || workout.day > 7) {
          errors.push({
            field: `weeks[${index}].workouts[${workoutIndex}].day`,
            message: 'Workout day must be between 1 and 7',
            severity: 'error'
          });
        }

        // Validate exercises
        if (!workout.mainExercises || workout.mainExercises.length === 0) {
          warnings.push({
            field: `weeks[${index}].workouts[${workoutIndex}].mainExercises`,
            message: 'Workout has no main exercises',
            suggestion: 'Add at least one exercise or mark as rest day'
          });
        }

        workout.mainExercises?.forEach((exercise, exerciseIndex) => {
          if (!exercise.name) {
            errors.push({
              field: `weeks[${index}].workouts[${workoutIndex}].mainExercises[${exerciseIndex}].name`,
              message: 'Exercise name is required',
              severity: 'error'
            });
          }

          if (exercise.order === undefined || exercise.order < 0) {
            warnings.push({
              field: `weeks[${index}].workouts[${workoutIndex}].mainExercises[${exerciseIndex}].order`,
              message: 'Exercise order should be specified',
              suggestion: 'Set order index for proper exercise sequencing'
            });
          }
        });
      });
    });
  }

  // Validate phases if they exist
  if (program.phases && program.phases.length > 0) {
    program.phases.forEach((phase, index) => {
      if (!phase.name) {
        errors.push({
          field: `phases[${index}].name`,
          message: 'Phase name is required',
          severity: 'error'
        });
      }

      if (phase.startWeek < 1 || phase.endWeek > program.metadata.duration) {
        errors.push({
          field: `phases[${index}]`,
          message: 'Phase week range is invalid',
          severity: 'error'
        });
      }

      if (phase.startWeek > phase.endWeek) {
        errors.push({
          field: `phases[${index}]`,
          message: 'Phase start week must be before end week',
          severity: 'error'
        });
      }
    });
  }

  // Performance warnings
  if (program.totalWorkouts && program.totalWorkouts > 100) {
    warnings.push({
      field: 'totalWorkouts',
      message: 'Program has a very high number of workouts',
      suggestion: 'Consider breaking into multiple programs or reducing volume'
    });
  }

  if (program.estimatedTimePerWeek && program.estimatedTimePerWeek > 600) {
    warnings.push({
      field: 'estimatedTimePerWeek',
      message: 'Program requires more than 10 hours per week',
      suggestion: 'Consider reducing volume for better adherence'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateProgramMetadata(metadata: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const requiredFields = ['name', 'duration', 'difficulty', 'type'];
  
  requiredFields.forEach(field => {
    if (!metadata[field]) {
      errors.push({
        field: `metadata.${field}`,
        message: `${field} is required`,
        severity: 'error'
      });
    }
  });

  // Validate enums
  const validDifficulties = ['beginner', 'intermediate', 'advanced'];
  if (metadata.difficulty && !validDifficulties.includes(metadata.difficulty)) {
    errors.push({
      field: 'metadata.difficulty',
      message: `Difficulty must be one of: ${validDifficulties.join(', ')}`,
      severity: 'error'
    });
  }

  const validTypes = ['running', 'strength', 'mixed', 'cardio', 'flexibility'];
  if (metadata.type && !validTypes.includes(metadata.type)) {
    errors.push({
      field: 'metadata.type',
      message: `Type must be one of: ${validTypes.join(', ')}`,
      severity: 'error'
    });
  }

  // Duration validation
  if (metadata.duration) {
    if (typeof metadata.duration !== 'number' || metadata.duration < 1) {
      errors.push({
        field: 'metadata.duration',
        message: 'Duration must be a positive number',
        severity: 'error'
      });
    } else if (metadata.duration > 52) {
      warnings.push({
        field: 'metadata.duration',
        message: 'Program duration is longer than 1 year',
        suggestion: 'Consider breaking into multiple programs'
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateParsedData(data: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Basic structure validation
  if (!data || typeof data !== 'object') {
    errors.push({
      field: 'root',
      message: 'Data must be a valid object',
      severity: 'error'
    });
    return { isValid: false, errors, warnings };
  }

  // Required top-level fields
  const requiredFields = ['id', 'metadata', 'weeks'];
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push({
        field: field,
        message: `${field} is required`,
        severity: 'error'
      });
    }
  });

  // Validate metadata
  if (data.metadata) {
    const metadataValidation = validateProgramMetadata(data.metadata);
    errors.push(...metadataValidation.errors);
    warnings.push(...metadataValidation.warnings);
  }

  // Validate weeks array
  if (data.weeks) {
    if (!Array.isArray(data.weeks)) {
      errors.push({
        field: 'weeks',
        message: 'Weeks must be an array',
        severity: 'error'
      });
    } else if (data.weeks.length === 0) {
      errors.push({
        field: 'weeks',
        message: 'At least one week is required',
        severity: 'error'
      });
    }
  }

  // ID validation
  if (data.id && typeof data.id !== 'string') {
    errors.push({
      field: 'id',
      message: 'ID must be a string',
      severity: 'error'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function getValidationSummary(result: ValidationResult): string {
  if (result.isValid) {
    const warningCount = result.warnings.length;
    return warningCount > 0 
      ? `✅ Valid (${warningCount} warnings)`
      : '✅ Valid';
  } else {
    const errorCount = result.errors.length;
    const warningCount = result.warnings.length;
    return `❌ Invalid (${errorCount} errors, ${warningCount} warnings)`;
  }
}