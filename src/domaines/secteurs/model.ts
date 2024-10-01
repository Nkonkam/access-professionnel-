import mongoose, { Document, Schema, model } from "mongoose";

// Interface pour Secteur
interface ISecteur extends Document {
  NomSecteur: string;
  Image: string;
  Description: string;
  Domaines?: mongoose.Types.ObjectId[]; // Références aux domaines
}

// Schéma pour Secteur
const secteurSchema = new Schema<ISecteur>({
  NomSecteur: { type: String, required: true },
  Image: { type: String, required: true },
  Description: { type: String, required: true },
  Domaines: [{ type: Schema.Types.ObjectId, ref: "Domaine", required: false }],
});

// Modèle pour Secteur
const Secteur = mongoose.model<ISecteur>("Secteur", secteurSchema);

export { ISecteur, Secteur };
