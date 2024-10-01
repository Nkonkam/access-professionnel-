import mongoose, { Schema, Document } from "mongoose";

// Interface pour Option
interface IOption extends Document {
  NomOption: string;
  Image: string;
  Description: string;
  Specialite?: mongoose.Types.ObjectId[]; // Référence à la spécialité
}

// Schéma pour Option
const optionSchema = new Schema<IOption>({
  NomOption: { type: String, required: true },
  Image: { type: String, required: true },
  Description: { type: String, required: true },
  Specialite: [
    { type: Schema.Types.ObjectId, ref: "Specialite", required: false },
  ],
});

// Modèle pour Option
const Option = mongoose.model<IOption>("Option", optionSchema);

export { IOption, Option };
