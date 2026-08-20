import { createFileRoute, Link } from '@tanstack/react-router'
import { Play, Flame } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getWorkouts, type StoredWorkout } from '~/lib/storage'

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () => ({
    meta: [
      { title: 'Home | FitTrack' },
      { name: 'description', content: 'Trang chủ FitTrack - Bắt đầu buổi tập của bạn' },
    ],
  }),
})

function formatRelativeDate(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return 'Hôm nay'
  if (d.toDateString() === yesterday.toDateString()) return 'Hôm qua'
  return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })
}

function calcStreak(workouts: StoredWorkout[]): number {
  if (workouts.length === 0) return 0

  const days = new Set(
    workouts.map((w) => new Date(w.completedAt).toDateString()),
  )

  let streak = 0
  const cursor = new Date()
  // If no workout today, start from yesterday
  if (!days.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1)
  }

  while (days.has(cursor.toDateString())) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function HomePage() {
  const [lastWorkout, setLastWorkout] = useState<StoredWorkout | null>(null)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const list = getWorkouts()
    setLastWorkout(list[0] ?? null)
    setStreak(calcStreak(list))
  }, [])

  return (
    <div className="px-4 pt-6 pb-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Xin chào 👋</h1>
        <p className="mt-1 text-sm text-muted">Sẵn sàng cho buổi tập hôm nay?</p>
      </header>

      {/* CTA lớn - Bắt đầu tập ngay */}
      <Link
        to="/workout"
        className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform"
      >
        <Play className="h-6 w-6 fill-current" />
        Bắt đầu tập ngay
      </Link>

      <div className="space-y-4">
        {/* Streak */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <p className="text-sm text-muted">Streak hiện tại</p>
          </div>
          <p className="mt-1 text-3xl font-bold text-primary">
            {streak} ngày
          </p>
        </div>

        {/* Last workout */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm text-muted">Buổi tập gần nhất</p>
          {lastWorkout ? (
            <Link
              to="/log/$workoutId"
              params={{ workoutId: lastWorkout.id }}
              className="mt-2 block active:opacity-80"
            >
              <p className="font-semibold text-foreground">
                {lastWorkout.name}
              </p>
              <p className="mt-0.5 text-sm text-muted">
                {formatRelativeDate(lastWorkout.completedAt)} ·{' '}
                {lastWorkout.totalVolume.toLocaleString('vi-VN')} kg ·{' '}
                {lastWorkout.exercises.length} bài
              </p>
            </Link>
          ) : (
            <p className="mt-1 font-medium text-muted">Chưa có buổi tập nào</p>
          )}
        </div>
      </div>
    </div>
  )
}
