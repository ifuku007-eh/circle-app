import { useState } from "react"
import { api } from "../../services/api"
import CommentSection from "./CommentSection"

export default function PostCard({ post }: any) {
  const [likes, setLikes] = useState(post.likes?.length || 0)

  const handleLike = async () => {
    const res = await api.post("/like", { postId: post.id })
    setLikes((prev: number) => prev + (res.data.liked ? 1 : -1))
  }

  return (
    <div className="bg-white p-4 mb-4">
      <h3>{post.author.name}</h3>
      <p>{post.content}</p>

      <button onClick={handleLike}>❤️ {likes}</button>

      <CommentSection postId={post.id} />
    </div>
  )
}