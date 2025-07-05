// Simple PDF parser for structured program PDFs

import { SimpleProgram, ParsedProgram, Week, Day, Exercise, ProgramDifficulty, ProgramType } from '../types/simpleProgram';

export function parseSimplePDF(pdfText: string): ParsedProgram {
  const errors: string[] = [];
  const warnings: string[] = [];
  let confidence = 100;

  try {
    // Clean up the text
    const cleanText = pdfText.trim().replace(/\r\n/g, '\n');
    const lines = cleanText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Parse metadata
    const metadata = parseMetadata(lines, errors);
    if (!metadata) {
      return {
        program: {} as SimpleProgram,
        parseErrors: ['Failed to parse program metadata'],
        parseWarnings: warnings,
        confidence: 0
      };
    }

    // Parse weeks
    const weeks = parseWeeks(lines, errors, warnings);
    if (weeks.length === 0) {
      errors.push('No weeks found in PDF');
      confidence = 0;
    }

    // Calculate confidence based on errors and warnings
    confidence = Math.max(0, 100 - (errors.length * 25) - (warnings.length * 10));

    const program: SimpleProgram = {
      id: generateProgramId(metadata.name),
      metadata,
      weeks,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return {
      program,
      parseErrors: errors,
      parseWarnings: warnings,
      confidence
    };

  } catch (error) {
    return {
      program: {} as SimpleProgram,
      parseErrors: [`Parsing failed: ${error}`],
      parseWarnings: warnings,
      confidence: 0
    };
  }
}

function parseMetadata(lines: string[], errors: string[]) {
  const metadata: any = {
    equipment: []
  };

  for (const line of lines) {
    if (line.startsWith('PROGRAM:')) {
      metadata.name = line.replace('PROGRAM:', '').trim();
    } else if (line.startsWith('DURATION:')) {
      const durationMatch = line.match(/DURATION:\s*(\d+)\s*weeks?/i);
      if (durationMatch) {
        metadata.duration = parseInt(durationMatch[1]);
      } else {
        errors.push('Invalid duration format');
      }
    } else if (line.startsWith('DIFFICULTY:')) {
      const difficulty = line.replace('DIFFICULTY:', '').trim().toLowerCase();
      if (['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
        metadata.difficulty = difficulty as ProgramDifficulty;
      } else {
        errors.push(`Invalid difficulty: ${difficulty}`);
      }
    } else if (line.startsWith('TYPE:')) {
      const type = line.replace('TYPE:', '').trim().toLowerCase();
      if (['running', 'strength', 'cardio', 'flexibility', 'mixed'].includes(type)) {
        metadata.type = type as ProgramType;
      } else {
        errors.push(`Invalid type: ${type}`);
      }
    } else if (line.startsWith('EQUIPMENT:')) {
      const equipmentText = line.replace('EQUIPMENT:', '').trim();
      metadata.equipment = equipmentText.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
  }

  // Validate required fields
  if (!metadata.name) errors.push('Program name is required');
  if (!metadata.duration) errors.push('Program duration is required');
  if (!metadata.difficulty) errors.push('Program difficulty is required');
  if (!metadata.type) errors.push('Program type is required');

  return errors.length > 0 ? null : metadata;
}

function parseWeeks(lines: string[], errors: string[], warnings: string[]): Week[] {
  const weeks: Week[] = [];
  let currentWeek: Week | null = null;
  let currentDay: Day | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for week start
    const weekMatch = line.match(/^WEEK\s+(\d+):/i);
    if (weekMatch) {
      // Save previous week if exists
      if (currentWeek) {
        if (currentDay) {
          currentWeek.days.push(currentDay);
          currentDay = null;
        }
        weeks.push(currentWeek);
      }

      // Start new week
      currentWeek = {
        number: parseInt(weekMatch[1]),
        days: []
      };
      continue;
    }

    // Check for day start
    const dayMatch = line.match(/^DAY\s+(\d+):\s*(.*)/i);
    if (dayMatch && currentWeek) {
      // Save previous day if exists
      if (currentDay) {
        currentWeek.days.push(currentDay);
      }

      // Start new day
      const dayNumber = parseInt(dayMatch[1]);
      const dayName = dayMatch[2].trim();

      currentDay = {
        day: dayNumber,
        name: dayName,
        exercises: []
      };
      continue;
    }

    // Check for exercise (lines starting with -)
    if (line.startsWith('-') && currentDay) {
      const exerciseText = line.substring(1).trim();
      const exercise = parseExercise(exerciseText, warnings);
      if (exercise) {
        currentDay.exercises.push(exercise);
      }
      continue;
    }
  }

  // Don't forget the last week and day
  if (currentDay && currentWeek) {
    currentWeek.days.push(currentDay);
  }
  if (currentWeek) {
    weeks.push(currentWeek);
  }

  return weeks;
}

function parseExercise(exerciseText: string, warnings: string[]): Exercise | null {
  // Split on first colon to separate name and details
  const colonIndex = exerciseText.indexOf(':');
  if (colonIndex === -1) {
    warnings.push(`Exercise missing details: ${exerciseText}`);
    return {
      name: exerciseText,
      details: ''
    };
  }

  const name = exerciseText.substring(0, colonIndex).trim();
  const details = exerciseText.substring(colonIndex + 1).trim();

  if (!name) {
    warnings.push(`Exercise missing name: ${exerciseText}`);
    return null;
  }

  return {
    name,
    details
  };
}

function generateProgramId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50) + '-v1';
}

// Validation function for simple programs
export function validateSimpleProgram(program: SimpleProgram): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate metadata
  if (!program.metadata?.name) errors.push('Program name is required');
  if (!program.metadata?.duration || program.metadata.duration < 1) errors.push('Valid duration is required');
  if (!program.metadata?.difficulty) errors.push('Difficulty is required');
  if (!program.metadata?.type) errors.push('Type is required');

  // Validate weeks
  if (!program.weeks || program.weeks.length === 0) {
    errors.push('At least one week is required');
  } else {
    // Check week numbering
    const weekNumbers = program.weeks.map(w => w.number).sort((a, b) => a - b);
    for (let i = 0; i < weekNumbers.length; i++) {
      if (weekNumbers[i] !== i + 1) {
        warnings.push(`Week numbering gap: expected ${i + 1}, found ${weekNumbers[i]}`);
      }
    }

    // Validate each week
    program.weeks.forEach((week, weekIndex) => {
      if (!week.days || week.days.length === 0) {
        warnings.push(`Week ${week.number} has no days`);
      }

      week.days?.forEach((day, dayIndex) => {
        if (day.day < 1 || day.day > 7) {
          errors.push(`Week ${week.number}, day ${dayIndex + 1}: Invalid day number ${day.day}`);
        }
        if (!day.name) {
          errors.push(`Week ${week.number}, day ${day.day}: Day name is required`);
        }
        if (day.name !== 'REST' && (!day.exercises || day.exercises.length === 0)) {
          warnings.push(`Week ${week.number}, day ${day.day}: Non-rest day has no exercises`);
        }
      });
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Helper function to convert simple program to display format
export function formatProgramForDisplay(program: SimpleProgram) {
  return {
    title: program.metadata.name,
    subtitle: `${program.metadata.duration} weeks • ${program.metadata.difficulty} • ${program.metadata.type}`,
    equipment: program.metadata.equipment.length > 0 ? `Equipment: ${program.metadata.equipment.join(', ')}` : 'No equipment needed',
    weeks: program.weeks.map(week => ({
      title: `Week ${week.number}`,
      days: week.days.map(day => ({
        title: `Day ${day.day}: ${day.name}`,
        isRest: day.name === 'REST' || day.exercises.length === 0,
        exercises: day.exercises.map(exercise => `${exercise.name}: ${exercise.details}`)
      }))
    }))
  };
}