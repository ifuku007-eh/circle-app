import { useState, useEffect, useCallback } from 'react'
import { ThreadsState, Thread } from '../types/thread.types'
import { dummyThreads } from '../data/dummy.threads'
import { threadService } from '../services/thread.service'

export const useThreads = () => {
  const [state, setState] = useState<ThreadsState>({
    threads: [],
    isLoading: true,
    error: null
  })

  // GET THREADS
  const fetchThreads = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const data = await threadService.getAll()

      setState({
        threads: data,
        isLoading: false,
        error: null
      })
    } catch {
      // fallback dummy
      setState({
        threads: dummyThreads,
        isLoading: false,
        error: null
      })
    }
  }, [])

  useEffect(() => {
    fetchThreads()
  }, [fetchThreads])

  // LIKE
  const toggleLike = useCallback(async (threadId: number) => {
    setState(prev => ({
      ...prev,
      threads: prev.threads.map(t => {
        if (t.id !== threadId) return t

        const likes = t._count?.likes ?? 0

        return {
          ...t,
          isLiked: !t.isLiked,
          _count: {
            likes: t.isLiked ? likes - 1 : likes + 1,
            replies: t._count?.replies ?? 0
          }
        }
      })
    }))

    try {
      await threadService.toggleLike(threadId)
    } catch {
      // rollback
      setState(prev => ({
        ...prev,
        threads: prev.threads.map(t => {
          if (t.id !== threadId) return t

          const likes = t._count?.likes ?? 0

          return {
            ...t,
            isLiked: !t.isLiked,
            _count: {
              likes: t.isLiked ? likes - 1 : likes + 1,
              replies: t._count?.replies ?? 0
            }
          }
        })
      }))
    }
  }, [])

  // ADD THREAD
  const addThread = useCallback((newThread: Thread) => {
    setState(prev => ({
      ...prev,
      threads: [newThread, ...prev.threads]
    }))
  }, [])

  return {
    threads: state.threads,
    isLoading: state.isLoading,
    error: state.error,
    toggleLike,
    addThread,
    refetch: fetchThreads
  }
}