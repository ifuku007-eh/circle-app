import { useState } from "react";
import { api } from "../../services/api";
import { uploadImage } from "../../utils/uploadImage";

export default function CreatePost({ onPost }: any) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = async (file?: File) => {
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setImage(url);
    } catch (err: any) {
      console.error("Upload gambar gagal:", err);
      const reason = err?.response?.data?.reason || err?.response?.data?.message || err?.message;
      alert(`Gagal upload gambar.${reason ? ` (${reason})` : " Coba lagi."}`);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !image) return;

    try {
      setLoading(true);
      const res = await api.post("/posts", { content, image });
      onPost(res.data);
      setContent("");
      setImage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Apa momen MLBB kamu hari ini?"
        className="min-h-20 w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
      />

      {image && (
        <img
          src={image}
          className="mt-3 max-h-72 w-full rounded-xl object-cover"
        />
      )}

      <div className="mt-3 flex items-center justify-between">
        <label className="cursor-pointer rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
          Upload Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading || (!content.trim() && !image)}
          className="rounded-xl bg-cyan-500 px-5 py-2 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}