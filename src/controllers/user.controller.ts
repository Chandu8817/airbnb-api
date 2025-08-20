import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { AuthRequest } from "../middleware/auth";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name,role } = req.body;
    const result = await userService.signup(email, password, name,role);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const user = await userService.getMe(req.user.id);
    res.json(user);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};
