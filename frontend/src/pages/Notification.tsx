import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    const res = await api.get("/notifications");
    setNotifications(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();

    api.put("/notifications/read").catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">Notifications</h1>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
          Belum ada notifikasi.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <Link
              key={item.id}
              to={item.postId ? `/post/${item.postId}` : "/dashboard"}
              className={`block rounded-2xl border border-slate-800 p-4 ${
                item.read ? "bg-slate-900" : "bg-cyan-500/10"
              }`}
            >
              <p className="text-sm text-slate-200">{item.message}</p>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}

      <Link
        to="/dashboard"
        className="mt-6 inline-block text-sm text-cyan-400 hover:underline"
      >
        ← Back to dashboard
      </Link>
    </main>
  );
}