import { Thread } from '../types/thread.types'

export const dummyThreads: Thread[] = [
  {
    id: 1,
    content: 'Selamat datang di Circle! Platform sosial media baru dengan tampilan aqua yang segar 🌊',
    image: null,
    created_at: new Date().toISOString(),
    author: {
      id: 1,
      username: 'circle_official',
      full_name: 'Circle Official',
      photo_profile: null
    },
    _count: { likes: 128, replies: 24 },
    isLiked: false
  },
  {
    id: 2,
    content: 'Clean architecture di React itu penting banget. Pisahkan logic, UI, dan API calls ke layer yang berbeda supaya kode lebih mudah dimaintain dan di-test.',
    image: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    author: {
      id: 2,
      username: 'dev_indonesia',
      full_name: 'Dev Indonesia',
      photo_profile: null
    },
    _count: { likes: 87, replies: 12 },
    isLiked: true
  },
  {
    id: 3,
    content: 'Vite vs CRA — Vite jauh lebih cepat untuk development. Hot Module Replacement (HMR)-nya hampir instan. Tidak ada alasan lagi pakai CRA untuk project baru.',
    image: null,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    author: {
      id: 3,
      username: 'rizki_dev',
      full_name: 'Rizki Developer',
      photo_profile: null
    },
    _count: { likes: 203, replies: 45 },
    isLiked: false
  },
  {
    id: 4,
    content: 'Tips Git untuk kerja tim: selalu buat branch baru untuk setiap fitur, jangan langsung push ke main. Review kode lewat Pull Request sebelum merge.',
    image: null,
    created_at: new Date(Date.now() - 10800000).toISOString(),
    author: {
      id: 4,
      username: 'sinta_code',
      full_name: 'Sinta Coderina',
      photo_profile: null
    },
    _count: { likes: 156, replies: 33 },
    isLiked: false
  },
  {
    id: 5,
    content: 'Redux Toolkit + React Query adalah kombinasi yang powerful. Redux untuk global state (user, theme), React Query untuk server state (data dari API). Jangan campur keduanya!',
    image: null,
    created_at: new Date(Date.now() - 14400000).toISOString(),
    author: {
      id: 5,
      username: 'budi_frontend',
      full_name: 'Budi Frontend',
      photo_profile: null
    },
    _count: { likes: 341, replies: 67 },
    isLiked: true
  }
]