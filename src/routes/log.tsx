import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getWorkouts, type StoredWorkout } from '~/lib/storage'
import { ChevronRight, Dumbbell } from 'lucide-react'

export const Route = createFileRoute('/log')({
  component: LogPage,
  head: () => ({
    meta: [
      { title: 'Log | FitTrack' },
      { name: 'description', content: 'Lịch sử buổi tập' },
    ],
  }),
})

function formatDate(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const isToday = d.toDateString() === today.toDateString()
  const isYesterday = d.toDateString() === yesterday.toDateString()

  if (isToday) return 'Hôm nay'
  if (isYesterday) return 'Hôm qua'

  return d.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s} giây`
  return `${m} phút ${s > 0 ? `${s} giây` : ''}`.trim()
}

function LogPage() {
  const [workouts, setWorkouts] = useState<StoredWorkout[]>([])

  useEffect(() => {
    setWorkouts(getWorkouts())
  }, [])

  return (
    <div className="px-4 pt-6 pb-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Lịch sử</h1>
        <p className="mt-1 text-sm text-muted">
          {workouts.length === 0
            ? 'Các buổi tập đã ghi lại'
            : `${workouts.length} buổi tập`}
        </p>
      </header>

      {workouts.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary">
            <Dumbbell className="h-7 w-7 text-muted" />
          </div>
          <p className="font-medium text-foreground">Chưa có buổi tập nào</p>
          <p className="mt-1 text-sm text-muted">
            Hoàn thành buổi tập đầu tiên để xem lịch sử tại đây
          </p>
          <Link
            to="/workout"
            className="mt-5 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Bắt đầu tập ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {workouts.map((w) => {
            const exerciseCount = w.exercises.length
            const setCount = w.exercises.reduce(
              (n, e) => n + e.sets.filter((s) => s.completed).length,
              0,
            )

            return (
              <Link
                key={w.id}
                to="/log/$workoutId"
                params={{ workoutId: w.id }}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm active:bg-surface-secondary transition-colors"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-foreground truncate">
                      {formatDate(w.completedAt)}
                    </p>
                    <span className="text-xs text-muted shrink-0">
                      {formatTime(w.completedAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted">
                    {w.totalVolume.toLocaleString('vi-VN')} kg · {exerciseCount}{' '}
                    bài · {setCount} set
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatDuration(w.durationSeconds)}
                  </p>
                </div>

                <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
