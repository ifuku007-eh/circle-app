import api from "@/services/api"

export const threadService = {
  getAll: async () => {
    const res = await api.get("/threads")
    return res.data.data
  },

  toggleLike: async (threadId: number) => {
    return await api.post(`/threads/${threadId}/like`)
  },

  create: async (content: string, image?: string) => {
    const res = await api.post("/threads", { content, image })
    return res.data.data
  },
}