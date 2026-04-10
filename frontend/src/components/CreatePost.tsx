import { useState, useRef } from 'react'
import { X, ImageIcon } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { threadService } from '@/features/thread/services/thread.service'
import { Thread } from '@/features/thread/types/thread.types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface Props {
  onClose: () => void
  onSuccess?: (thread: Thread) => void
}

export default function CreatePost({ onClose, onSuccess }: Props) {
  const [content, setContent]   = useState('')
  const [image, setImage]       = useState<File | null>(null)
  const [preview, setPreview]   = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const fileRef                 = useRef<HTMLInputElement>(null)
  const { user }                = useAppSelector(s => s.auth)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!content.trim() || content.length > 280) return
    setLoading(true)
    setError('')
    try {
      const newThread = await threadService.create(content, image ?? undefined)
      onSuccess?.(newThread)
      onClose()
    } catch {
      setError('Gagal membuat post. Coba lagi.')
      setLoading(false)
    }
  }

  const remaining = 280 - content.length

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
          <span className="text-sm font-semibold text-white">Buat Post</span>
          <button
            onClick={handleSubmit}
            disabled={loading || !content.trim() || content.length > 280}
            className="text-xs font-semibold bg-aqua-400 hover:bg-aqua-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-full transition-all"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>

        <Separator />

        {/* Body */}
        <div className="px-5 py-4">
          <div className="flex gap-3">
            <Avatar className="w-9 h-9 flex-shrink-0">
              <AvatarFallback className="text-sm">
                {user?.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <p className="text-sm font-semibold text-white mb-2">{user?.name}</p>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Apa yang sedang terjadi?"
                rows={4}
                autoFocus
                className="w-full bg-transparent text-white text-sm placeholder:text-gray-600 resize-none focus:outline-none leading-relaxed"
              />

              {/* Image preview */}
              {preview && (
                <div className="relative mt-3 rounded-xl overflow-hidden border border-gray-800">
                  <img src={preview} alt="preview" className="w-full max-h-52 object-cover" />
                  <button
                    onClick={() => { setImage(null); setPreview(null) }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="text-aqua-400 hover:text-aqua-200 transition-colors p-1"
          >
            <ImageIcon size={18} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />

          <div className="flex items-center gap-3">
            {error && <span className="text-red-400 text-xs">{error}</span>}
            {/* Sisa karakter indicator */}
            <span className={`text-xs tabular-nums ${remaining < 20 ? 'text-red-400' : 'text-gray-600'}`}>
              {remaining}
            </span>
            {/* Progress circle */}
            <svg width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" fill="none" stroke="#1f2937" strokeWidth="2" />
              <circle
                cx="10" cy="10" r="8" fill="none"
                stroke={remaining < 20 ? '#f87171' : '#1D9E75'}
                strokeWidth="2"
                strokeDasharray={`${Math.max(0, (content.length / 280) * 50.3)} 50.3`}
                strokeLinecap="round"
                transform="rotate(-90 10 10)"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}