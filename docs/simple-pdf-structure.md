# Simple PDF Structure for Easy Parsing

## Overview
This document defines a **minimal, structured PDF format** that easily transforms into JSON and displays cleanly in the app.

## 📝 PDF Template Structure

### Header Section
```
PROGRAM: [Program Name]
DURATION: [X] weeks
DIFFICULTY: [beginner/intermediate/advanced]
TYPE: [running/strength/cardio]
EQUIPMENT: [list of equipment needed]
```

### Weekly Structure
```
WEEK [X]:
DAY 1: [Workout Name]
- [Exercise/Activity]: [Details]
- [Exercise/Activity]: [Details]

DAY 2: [Workout Name]  
- [Exercise/Activity]: [Details]
- [Exercise/Activity]: [Details]

DAY 3: REST

[repeat for each day]
```

## 📋 Exercise Format Options

### For Running Programs:
```
- Run: 20 minutes easy pace
- Intervals: 6 x 1 minute fast, 1 minute rest
- Long Run: 45 minutes steady pace
```

### For Strength Programs:
```
- Squats: 3 sets x 8 reps
- Push-ups: 2 sets x 10 reps  
- Plank: 3 sets x 30 seconds
```

### For Cardio Programs:
```
- Bike: 15 minutes moderate
- Burpees: 3 sets x 5 reps
- Jump Rope: 2 minutes
```

## ✅ Complete Example: Simple 4-Week Running Program

```
PROGRAM: Beginner 5K Training
DURATION: 4 weeks
DIFFICULTY: beginner
TYPE: running
EQUIPMENT: running shoes

WEEK 1:
DAY 1: Easy Run
- Run: 15 minutes easy pace

DAY 2: REST

DAY 3: Walk/Run Intervals  
- Warm-up: 5 minutes walk
- Intervals: 8 x 1 minute run, 2 minutes walk
- Cool-down: 5 minutes walk

DAY 4: REST

DAY 5: Easy Run
- Run: 20 minutes easy pace

DAY 6: REST

DAY 7: REST

WEEK 2:
DAY 1: Easy Run
- Run: 20 minutes easy pace

DAY 2: REST

DAY 3: Run Intervals
- Warm-up: 5 minutes easy run
- Intervals: 6 x 2 minutes run, 1 minute walk  
- Cool-down: 5 minutes walk

DAY 4: REST

DAY 5: Easy Run
- Run: 25 minutes easy pace

DAY 6: REST

DAY 7: REST

WEEK 3:
DAY 1: Easy Run
- Run: 25 minutes easy pace

DAY 2: REST

DAY 3: Run Intervals
- Warm-up: 5 minutes easy run
- Intervals: 5 x 3 minutes run, 1 minute walk
- Cool-down: 5 minutes walk

DAY 4: REST

DAY 5: Long Run
- Run: 30 minutes steady pace

DAY 6: REST

DAY 7: REST

WEEK 4:
DAY 1: Easy Run
- Run: 20 minutes easy pace

DAY 2: REST

DAY 3: Short Intervals
- Warm-up: 5 minutes easy run
- Intervals: 4 x 1 minute fast, 2 minutes easy
- Cool-down: 5 minutes walk

DAY 4: REST

DAY 5: 5K Test
- 5K Run: race pace

DAY 6: REST

DAY 7: REST
```

## 🎯 Parsing Rules

### Program Metadata
- Line starting with `PROGRAM:` = program name
- Line starting with `DURATION:` = extract number of weeks
- Line starting with `DIFFICULTY:` = difficulty level
- Line starting with `TYPE:` = program type
- Line starting with `EQUIPMENT:` = required equipment

### Week Identification
- Line starting with `WEEK [number]:` = new week
- Extract week number from text

### Day Identification  
- Line starting with `DAY [number]:` = new day
- Text after colon = workout name
- If workout name is "REST" = rest day

### Exercise Parsing
- Lines starting with `-` = exercise
- Format: `- [Exercise Name]: [Details]`
- Extract exercise name and details separately

## 📱 App Display Structure

```
Program: Beginner 5K Training (4 weeks, Beginner)
Equipment: running shoes

Week 1:
  Mon: Easy Run
    • Run: 15 minutes easy pace
  
  Tue: Rest Day
  
  Wed: Walk/Run Intervals
    • Warm-up: 5 minutes walk  
    • Intervals: 8 x 1 minute run, 2 minutes walk
    • Cool-down: 5 minutes walk
    
  [etc...]
```

## 🔄 JSON Output Structure

```json
{
  "name": "Beginner 5K Training",
  "duration": 4,
  "difficulty": "beginner", 
  "type": "running",
  "equipment": ["running shoes"],
  "weeks": [
    {
      "number": 1,
      "days": [
        {
          "day": 1,
          "name": "Easy Run",
          "exercises": [
            {
              "name": "Run",
              "details": "15 minutes easy pace"
            }
          ]
        },
        {
          "day": 2,
          "name": "REST",
          "exercises": []
        },
        {
          "day": 3,
          "name": "Walk/Run Intervals",
          "exercises": [
            {
              "name": "Warm-up", 
              "details": "5 minutes walk"
            },
            {
              "name": "Intervals",
              "details": "8 x 1 minute run, 2 minutes walk"
            },
            {
              "name": "Cool-down",
              "details": "5 minutes walk"
            }
          ]
        }
      ]
    }
  ]
}
```

## ✨ Benefits of This Structure

1. **Super Simple**: No complex formatting or random text
2. **Easy to Parse**: Clear patterns and delimiters
3. **Clean Display**: Structured for mobile app UI
4. **Flexible**: Works for any program type
5. **Scalable**: Easy to add new exercise types
6. **User-Friendly**: Clear, readable format

This structure transforms a PDF into clean, structured data that displays perfectly in your app!