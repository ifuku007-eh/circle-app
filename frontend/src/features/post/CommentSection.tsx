import { useEffect, useState } from "react";
import { api } from "../../services/api";

type Comment = {
  id?: number;
  content: string;
  postId?: number;
  userId?: number;
  createdAt?: string;
};

type CommentSectionProps = {
  postId: number;
};

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const loadComments = async () => {
    try {
      const res = await api.get(`/comment/${postId}`);
      setComments(res.data.comments || res.data || []);
    } catch (error) {
      console.log("Gagal mengambil komentar:", error);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const sendComment = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);

      const res = await api.post("/comment", {
        postId,
        content: text,
      });

      setComments((prev) => [...prev, res.data.comment || res.data]);
      setText("");
    } catch (error) {
      console.log("Gagal mengirim komentar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="space-y-2">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-400">Belum ada komentar.</p>
        ) : (
          comments.map((comment, index) => (
            <div
              key={comment.id || index}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
            >
              <p className="text-sm text-slate-200">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          placeholder="Tulis komentar..."
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white outline-none focus:border-cyan-400"
        />

        <button
          onClick={sendComment}
          disabled={loading}
          className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}