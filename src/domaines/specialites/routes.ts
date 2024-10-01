// routes/specialiteRoutes.ts
import express from "express";
import {
  addSpecialiteToFiliere,
  getAllSpecialites,
  getSpecialiteById,
  updateSpecialite,
  deleteSpecialite,
} from "./controller";
import { SuccessfulResponse } from "../../utils/successfulClass";
import mongoose from "mongoose";

const specialiteRouter = express.Router();

// Ajouter une spécialité à une filière
specialiteRouter.post("/:filiereId/specialites", async (req, res, next) => {
  try {
    const filiereId = new mongoose.Types.ObjectId(req.params.filiereId);
    const specialite = await addSpecialiteToFiliere(filiereId, req.body);
    const response = new SuccessfulResponse(201, specialite);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// Récupérer toutes les spécialités
specialiteRouter.get("/", async (req, res, next) => {
  try {
    const specialites = await getAllSpecialites();
    const response = new SuccessfulResponse(200, specialites);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// Récupérer une spécialité par ID
specialiteRouter.get("/:id", async (req, res, next) => {
  try {
    const specialiteId = new mongoose.Types.ObjectId(req.params.id);
    const specialite = await getSpecialiteById(specialiteId);
    const response = new SuccessfulResponse(200, specialite);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// Mettre à jour une spécialité
specialiteRouter.put("/:id", async (req, res, next) => {
  try {
    const specialiteId = new mongoose.Types.ObjectId(req.params.id);
    const updatedSpecialite = await updateSpecialite(specialiteId, req.body);
    const response = new SuccessfulResponse(200, updatedSpecialite);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// Supprimer une spécialité
specialiteRouter.delete("/:id", async (req, res, next) => {
  try {
    const specialiteId = new mongoose.Types.ObjectId(req.params.id);
    const deletedSpecialite = await deleteSpecialite(specialiteId);
    const response = new SuccessfulResponse(200, deletedSpecialite);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

export default specialiteRouter;
