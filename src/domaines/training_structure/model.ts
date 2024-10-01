import mongoose, { Schema } from "mongoose";

interface Specialite {
  nomSpecialite: string;
}

interface Categorie {
  nomCategorie: string;
  specialite: Specialite[];
}

interface Domaine {
  nomDomaine: string;
  categorie: Categorie[];
}

// Déclaration d'un tableau de Domaine pour correspondre à votre structure de données
const domaine: Domaine[] = [
  {
    nomDomaine: "informatique",
    categorie: [
      {
        nomCategorie: "genie logiciels",
        specialite: [{ nomSpecialite: "Nom de la spécialité ici" }],
      },
    ],
  },
];

export interface ITrainingStructure {
  password: string;
  verified: boolean;
  fullName: string;
  email: string;
  phoneNumber: string;
  creationDate: Date;
  address?: string;
  city?: string;
  image?: string;
  uniqueId?: string;
  mainObjectives?: string;
  website?: string;
  trainingDomains?: Domaine[];
}

const TrainingStructureSchema: Schema<ITrainingStructure> = new Schema({
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },

  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  creationDate: { type: Date, required: true },
  address: String,
  city: String,
  image: String,

  uniqueId: String,
  mainObjectives: String,
  website: String,
  trainingDomains: [
    {
      nomDomaine: { type: String },
      categorie: [
        {
          nomCategorie: { type: String },
          specialite: [{ nomSpecialite: { type: String } }],
        },
      ],
    },
  ],
});

const TrainingStructure = mongoose.model<ITrainingStructure>(
  "TrainingStructure",
  TrainingStructureSchema
);

export default TrainingStructure;
