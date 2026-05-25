import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function FollowList() {
  const { id, type } = useParams();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isFollowers = type === "followers";

  useEffect(() => {
    const loadData = async () => {
      const endpoint = isFollowers
        ? `/users/${id}/followers`
        : `/users/${id}/following`;

      const res = await api.get(endpoint);

      const mapped = (res.data || []).map((item: any) =>
        isFollowers ? item.follower : item.following
      );

      setUsers(mapped);
      setLoading(false);
    };

    loadData();
  }, [id, type]);

  return (
    <main className="mx-auto max-w-2xl">
      <div className="mb-5">
        <h1 className="text-2xl font-bold">
          {isFollowers ? "Followers" : "Following"}
        </h1>
        <p className="text-sm text-slate-500">
          Daftar user yang {isFollowers ? "mengikuti akun ini" : "diikuti akun ini"}.
        </p>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
          Belum ada data.
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Link
              key={user.id}
              to={`/profile/${user.id}`}
              className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 hover:bg-slate-800"
            >
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                className="h-12 w-12 rounded-full object-cover"
              />

              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        to={`/profile/${id}`}
        className="mt-6 inline-block text-sm text-cyan-400 hover:underline"
      >
        ← Back to profile
      </Link>
    </main>
  );
}