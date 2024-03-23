import nodemailer, { SendMailOptions, Transporter } from "nodemailer";

// Assurez-vous que les variables d'environnement sont définies
const AUTH_EMAIL: string | undefined = process.env.AUTH_EMAIL;
const AUTH_PASS: string | undefined = process.env.AUTH_PASS;

// Valider la présence des informations d'authentification
if (!AUTH_EMAIL || !AUTH_PASS) {
  throw new Error(
    "Les variables d'environnement pour l'email et le mot de passe sont requises."
  );
}

// Configuration du transporteur d'email
let transport: Transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // Utilisez `true` pour le port 465, `false` pour tous les autres ports
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASS,
  },
});

// Test du transporteur
transport.verify((error: Error | null, success: boolean) => {
  if (error) {
    console.error("Erreur de vérification du transporteur d'email:", error);
  } else {
    console.log("Prêt à envoyer des messages.");
    console.log(success);
  }
});

// Fonction pour envoyer un email
const sendEmail = async (mailOption: SendMailOptions): Promise<void> => {
  try {
    await transport.sendMail(mailOption);
  } catch (error: any) {
    // TypeScript 4.4+ recommande d'utiliser `unknown` ici
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw new Error("Échec de l'envoi de l'email.");
  }
};

export default sendEmail;
