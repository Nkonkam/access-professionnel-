import Type, { Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import Learner, { Ilearner } from "./model";
import { hashData, verifyHashedData } from "../../utils/hashData";

import { createToken } from "../../utils/createToken";

dotenv.config();

interface IlearnerWithId extends Ilearner {
  _id: Type.ObjectId;
}

interface PersonalInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
}

interface DataRegister {
  password: string;
  personalInfo: PersonalInfo;
}

interface DataLogin {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface UserTokenResponse {
  createdUser: Ilearner & Document;
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
    const createdLearner: Ilearner & Document = await newLearner.save();

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
    throw new Error("Failed to create new user");
  }
};

// Contrôleur pour la connexion  d'un apprenant pour le mobile
// export const login = async (data) => {
//   const { email, password, rememberMe } = req.body;

//   if (!(email && password)) {
//     throw Error("email et password vide ");
//   }

//   try {
//     // Vérifier si l'apprenant existe dans la base de données
//     const learner = await LearnerModel.findOne({ "personalInfo.email": email });

//     console.log("learner :", learner);

//     if (!learner) {
//       return res.status(401).json({
//         success: false,
//         error: {
//           code: 401,
//           message: "Adresse e-mail ou mot de passe incorrect",
//         },
//       });
//     }

//     // Vérifier si le mot de passe est correct
//     const passwordMatch: boolean = await bcrypt.compare(
//       password,
//       learner.password
//     );
//     if (!passwordMatch) {
//       return res.status(401).json({
//         success: false,
//         error: {
//           code: 401,
//           message: "Adresse e-mail ou mot de passe incorrect",
//         },
//       });
//     }

//     // Générer un jeton JWT avec une durée de validité plus longue si "se rappeler de moi" est activé
//     const expiresIn = rememberMe ? "7d" : "1d";

//     const token: Secret = jwt.sign(
//       { userId: learner._id },
//       process.env.JWT_SECRET || "",
//       { expiresIn }
//     );

//     const responseData = {
//       id: learner._id,
//       email: learner.personalInfo.email,
//       role: "learner",
//     };
//     // Répondre avec le jeton JWT, les informations du learner et un message
//     res.json({
//       success: true,
//       data: {
//         token,
//         userData: responseData,
//       },
//       message: "Connexion réussie",
//     });
//   } catch (error) {
//     console.error("Erreur lors de la connexion de l'apprenant :", error);
//     res.status(500).json({
//       success: false,
//       error: {
//         code: 500,
//         message: "Erreur lors de la connexion de l'apprenant",
//       },
//     });
//   }
// };

// Contrôleur pour l'enregistrement d'un apprenant pour le mobile
// export const learnerRegister = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const {
//       password,
//       personalInfo: { fullName, email, phoneNumber, dateOfBirth },
//     }: LearnerRegister = req.body;

//     const existingLearner = await LearnerModel.findOne({
//       "personalInfo.email": email,
//     });
//     if (existingLearner) {
//       res.status(400).json({
//         success: false,
//         error: {
//           code: 400,
//           message: "Email already exists.",
//         },
//       });
//       return;
//     }

//     // Hacher le mot de passe
//     const hashedPassword = await bcrypt.hash(password, 10);
//     if (!hashedPassword) {
//       throw new Error("Error hashing password");
//     }

//     const newLearner = new LearnerModel({
//       password: hashedPassword,
//       personalInfo: {
//         fullName,
//         email,
//         phoneNumber,
//         dateOfBirth,
//       },
//     });

//     const savedLearner = await newLearner.save();

//     const responseData = {
//       _id: savedLearner._id,
//       email: savedLearner.personalInfo.email,
//       role: "learner",
//     };

//     const expiresIn = "1d";
//     const token: Secret = jwt.sign(
//       { userId: responseData._id },
//       process.env.JWT_SECRET || "",
//       { expiresIn }
//     );

//     res.status(201).json({
//       success: true,
//       data: {
//         token: token,
//         user: responseData,
//       },
//       message: "User registered successfully",
//     });
//   } catch (error: any) {
//     console.error("Error registering learner:", error);
//     let statusCode = 500;
//     let errorMessage = "An error occurred while registering the learner.";

//     if (error.code === 11000) {
//       statusCode = 400;
//       errorMessage = "Email already exists.";
//     }

//     res.status(statusCode).json({
//       success: false,
//       error: {
//         code: statusCode,
//         message: errorMessage,
//       },
//     });
//   }
// };
// Assure-toi que le chemin d'importation est correct

// export const profileUpload = async (
//   req: RequestWithUser,
//   res: Response
// ): Promise<Response> => {
//   if (!req.file) {
//     return res.status(400).send("Please upload a file.");
//   }

//   // Vérification de l'existence de `req.user` et de son `_id`
//   if (!req.user || !req.user.userId) {
//     return res.status(400).send("User authentication failed.");
//   }

//   const userId = req.user.userId;
//   const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
//     req.file.filename
//   }`;

//   try {
//     const updatedLearner = await LearnerModel.findByIdAndUpdate(
//       userId,
//       { "personalInfo.image": fileUrl },
//       { new: true }
//     );
//     if (!updatedLearner) {
//       return res.status(404).send("User not found.");
//     }
//     return res.send({ message: "Image uploaded successfully!", fileUrl });
//   } catch (error) {
//     // Log l'erreur pour un diagnostic en interne sans exposer les détails au client
//     console.error(`Upload Error: ${error}`);
//     return res.status(500).send("An error occurred during the upload.");
//   }
// };
