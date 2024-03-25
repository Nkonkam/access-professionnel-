import mongoose from "mongoose";

// Définition de l'interface pour le document Learner
export interface ILearner {
  verified: boolean;
  password: string;
  personalInfo: {
    image: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    neighborhood: string;
    city: string;
    department: string;
    originalDistrict: string;
  };
  professionalInfo: {
    fslc?: boolean;
    gceOL?: boolean;
    gceAL?: boolean;
    phd?: boolean;
    cep?: boolean;
    bepc?: boolean;
    probatoire?: boolean;
    baccalaureat?: boolean;
    bts?: boolean;
    licence?: boolean;
    master?: boolean;
    doctorat?: boolean;
  };
}

// Création du schéma Mongoose pour le document Learner
const learnerSchema = new mongoose.Schema<ILearner>(
  {
    verified: { type: Boolean, default: false },
    password: { type: String, required: true },
    personalInfo: {
      image: { type: String, required: false, default: "" },
      fullName: { type: String, required: true },
      email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: (email: string) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
          message: (props: { value: string }) =>
            `${props.value} n'est pas une adresse e-mail valide!`,
        },
      },
      phoneNumber: { type: String, required: true },
      dateOfBirth: { type: Date },
      neighborhood: { type: String },
      city: { type: String },
      department: { type: String },
      originalDistrict: { type: String },
    },
    professionalInfo: {
      fslc: { type: Boolean, default: false },
      gceOL: { type: Boolean, default: false },
      gceAL: { type: Boolean, default: false },
      phd: { type: Boolean, default: false },
      cep: { type: Boolean, default: false },
      bepc: { type: Boolean, default: false },
      probatoire: { type: Boolean, default: false },
      baccalaureat: { type: Boolean, default: false },
      bts: { type: Boolean, default: false },
      licence: { type: Boolean, default: false },
      master: { type: Boolean, default: false },
      doctorat: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
); // Ajoute les champs createdAt et updatedAt automatiquement

// Création du modèle Mongoose
const Learner = mongoose.model<ILearner>("Learner", learnerSchema);

export default Learner;
