import { Link } from '@tanstack/react-router'
import { Home, Dumbbell, ClipboardList, BarChart3, User } from 'lucide-react'

const tabs = [
  { to: '/', label: 'Home', icon: Home, exact: true },
  { to: '/routines', label: 'Routines', icon: Dumbbell },
  { to: '/log', label: 'Log', icon: ClipboardList },
  { to: '/stats', label: 'Stats', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
] as const

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-md safe-bottom">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {tabs.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: !!exact }}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-muted transition-colors"
            activeProps={{
              className:
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-primary font-medium',
            }}
          >
            <Icon className="h-6 w-6" strokeWidth={2} />
            <span className="text-[11px] leading-tight">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
