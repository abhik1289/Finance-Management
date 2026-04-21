import { Bell, Menu, Search, User } from 'lucide-react'
import { useNavigate } from "react-router";
export default function Header({ onOpenSidebar = () => {} }) {


  const navigation = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-violet-100 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-violet-200 hover:text-violet-700 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

         
        </div>

        <div className="ml-auto flex items-center gap-2">
         
          <div className="inline-flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-2.5 py-2 sm:px-3">
            <div onClick={()=>navigation("/profile")} className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-violet-700">
              <User size={15} />
            </div>
            <span className="hidden text-sm font-medium text-violet-700 sm:inline">Account</span>
          </div>
        </div>
      </div>
    </header>
  )
}
