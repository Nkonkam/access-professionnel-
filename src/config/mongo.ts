import mongoose from "mongoose";

// Assure-toi que process.env.MONGO_URL existe et est une chaîne
const MONGO_URL: string = process.env.MONGO_URL || '';

mongoose.connection.on("open", () => {
  console.log("Connexion réussie avec MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

export async function mongoConnect(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connexion réussie à MongoDB");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error);
  }
}

export async function mongoDisconnect(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("Déconnexion réussie de MongoDB");
  } catch (error) {
    console.error("Erreur de déconnexion de MongoDB :", error);
  }
}
