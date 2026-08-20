import { Link } from '@tanstack/react-router'

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="text-muted">
        {children || <p>Trang bạn tìm không tồn tại.</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Quay lại
        </button>
        <Link
          to="/"
          className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}
