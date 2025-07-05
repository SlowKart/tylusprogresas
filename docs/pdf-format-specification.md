# PDF Format Specification

## Overview
This document defines the standardized format for fitness program PDFs to ensure consistent parsing into structured JSON data.

## Analysis of Existing PDFs

### Nike 5K Training Program
- **Duration**: 8 weeks
- **Structure**: Week-by-week breakdown with specific workouts
- **Workout Types**: Speed runs, Long runs, Recovery runs, Rest days
- **Key Sections**: Pace chart, workout schedules, glossary

### Athletic Strength & Power Program  
- **Duration**: 12 weeks (3 phases of 4 weeks each)
- **Structure**: Phase-based with different focuses per phase
- **Workout Types**: Strength, Power, Conditioning, Recovery
- **Key Sections**: Phase breakdowns, exercise descriptions, RPE charts

## Standardized PDF Format Requirements

### 1. Program Header (Required)
```
PROGRAM NAME
Duration: X weeks
Difficulty: Beginner/Intermediate/Advanced
Type: Running/Strength/Mixed
Author: [Optional]
```

### 2. Program Overview (Required)
```
Description: Brief program description
Goals: What the program aims to achieve
Equipment: Required equipment (if any)
Prerequisites: Experience level or fitness requirements
```

### 3. Program Structure (Required)
```
Phase 1: [Name] (Week 1-X)
- Focus: [e.g., Base Building, Strength, Power]
- Description: [Brief description]

Phase 2: [Name] (Week Y-Z)
- Focus: [e.g., Intensity, Endurance]
- Description: [Brief description]
```

### 4. Weekly Schedule Template (Required)
```
Week [X]: [Week Name/Focus]
Day 1: [Workout Name/Type]
- [Workout details]
Day 2: [Workout Name/Type]
- [Workout details]
...
Day 7: Rest/Recovery
```

### 5. Workout Details Format (Required)
```
[Workout Name]
Type: [Speed/Long/Recovery/Strength/etc.]
Duration: [Time or Distance]
Intensity: [RPE/Pace/Percentage]
Description: [Detailed instructions]
```

### 6. Exercise Format (For Strength Programs)
```
[Exercise Name]
Sets: X
Reps: Y
Weight: [Percentage/RPE/Fixed]
Rest: [Time between sets]
Notes: [Form cues, modifications]
```

### 7. Parsing Markers
To ensure consistent parsing, PDFs should include these markers:

- **Program Start**: `PROGRAM:` followed by program name
- **Week Start**: `WEEK [NUMBER]:` or `[NUMBER] WEEK[S] TO GO`
- **Day Start**: `DAY [NUMBER]:` or specific day names
- **Exercise Start**: Numbered lists or bullet points
- **Phase Start**: `PHASE [NUMBER]:` or distinct section headers

## Recommended Sections (Optional)
- Warm-up routines
- Cool-down/recovery protocols
- Nutrition guidelines
- Progress tracking methods
- FAQ section
- Glossary of terms

## Parsing Priorities
1. **Program metadata** (name, duration, difficulty)
2. **Weekly structure** (which week, which day)
3. **Workout details** (type, duration, intensity)
4. **Exercise specifics** (sets, reps, weight, rest)
5. **Additional notes** (form cues, modifications)

## Format Flexibility
The parser should handle variations in:
- Date formats (Week 1, Week 01, 8 WEEKS TO GO)
- Day formats (Day 1, Monday, MON)
- Exercise notation (bullet points, numbered lists, structured tables)
- Intensity notation (RPE, percentage, descriptive terms)

## Examples from Current PDFs

### Nike Format Example:
```
08 WEEKS TO GO
RECOVERY RUN
NRC Guided Run: 5 Minute Run
5:00 Recovery Run

SPEED RUN
NRC Guided Run: First Speed Run
Intervals
8 x 1:00 5K Pace
1:00 Recovery between all intervals
```

### Athletic Format Example:
```
PHASE 1: FOUNDATIONAL STRENGTH AND HYPERTROPHY
WEEK 1-2

DAY 1: LOWER BODY STRENGTH + DURABILITY
A1. PAUSE TRAP BAR DEADLIFT: 4X6 (60 SECS REST)
A2. DEPTH DROP + VERTICAL JUMP: 4X5 (60 SECS REST)
```

This specification provides a framework for consistent PDF parsing while accommodating the variety in existing program formats.