import multer from "multer";
import dotenv from "dotenv";
import { upload } from "../../config/multer";
import express, { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { authenticateUser, createNewUser } from "./controller";
import { sendVerificationOTPEmail } from "../email_verification/controller";
import Learner from "./model";
import { JwtPayload } from "jsonwebtoken";

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

router.put(
  "/profile_picture",
  verifyToken,
  upload.single("image"),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.file) {
      return res.status(400).send("Please upload a file.");
    }

    // Assurez-vous que l'utilisateur est défini grâce à votre middleware `verifyToken`
    if (!req.user || !req.user.userId) {
      return res.status(400).send("User identification failed.");
    }

    const userId = req.user.userId;
    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/learner/profile_picture/${req.file.filename}`;

    try {
      await Learner.findByIdAndUpdate(userId, {
        "personalInfo.image": fileUrl,
      });
      res.send({ message: "Image uploaded successfully!", imageUrl: fileUrl });
    } catch (error: any) {
      // next(error); // Passe l'erreur au middleware d'erreur suivant

      res.status(400).send(error.message);
    }
  }
);

export default router;
