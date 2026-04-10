import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAppDispatch } from '../store/hooks'
import { login } from '../store/authSlice'

const fields = [
  { name: 'username', label: 'Username',      placeholder: 'john_doe',          type: 'text'     },
  { name: 'name',     label: 'Nama Lengkap',  placeholder: 'John Doe',          type: 'text'     },
  { name: 'email',    label: 'Email',          placeholder: 'john@example.com',  type: 'email'    },
  { name: 'password', label: 'Password',       placeholder: 'Minimal 8 karakter',type: 'password' },
]

export default function Register() {
  const [form, setForm]     = useState({ username: '', name: '', email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
      username: form.username,
      full_name: form.name,
      email: form.email,
      password: form.password
})
      dispatch(login({ ...res.data.data, avatar: null }))
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Registrasi gagal, coba lagi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <h1 className="text-3xl font-bold text-aqua-400 mb-1">circle</h1>
        <p className="text-gray-500 text-sm mb-8">Buat akun baru</p>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 rounded-xl px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map(f => (
            <div key={f.name} className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                placeholder={f.placeholder}
                value={(form as any)[f.name]}
                onChange={handleChange}
                required
                className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-aqua-400 transition-colors placeholder:text-gray-600"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="bg-aqua-400 hover:bg-aqua-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-sm mt-1"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-aqua-400 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}