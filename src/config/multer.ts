// configs/multerConfig.ts
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // N'accepter que les fichiers image
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images.") as any, false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024, // Limite la taille des fichiers à 4MB
  },
  fileFilter: fileFilter,
});
