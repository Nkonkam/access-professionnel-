import express from "express";
import {
  createSecteur,
  getSecteurs,
  getSecteurById,
  updateSecteur,
} from "./controller";
import { SuccessfulResponse } from "../../utils/successfulClass"; // Assure-toi de mettre à jour le chemin selon ta structure de projet
import mongoose from "mongoose";
import { verifyToken } from "../../middlewares/verifyToken";

const router = express.Router();

router.post("/", verifyToken, async (req, res, next) => {
  try {
    const secteur = await createSecteur(req.body);
    const response = new SuccessfulResponse(201, secteur);
    response.send(res);
  } catch (error) {
    next(error); // Passe l'erreur au middleware de gestion des erreurs
  }
});

router.get("/", verifyToken, async (req, res, next) => {
  try {
    const secteurs = await getSecteurs();
    const response = new SuccessfulResponse(200, secteurs);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", verifyToken, async (req, res, next) => {
  try {
    const secteurId = new mongoose.Types.ObjectId(req.params.id);
    const secteur = await getSecteurById(secteurId);
    const response = new SuccessfulResponse(200, secteur);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const secteurId = new mongoose.Types.ObjectId(req.params.id);
    const secteur = await updateSecteur(secteurId, req.body);
    const response = new SuccessfulResponse(200, secteur);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// router.delete("/secteurs/:id", async (req, res, next) => {
//   try {
//     const message = await deleteSecteur(req.params.id);
//     const response = new SuccessfulResponse(200, message);
//     response.send(res);
//   } catch (error) {
//     next(error);
//   }
// });

export default router;
