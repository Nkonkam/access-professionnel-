import dotenv from "dotenv";
import { upload } from "../../config/multer";
import express, { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { SuccessfulResponse } from "../../utils/successfulClass";
import {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  BadRequestError,
  ValidationError,
} from "../../utils/errorClass";
import {
  authenticateUser,
  createNewUser,
  updateLearnerPrfile,
} from "./controller";
import { sendVerificationOTPEmail } from "../email_verification/controller";
import Learner from "./model";
import { JwtPayload } from "jsonwebtoken";

dotenv.config();

const router = express.Router();

interface DataRegister {
  password: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
}

interface DataLogin {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Définis le type pour les informations de l'utilisateur décodées du token
interface UserPayload extends JwtPayload {
  userId: string;
  email: string; // Assure-toi que cela correspond aux informations que tu stockes dans le token
}

// Étend l'interface Request pour inclure l'utilisateur
interface RequestWithUser extends Request {
  user?: UserPayload;
}

// Route  d' enregistrement
router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let {
        password,
        fullName,
        email,
        phoneNumber,
        dateOfBirth,
      }: DataRegister = req.body;

      email = email.trim();
      fullName = fullName.trim();
      phoneNumber = phoneNumber.trim();

      if (!(email && password && phoneNumber && dateOfBirth)) {
        throw new BadRequestError("Empty input fields");
      }

      const newUser = await createNewUser({
        password,
        fullName,
        email,
        phoneNumber,
        dateOfBirth,
      });
      await sendVerificationOTPEmail(email);
      // res.status(200).json(newUser);

      // Utilise la classe SuccessfulResponse pour envoyer la réponse
      const successResponse = new SuccessfulResponse(200, newUser);
      successResponse.send(res);
    } catch (error: unknown) {
      next(error);
    }
  }
);

// Route de connexion
router.post(
  "/auth",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let { email, password, rememberMe }: DataLogin = req.body;
      email = email.trim();

      if (!(email && password)) {
        // Utilise une erreur personnalisée pour des champs vides
        throw new BadRequestError("Empty credentials supplied");
      }

      const authenticatedUser = await authenticateUser({
        email,
        password,
        rememberMe,
      });
      // res.status(200).json(authenticatedUser);
      // Utilise la classe SuccessfulResponse pour envoyer la réponse
      const successResponse = new SuccessfulResponse(200, authenticatedUser);
      successResponse.send(res);
    } catch (error: any) {
      next(error);
    }
  }
);

// Route de modification de l image
router.patch(
  "/:id/profile_picture",
  verifyToken,
  upload.single("image"),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const userId = req.user?.userId;

    if (req.user?.userId != id) {
      // return res.status(404).send("Apprenant non trouvé.");
      throw new NotFoundError("Apprenant non trouvé.");
    }
    if (!req.file) {
      // return res.status(400).send("Please upload a file.");
      throw new BadRequestError("Please upload a file.");
    }

    // Assurez-vous que l'utilisateur est défini grâce à votre middleware `verifyToken`
    if (!req.user || !req.user.userId) {
      // return res.status(400).send("User identification failed.");

      throw new UnauthorizedError("User identification failed.");
    }

    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/learner/profile_picture/${req.file.filename}`;

    try {
      await Learner.findByIdAndUpdate(
        userId,
        {
          image: fileUrl,
        },
        {
          upsert: true,
        }
      );
      // res.send({ message: "Image uploaded successfully!", imageUrl: fileUrl });
      // Utilise la classe SuccessfulResponse pour les réponses de succès
      const successResponse = new SuccessfulResponse(200, {
        message: "Image uploaded successfully!",
        imageUrl: fileUrl,
      });
      successResponse.send(res);
    } catch (error: unknown) {
      next(error);

      // res.status(400).send(error.message);
    }
  }
);

// Route pour modifier les informations personnelles d'un apprenant
router.patch(
  "/:id/profile",
  verifyToken,
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const profileData = req.body;

      if (req.user?.userId != userId) {
        // return res.status(404).send("Apprenant non trouvé.");
        throw new NotFoundError("Apprenant non trouvé."); // Répéter l'utilisation de NotFoundError si nécessaire
      }

      const updatedLearner = await updateLearnerPrfile(userId, profileData);

      if (!updatedLearner) {
        // return res.status(404).send("Apprenant non trouvé.");
        throw new NotFoundError("Apprenant non trouvé."); // Répéter l'utilisation de NotFoundError si nécessaire
      }

      // res.send(updatedLearner);

      const successResponse = new SuccessfulResponse(200, updatedLearner);
      successResponse.send(res);
    } catch (error: unknown) {
      // res.status(400).send(error.message);

      next(error);
    }
  }
);

export default router;
