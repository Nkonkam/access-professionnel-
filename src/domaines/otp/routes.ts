import express, { Request, Response, Router } from "express";
import { sendOTP, verifyOTP } from "./controller"; // Supposons que controller.ts exporte correctement ces fonctions

interface SendOTPRequest {
  email: string;
  subject: string;
  message: string;
  duration: number; // Assurez-vous que la durée est attendue comme un nombre (ex. en minutes ou secondes)
}

interface VerifyOTPRequest {
  email: string;
  otp: string;
}

const router: Router = express.Router();

// Demande de nouvelle vérification
router.post("/verify", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp }: VerifyOTPRequest = req.body;

    const validOTP: boolean = await verifyOTP({ email, otp });

    res.status(200).json({ valid: validOTP });
  } catch (error: any) {
    // TypeScript 4.x et inférieurs: utiliser "any", TypeScript 4.4 et supérieurs: "unknown" et un type guard
    res.status(400).send(error.message);
  }
});

// Demande de création d'un nouveau OTP
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, subject, message, duration }: SendOTPRequest = req.body;

    const createdOTP = await sendOTP({
      email,
      subject,
      message,
      duration,
    });

    res.status(200).json(createdOTP);
  } catch (error: any) {
    // Même note que ci-dessus concernant le typage des erreurs
    res.status(400).send(error.message);
  }
});

export default router;
