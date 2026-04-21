import { CalendarDays, LogOut, Mail, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'

const profile = {
  name: 'Abhik Patra',
  email: 'abhik.Patra@example.com',
  joinedOn: '2024-01-10',
}

export default function ProfilePage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/sign-in')
  }

  const joinedDateLabel = new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(profile.joinedOn))

  return (
    <section className="mx-auto w-full max-w-4xl">
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-100/50 border-slate-300">
      

        <div className="p-6 md:p-8">
          <div className="mb-6 flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm">
              <User size={24} />
            </div>
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-wide text-slate-600">Welcome back</p>
              <p className="m-0 text-xl font-bold text-gray-900">{profile.name}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-600">
                <User size={16} />
                <p className="m-0 text-xs font-semibold uppercase tracking-wide">Name</p>
              </div>
              <p className="m-0 text-base font-semibold text-gray-900">{profile.name}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-600">
                <Mail size={16} />
                <p className="m-0 text-xs font-semibold uppercase tracking-wide">Email</p>
              </div>
              <p className="m-0 break-all text-base font-semibold text-gray-900">{profile.email}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-600">
                <CalendarDays size={16} />
                <p className="m-0 text-xs font-semibold uppercase tracking-wide">Join Date</p>
              </div>
              <p className="m-0 text-base font-semibold text-gray-900">{joinedDateLabel}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <Button
              type="button"
              onClick={handleLogout}
              className="h-11 gap-2 rounded-xl bg-red-600 px-5 text-white shadow-md shadow-red-200 transition hover:bg-red-700"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
