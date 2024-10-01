// models/filiere.ts
import mongoose, { Document, Schema } from "mongoose";

// Interface pour Filière
interface IFiliere extends Document {
  NomFiliere: string;
  Image: string;
  Description: string;
  Specialites?: mongoose.Types.ObjectId[]; // Références aux spécialités
}

// Schéma pour Filière
const filiereSchema = new Schema<IFiliere>({
  NomFiliere: { type: String, required: true },
  Image: { type: String, required: true },
  Description: { type: String, required: true },
  Specialites: [
    { type: Schema.Types.ObjectId, ref: "Specialite", required: false },
  ],
});

// Modèle pour Filière
const Filiere = mongoose.model<IFiliere>("Filiere", filiereSchema);

export { IFiliere, Filiere };
