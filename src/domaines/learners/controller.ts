import Type, { Document } from "mongoose";
import dotenv from "dotenv";
import Learner, { ILearner } from "./model";
import { hashData, verifyHashedData } from "../../utils/hashData";

import { createToken } from "../../utils/createToken";

dotenv.config();

// interface PersonalInfo {
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   dateOfBirth: Date;
// }

interface ILearnerUpdateData {
  // verified?: boolean;
  // password: string;
  personalInfo: {
    image?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    neighborhood?: string;
    city?: string;
    department?: string;
    originalDistrict?: string;
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

interface DataRegister {
  password: string;
  personalInfo: ILearner["personalInfo"];
}

interface DataLogin {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface UserTokenResponse {
  createdUser: ILearner & Document;
  token: string;
}

export const authenticateUser = async (data: DataLogin) => {
  try {
    const { email, password, rememberMe } = data;

    const fetchedLearner = await Learner.findOne({
      "personalInfo.email": email,
    });

    if (!fetchedLearner) {
      throw Error("Invalid email entered");
    }
    // if (!fetchedLearner.verified) {
    //   throw Error("Email hasn't been verified yet. Check your inbox");
    // }

    const hashedPassword = fetchedLearner.password;
    const passwordMatch = await verifyHashedData(password, hashedPassword);

    if (!passwordMatch) {
      throw Error("Invalid password  entered");
    }

    // create user token

    const tokenData = { userId: fetchedLearner._id, email };

    const token = createToken(tokenData, rememberMe);

    const fetchedLearnerData = {
      fetchedLearner,
      token,
    };

    return fetchedLearnerData;
  } catch (error) {
    throw error;
  }
};

export const createNewUser = async (
  data: DataRegister
): Promise<UserTokenResponse> => {
  try {
    const {
      password,
      personalInfo: { fullName, email, phoneNumber, dateOfBirth },
    } = data;

    // Vérification de l'existence de l'apprenant
    const existingLearner = await Learner.findOne({
      "personalInfo.email": email,
    }).exec();

    if (existingLearner) {
      throw new Error("Learner with the provided email already exists");
    }

    // Hashage du mot de passe
    const hashedPassword = await hashData(password);

    // Création de l'instance Learner
    const newLearner = new Learner({
      password: hashedPassword,
      personalInfo: { fullName, email, phoneNumber, dateOfBirth },
    });

    // Sauvegarde de l'apprenant dans la base de données
    const createdLearner: ILearner & Document = await newLearner.save();

    const tokenData = { userId: createdLearner._id, email };

    const token = createToken(tokenData);

    const learnerData: UserTokenResponse = {
      createdUser: createdLearner,
      token,
    };

    return learnerData;
  } catch (error: any) {
    // Gestion des erreurs avec un niveau de détail adapté à une production sécurisée
    console.error("Error creating new user:", error.message);
    throw error;
  }
};

// Fonction pour mettre à jour les informations personnelles d'un apprenant
export const updateLearnerPersonalInfo = async (
  id: string,
  personalInfo: ILearnerUpdateData["personalInfo"]
) => {
  try {
    const update = { personalInfo };
    return await Learner.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    throw error;
  }
};
