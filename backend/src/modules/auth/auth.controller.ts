import { Request, Response } from "express";
import { loginService, registerService } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const data = await registerService(req.body);

    res.json({
      status: "success",
      data,
    });
  } catch (err: any) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = await loginService(req.body.email, req.body.password);

    res.json({
      status: "success",
      data,
    });
  } catch (err: any) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};