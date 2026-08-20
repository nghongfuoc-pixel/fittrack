import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: 'Profile | FitTrack' },
      { name: 'description', content: 'Thông tin cá nhân và cài đặt' },
    ],
  }),
})

function ProfilePage() {
  return (
    <div className="px-4 pt-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Hồ sơ</h1>
        <p className="mt-1 text-sm text-muted">Thông tin và cài đặt tài khoản</p>
      </header>

      <div className="rounded-2xl bg-surface p-6 text-center border border-border">
        <p className="text-muted">Đang phát triển</p>
        <p className="mt-1 text-sm text-muted">Cân nặng, đơn vị, mục tiêu sẽ thêm sau</p>
      </div>
    </div>
  )
}
