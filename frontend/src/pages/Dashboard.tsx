import { useEffect, useState } from "react";
import { api } from "../services/api";
import PostCard from "../features/post/PostCard";
import CreatePost from "../features/post/CreatePost";

export default function Dashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(Array.isArray(res.data) ? res.data : res.data.posts || []);
    } catch (error) {
      console.log("Gagal mengambil posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const addPost = (post: any) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Bagikan momen Mobile Legends kamu.
          </p>
        </div>

        <CreatePost onPost={addPost} />

        <div className="mt-6 space-y-4">
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
      </div>
    </main>
  );
}