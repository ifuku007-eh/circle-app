import { useNavigate } from 'react-router-dom'

interface Props {
  thread: any
  onLike: (id: number) => void
}

export default function ThreadCard({ thread, onLike }: Props) {
  const navigate = useNavigate()

  return (
    <article
      onClick={() => navigate(`/thread/${thread.id}`)}
      className="border-b border-gray-900 px-5 py-4 hover:bg-gray-950 transition-colors cursor-pointer"
    >
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-aqua-700 flex items-center justify-center font-bold text-sm">
          {thread.author?.full_name?.[0]?.toUpperCase() ?? "?"}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-white">
              {thread.author?.full_name}
            </span>
            <span className="text-gray-600 text-xs">
              @{thread.author?.username}
            </span>
          </div>

          <p className="text-gray-200 text-sm mb-3">
            {thread.content}
          </p>

          {thread.image && (
            <img
              src={thread.image}
              className="rounded-xl mb-3"
            />
          )}

          <div className="flex gap-5 text-gray-600 text-xs">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onLike(thread.id)
              }}
              className="flex items-center gap-1.5 hover:text-aqua-400"
            >
              ❤️ {thread._count?.likes ?? 0}
            </button>

            <span>
              💬 {thread._count?.replies ?? 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}