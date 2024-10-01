import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

const TOKEN_KEY_API = process.env.TOKEN_KEY_API ?? "defaultAccess";
const TOKEN_EXPIRY_API = process.env.TOKEN_EXPIRY_API ?? "1d"; // Valeur par défaut, par exemple "1d" pour 1 jour

const generateTokenSecureApi = (
  tokenKey: string = TOKEN_KEY_API,
  expiresIn: string = TOKEN_EXPIRY_API
): string => {
  try {
    // Création du token
    const token = jwt.sign({ name: "accessFinance" }, tokenKey, {
      expiresIn,
    });
    console.log("token", token);

    return token;
  } catch (error: any) {
    console.error("Failed to create token:", error);
    // Dans un contexte de production, il pourrait être plus approprié de gérer l'erreur
    // d'une manière qui ne stoppe pas brusquement l'exécution, sauf si c'est le comportement désiré.
    // Par exemple, vous pourriez retourner null ou une chaîne vide et gérer l'erreur en amont.
    // throw new Error("Error creating JWT token");
    return "";
  }
};

generateTokenSecureApi();
