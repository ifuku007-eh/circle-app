import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Home, Search, User, LogOut, PenSquare } from 'lucide-react'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/authSlice'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import CreatePost from './CreatePost'
import { Thread } from '@/features/thread/types/thread.types'

export const threadEvents = new EventTarget()
export const THREAD_CREATED = 'thread:created'


const navItem = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm w-full ${
    isActive
      ? 'bg-aqua-900/60 text-aqua-300 font-medium'
      : 'text-gray-400 hover:bg-white/5 hover:text-white'
  }`

export default function Layout() {
  const navigate            = useNavigate()
  const dispatch            = useAppDispatch()
  const { user }            = useAppSelector(s => s.auth)
  const [showCreate, setShowCreate] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleThreadCreated = (thread: Thread) => {
    threadEvents.dispatchEvent(
      Object.assign(new CustomEvent(THREAD_CREATED), { thread })
    )
    setShowCreate(false)
  }

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* Sidebar */}
      <aside className="w-60 border-r border-gray-900 flex flex-col p-4 fixed h-full">

        <div className="px-4 py-3 mb-6">
          <h1 className="text-xl font-bold text-aqua-400 tracking-tight">circle</h1>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <NavLink to="/" end className={navItem}>
            <Home size={19} /> Home
          </NavLink>
          <NavLink to="/search" className={navItem}>
            <Search size={19} /> Search
          </NavLink>
          <NavLink to={`/profile/${user?.user_id}`} className={navItem}>
            <User size={19} /> Profile
          </NavLink>
        </nav>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center justify-center gap-2 bg-aqua-400 hover:bg-aqua-600 active:scale-[0.98] text-white font-semibold py-2.5 px-4 rounded-xl transition-all mb-4 text-sm"
        >
          <PenSquare size={15} /> Create Post
        </button>

        {/* User info */}
        {user && (
          <button
            onClick={() => navigate(`/profile/${user.user_id}`)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left mb-1"
          >
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="text-xs">
                {user.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-600 truncate">@{user.username}</p>
            </div>
          </button>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-white hover:bg-white/5 transition-all text-sm rounded-xl"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1">
        <Outlet />
      </main>

      {showCreate && (
        <CreatePost
          onClose={() => setShowCreate(false)}
          onSuccess={(thread) => {
      threadEvents.dispatchEvent(
        new CustomEvent(THREAD_CREATED, { detail: thread })
      )
    }}
  />
)}
    </div>
  )
}