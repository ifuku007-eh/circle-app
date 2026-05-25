import { useEffect, useState } from "react";
import { api } from "../services/api";
import PostCard from "../features/post/PostCard";
import CreatePost from "../features/post/CreatePost";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    const res = await api.get("/posts");
    setPosts(Array.isArray(res.data) ? res.data : []);
    setLoading(false);
  };

  const loadSuggestions = async () => {
    const res = await api.get("/users/suggestions");
    setSuggestions(res.data || []);
  };

  useEffect(() => {
    loadPosts();
    loadSuggestions();
  }, []);

  const handleFollow = async (id: number) => {
    await api.post(`/follow/${id}`);
    setSuggestions((prev) => prev.filter((user) => user.id !== id));
  };

  const addPost = (post: any) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <main className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section>
        <CreatePost onPost={addPost} />

        <div className="mt-5 space-y-4">
          {loading ? (
            <p className="text-slate-400">Loading posts...</p>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
              Belum ada post.
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="mb-3 font-bold">Follow Suggestion</h2>

          {suggestions.length === 0 ? (
            <p className="text-sm text-slate-400">Belum ada suggestion.</p>
          ) : (
            suggestions.map((user) => (
              <div
                key={user.id}
                className="mb-3 flex items-center justify-between gap-3"
              >
                <Link to={`/profile/${user.id}`} className="flex min-w-0 items-center gap-3">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <span className="truncate text-sm font-semibold">{user.name}</span>
                </Link>

                <button
                  onClick={() => handleFollow(user.id)}
                  className="rounded-lg bg-cyan-500 px-3 py-1 text-xs font-bold text-slate-950"
                >
                  Follow
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </main>
  );
}