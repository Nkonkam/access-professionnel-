import mongoose, { Document, Schema } from "mongoose";

// Interface pour le document OTP
export interface IOTP extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

// Définition du schéma OTP
const OTPSchema: Schema = new Schema({
  email: { type: String, unique: true, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
});

// Création du modèle OTP avec typage
const OTP = mongoose.model<IOTP>("OTP", OTPSchema);

export { OTP };
