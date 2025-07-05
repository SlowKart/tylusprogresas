# PDF-to-JSON Program Parser Documentation

## Overview

This documentation outlines the complete system for parsing fitness program PDFs into structured JSON data for your fitness app MVP. The system is designed to handle curated programs that can be scaled to different difficulty levels.

## 📁 File Structure

```
docs/
├── pdf-format-specification.md     # Standardized PDF format requirements
├── pdf-parsing-requirements.md     # Technical parsing specifications  
└── database-schema-design.md       # Database structure for parsed data

src/
├── types/program.ts                # TypeScript interfaces for all data structures
└── utils/programValidation.ts      # Validation functions for parsed data

examples/
├── sample-nike-5k-program.json     # Example running program structure
└── sample-athletic-strength-program.json  # Example strength program structure
```

## 🎯 System Goals

1. **Upload PDFs** in consistent format
2. **Parse to JSON** using predefined structure  
3. **Display to users** through the app interface
4. **Scale programs** to different difficulty levels
5. **Track progress** as users complete workouts

## 📋 Phase 1 Completed Tasks

✅ **Research existing PDF samples** - Analyzed Nike 5K and Athletic Strength programs  
✅ **Define standardized PDF format** - Created parsing specification document  
✅ **Document parsing requirements** - Technical implementation guidelines  
✅ **Create TypeScript interfaces** - Complete data structure definitions  
✅ **Design database schema** - 12 tables for comprehensive program storage  
✅ **Create sample JSON data** - Validated structure with real program examples  
✅ **Create validation functions** - Ensure data integrity and completeness  

## 🏗️ Data Structure Overview

### Core Types
- **Program**: Complete fitness program with metadata, weeks, and workouts
- **Week**: Weekly structure with workouts and rest days
- **Workout**: Individual training session with exercises
- **Exercise**: Specific movement with sets, reps, intensity
- **Phase**: Multi-week training blocks (for periodized programs)

### Key Features
- **Flexible intensity specification** (RPE, percentage, pace, descriptive)
- **Equipment tracking** for each exercise and workout
- **Exercise grouping** (supersets, circuits, sequences)
- **User progress tracking** with completion data
- **Validation system** with errors and warnings

## 📊 Database Design

The schema includes 12 main tables:
- `programs` - Program metadata and information
- `program_phases` - Multi-phase program structure  
- `program_weeks` - Weekly organization
- `program_workouts` - Individual workout sessions
- `workout_exercises` - Exercise details and specifications
- `exercise_groups` - Superset/circuit groupings
- `user_programs` - User enrollment and progress
- `workout_completions` - Completed workout tracking
- `exercise_completions` - Exercise-level completion data
- `program_templates` - Reusable program structures
- `parsing_metadata` - PDF parsing confidence and errors

## 🔍 Parsing Strategy

### Input: PDF Files
- Nike 5K Program: 8-week running program with audio guidance
- Athletic Strength Program: 12-week, 3-phase strength/power program

### Processing: Pattern Recognition
- Extract program metadata (name, duration, difficulty)
- Identify weekly/phase structure  
- Parse workout details (type, duration, exercises)
- Extract exercise specifications (sets, reps, intensity)

### Output: Structured JSON
```json
{
  "id": "program-unique-id",
  "metadata": { "name": "...", "duration": 8, "difficulty": "intermediate" },
  "weeks": [
    {
      "number": 1,
      "workouts": [
        {
          "name": "Speed Run",
          "type": "speed", 
          "day": 2,
          "mainExercises": [
            {
              "name": "Speed Intervals",
              "sets": 8,
              "duration": 60,
              "intensity": { "type": "pace", "value": "5k" }
            }
          ]
        }
      ]
    }
  ]
}
```

## 🎨 Sample Programs Created

### Nike 5K Training Program
- **Type**: Running
- **Duration**: 8 weeks  
- **Structure**: Progressive speed, recovery, and long runs
- **Features**: Audio-guided workouts, pace-based intensity

### Athletic Strength Program  
- **Type**: Strength training
- **Duration**: 12 weeks (3 phases)
- **Structure**: Foundational → Strength/Power → Peak/Contrast
- **Features**: Complex exercise groupings, RPE-based intensity

## ✅ Validation System

The validation functions check for:
- **Required fields** (name, duration, difficulty, type)
- **Data consistency** (week numbering, day ranges)
- **Structure integrity** (workouts have exercises, proper ordering)
- **Performance warnings** (excessive volume, unrealistic durations)

Example validation output:
```typescript
{
  isValid: true,
  errors: [],
  warnings: [
    {
      field: "estimatedTimePerWeek", 
      message: "Program requires more than 10 hours per week",
      suggestion: "Consider reducing volume for better adherence"
    }
  ]
}
```

## 🚀 Next Steps (Phase 2)

1. **Implement JSON types in codebase** - Add type definitions to app
2. **Create database migrations** - Set up table structure in Supabase  
3. **Build PDF parser** - Extract structured data from PDF text
4. **Create API endpoints** - Handle program storage and retrieval
5. **Build UI components** - Display programs and track progress

## 🔧 Technical Implementation

### Technologies Used
- **TypeScript** for type safety and interfaces
- **Supabase/PostgreSQL** for database storage
- **pdf-parse** library for text extraction  
- **Next.js/React** for frontend display

### Key Considerations
- **Parsing confidence levels** (90-100% high, 70-89% medium, 50-69% low)
- **Error handling** for malformed PDFs and missing data
- **Scalability** for different program types and structures
- **User experience** for program selection and progress tracking

## 📖 Usage Examples

### Parsing a PDF
```typescript
import { validateProgram } from './src/utils/programValidation';
import { Program } from './src/types/program';

const parsedProgram: Program = parsePDFToProgram(pdfBuffer);
const validation = validateProgram(parsedProgram);

if (validation.isValid) {
  await saveProgramToDatabase(parsedProgram);
} else {
  console.log('Validation errors:', validation.errors);
}
```

### Displaying Programs
```typescript
const programs = await fetchProgramsByType('running');
const userProgram = await enrollUserInProgram(userId, programId);
const progress = calculateProgress(userProgram);
```

This foundation provides a robust, type-safe system for transforming PDF fitness programs into structured, scalable data that can power your fitness app MVP.