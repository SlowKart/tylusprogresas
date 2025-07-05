# Database Schema Design

## Overview
This document defines the database schema for storing structured fitness program data parsed from PDFs.

## Existing Tables Analysis
Currently, the database has:
- `pdf_texts` - Raw PDF text storage
- `exercises` - Exercise definitions with equipment, type, difficulty
- `muscle_groups` - Muscle group definitions
- `attributes` - Exercise attributes
- `exercise_muscle_groups` - Many-to-many relationship
- `exercise_attributes` - Many-to-many relationship

## New Tables Design

### 1. Programs Table
```sql
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_weeks INTEGER NOT NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  type VARCHAR(20) NOT NULL CHECK (type IN ('running', 'strength', 'mixed', 'cardio', 'flexibility')),
  author VARCHAR(255),
  source_file VARCHAR(255), -- PDF filename
  goals TEXT[],
  prerequisites TEXT[],
  equipment TEXT[],
  tags TEXT[],
  total_workouts INTEGER NOT NULL DEFAULT 0,
  estimated_time_per_week INTEGER, -- minutes
  notes TEXT,
  version VARCHAR(20) DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Program Phases Table
```sql
CREATE TABLE program_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  focus VARCHAR(255) NOT NULL,
  description TEXT,
  start_week INTEGER NOT NULL,
  end_week INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_program_phase UNIQUE(program_id, number)
);
```

### 3. Program Weeks Table
```sql
CREATE TABLE program_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES program_phases(id) ON DELETE SET NULL,
  number INTEGER NOT NULL,
  name VARCHAR(255),
  focus VARCHAR(255),
  notes TEXT,
  rest_days INTEGER[] DEFAULT '{7}', -- Array of day numbers (1-7)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_program_week UNIQUE(program_id, number)
);
```

### 4. Program Workouts Table
```sql
CREATE TABLE program_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID NOT NULL REFERENCES program_weeks(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('speed', 'long', 'recovery', 'strength', 'power', 'conditioning', 'core', 'rest')),
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 7),
  duration_minutes INTEGER,
  description TEXT,
  notes TEXT,
  intensity_type VARCHAR(20) CHECK (intensity_type IN ('rpe', 'percentage', 'pace', 'descriptive')),
  intensity_value VARCHAR(50),
  intensity_description TEXT,
  equipment TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_week_day UNIQUE(week_id, day_number)
);
```

### 5. Workout Exercises Table
```sql
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES program_workouts(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL, -- Fallback if exercise_id is null
  category VARCHAR(20) NOT NULL CHECK (category IN ('warmup', 'main', 'cooldown')),
  sets INTEGER,
  reps VARCHAR(20), -- Can be "8-12", "AMRAP", etc.
  weight_kg DECIMAL(5,2),
  weight_description VARCHAR(50), -- "bodyweight", "85%", etc.
  duration_seconds INTEGER,
  distance_meters INTEGER,
  rest_seconds INTEGER,
  intensity_type VARCHAR(20) CHECK (intensity_type IN ('rpe', 'percentage', 'pace', 'descriptive')),
  intensity_value VARCHAR(50),
  intensity_description TEXT,
  notes TEXT,
  modifications TEXT[],
  equipment TEXT[],
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. Exercise Groups Table (for supersets/circuits)
```sql
CREATE TABLE exercise_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES program_workouts(id) ON DELETE CASCADE,
  name VARCHAR(255),
  type VARCHAR(20) NOT NULL CHECK (type IN ('superset', 'circuit', 'sequence')),
  rounds INTEGER,
  rest_between_rounds_seconds INTEGER,
  notes TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7. Exercise Group Items Table
```sql
CREATE TABLE exercise_group_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES exercise_groups(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_group_exercise UNIQUE(group_id, exercise_id)
);
```

### 8. User Programs Table
```sql
CREATE TABLE user_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- References auth.users(id)
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  current_week INTEGER NOT NULL DEFAULT 1,
  current_day INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  notes TEXT,
  modifications TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 9. Workout Completions Table
```sql
CREATE TABLE workout_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_program_id UUID NOT NULL REFERENCES user_programs(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES program_workouts(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  actual_duration_minutes INTEGER,
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 10),
  enjoyment_rating INTEGER CHECK (enjoyment_rating BETWEEN 1 AND 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 10. Exercise Completions Table
```sql
CREATE TABLE exercise_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_completion_id UUID NOT NULL REFERENCES workout_completions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT true,
  actual_sets INTEGER,
  actual_reps INTEGER,
  actual_weight_kg DECIMAL(5,2),
  actual_duration_seconds INTEGER,
  notes TEXT,
  modifications TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 11. Program Templates Table
```sql
CREATE TABLE program_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('running', 'strength', 'mixed', 'cardio', 'flexibility')),
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  default_duration_weeks INTEGER NOT NULL,
  workouts_per_week INTEGER NOT NULL,
  rest_days_per_week INTEGER NOT NULL,
  avg_workout_duration_minutes INTEGER NOT NULL,
  equipment TEXT[],
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 12. Parsing Metadata Table
```sql
CREATE TABLE parsing_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  source_file VARCHAR(255) NOT NULL,
  confidence_score INTEGER NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),
  warnings TEXT[],
  errors TEXT[],
  parser_version VARCHAR(20) NOT NULL,
  parsed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_programs_type ON programs(type);
CREATE INDEX idx_programs_difficulty ON programs(difficulty);
CREATE INDEX idx_programs_created_at ON programs(created_at);

CREATE INDEX idx_program_weeks_program_id ON program_weeks(program_id);
CREATE INDEX idx_program_weeks_number ON program_weeks(number);

CREATE INDEX idx_program_workouts_week_id ON program_workouts(week_id);
CREATE INDEX idx_program_workouts_day ON program_workouts(day_number);

CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_order ON workout_exercises(order_index);

CREATE INDEX idx_user_programs_user_id ON user_programs(user_id);
CREATE INDEX idx_user_programs_status ON user_programs(status);

CREATE INDEX idx_workout_completions_user_program_id ON workout_completions(user_program_id);
CREATE INDEX idx_workout_completions_completed_at ON workout_completions(completed_at);
```

## Views

### Program Summary View
```sql
CREATE VIEW program_summary AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.duration_weeks,
  p.difficulty,
  p.type,
  p.author,
  p.total_workouts,
  p.estimated_time_per_week,
  COUNT(DISTINCT pw.id) as actual_weeks,
  COUNT(DISTINCT pwo.id) as actual_workouts,
  p.created_at
FROM programs p
LEFT JOIN program_weeks pw ON p.id = pw.program_id
LEFT JOIN program_workouts pwo ON pw.id = pwo.week_id
GROUP BY p.id;
```

### User Program Progress View
```sql
CREATE VIEW user_program_progress AS
SELECT 
  up.id,
  up.user_id,
  p.name as program_name,
  up.current_week,
  up.current_day,
  up.status,
  up.start_date,
  COUNT(wc.id) as completed_workouts,
  p.total_workouts,
  ROUND((COUNT(wc.id)::DECIMAL / p.total_workouts) * 100, 2) as completion_percentage
FROM user_programs up
JOIN programs p ON up.program_id = p.id
LEFT JOIN workout_completions wc ON up.id = wc.user_program_id
GROUP BY up.id, p.id;
```

## Triggers

### Update timestamp trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_programs_updated_at 
  BEFORE UPDATE ON programs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_programs_updated_at 
  BEFORE UPDATE ON user_programs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Program workout count trigger
```sql
CREATE OR REPLACE FUNCTION update_program_workout_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE programs 
  SET total_workouts = (
    SELECT COUNT(*)
    FROM program_workouts pwo
    JOIN program_weeks pw ON pwo.week_id = pw.id
    WHERE pw.program_id = COALESCE(NEW.program_id, OLD.program_id)
  )
  WHERE id = COALESCE(NEW.program_id, OLD.program_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_program_workout_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON program_workouts
  FOR EACH ROW EXECUTE FUNCTION update_program_workout_count();
```

## Security (RLS Policies)

```sql
-- Enable RLS on user-specific tables
ALTER TABLE user_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_completions ENABLE ROW LEVEL SECURITY;

-- User programs - users can only see their own
CREATE POLICY user_programs_policy ON user_programs
  FOR ALL USING (auth.uid() = user_id);

-- Workout completions - users can only see their own
CREATE POLICY workout_completions_policy ON workout_completions
  FOR ALL USING (
    auth.uid() = (
      SELECT user_id FROM user_programs 
      WHERE id = user_program_id
    )
  );

-- Exercise completions - users can only see their own
CREATE POLICY exercise_completions_policy ON exercise_completions
  FOR ALL USING (
    auth.uid() = (
      SELECT up.user_id 
      FROM user_programs up
      JOIN workout_completions wc ON up.id = wc.user_program_id
      WHERE wc.id = workout_completion_id
    )
  );
```

## Migration Order

1. Create `programs` table
2. Create `program_phases` table  
3. Create `program_weeks` table
4. Create `program_workouts` table
5. Create `workout_exercises` table
6. Create `exercise_groups` table
7. Create `exercise_group_items` table
8. Create `user_programs` table
9. Create `workout_completions` table
10. Create `exercise_completions` table
11. Create `program_templates` table
12. Create `parsing_metadata` table
13. Create indexes
14. Create views
15. Create triggers
16. Enable RLS policies

This schema design provides a comprehensive structure for storing parsed program data while maintaining flexibility for different program types and user interaction patterns.