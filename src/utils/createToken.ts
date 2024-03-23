import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface TokenData {
  userId: Types.ObjectId;
  email: string; // Notez le "string" minuscule ici
}

const TOKEN_KEY = process.env.TOKEN_KEY ?? "your_default_secret_key";
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY ?? "1d"; // Valeur par défaut, par exemple "1d" pour 1 jour

export const createToken = (
  tokenData: TokenData,
  rememberMe: boolean = false,
  tokenKey: string = TOKEN_KEY,
  expiresIn: string = TOKEN_EXPIRY
): string => {
  try {
    // Ajustement de la durée d'expiration pour "se souvenir de moi"
    const finalExpiresIn = rememberMe ? "15d" : expiresIn;

    // Création du token
    const token = jwt.sign(tokenData, tokenKey, {
      expiresIn: finalExpiresIn,
    });

    return token;
  } catch (error) {
    console.error("Failed to create token:", error);
    // Dans un contexte de production, il pourrait être plus approprié de gérer l'erreur
    // d'une manière qui ne stoppe pas brusquement l'exécution, sauf si c'est le comportement désiré.
    // Par exemple, vous pourriez retourner null ou une chaîne vide et gérer l'erreur en amont.
    throw new Error("Error creating JWT token");
  }
};
