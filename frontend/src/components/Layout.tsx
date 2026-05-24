import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem("user") || "null");

  const [me, setMe] = useState<any>(localUser);

  useEffect(() => {
    api.get("/users/me").then((res) => {
      setMe(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/dashboard" className="font-bold text-cyan-400">
            Circle MLBB
          </Link>

          <div className="flex items-center gap-2 text-sm">
            <Link
              to={`/profile/${me?.id}`}
              className="rounded-xl bg-slate-800 px-3 py-2 hover:bg-slate-700"
            >
              Profile
            </Link>

            <Link
              to="/notifications"
              className="rounded-xl bg-slate-800 px-3 py-2 hover:bg-slate-700"
            >
              🔔
            </Link>

            <span className="hidden text-slate-400 md:block">
              Followers {me?._count?.followers || 0} · Following{" "}
              {me?._count?.following || 0}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-700 px-3 py-2 text-slate-300 hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}