// routes/optionRoutes.ts
import express from "express";
import {
  addOptionToSpecialite,
  getAllOptions,
  getOptionById,
  updateOption,
  deleteOption,
} from "./controller";
import { errorHandler } from "../../middlewares/errorHandler";
import { SuccessfulResponse } from "../../utils/successfulClass";
import mongoose from "mongoose";

const router = express.Router();

// Ajouter une option à une spécialité
router.post("/:specialiteId/options", async (req, res, next) => {
  try {
    const specialiteId = new mongoose.Types.ObjectId(req.params.specialiteId);
    const option = await addOptionToSpecialite(specialiteId, req.body);
    const response = new SuccessfulResponse(201, option);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// Récupérer toutes les options
router.get("/", async (req, res, next) => {
  try {
    const options = await getAllOptions();
    const response = new SuccessfulResponse(200, options);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// Récupérer une option par ID
router.get("/:id", async (req, res, next) => {
  try {
    const optionId = new mongoose.Types.ObjectId(req.params.id);
    const option = await getOptionById(optionId);
    const response = new SuccessfulResponse(200, option);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// Mettre à jour une option
router.put("/:id", async (req, res, next) => {
  try {
    const optionId = new mongoose.Types.ObjectId(req.params.id);
    const updatedOption = await updateOption(optionId, req.body);
    const response = new SuccessfulResponse(200, updatedOption);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

// Supprimer une option
router.delete("/:id", async (req, res, next) => {
  try {
    const optionId = new mongoose.Types.ObjectId(req.params.id);
    const deletedOption = await deleteOption(optionId);
    const response = new SuccessfulResponse(200, deletedOption);
    response.send(res);
  } catch (error) {
    next(error);
  }
});

export default router;
