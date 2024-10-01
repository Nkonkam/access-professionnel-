// routes/domaineRoutes.ts
import express from "express";
import {
  addDomaineToSecteur,
  getAllDomaines,
  getDomaineById,
  updateDomaine,
  deleteDomaine,
} from "./controllers";
import { errorHandler } from "../../middlewares/errorHandler";
import { SuccessfulResponse } from "../../utils/successfulClass";
import mongoose from "mongoose";

const router = express.Router();

// Ajouter un domaine à un secteur
router.post("/:secteurId", async (req, res, next) => {
  try {
    const secteurId = new mongoose.Types.ObjectId(req.params.secteurId);
    const domaine = await addDomaineToSecteur(secteurId, req.body);
    const response = new SuccessfulResponse(201, domaine);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// Récupérer tous les domaines
router.get("/", async (req, res, next) => {
  try {
    const domaines = await getAllDomaines();
    const response = new SuccessfulResponse(200, domaines);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// Récupérer un domaine par ID
router.get("/:id", async (req, res, next) => {
  try {
    const domaine = await getDomaineById(req.params.id);
    const response = new SuccessfulResponse(200, domaine);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// Mettre à jour un domaine
router.put("/:id", async (req, res, next) => {
  try {
    const updatedDomaine = await updateDomaine(req.params.id, req.body);
    const response = new SuccessfulResponse(200, updatedDomaine);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// Supprimer un domaine
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedDomaine = await deleteDomaine(req.params.id);
    const response = new SuccessfulResponse(200, deletedDomaine);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

export default router;
