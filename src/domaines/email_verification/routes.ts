import express, { Request, Response, Router } from "express";
import { sendVerificationOTPEmail, verifyUserEmail } from "./controller";
import { sendOTP, verifyOTP } from "../otp/controller";

const router: Router = express.Router();

interface EmailOTPBody {
  email: string;
  otp?: string; // OTP est optionnel car non requis pour toutes les routes
}

// Demande de nouvelle vérification OTP
router.post("/verify", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body as EmailOTPBody;

    if (!email || !otp) throw new Error("Empty OTP details are not allowed");

    await verifyUserEmail({ email, otp });
    res.status(200).json({ email, verified: true });
  } catch (error: any) {
    // En TypeScript 4.4+, envisagez d'utiliser `unknown` et de faire une assertion de type
    res.status(400).send(error.message);
  }
});

// Demande d'un nouveau OTP de vérification
router.post("/", async (req: Request, res: Response) => {
  try {
    const { email } = req.body as EmailOTPBody;

    if (!email) throw new Error("An email is required!");

    const createdEmailVerificationOTP = await sendVerificationOTPEmail(email);

    res.status(200).json({ message: createdEmailVerificationOTP });
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

export default router;
