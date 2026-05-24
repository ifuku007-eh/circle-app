import { useState } from "react";
import { api } from "../../services/api";

export default function CreatePost({ onPost }: any) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);
      const res = await api.post("/posts", { content });
      onPost(res.data.post || res.data);
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Apa momen MLBB kamu hari ini?"
        className="min-h-28 w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
      />

      <div className="mt-3 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="rounded-xl bg-cyan-500 px-5 py-2 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}