# PDF Parsing Requirements

## Overview
This document defines the technical requirements for parsing fitness program PDFs into structured JSON data.

## Parsing Strategy

### 1. Text Extraction
- **Library**: pdf-parse (already implemented)
- **Input**: PDF file buffer
- **Output**: Raw text string
- **Preprocessing**: Clean up whitespace, normalize line breaks

### 2. Pattern Recognition
The parser must identify and extract:

#### Program Metadata
- **Pattern**: First occurrence of program title (all caps, large text)
- **Regex**: `/^[A-Z\s]+PROGRAM|^[A-Z\s]+TRAINING/m`
- **Extract**: Program name, duration, difficulty, type

#### Week Identifiers
- **Patterns**: 
  - `WEEK [NUMBER]` or `[NUMBER] WEEK[S] TO GO`
  - `PHASE [NUMBER]` (for phase-based programs)
- **Regex**: `/(\d+)\s*WEEK[S]?\s*TO\s*GO|WEEK\s*(\d+)|PHASE\s*(\d+)/gi`

#### Day Identifiers
- **Patterns**:
  - `DAY [NUMBER]` or day names (MONDAY, MON, etc.)
  - Numbered workout sessions
- **Regex**: `/DAY\s*(\d+)|MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY|MON|TUE|WED|THU|FRI|SAT|SUN/gi`

#### Workout Types
- **Patterns**: 
  - SPEED RUN, LONG RUN, RECOVERY RUN, REST DAY
  - STRENGTH, POWER, CONDITIONING, CORE
- **Regex**: `/SPEED\s*RUN|LONG\s*RUN|RECOVERY\s*RUN|REST\s*DAY|STRENGTH|POWER|CONDITIONING|CORE/gi`

#### Exercise Details
- **Patterns**:
  - Sets x Reps format: `4X6`, `3 x 8`, `5 sets of 10`
  - Time durations: `5:00`, `30 seconds`, `2 minutes`
  - Intensity: `5K Pace`, `RPE 7`, `85%`
- **Regex**: `/(\d+)\s*[Xx]\s*(\d+)|(\d+)\s*sets?\s*of\s*(\d+)|(\d+):(\d+)|(\d+)\s*(?:seconds?|secs?|minutes?|mins?)/gi`

### 3. Parsing Algorithm

#### Step 1: Extract Program Metadata
```javascript
function extractProgramMetadata(text) {
  // Find program title
  // Extract duration (weeks)
  // Identify difficulty level
  // Determine program type
}
```

#### Step 2: Identify Program Structure
```javascript
function identifyStructure(text) {
  // Check for phase-based or week-based structure
  // Extract phase/week boundaries
  // Map weeks to phases if applicable
}
```

#### Step 3: Parse Weekly Content
```javascript
function parseWeeklyContent(text, weekBoundaries) {
  // For each week:
  //   - Extract daily workouts
  //   - Parse workout details
  //   - Extract exercise information
}
```

#### Step 4: Extract Exercise Details
```javascript
function parseExerciseDetails(exerciseText) {
  // Extract sets, reps, weight, rest periods
  // Parse intensity indicators
  // Extract form cues and notes
}
```

### 4. Error Handling

#### Common Parsing Challenges
1. **OCR Errors**: Misread characters, merged words
2. **Format Variations**: Different notation styles
3. **Missing Information**: Incomplete exercise details
4. **Layout Issues**: Multi-column layouts, tables

#### Fallback Strategies
- **Fuzzy Matching**: Use string similarity for exercise names
- **Context Clues**: Infer missing information from surrounding text
- **Manual Validation**: Flag ambiguous content for review

### 5. Output Structure

#### Parsed Data Format
```typescript
interface ParsedProgram {
  metadata: {
    name: string;
    duration: number; // weeks
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    type: 'running' | 'strength' | 'mixed';
    author?: string;
  };
  phases: Phase[];
  weeks: Week[];
  exercises: Exercise[];
}
```

### 6. Validation Rules

#### Data Completeness
- Program must have name and duration
- Each week must have at least one workout
- Exercises must have clear instructions

#### Data Consistency
- Week numbers must be sequential
- Exercise references must be valid
- Intensity levels must be within reasonable ranges

### 7. Parsing Confidence Levels

#### High Confidence (90-100%)
- Clear pattern matches
- Complete exercise details
- Consistent formatting

#### Medium Confidence (70-89%)
- Some ambiguity in parsing
- Minor format variations
- Inferred information

#### Low Confidence (50-69%)
- Significant ambiguity
- Missing key information
- Requires manual review

### 8. Implementation Considerations

#### Performance
- Stream processing for large PDFs
- Efficient regex compilation
- Minimal memory usage

#### Scalability
- Support for various PDF formats
- Extensible parsing rules
- Easy addition of new patterns

#### Maintenance
- Clear logging of parsing decisions
- Debugging tools for failed parses
- Version control for parsing rules

## Testing Strategy

### Unit Tests
- Pattern recognition accuracy
- Data structure validation
- Edge case handling

### Integration Tests
- Full PDF parsing pipeline
- Database storage validation
- API endpoint testing

### Performance Tests
- Large PDF handling
- Memory usage monitoring
- Processing time benchmarks

## Success Metrics

### Parsing Accuracy
- 95% accuracy for program metadata
- 90% accuracy for workout structure
- 85% accuracy for exercise details

### Processing Speed
- < 5 seconds for typical program PDF
- < 30 seconds for complex multi-phase programs
- Graceful degradation for very large PDFs

### Data Quality
- 100% of parsed programs have complete metadata
- 95% of workouts have valid structure
- 90% of exercises have complete details