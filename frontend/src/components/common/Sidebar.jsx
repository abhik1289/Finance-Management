import { LayoutDashboard, ListTree, ReceiptText, User, Wallet } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/category', label: 'Category', icon: ListTree },
  { to: '/expenses', label: 'Transactions', icon: ReceiptText },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white p-4">
      <div className="mb-8 flex items-center gap-2 px-2">
        <Wallet size={22} className="text-violet-600" />
        <span className="text-lg font-semibold text-gray-900">Finance Manager</span>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const IconComponent = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <IconComponent size={18} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
