import { SimpleProgram, Week, Day, Exercise, ProgramMetadata } from "@/types/simpleProgram";

export interface WorkoutOptions {
  sport: 'bodybuilding' | 'general-fitness';
  daysPerWeek: number;
  equipment: string[];
  cardioType?: string; // Only for general-fitness
}

// Exercise templates based on equipment
const exerciseTemplates = {
  dumbbells: {
    upper: [
      { name: "Dumbbell Bench Press", details: "3 sets x 8-10 reps" },
      { name: "Dumbbell Rows", details: "3 sets x 10-12 reps" },
      { name: "Shoulder Press", details: "3 sets x 8-10 reps" },
      { name: "Bicep Curls", details: "3 sets x 12-15 reps" },
      { name: "Tricep Extensions", details: "3 sets x 10-12 reps" }
    ],
    lower: [
      { name: "Dumbbell Squats", details: "3 sets x 12-15 reps" },
      { name: "Dumbbell Lunges", details: "3 sets x 10 reps each leg" },
      { name: "Romanian Deadlifts", details: "3 sets x 10-12 reps" },
      { name: "Dumbbell Step-ups", details: "3 sets x 8 reps each leg" },
      { name: "Calf Raises", details: "3 sets x 15-20 reps" }
    ]
  },
  barbell: {
    upper: [
      { name: "Barbell Bench Press", details: "3 sets x 6-8 reps" },
      { name: "Barbell Rows", details: "3 sets x 8-10 reps" },
      { name: "Overhead Press", details: "3 sets x 6-8 reps" },
      { name: "Barbell Curls", details: "3 sets x 10-12 reps" },
      { name: "Close-Grip Bench Press", details: "3 sets x 8-10 reps" }
    ],
    lower: [
      { name: "Barbell Squats", details: "3 sets x 8-10 reps" },
      { name: "Deadlifts", details: "3 sets x 5-6 reps" },
      { name: "Romanian Deadlifts", details: "3 sets x 8-10 reps" },
      { name: "Barbell Lunges", details: "3 sets x 8 reps each leg" },
      { name: "Hip Thrusts", details: "3 sets x 12-15 reps" }
    ]
  },
  'gym-machines': {
    upper: [
      { name: "Chest Press Machine", details: "3 sets x 10-12 reps" },
      { name: "Lat Pulldown", details: "3 sets x 10-12 reps" },
      { name: "Shoulder Press Machine", details: "3 sets x 10-12 reps" },
      { name: "Cable Bicep Curls", details: "3 sets x 12-15 reps" },
      { name: "Cable Tricep Extensions", details: "3 sets x 12-15 reps" }
    ],
    lower: [
      { name: "Leg Press", details: "3 sets x 12-15 reps" },
      { name: "Leg Curls", details: "3 sets x 12-15 reps" },
      { name: "Leg Extensions", details: "3 sets x 12-15 reps" },
      { name: "Calf Raise Machine", details: "3 sets x 15-20 reps" },
      { name: "Hip Abduction", details: "3 sets x 12-15 reps" }
    ]
  },
  'no-equipment': {
    upper: [
      { name: "Push-ups", details: "3 sets x 8-12 reps" },
      { name: "Pike Push-ups", details: "3 sets x 6-10 reps" },
      { name: "Tricep Dips", details: "3 sets x 8-12 reps" },
      { name: "Plank", details: "3 sets x 30-45 seconds" },
      { name: "Mountain Climbers", details: "3 sets x 20 reps" }
    ],
    lower: [
      { name: "Bodyweight Squats", details: "3 sets x 15-20 reps" },
      { name: "Lunges", details: "3 sets x 10 reps each leg" },
      { name: "Single-leg Glute Bridges", details: "3 sets x 10 reps each leg" },
      { name: "Wall Sit", details: "3 sets x 30-45 seconds" },
      { name: "Calf Raises", details: "3 sets x 15-20 reps" }
    ]
  }
};

const cardioExercises = {
  running: [
    { name: "Easy Run", details: "20-30 minutes at comfortable pace" },
    { name: "Interval Run", details: "5 min warm-up, 4x1 min fast/1 min easy, 5 min cool-down" },
    { name: "Long Run", details: "30-45 minutes at easy pace" }
  ],
  cycling: [
    { name: "Easy Ride", details: "20-30 minutes at comfortable pace" },
    { name: "Interval Cycling", details: "5 min warm-up, 4x1 min hard/1 min easy, 5 min cool-down" },
    { name: "Long Ride", details: "30-45 minutes at easy pace" }
  ]
};

function getExercisesForEquipment(equipment: string[], type: 'upper' | 'lower'): Exercise[] {
  const availableExercises: Exercise[] = [];
  
  // Prioritize equipment in order of effectiveness
  const equipmentPriority = ['barbell', 'dumbbells', 'gym-machines', 'no-equipment'];
  
  for (const eq of equipmentPriority) {
    if (equipment.includes(eq) && exerciseTemplates[eq as keyof typeof exerciseTemplates]) {
      availableExercises.push(...exerciseTemplates[eq as keyof typeof exerciseTemplates][type]);
    }
  }
  
  // If no equipment selected, use bodyweight
  if (availableExercises.length === 0) {
    availableExercises.push(...exerciseTemplates['no-equipment'][type]);
  }
  
  // Return 3-4 exercises, shuffled
  return availableExercises.sort(() => Math.random() - 0.5).slice(0, 4);
}

function getCardioExercise(cardioType: string): Exercise {
  const exercises = cardioExercises[cardioType as keyof typeof cardioExercises] || cardioExercises.running;
  return exercises[Math.floor(Math.random() * exercises.length)];
}

function generateWorkoutWeek(weekNumber: number, options: WorkoutOptions): Week {
  const { sport, daysPerWeek, equipment, cardioType } = options;
  const days: Day[] = [];
  
  for (let dayNum = 1; dayNum <= 7; dayNum++) {
    if (dayNum > daysPerWeek) {
      // Rest day
      days.push({
        day: dayNum,
        name: "REST",
        exercises: []
      });
    } else {
      if (sport === 'bodybuilding') {
        // Bodybuilding split
        if (daysPerWeek >= 4) {
          // Upper/Lower split
          const isUpper = dayNum % 2 === 1;
          const exercises = getExercisesForEquipment(equipment, isUpper ? 'upper' : 'lower');
          days.push({
            day: dayNum,
            name: isUpper ? "Upper Body" : "Lower Body",
            exercises: exercises
          });
        } else {
          // Full body
          const upperExercises = getExercisesForEquipment(equipment, 'upper').slice(0, 2);
          const lowerExercises = getExercisesForEquipment(equipment, 'lower').slice(0, 2);
          days.push({
            day: dayNum,
            name: "Full Body",
            exercises: [...upperExercises, ...lowerExercises]
          });
        }
      } else {
        // General fitness
        if (dayNum % 3 === 0 && cardioType) {
          // Cardio day
          const cardioExercise = getCardioExercise(cardioType);
          days.push({
            day: dayNum,
            name: "Cardio",
            exercises: [cardioExercise]
          });
        } else {
          // Strength day
          const isUpper = dayNum % 2 === 1;
          const exercises = getExercisesForEquipment(equipment, isUpper ? 'upper' : 'lower');
          days.push({
            day: dayNum,
            name: isUpper ? "Upper Body" : "Lower Body",
            exercises: exercises.slice(0, 3) // Fewer exercises for general fitness
          });
        }
      }
    }
  }
  
  return {
    number: weekNumber,
    days: days
  };
}

/**
 * Generates a mock workout program based on user selections
 * Creates a 4-week program with appropriate exercises for the chosen sport and equipment
 */
export function generateMockWorkout(options: WorkoutOptions): SimpleProgram {
  const { sport, daysPerWeek, equipment, cardioType } = options;
  
  // Generate metadata
  const metadata: ProgramMetadata = {
    name: sport === 'bodybuilding' 
      ? `${daysPerWeek}-Day Bodybuilding Program`
      : `${daysPerWeek}-Day General Fitness Program`,
    duration: 4, // 4 weeks
    difficulty: 'beginner',
    type: sport === 'bodybuilding' ? 'strength' : 'mixed',
    equipment: equipment,
    description: sport === 'bodybuilding' 
      ? "A structured bodybuilding program focused on muscle building and strength development."
      : `A balanced fitness program combining strength training${cardioType ? ` with ${cardioType}` : ''}.`
  };
  
  // Generate 4 weeks of workouts
  const weeks: Week[] = [];
  for (let weekNum = 1; weekNum <= 4; weekNum++) {
    weeks.push(generateWorkoutWeek(weekNum, options));
  }
  
  return {
    id: `mock-${sport}-${Date.now()}`,
    metadata: metadata,
    weeks: weeks,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}