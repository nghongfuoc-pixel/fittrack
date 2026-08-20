import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Timer, Plus, Trash2, Check, Trophy } from 'lucide-react'
import { useState, useEffect } from 'react'
import { saveWorkout, type StoredWorkout } from '~/lib/storage'
import { getRoutineById } from '~/lib/routines'
import { z } from 'zod'

const workoutSearchSchema = z.object({
  routineId: z.string().optional(),
})

export const Route = createFileRoute('/workout')({
  component: ActiveWorkoutPage,
  validateSearch: workoutSearchSchema,
  head: () => ({
    meta: [
      { title: 'Đang tập | FitTrack' },
      { name: 'description', content: 'Màn hình ghi buổi tập đang diễn ra' },
    ],
  }),
})

// ===== Types =====
type SetData = {
  id: string
  setNumber: number
  weight: number
  reps: number
  completed: boolean
}

type WorkoutExercise = {
  id: string
  exerciseId: string
  name: string
  sets: SetData[]
}

// ===== Sample exercises (hardcode) =====
const SAMPLE_EXERCISES = [
  { id: 'ex1', name: 'Bench Press' },
  { id: 'ex2', name: 'Squat' },
  { id: 'ex3', name: 'Deadlift' },
  { id: 'ex4', name: 'Overhead Press' },
  { id: 'ex5', name: 'Barbell Row' },
  { id: 'ex6', name: 'Pull-up' },
]

function createEmptySet(setNumber: number): SetData {
  return {
    id: `set-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    setNumber,
    weight: 0,
    reps: 0,
    completed: false,
  }
}

function createSets(count: number): SetData[] {
  return Array.from({ length: count }, (_, i) => createEmptySet(i + 1))
}

function ActiveWorkoutPage() {
  const navigate = useNavigate()
  const { routineId } = Route.useSearch()
  const routine = routineId ? getRoutineById(routineId) : undefined

  const [startedAt] = useState(() => new Date())
  const [elapsed, setElapsed] = useState(0)
  const [exercises, setExercises] = useState<WorkoutExercise[]>(() => {
    if (!routine) return []
    return routine.exercises.map((ex) => ({
      id: `we-${ex.exerciseId}-${Date.now()}`,
      exerciseId: ex.exerciseId,
      name: ex.name,
      sets: createSets(ex.targetSets),
    }))
  })
  const [showPicker, setShowPicker] = useState(false)
  const [finishedWorkout, setFinishedWorkout] = useState<StoredWorkout | null>(
    null,
  )

  // Simple timer
  useEffect(() => {
    if (finishedWorkout) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.getTime()) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startedAt, finishedWorkout])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // ===== Actions =====
  const addExercise = (ex: (typeof SAMPLE_EXERCISES)[0]) => {
    const newEx: WorkoutExercise = {
      id: `we-${Date.now()}`,
      exerciseId: ex.id,
      name: ex.name,
      sets: [createEmptySet(1)],
    }
    setExercises((prev) => [...prev, newEx])
    setShowPicker(false)
  }

  const removeExercise = (exerciseId: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== exerciseId))
  }

  const addSet = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((e) => {
        if (e.id !== exerciseId) return e
        const nextNum = e.sets.length + 1
        return { ...e, sets: [...e.sets, createEmptySet(nextNum)] }
      }),
    )
  }

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((e) => {
        if (e.id !== exerciseId) return e
        const filtered = e.sets.filter((s) => s.id !== setId)
        const renumbered = filtered.map((s, i) => ({
          ...s,
          setNumber: i + 1,
        }))
        return { ...e, sets: renumbered }
      }),
    )
  }

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: 'weight' | 'reps' | 'completed',
    value: number | boolean,
  ) => {
    setExercises((prev) =>
      prev.map((e) => {
        if (e.id !== exerciseId) return e
        return {
          ...e,
          sets: e.sets.map((s) =>
            s.id === setId ? { ...s, [field]: value } : s,
          ),
        }
      }),
    )
  }

  const totalVolume = exercises.reduce((sum, e) => {
    return (
      sum +
      e.sets
        .filter((s) => s.completed)
        .reduce((sSum, s) => sSum + s.weight * s.reps, 0)
    )
  }, 0)

  const hasCompletedSets = exercises.some((e) =>
    e.sets.some((s) => s.completed && s.weight > 0 && s.reps > 0),
  )

  const handleFinish = () => {
    if (!hasCompletedSets) return

    const completedAt = new Date()
    const durationSeconds = Math.floor(
      (completedAt.getTime() - startedAt.getTime()) / 1000,
    )

    const workout: StoredWorkout = {
      id: `w-${Date.now()}`,
      name: routine ? routine.name : 'Buổi tập tự do',
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      totalVolume,
      durationSeconds,
      exercises: exercises.map((e) => ({
        exerciseId: e.exerciseId,
        exerciseName: e.name,
        sets: e.sets.map((s) => ({
          setNumber: s.setNumber,
          weight: s.weight,
          reps: s.reps,
          completed: s.completed,
        })),
      })),
    }

    saveWorkout(workout)
    setFinishedWorkout(workout)
  }

  // ===== Finished Summary Screen =====
  if (finishedWorkout) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">
          <Trophy className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Hoàn thành!</h1>
        <p className="mt-2 text-muted">Buổi tập đã được lưu thành công</p>

        <div className="mt-8 w-full max-w-sm space-y-3 rounded-2xl border border-border bg-surface p-5 text-left shadow-sm">
          <div className="flex justify-between">
            <span className="text-muted">Tên buổi tập</span>
            <span className="font-semibold">{finishedWorkout.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Tổng volume</span>
            <span className="font-semibold">
              {finishedWorkout.totalVolume.toLocaleString('vi-VN')} kg
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Thời gian</span>
            <span className="font-semibold">
              {formatTime(finishedWorkout.durationSeconds)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Số bài tập</span>
            <span className="font-semibold">
              {finishedWorkout.exercises.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Số set hoàn thành</span>
            <span className="font-semibold">
              {finishedWorkout.exercises.reduce(
                (n, e) => n + e.sets.filter((s) => s.completed).length,
                0,
              )}
            </span>
          </div>
        </div>

        <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
          <Link
            to="/log"
            className="rounded-2xl bg-primary py-4 text-center text-base font-semibold text-primary-foreground"
          >
            Xem lịch sử
          </Link>
          <button
            onClick={() => navigate({ to: '/' })}
            className="rounded-2xl border border-border bg-surface py-4 text-center text-base font-medium"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    )
  }

  // ===== Active Workout UI =====
  return (
    <div className="flex min-h-full flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur-md">
        <Link
          to="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-secondary text-foreground active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold truncate">
            {routine ? routine.name : 'Buổi tập đang diễn ra'}
          </h1>
          <p className="text-xs text-muted">
            {routine ? routine.description : 'Tập tự do'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1.5 text-sm font-medium text-muted">
          <Timer className="h-4 w-4" />
          {formatTime(elapsed)}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted">Chưa có bài tập nào</p>
            <p className="mt-1 text-sm text-muted">
              Bấm nút bên dưới để thêm bài tập
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {exercises.map((ex) => (
              <div
                key={ex.id}
                className="rounded-2xl border border-border bg-surface p-4 shadow-sm"
              >
                {/* Exercise header */}
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">{ex.name}</h2>
                  <button
                    onClick={() => removeExercise(ex.id)}
                    className="rounded-lg p-1.5 text-muted hover:bg-surface-secondary hover:text-danger"
                    aria-label="Xóa bài tập"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Sets header */}
                <div className="mb-2 grid grid-cols-[32px_1fr_1fr_40px] gap-2 text-xs font-medium text-muted">
                  <span className="text-center">Set</span>
                  <span className="text-center">Kg</span>
                  <span className="text-center">Reps</span>
                  <span className="text-center">✓</span>
                </div>

                {/* Sets list */}
                <div className="space-y-2">
                  {ex.sets.map((set) => (
                    <div
                      key={set.id}
                      className="grid grid-cols-[32px_1fr_1fr_40px] items-center gap-2"
                    >
                      <span className="text-center text-sm font-medium text-muted">
                        {set.setNumber}
                      </span>

                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step={0.5}
                        value={set.weight || ''}
                        onChange={(e) =>
                          updateSet(
                            ex.id,
                            set.id,
                            'weight',
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        placeholder="0"
                        className="h-11 rounded-xl border border-border bg-surface-secondary px-3 text-center text-base font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />

                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={set.reps || ''}
                        onChange={(e) =>
                          updateSet(
                            ex.id,
                            set.id,
                            'reps',
                            parseInt(e.target.value) || 0,
                          )
                        }
                        placeholder="0"
                        className="h-11 rounded-xl border border-border bg-surface-secondary px-3 text-center text-base font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />

                      <button
                        onClick={() =>
                          updateSet(ex.id, set.id, 'completed', !set.completed)
                        }
                        className={`flex h-11 w-10 items-center justify-center rounded-xl transition-colors ${
                          set.completed
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-surface-secondary text-muted'
                        }`}
                        aria-label="Đánh dấu hoàn thành"
                      >
                        <Check className="h-5 w-5" strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add / Remove set */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => addSet(ex.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-sm font-medium text-muted active:bg-surface-secondary"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm set
                  </button>
                  {ex.sets.length > 1 && (
                    <button
                      onClick={() =>
                        removeSet(ex.id, ex.sets[ex.sets.length - 1].id)
                      }
                      className="rounded-xl border border-border px-3 py-2.5 text-sm text-muted active:bg-surface-secondary"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add exercise button */}
        <button
          onClick={() => setShowPicker(true)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 py-4 text-base font-semibold text-primary active:bg-primary/10"
        >
          <Plus className="h-5 w-5" />
          Thêm bài tập
        </button>
      </div>

      {/* Bottom bar */}
      <div className="sticky bottom-0 border-t border-border bg-surface p-4 safe-bottom">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-muted">Tổng volume (đã hoàn thành)</span>
          <span className="font-semibold text-foreground">
            {totalVolume.toLocaleString('vi-VN')} kg
          </span>
        </div>
        <button
          onClick={handleFinish}
          disabled={!hasCompletedSets}
          className={`w-full rounded-2xl py-4 text-center text-base font-semibold text-primary-foreground transition-opacity ${
            hasCompletedSets
              ? 'bg-primary active:scale-[0.98]'
              : 'bg-primary/40 opacity-60'
          }`}
        >
          Hoàn thành buổi tập
        </button>
        {!hasCompletedSets && (
          <p className="mt-2 text-center text-xs text-muted">
            Hoàn thành ít nhất 1 set để kết thúc
          </p>
        )}
      </div>

      {/* Exercise Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-t-3xl bg-surface p-4 pb-8 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Chọn bài tập</h3>
              <button
                onClick={() => setShowPicker(false)}
                className="rounded-full bg-surface-secondary px-3 py-1 text-sm text-muted"
              >
                Đóng
              </button>
            </div>
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {SAMPLE_EXERCISES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => addExercise(ex)}
                  className="flex w-full items-center rounded-xl bg-surface-secondary px-4 py-3.5 text-left font-medium active:bg-primary/10"
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
