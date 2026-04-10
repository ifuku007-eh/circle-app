import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AiOutlineArrowLeft, AiOutlineHeart } from 'react-icons/ai'
import { useAppSelector } from '../store/hooks'
import api from '../services/api'

export default function DetailPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAppSelector(s => s.auth)
  const [thread, setThread]   = useState<any>(null)
  const [reply, setReply]     = useState('')
  const [posting, setPosting] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchThread = () =>
    api.get(`/threads/${id}`)
      .then(r => setThread(r.data.data ?? r.data))
      .finally(() => setLoading(false))

  useEffect(() => { fetchThread() }, [id])

  const handleReply = async () => {
    if (!reply.trim()) return
    setPosting(true)
    try {
      await api.post('/replies', { thread_id: Number(id), content: reply })
      setReply('')
      fetchThread()
    } finally {
      setPosting(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-aqua-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!thread) return <div className="p-8 text-gray-600 text-sm">Thread tidak ditemukan</div>

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-900 px-5 py-4 z-10 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
          <AiOutlineArrowLeft size={20} />
        </button>
        <h2 className="font-bold text-base">Post</h2>
      </div>

      {/* Thread utama */}
      <div className="px-5 py-5 border-b border-gray-900">
        <div className="flex gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-aqua-700 flex items-center justify-center font-bold text-sm text-aqua-100 flex-shrink-0">
            {thread.author?.full_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm">{thread.author?.full_name}</p>
            <p className="text-gray-500 text-xs">@{thread.author?.username}</p>
          </div>
        </div>

        <p className="text-white text-base leading-relaxed mb-4">{thread.content}</p>

        {thread.image && (
          <img src={thread.image} alt="" className="rounded-xl w-full border border-gray-800 mb-4" />
        )}

        <div className="flex items-center gap-4 text-gray-600 text-sm pt-4 border-t border-gray-900">
          <span className="flex items-center gap-1.5">
            <AiOutlineHeart size={16} /> {thread._count?.likes ?? 0} likes
          </span>
          <span>{thread.replies?.length ?? 0} replies</span>
        </div>
      </div>

      {/* Input reply */}
      <div className="px-5 py-4 border-b border-gray-900 flex gap-3">
        <div className="w-9 h-9 rounded-full bg-aqua-800 flex items-center justify-center text-sm font-bold text-aqua-100 flex-shrink-0">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1">
          <textarea
            value={reply}
            onChange={e => setReply(e.target.value)}
            placeholder="Tulis balasan..."
            rows={2}
            className="w-full bg-transparent text-white text-sm placeholder:text-gray-600 resize-none focus:outline-none leading-relaxed"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleReply}
              disabled={posting || !reply.trim()}
              className="bg-aqua-400 hover:bg-aqua-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all active:scale-95"
            >
              {posting ? 'Memproses...' : 'Reply'}
            </button>
          </div>
        </div>
      </div>

      {/* List replies */}
      {thread.replies?.map((r: any) => (
        <div key={r.id} className="px-5 py-4 border-b border-gray-900 flex gap-3">
          <div className="w-9 h-9 rounded-full bg-aqua-800 flex items-center justify-center text-sm font-bold text-aqua-100 flex-shrink-0">
            {r.user?.full_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{r.user?.full_name}</span>
              <span className="text-gray-600 text-xs">@{r.user?.username}</span>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">{r.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}