// models/specialite.ts
import mongoose, { Document, Schema } from "mongoose";

// Interface pour Spécialité
interface ISpecialite extends Document {
  NomSpecialite: string;
  Image: string;
  Description: string;
  Options: mongoose.Types.ObjectId[]; // Références aux options
}

// Schéma pour Spécialité
const specialiteSchema = new Schema<ISpecialite>({
  NomSpecialite: { type: String, required: true },
  Image: { type: String, required: true },
  Description: { type: String, required: true },
  Options: [{ type: Schema.Types.ObjectId, ref: "Option" }],
});

// Modèle pour Spécialité
const Specialite = mongoose.model<ISpecialite>("Specialite", specialiteSchema);

export { ISpecialite, Specialite };
