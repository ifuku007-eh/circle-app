import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage } from "react-icons/ai";
import api from "../services/api";

interface Props {
  thread: any;
}

export default function ThreadCard({ thread }: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(thread._count?.likes ?? 0);
  const navigate = useNavigate();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/threads/${thread.id}/like`);
      setLiked(res.data.data.liked);
      setLikeCount((prev: number) =>
        res.data.data.liked ? prev + 1 : prev - 1,
      );
    } catch {}
  };

  return (
    <article
      onClick={() => navigate(`/thread/${thread.id}`)}
      className="border-b border-gray-900 px-5 py-4 hover:bg-gray-950 transition-colors cursor-pointer"
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-aqua-700 flex items-center justify-center font-bold text-sm flex-shrink-0 text-aqua-100">
          {thread.author?.full_name?.[0]?.toUpperCase() ?? "?"}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-white">
              {thread.author?.full_name}
            </span>
            <span className="text-gray-600 text-xs">
              @{thread.author?.username}
            </span>
          </div>

          {/* Content */}
          <p className="text-gray-200 text-sm leading-relaxed mb-3">
            {thread.content}
          </p>

          {/* Image */}
          {thread.image && (
            <img
              src={thread.image}
              alt=""
              className="rounded-xl max-h-72 w-full object-cover mb-3 border border-gray-800"
            />
          )}

          {/* Actions */}
          <div className="flex gap-5 text-gray-600 text-xs">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors hover:text-aqua-400 ${liked ? "text-aqua-400" : ""}`}
            >
              {liked ? <AiFillHeart size={16} /> : <AiOutlineHeart size={16} />}
              {likeCount}
            </button>
            <span className="flex items-center gap-1.5 hover:text-aqua-400 transition-colors">
              <AiOutlineMessage size={16} />
              {thread._count?.replies ?? 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
