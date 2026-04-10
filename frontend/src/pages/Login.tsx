import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAppDispatch } from "../store/hooks";
import { login } from "../store/authSlice";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  setLoading(true)

  try {
    const res = await api.post('/auth/login', {
      email: identifier,
      password
    })

    const token = res.data.data.token
    const user  = res.data.data.user

    localStorage.setItem('token', token)
    dispatch(login(user))

    navigate('/')
  } catch (err: any) {
    console.log("ERROR:", err.response?.data)
    setError(err.response?.data?.message || "Login gagal")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-aqua-400 mb-1">circle</h1>
        <p className="text-gray-500 text-sm mb-8">Masuk ke akun kamu</p>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 rounded-xl px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Email atau Username</label>
            <input
              type="text"
              placeholder="john@example.com atau john_doe"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-aqua-400 transition-colors placeholder:text-gray-600"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-aqua-400 transition-colors placeholder:text-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-aqua-400 hover:bg-aqua-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-sm mt-1"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Belum punya akun?{" "}
          <Link to="/register" className="text-aqua-400 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
