import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";
import CommentSection from "../features/post/CommentSection";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [likes, setLikes] = useState(0);

  const loadPost = async () => {
    const res = await api.get(`/posts/${id}`);
    setPost(res.data);
    setLikes(res.data.likes?.length || 0);
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  const handleLike = async () => {
    const res = await api.post("/like", { postId: Number(id) });
    setLikes((prev) => prev + (res.data.liked ? 1 : -1));
  };

  if (!post) {
    return <div className="mx-auto max-w-2xl p-6 text-slate-400">Loading...</div>;
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <Link to="/dashboard" className="text-sm text-cyan-400">
        ← Back to dashboard
      </Link>

      <article className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <Link to={`/profile/${post.author?.id}`} className="mb-3 flex items-center gap-3">
          <img
            src={
              post.author?.avatar ||
              `https://ui-avatars.com/api/?name=${post.author?.name || "User"}`
            }
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{post.author?.name}</h3>
            <p className="text-xs text-slate-500">Circle MLBB Player</p>
          </div>
        </Link>

        <p className="whitespace-pre-wrap text-slate-200">{post.content}</p>

        {post.image && (
          <img
            src={post.image}
            className="mt-4 max-h-[520px] w-full rounded-2xl object-cover"
          />
        )}

        <button
          onClick={handleLike}
          className="mt-4 rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
        >
          ❤️ {likes}
        </button>
      </article>

      <CommentSection
        postId={post.id}
        comments={post.comments || []}
        onComment={(comment) =>
          setPost((prev: any) => ({
            ...prev,
            comments: [...(prev.comments || []), comment],
          }))
        }
      />
    </main>
  );
}