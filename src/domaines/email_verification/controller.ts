import Learner from "../learners/model";
import { sendOTP, verifyOTP, deleteOTP } from "../otp/controller";

interface OTPDetails {
  email: string;
  subject: string;
  message: string;
  duration: number;
}

interface VerifyUserEmailParams {
  email: string;
  otp: string;
}

export const verifyUserEmail = async ({
  email,
  otp,
}: VerifyUserEmailParams): Promise<void> => {
  try {
    const validOTP: boolean = await verifyOTP({ email, otp });

    if (!validOTP) {
      throw new Error("Invalid code passed. Check your inbox.");
    }

    await Learner.updateOne(
      { "personalInfo.email": email },
      { verified: true }
    );
    await deleteOTP(email);
  } catch (error: unknown) {
    console.error("Error verifying user email:", error);
    throw error;
  }
};

export const sendVerificationOTPEmail = async (
  email: string
): Promise<string> => {
  // Remplacez `any` par un type plus spécifique
  try {
    const existingUser = await Learner.findOne({ "personalInfo.email": email });
    if (!existingUser) {
      throw new Error("There's no account for the provided email.");
    }

    const otpDetails: OTPDetails = {
      email,
      subject: "Email Verification",
      message: "Verify your email with the code below.",
      duration: 1,
    };

    await sendOTP(otpDetails);

    return "envoie avec success";
  } catch (error: unknown) {
    console.error("Error sending verification OTP email:", error);
    throw error;
  }
};
