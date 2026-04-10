export default function ThreadSkeleton() {
  return (
    <div className="border-b border-gray-900 px-5 py-4 animate-pulse">
      <div className="flex gap-3">
        {/* Avatar skeleton */}
        <div className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          {/* Name skeleton */}
          <div className="flex gap-2 items-center">
            <div className="h-3 bg-gray-800 rounded-full w-24" />
            <div className="h-3 bg-gray-800 rounded-full w-16" />
          </div>
          {/* Content skeleton */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-800 rounded-full w-full" />
            <div className="h-3 bg-gray-800 rounded-full w-4/5" />
            <div className="h-3 bg-gray-800 rounded-full w-3/5" />
          </div>
          {/* Action skeleton */}
          <div className="flex gap-4 pt-1">
            <div className="h-3 bg-gray-800 rounded-full w-10" />
            <div className="h-3 bg-gray-800 rounded-full w-10" />
          </div>
        </div>
      </div>
    </div>
  )
}