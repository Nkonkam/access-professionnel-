import { Request, Response, NextFunction } from "express";
import { verifTokenAPI } from "../utils/createToken";

const jwtSecret = process.env.TOKEN_KEY_API;

export const verifyTokenAccessAPI = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.get("X-API-KEY");

  if (!token) {
    return res.status(401).json({ error: "Accès non autorisé" });
  }

  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined in the environment variables.");

    throw Error("Internal server error.");
  }

  console.log("token", token);
  try {
    await verifTokenAPI(token);
    next();
  } catch (error: any) {
    return res.status(401).json({ error: "Accès non autorisé" });
  }
};
