import { User } from 'lucide-react'

export default function Header() {
  return (
    <header className="h-16 flex justify-end py-2 items-center border-b border-gray-200 bg-white px-6">
      <div className="gap-4 text-gray-600">
        <div className="profile">
          <User size={20} />
        </div>
      </div>
    </header>
  )
}
