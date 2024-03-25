import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

interface TokenData {
  userId: Types.ObjectId;
  email: string; // Notez le "string" minuscule ici
}

// Définis le type pour les informations de l'utilisateur décodées du token
interface UserPayload extends JwtPayload {
  userId: string;
  email: string; // Assure-toi que cela correspond aux informations que tu stockes dans le token
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

export const verifToken = async (
  token: string,
  tokenKey: string = TOKEN_KEY
): Promise<UserPayload> => {
  try {
    const decoded = jwt.verify(token, tokenKey) as UserPayload;

    if (!decoded) {
      console.error("Token verification failed: No payload decoded.");

      throw Error("Token verification failed");
    }

    return decoded as UserPayload; // Assurez-vous que le type retourné correspond à vos données de token
  } catch (error) {
    console.error("Token verification failed:", error);

    throw error;
  }
};
