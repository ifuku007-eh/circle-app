import { useEffect, useState } from "react"
import { api } from "../../services/api"
import { socket } from "../../services/socket"

export default function CommentSection({ postId }: any) {
  const [comments, setComments] = useState<any[]>([])
  const [text, setText] = useState("")

  useEffect(() => {
    socket.on("comment-update", (data: any) => {
      if (data.postId === postId) {
        setComments((prev) => [...prev, data])
      }
    })
  }, [])

  const sendComment = async () => {
    const res = await api.post("/comment", {
      postId,
      content: text,
    })

    socket.emit("new-comment", res.data)
    setText("")
  }

  return (
    <div>
      {comments.map((c, i) => (
        <p key={i}>{c.content}</p>
      ))}

      <input onChange={(e) => setText(e.target.value)} />
      <button onClick={sendComment}>Send</button>
    </div>
  )
}