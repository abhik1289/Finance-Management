import { LayoutDashboard, ListTree, ReceiptText, User, Wallet, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/category', label: 'Category', icon: ListTree },
  { to: '/expenses', label: 'Transactions', icon: ReceiptText },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 shrink-0 border-r border-violet-100 bg-white p-5 shadow-xl shadow-violet-200/40 transition-transform duration-300 lg:translate-x-0 lg:bg-gradient-to-b lg:from-white lg:via-violet-50/30 lg:to-white lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-start justify-between gap-3 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Wallet size={20} />
            </div>
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Finance</p>
              <span className="text-base font-semibold text-gray-900">Manager Suite</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 lg:hidden"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const IconComponent = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                      : 'text-slate-600 hover:bg-white hover:text-violet-700 hover:shadow-sm'
                  }`
                }
              >
                <IconComponent size={18} className="transition-transform group-hover:scale-105" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
