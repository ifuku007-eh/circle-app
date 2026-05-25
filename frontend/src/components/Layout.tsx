import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [me, setMe] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const loadMe = async () => {
    const res = await api.get("/users/me");
    setMe(res.data);
    localStorage.setItem("user", JSON.stringify(res.data));
  };

  useEffect(() => {
    loadMe();
  }, [location.pathname]);

  const handleSearch = async (value: string) => {
    setSearch(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const res = await api.get(`/users/search?q=${encodeURIComponent(value)}`);
    setResults(res.data || []);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-5">
        <aside className="sticky top-5 hidden h-fit w-[280px] shrink-0 space-y-4 lg:block">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <Link to="/dashboard" className="block text-2xl font-bold text-cyan-400">
              Circle MLBB
            </Link>

            <p className="mt-1 text-sm text-slate-500">
              Social MLBB Community
            </p>

            <div className="relative mt-5">
              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search player..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />

              {results.length > 0 && (
                <div className="absolute left-0 right-0 z-50 mt-2 space-y-2 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-xl">
                  {results.map((user) => (
                    <Link
                      key={user.id}
                      to={`/profile/${user.id}`}
                      onClick={() => {
                        setSearch("");
                        setResults([]);
                      }}
                      className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-800"
                    >
                      <img
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${user.name}`
                        }
                        className="h-10 w-10 rounded-full object-cover"
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 space-y-2">
              <Link className="block rounded-xl bg-slate-800 px-4 py-3 text-sm hover:bg-slate-700" to="/dashboard">
                🏠 Dashboard
              </Link>

              <Link className="block rounded-xl bg-slate-800 px-4 py-3 text-sm hover:bg-slate-700" to={`/profile/${me?.id}`}>
                👤 Profile
              </Link>

              <Link className="block rounded-xl bg-slate-800 px-4 py-3 text-sm hover:bg-slate-700" to={`/profile/${me?.id}/followers`}>
                👥 Followers
              </Link>

              <Link className="block rounded-xl bg-slate-800 px-4 py-3 text-sm hover:bg-slate-700" to={`/profile/${me?.id}/following`}>
                ➕ Following
              </Link>

              <Link className="block rounded-xl bg-slate-800 px-4 py-3 text-sm hover:bg-slate-700" to="/notifications">
                🔔 Notifications
              </Link>
            </div>

            <button
              onClick={handleLogout}
              className="mt-5 w-full rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
            >
              Logout
            </button>
          </div>

          {me && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center gap-3">
                <img
                  src={me.avatar || `https://ui-avatars.com/api/?name=${me.name}`}
                  className="h-14 w-14 rounded-full object-cover"
                />

                <div className="min-w-0">
                  <h2 className="truncate font-bold">{me.name}</h2>
                  <p className="truncate text-xs text-slate-500">{me.email}</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Link
                  to={`/profile/${me.id}/followers`}
                  className="rounded-2xl bg-slate-950 p-4 text-center hover:bg-slate-800"
                >
                  <p className="text-xl font-bold">{me._count?.followers || 0}</p>
                  <p className="text-xs text-slate-500">Followers</p>
                </Link>

                <Link
                  to={`/profile/${me.id}/following`}
                  className="rounded-2xl bg-slate-950 p-4 text-center hover:bg-slate-800"
                >
                  <p className="text-xl font-bold">{me._count?.following || 0}</p>
                  <p className="text-xs text-slate-500">Following</p>
                </Link>
              </div>
            </div>
          )}
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}