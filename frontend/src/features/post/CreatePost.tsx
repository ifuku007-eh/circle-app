import { useState } from "react"
import { api } from "../../services/api"

export default function CreatePost({ onPost }: any) {
  const [content, setContent] = useState("")

  const handleSubmit = async () => {
    const res = await api.post("/posts", { content })
    onPost(res.data)
    setContent("")
  }

  return (
    <div className="p-4 bg-white rounded mb-4">
      <textarea onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleSubmit}>Post</button>
    </div>
  )
}