import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Définis le type pour les informations de l'utilisateur décodées du token
interface UserPayload extends JwtPayload {
  userId: string; // Assure-toi que cela correspond aux informations que tu stockes dans le token
}

// Étend l'interface Request pour inclure l'utilisateur
interface RequestWithUser extends Request {
  user?: UserPayload;
}

export const verifyToken = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // 'Bearer TOKEN'

  if (!token) {
    return res
      .status(403)
      .json({ message: "A token is required for authentication." });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined in the environment variables.");
    return res.status(500).json({ message: "Internal server error." });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Invalid token";
    return res
      .status(401)
      .json({ message: "Invalid Token", details: errorMessage });
  }
};
