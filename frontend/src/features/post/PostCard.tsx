import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

export default function PostCard({ post }: any) {
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    const res = await api.post("/like", { postId: post.id });

    setLiked(res.data.liked);
    setLikes((prev: number) => prev + (res.data.liked ? 1 : -1));
  };

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <Link to={`/profile/${post.author?.id}`} className="mb-3 flex items-center gap-3">
        <img
          src={
            post.author?.avatar ||
            `https://ui-avatars.com/api/?name=${post.author?.name || "User"}`
          }
          className="h-10 w-10 rounded-full object-cover"
        />

        <div>
          <h3 className="font-semibold text-white">
            {post.author?.name || "Unknown User"}
          </h3>
          <p className="text-xs text-slate-500">Circle MLBB Player</p>
        </div>
      </Link>

      <p className="whitespace-pre-wrap text-slate-200">{post.content}</p>

      {post.image && (
        <img
          src={post.image}
          className="mt-4 max-h-[420px] w-full rounded-2xl object-cover"
        />
      )}

      <div className="mt-4 flex gap-3 border-t border-slate-800 pt-3">
        <button
          onClick={handleLike}
          className={`rounded-xl px-4 py-2 text-sm ${
            liked
              ? "bg-red-500/20 text-red-300"
              : "bg-slate-800 text-slate-200 hover:bg-slate-700"
          }`}
        >
          ❤️ {likes}
        </button>

        <Link
          to={`/post/${post.id}`}
          className="rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
        >
          💬 {post.comments?.length || 0} Comment
        </Link>
      </div>
    </article>
  );
}