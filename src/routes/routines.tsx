import { createFileRoute, Link } from '@tanstack/react-router'
import { SAMPLE_ROUTINES } from '~/lib/routines'
import { Play, Dumbbell } from 'lucide-react'

export const Route = createFileRoute('/routines')({
  component: RoutinesPage,
  head: () => ({
    meta: [
      { title: 'Routines | FitTrack' },
      { name: 'description', content: 'Danh sách giáo án tập luyện' },
    ],
  }),
})

function RoutinesPage() {
  return (
    <div className="px-4 pt-6 pb-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Giáo án</h1>
        <p className="mt-1 text-sm text-muted">
          Chọn routine để bắt đầu tập nhanh
        </p>
      </header>

      <div className="space-y-3">
        {SAMPLE_ROUTINES.map((routine) => (
          <div
            key={routine.id}
            className="rounded-2xl border border-border bg-surface p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-foreground">{routine.name}</h2>
                <p className="mt-0.5 text-sm text-muted">{routine.description}</p>
                <p className="mt-1.5 text-xs text-muted">
                  {routine.exercises.length} bài tập ·{' '}
                  {routine.exercises.reduce((n, e) => n + e.targetSets, 0)} set
                  gợi ý
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {routine.exercises.map((ex) => (
                    <span
                      key={ex.exerciseId}
                      className="rounded-full bg-surface-secondary px-2.5 py-0.5 text-xs text-muted"
                    >
                      {ex.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/workout"
              search={{ routineId: routine.id }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground active:scale-[0.98] transition-transform"
            >
              <Play className="h-4 w-4 fill-current" />
              Tập routine này
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
