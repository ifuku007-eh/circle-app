import { api } from "../services/api";

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post("/upload", formData);

  return res.data.url;
}