import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { getWorkoutById } from '~/lib/storage'
import { ArrowLeft, Check } from 'lucide-react'

export const Route = createFileRoute('/log/$workoutId')({
  component: WorkoutDetailPage,
  head: () => ({
    meta: [
      { title: 'Chi tiết buổi tập | FitTrack' },
      { name: 'description', content: 'Xem chi tiết các set của buổi tập' },
    ],
  }),
})

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s} giây`
  return `${m} phút${s > 0 ? ` ${s} giây` : ''}`
}

function WorkoutDetailPage() {
  const { workoutId } = Route.useParams()

  const workout = useMemo(() => getWorkoutById(workoutId), [workoutId])

  if (!workout) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-muted">Không tìm thấy buổi tập</p>
        <Link
          to="/log"
          className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Quay lại lịch sử
        </Link>
      </div>
    )
  }

  const completedSets = workout.exercises.reduce(
    (n, e) => n + e.sets.filter((s) => s.completed).length,
    0,
  )

  return (
    <div className="flex min-h-full flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur-md">
        <Link
          to="/log"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-secondary text-foreground active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold truncate">{workout.name}</h1>
          <p className="text-xs text-muted truncate">
            {formatDateTime(workout.completedAt)}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs text-muted">Tổng volume</p>
            <p className="mt-1 text-xl font-bold text-primary">
              {workout.totalVolume.toLocaleString('vi-VN')} kg
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs text-muted">Thời gian</p>
            <p className="mt-1 text-xl font-bold text-foreground">
              {formatDuration(workout.durationSeconds)}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs text-muted">Bài tập</p>
            <p className="mt-1 text-xl font-bold text-foreground">
              {workout.exercises.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs text-muted">Set hoàn thành</p>
            <p className="mt-1 text-xl font-bold text-foreground">
              {completedSets}
            </p>
          </div>
        </div>

        {/* Exercises + sets */}
        <h2 className="mb-3 text-sm font-semibold text-muted uppercase tracking-wide">
          Chi tiết bài tập
        </h2>

        <div className="space-y-4">
          {workout.exercises.map((ex, idx) => (
            <div
              key={`${ex.exerciseId}-${idx}`}
              className="rounded-2xl border border-border bg-surface p-4 shadow-sm"
            >
              <h3 className="mb-3 font-semibold text-foreground">
                {ex.exerciseName}
              </h3>

              {/* Table header */}
              <div className="mb-2 grid grid-cols-[40px_1fr_1fr_40px] gap-2 text-xs font-medium text-muted">
                <span className="text-center">Set</span>
                <span className="text-center">Kg</span>
                <span className="text-center">Reps</span>
                <span className="text-center">✓</span>
              </div>

              <div className="space-y-1.5">
                {ex.sets.map((set) => (
                  <div
                    key={set.setNumber}
                    className={`grid grid-cols-[40px_1fr_1fr_40px] items-center gap-2 rounded-xl px-1 py-2 ${
                      set.completed ? 'bg-primary/5' : 'opacity-50'
                    }`}
                  >
                    <span className="text-center text-sm font-medium text-muted">
                      {set.setNumber}
                    </span>
                    <span className="text-center text-sm font-semibold">
                      {set.weight}
                    </span>
                    <span className="text-center text-sm font-semibold">
                      {set.reps}
                    </span>
                    <span className="flex justify-center">
                      {set.completed ? (
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                          <Check className="h-4 w-4" strokeWidth={2.5} />
                        </span>
                      ) : (
                        <span className="h-7 w-7 rounded-lg bg-surface-secondary" />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
