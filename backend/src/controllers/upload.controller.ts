import { Response } from "express";
import cloudinary from "../config/cloudinary";

export const uploadImage = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File tidak ditemukan" });
    }

    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "circle-mlbb",
      resource_type: "image",
    });

    return res.json({
      message: "Upload berhasil",
      url: result.secure_url,
    });
  } catch (error) {
    return res.status(500).json({ message: "Upload gagal" });
  }
};