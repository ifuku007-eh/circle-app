import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import api from '../services/api'
import ThreadCard from '../components/ThreadCard'

export default function Profile() {
  const { id }  = useParams()
  const { user: me } = useAppSelector(s => s.auth)
  const [user, setUser]       = useState<any>(null)
  const [followed, setFollowed] = useState(false)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(r => setUser(r.data.data ?? r.data))
      .finally(() => setLoading(false))
  }, [id])

  const handleFollow = async () => {
    const res = await api.post(`/users/${id}/follow`)
    setFollowed(res.data.data?.following ?? false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-aqua-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!user) return <div className="p-8 text-gray-600 text-sm">User tidak ditemukan</div>

  const isMe = String(me?.user_id) === String(id)

  return (
    <div>
      {/* Cover */}
      <div className="h-36 bg-aqua-900 border-b border-gray-900" />

      <div className="px-6 pb-6">
        {/* Avatar + Follow */}
        <div className="flex justify-between items-end -mt-12 mb-4">
          <div className="w-20 h-20 rounded-full bg-aqua-600 border-4 border-black flex items-center justify-center text-2xl font-bold text-white">
            {user.full_name?.[0]?.toUpperCase()}
          </div>
          {!isMe && (
            <button
              onClick={handleFollow}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                followed
                  ? 'bg-gray-900 border border-gray-700 text-white hover:bg-gray-800'
                  : 'bg-aqua-400 hover:bg-aqua-600 text-white'
              }`}
            >
              {followed ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        <h2 className="text-lg font-bold text-white">{user.full_name}</h2>
        <p className="text-gray-500 text-sm mb-2">@{user.username}</p>
        {user.bio && <p className="text-gray-300 text-sm mb-3 leading-relaxed">{user.bio}</p>}

        <div className="flex gap-5 text-sm text-gray-500 mb-6">
          <span><strong className="text-white font-semibold">{user._count?.following ?? 0}</strong> Following</span>
          <span><strong className="text-white font-semibold">{user._count?.followers ?? 0}</strong> Followers</span>
        </div>

        <div className="border-t border-gray-900">
          {user.threads?.length === 0 && (
            <p className="text-gray-600 text-sm text-center py-10">Belum ada thread</p>
          )}
          {user.threads?.map((t: any) => (
            <ThreadCard key={t.id} thread={{ ...t, author: user }} />
          ))}
        </div>
      </div>
    </div>
  )
}