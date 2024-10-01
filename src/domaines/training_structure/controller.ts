import Type, { Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import TrainingStructure, { ITrainingStructure } from "./model";
import { hashData, verifyHashedData } from "../../utils/hashData";

import { createToken } from "../../utils/createToken";

dotenv.config();

interface ITrainingStructureWithId extends ITrainingStructure {
  _id: Type.ObjectId;
}

interface DataRegister {
  password: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  creationDate: Date;
}

interface DataLogin {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface UserTokenResponse {
  createdUser: ITrainingStructure & Document;
  token: string;
}

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

export interface ITrainingStructureUpdateData {
  password?: string;
  verified?: boolean;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  creationDate?: Date;
  address?: string;
  city?: string;
  image?: string;
  uniqueId?: string;
  mainObjectives?: string;
  website?: string;
  trainingDomains?: Domaine[];
}

export const authenticateUser = async (data: DataLogin) => {
  try {
    const { email, password, rememberMe } = data;

    const fetchedTrainingStructure = await TrainingStructure.findOne({
      email,
    });

    if (!fetchedTrainingStructure) {
      throw Error("Invalid email entered");
    }
    // if (!fetchedLearner.verified) {
    //   throw Error("Email hasn't been verified yet. Check your inbox");
    // }

    const hashedPassword = fetchedTrainingStructure.password;
    const passwordMatch = await verifyHashedData(password, hashedPassword);

    if (!passwordMatch) {
      throw Error("Invalid password  entered");
    }

    // create user token

    const tokenData = { userId: fetchedTrainingStructure._id, email };

    const token = createToken(tokenData, rememberMe);

    const fetchedTrainingStructureData: UserTokenResponse = {
      createdUser: fetchedTrainingStructure,
      token,
    };

    return fetchedTrainingStructureData;
  } catch (error) {
    throw error;
  }
};

export const createNewUser = async (
  data: DataRegister
): Promise<UserTokenResponse> => {
  try {
    const { password, fullName, email, phoneNumber, creationDate } = data;

    // Vérification de l'existence de l'apprenant
    const existingTrainingStructure = await TrainingStructure.findOne({
      email,
    }).exec();

    if (existingTrainingStructure) {
      throw new Error(
        "trainingStructure with the provided email already exists"
      );
    }

    // Hashage du mot de passe
    const hashedPassword = await hashData(password);

    // Création de l'instance Learner
    const newTrainingStructure = new TrainingStructure({
      password: hashedPassword,
      fullName,
      email,
      phoneNumber,
      creationDate,
    });

    // Sauvegarde de l'apprenant dans la base de données
    const createdTrainingStructure: ITrainingStructure & Document =
      await newTrainingStructure.save();

    const tokenData = { userId: createdTrainingStructure._id, email };

    const token = createToken(tokenData);

    const trainingStructureData: UserTokenResponse = {
      createdUser: createdTrainingStructure,
      token,
    };

    return trainingStructureData;
  } catch (error: any) {
    // Gestion des erreurs avec un niveau de détail adapté à une production sécurisée
    console.error("Error creating new trainingStructure:", error.message);
    throw error;
  }
};
