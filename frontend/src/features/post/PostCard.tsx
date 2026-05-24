import { useState } from "react";
import { api } from "../../services/api";
import CommentSection from "./CommentSection";

export default function PostCard({ post }: any) {
  const [likes, setLikes] = useState(post.likes?.length || 0);

  const handleLike = async () => {
    const res = await api.post("/like", { postId: post.id });
    setLikes((prev: number) => prev + (res.data.liked ? 1 : -1));
  };

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-bold text-slate-950">
          {post.author?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div>
          <h3 className="font-semibold text-white">
            {post.author?.name || "Unknown User"}
          </h3>
          <p className="text-xs text-slate-500">Circle MLBB Player</p>
        </div>
      </div>

      <p className="whitespace-pre-wrap text-slate-200">{post.content}</p>

      <div className="mt-4 border-t border-slate-800 pt-3">
        <button
          onClick={handleLike}
          className="rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
        >
          ❤️ {likes}
        </button>
      </div>

      <CommentSection postId={post.id} />
    </article>
  );
}