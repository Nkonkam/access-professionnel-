import { Request, Response, NextFunction } from "express";
import { ApplicationError, ValidationError } from "../utils/errorClass"; // Assure-toi que le chemin est correct

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ApplicationError) {
    // Traitement spécifique pour les erreurs d'application personnalisées
    res.status(err.statusCode).json({ message: err.message });
  } else if (err instanceof ValidationError) {
    // Traitement spécifique pour les erreurs de validation
    // Bien que ValidationError soit une ApplicationError avec un statusCode de 400,
    // cette vérification est utile si vous souhaitez un traitement ou un message spécifique pour les erreurs de validation
    res.status(err.statusCode).json({ message: err.message });
  } else if (err instanceof Error) {
    // Gestion des erreurs standard Error
    res.status(500).json({ message: err.message });
  } else {
    // Si l'erreur n'est pas une instance de Error, elle est de type unknown
    console.error(`Unexpected error: ${err}`);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
}
