import express, { Request, Response } from "express";
import dotenv from "dotenv";
import multer from "multer";

import { upload } from "../../config/multer";
import { verifyToken } from "../../middlewares/verifyToken";
import { authenticateUser, createNewUser } from "./controller";
import { sendVerificationOTPEmail } from "../email_verification/controller";

dotenv.config();

const router = express.Router();

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

// Route  d' enregistrement
router.post("/signup", async (req: Request, res: Response) => {
  try {
    let {
      password,
      personalInfo: { fullName, email, phoneNumber, dateOfBirth },
    }: DataRegister = req.body;

    email = email.trim();
    fullName = fullName.trim();
    phoneNumber = phoneNumber.trim();

    console.log("test", password);

    if (!(email && password && phoneNumber && dateOfBirth)) {
      throw Error("Empty input fields");
    }

    const newUser = await createNewUser({
      password,
      personalInfo: { fullName, email, phoneNumber, dateOfBirth },
    });
    await sendVerificationOTPEmail(email);
    res.status(200).json(newUser);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

// Route de connexion
router.post("/auth", async (req: Request, res: Response): Promise<void> => {
  try {
    let { email, password, rememberMe } = req.body;
    email = email.trim();
    password = password.trim();

    if (!(email && password)) {
      throw Error("Empty credentials supplied");
    }

    const authenticatedUser = await authenticateUser({
      email,
      password,
      rememberMe,
    });
    res.status(200).json(authenticatedUser);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

// Route d'enregistrement
// router.put(
//   "/learner/profile/upload",
//   verifyToken,
//   upload.single("image"),
//   profileUpload,
//   (
//     error: any,
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) => {
//     // Gestion des erreurs de téléchargement de Multer
//     if (error instanceof multer.MulterError) {
//       // Une erreur Multer s'est produite lors du téléchargement.
//       res.status(400).send(error.message);
//     } else {
//       next(error);
//     }
//   }
// );

export default router;
