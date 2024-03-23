import { Document } from "mongoose";
import { generateOTP } from "../../utils/generateOTP";
import sendEmail from "../../utils/sendEmail";
import { hashData, verifyHashedData } from "../../utils/hashData";
import { OTP, IOTP } from "../otp/model";

interface OTPVerifyParams {
  email: string;
  otp: string;
}

interface OTPSendParams {
  email: string;
  subject: string;
  message: string;
  duration?: number; // Duration est optionnel avec une valeur par défaut
}

const { AUTH_EMAIL, AUTH_PASS } = process.env;

export const verifyOTP = async ({
  email,
  otp,
}: OTPVerifyParams): Promise<boolean> => {
  if (!email || !otp) {
    throw new Error("Provide values for email and otp.");
  }

  const matchedOTPRecord = await OTP.findOne({ email });
  if (!matchedOTPRecord) {
    throw new Error("No otp records found.");
  }

  const { expiresAt } = matchedOTPRecord;
  if (expiresAt.getTime() < Date.now()) {
    await OTP.deleteOne({ email });
    throw new Error("OTP code has expired. Request a new one.");
  }

  const hashedOTP = matchedOTPRecord.otp;
  const validOTP = await verifyHashedData(otp, hashedOTP);

  return validOTP;
};

export const sendOTP = async ({
  email,
  subject,
  message,
  duration = 1,
}: OTPSendParams): Promise<IOTP & Document> => {
  if (!email || !subject || !message) {
    throw new Error("Provide values for email, subject, and message.");
  }

  // await OTP.deleteOne({ email });
  await deleteOTP(email);

  const generatedOTP = await generateOTP();

  const mailOption = {
    from: AUTH_EMAIL,
    to: email,
    subject,
    html: `<p>${message}</p><p style="color:tomato;font-size:25px;letter-spacing:2px;"><b>${generatedOTP}</b></p><p>this code expires in ${duration} hour(s).</p>`,
  };

  await sendEmail(mailOption);

  const hashedOTP = await hashData(generatedOTP);

  const newOTP = new OTP({
    email,
    otp: hashedOTP,
    createdAt: Date.now(),
    expiresAt: Date.now() + 3600000 * duration,
  });

  const createOTP: IOTP & Document = await newOTP.save();

  return createOTP;
};

export const deleteOTP = async (email: string): Promise<void> => {
  await OTP.deleteOne({ email });
};
