export interface Author {
  id: number
  username: string
  full_name: string
  photo_profile: string | null
}

export interface Thread {
  id: number
  content: string
  image: string | null
  created_at: string
  author: Author
  _count: {
    likes: number
    replies: number
  }
  isLiked?: boolean
}

export interface ThreadsState {
  threads: Thread[]
  isLoading: boolean
  error: string | null
}