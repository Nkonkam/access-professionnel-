import mongoose from "mongoose";
import { Specialite, ISpecialite } from "./model";
import { Filiere } from "../filieres/models";
import { InternalServerError, NotFoundError } from "../../utils/errorClass";

export const addSpecialiteToFiliere = async (
  filiereId: mongoose.Types.ObjectId,
  specialiteData: Partial<ISpecialite>
) => {
  try {
    const nouvelleSpecialite = new Specialite(specialiteData);
    const specialite = await nouvelleSpecialite.save();

    const filiere = await Filiere.findById(filiereId);
    if (!filiere) {
      throw new NotFoundError("Filière non trouvée");
    }

    filiere.Specialites?.push(specialite._id);
    await filiere.save();

    return specialite;
  } catch (error) {
    throw new InternalServerError(
      "Erreur lors de l'ajout de la spécialité à la filière"
    );
  }
};

export const getAllSpecialites = async () => {
  try {
    return await Specialite.find().populate("Options");
  } catch (error) {
    throw new InternalServerError(
      "Erreur lors de la récupération des spécialités"
    );
  }
};

export const getSpecialiteById = async (id: mongoose.Types.ObjectId) => {
  try {
    const specialite = await Specialite.findById(id).populate("Options");
    if (!specialite) {
      throw new NotFoundError("Spécialité non trouvée");
    }
    return specialite;
  } catch (error) {
    throw new InternalServerError(
      "Erreur lors de la récupération de la spécialité"
    );
  }
};

export const updateSpecialite = async (
  id: mongoose.Types.ObjectId,
  updateData: Partial<ISpecialite>
) => {
  try {
    const updatedSpecialite = await Specialite.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    ).populate("Options");

    if (!updatedSpecialite) {
      throw new NotFoundError("Spécialité non trouvée");
    }

    return updatedSpecialite;
  } catch (error) {
    throw new InternalServerError(
      "Erreur lors de la mise à jour de la spécialité"
    );
  }
};

export const deleteSpecialite = async (id: mongoose.Types.ObjectId) => {
  try {
    const specialite = await Specialite.findById(id);
    if (!specialite) {
      throw new NotFoundError("Spécialité non trouvée");
    }

    // Supprimer la spécialité
    await Specialite.findByIdAndDelete(id);

    // Retirer la référence de la spécialité de toutes les filières
    await Filiere.updateMany(
      { Specialites: id },
      { $pull: { Specialites: id } }
    );

    return specialite;
  } catch (error) {
    throw new InternalServerError(
      "Erreur lors de la suppression de la spécialité"
    );
  }
};
