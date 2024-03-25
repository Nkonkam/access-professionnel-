import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifToken } from "../utils/createToken";

// Définis le type pour les informations de l'utilisateur décodées du token
interface UserPayload extends JwtPayload {
  userId: string;
  email: string; // Assure-toi que cela correspond aux informations que tu stockes dans le token
}

// Étend l'interface Request pour inclure l'utilisateur
interface RequestWithUser extends Request {
  user?: UserPayload;
}

export const verifyToken = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // 'Bearer TOKEN'

  if (!token) {
    throw Error("A token is required for authentication.");
  }

  const jwtSecret = process.env.TOKEN_KEY;
  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined in the environment variables.");

    throw Error("Internal server error.");
  }

  try {
    const decoded = (await verifToken(token)) as UserPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
};
