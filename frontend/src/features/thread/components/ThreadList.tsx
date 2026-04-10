import { Thread } from '../types/thread.types'
import ThreadCard from './ThreadCard'
import ThreadSkeleton from './ThreadSkeleton'

interface ThreadListProps {
  threads: Thread[]
  isLoading: boolean
  onLike: (threadId: number) => void
}

export default function ThreadList({ threads, isLoading, onLike }: ThreadListProps) {

  // ✅ Conditional rendering: loading state
  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <ThreadSkeleton key={i} />
        ))}
      </div>
    )
  }

  // ✅ Conditional rendering: empty state
  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center mb-4">
          <span className="text-2xl">🌊</span>
        </div>
        <p className="text-white font-medium text-sm mb-1">Belum ada thread</p>
        <p className="text-gray-600 text-xs">Jadilah yang pertama memulai percakapan!</p>
      </div>
    )
  }

  // ✅ Render list thread
  return (
    <div>
      {threads.map(thread => (
        <ThreadCard
          key={thread.id}
          thread={thread}
          onLike={onLike}
        />
      ))}
    </div>
  )
}