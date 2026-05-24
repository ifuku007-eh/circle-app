import { useEffect, useState } from "react";
import { api } from "../services/api";
import PostCard from "../features/post/PostCard";
import CreatePost from "../features/post/CreatePost";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
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

  const handleSearch = async () => {
    if (!search.trim()) return setSearchResults([]);

    const res = await api.get(`/users/search?q=${search}`);
    setSearchResults(res.data || []);
  };

  const handleFollow = async (id: number) => {
    await api.post(`/follow/${id}`);
    setSuggestions((prev) => prev.filter((u) => u.id !== id));
  };

  const addPost = (post: any) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari player..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleSearch}
                className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950"
              >
                Search
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-3 space-y-2">
                {searchResults.map((user) => (
                  <Link
                    key={user.id}
                    to={`/profile/${user.id}`}
                    className="flex items-center gap-3 rounded-xl bg-slate-800 p-3 hover:bg-slate-700"
                  >
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

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
                  <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <span className="text-sm font-semibold">{user.name}</span>
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
      </div>
    </main>
  );
}