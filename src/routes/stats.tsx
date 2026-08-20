import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/stats')({
  component: StatsPage,
  head: () => ({
    meta: [
      { title: 'Stats | FitTrack' },
      { name: 'description', content: 'Thống kê và tiến bộ tập luyện' },
    ],
  }),
})

function StatsPage() {
  return (
    <div className="px-4 pt-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Thống kê</h1>
        <p className="mt-1 text-sm text-muted">Theo dõi tiến bộ của bạn</p>
      </header>

      <div className="rounded-2xl bg-surface p-6 text-center border border-border">
        <p className="text-muted">Đang phát triển</p>
        <p className="mt-1 text-sm text-muted">Biểu đồ sẽ xuất hiện ở giai đoạn sau</p>
      </div>
    </div>
  )
}
