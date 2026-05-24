import { useEffect, useState } from "react"
import { api } from "../services/api"
import PostCard from "../features/post/PostCard"
import CreatePost from "../features/post/CreatePost"

export default function Dashboard() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    api.get("/posts").then((res: any) => setPosts(res.data))
  }, [])

  const addPost = (post: any) => {
    setPosts((prev) => [post, ...prev])
  }

  return (
    <div className="p-4">
      <CreatePost onPost={addPost} />

      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  )
}