import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Interface pour définir la structure d'un document Learner
export interface Ilearner {
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
    cepBepc?: boolean;
    probatoire?: boolean;
    baccalaureat?: boolean;
    bts?: boolean;
    licence?: boolean;
    master?: boolean;
    doctorat?: boolean;
  };
}

const LearnerSchema = new Schema<Ilearner>({
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  personalInfo: {
    image: { type: String, required: false },
    fullName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: (props: { value: string }) =>
          `${props.value} n'est pas une adresse e-mail valide!`,
      },
    },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: false },
    neighborhood: { type: String, required: false },
    city: { type: String, required: false },
    department: { type: String, required: false },
    originalDistrict: { type: String, required: false },
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
});

const Learner = model<Ilearner>("Learner", LearnerSchema);

export default Learner;
