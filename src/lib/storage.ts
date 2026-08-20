// Storage helper for FitTrack demo (localStorage)
// Cấu trúc gần với database thật để dễ chuyển sang Postgres sau này

export type StoredSet = {
  setNumber: number
  weight: number
  reps: number
  completed: boolean
}

export type StoredExercise = {
  exerciseId: string
  exerciseName: string
  sets: StoredSet[]
}

export type StoredWorkout = {
  id: string
  name: string
  startedAt: string // ISO
  completedAt: string // ISO
  totalVolume: number
  durationSeconds: number
  exercises: StoredExercise[]
}

const STORAGE_KEY = 'fittrack_workouts'

export function getWorkouts(): StoredWorkout[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function saveWorkout(workout: StoredWorkout): void {
  const list = getWorkouts()
  list.unshift(workout) // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function getWorkoutById(id: string): StoredWorkout | undefined {
  return getWorkouts().find((w) => w.id === id)
}
