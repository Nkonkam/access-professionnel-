import mongoose, { Document, Schema } from "mongoose";

// Interface pour Domaine
interface IDomaine extends Document {
  NomDomaine: string;
  Image: string;
  Description: string;
  Filieres?: mongoose.Types.ObjectId[]; // Références aux filières
}

// Schéma pour Domaine
const domaineSchema = new Schema<IDomaine>({
  NomDomaine: { type: String, required: true },
  Image: { type: String, required: true },
  Description: { type: String, required: true },
  Filieres: [{ type: Schema.Types.ObjectId, ref: "Filiere", required: false }],
});

// Modèle pour Domaine
const Domaine = mongoose.model<IDomaine>("Domaine", domaineSchema);

export { IDomaine, Domaine };
