import { useState } from "react";
import { api } from "../../services/api";
import { uploadImage } from "../../utils/uploadImage";

type CommentSectionProps = {
  postId: number;
  comments: any[];
  onComment: (comment: any) => void;
};

export default function CommentSection({
  postId,
  comments,
  onComment,
}: CommentSectionProps) {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = async (file?: File) => {
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setImage(url);
    } catch (err) {
      console.error("Upload gambar komentar gagal:", err);
      alert("Gagal upload gambar. Coba lagi.");
    }
  };

  const sendComment = async () => {
    if (!text.trim() && !image) return;

    try {
      setLoading(true);

      const res = await api.post("/comment", {
        postId,
        content: text,
        image,
      });

      onComment(res.data);
      setText("");
      setImage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <h2 className="font-bold">Comments</h2>

      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-400">Belum ada komentar.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <img
                  src={
                    comment.user?.avatar ||
                    `https://ui-avatars.com/api/?name=${comment.user?.name || "User"}`
                  }
                  className="h-8 w-8 rounded-full object-cover"
                />
                <p className="text-sm font-semibold">
                  {comment.user?.name || "User"}
                </p>
              </div>

              {comment.content && (
                <p className="text-sm text-slate-200">{comment.content}</p>
              )}

              {comment.image && (
                <img
                  src={comment.image}
                  className="mt-3 max-h-80 w-full rounded-xl object-cover"
                />
              )}
            </div>
          ))
        )}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <textarea
          value={text}
          placeholder="Tulis komentar..."
          onChange={(e) => setText(e.target.value)}
          className="min-h-20 w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
        />

        {image && (
          <img
            src={image}
            className="mt-3 max-h-72 w-full rounded-xl object-cover"
          />
        )}

        <div className="mt-3 flex justify-between">
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
            onClick={sendComment}
            disabled={loading || (!text.trim() && !image)}
            className="rounded-xl bg-cyan-500 px-5 py-2 text-sm font-bold text-slate-950 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Comment"}
          </button>
        </div>
      </div>
    </div>
  );
}