// routes/filiereRoutes.ts
import express from "express";
import {
  addFiliereToDomaine,
  getAllFilieres,
  getFiliereById,
  updateFiliere,
  deleteFiliere,
} from "./controller";
import { SuccessfulResponse } from "../../utils/successfulClass";
import mongoose from "mongoose";

const router = express.Router();

// Ajouter une filière à un domaine
router.post("/:domaineId", async (req, res, next) => {
  try {
    const domianId = new mongoose.Types.ObjectId(req.params.domaineId);
    const filiere = await addFiliereToDomaine(domianId, req.body);
    const response = new SuccessfulResponse(201, filiere);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// Récupérer toutes les filières
router.get("/", async (req, res, next) => {
  try {
    const filieres = await getAllFilieres();
    const response = new SuccessfulResponse(200, filieres);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// Récupérer une filière par ID
router.get("/:id", async (req, res, next) => {
  try {
    const filiereId = new mongoose.Types.ObjectId(req.params.id);
    const filiere = await getFiliereById(filiereId);
    const response = new SuccessfulResponse(200, filiere);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// Mettre à jour une filière
router.put("/:id", async (req, res, next) => {
  try {
    const filiereId = new mongoose.Types.ObjectId(req.params.id);
    const updatedFiliere = await updateFiliere(filiereId, req.body);
    const response = new SuccessfulResponse(200, updatedFiliere);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// Supprimer une filière
router.delete("/:id", async (req, res, next) => {
  try {
    const filiereId = new mongoose.Types.ObjectId(req.params.id);
    const deletedFiliere = await deleteFiliere(filiereId);
    const response = new SuccessfulResponse(200, deletedFiliere);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

export default router;
