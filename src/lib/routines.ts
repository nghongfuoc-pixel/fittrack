// Sample routines (hardcode) for demo

export type RoutineExercise = {
  exerciseId: string
  name: string
  targetSets: number
}

export type Routine = {
  id: string
  name: string
  description: string
  exercises: RoutineExercise[]
}

export const SAMPLE_ROUTINES: Routine[] = [
  {
    id: 'routine-push',
    name: 'Push Day',
    description: 'Ngực, vai, tay sau',
    exercises: [
      { exerciseId: 'ex1', name: 'Bench Press', targetSets: 4 },
      { exerciseId: 'ex4', name: 'Overhead Press', targetSets: 3 },
    ],
  },
  {
    id: 'routine-pull',
    name: 'Pull Day',
    description: 'Lưng và tay trước',
    exercises: [
      { exerciseId: 'ex3', name: 'Deadlift', targetSets: 3 },
      { exerciseId: 'ex5', name: 'Barbell Row', targetSets: 4 },
      { exerciseId: 'ex6', name: 'Pull-up', targetSets: 3 },
    ],
  },
  {
    id: 'routine-legs',
    name: 'Leg Day',
    description: 'Chân và mông',
    exercises: [
      { exerciseId: 'ex2', name: 'Squat', targetSets: 4 },
      { exerciseId: 'ex3', name: 'Deadlift', targetSets: 3 },
    ],
  },
]

export function getRoutineById(id: string): Routine | undefined {
  return SAMPLE_ROUTINES.find((r) => r.id === id)
}
