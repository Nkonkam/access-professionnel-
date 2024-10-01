import mongoose from "mongoose";
import { Filiere, IFiliere } from "./models";
import { Domaine } from "../domaines/models";
import { InternalServerError, NotFoundError } from "../../utils/errorClass";

export const addFiliereToDomaine = async (
  domaineId: mongoose.Types.ObjectId,
  filiereData: Partial<IFiliere>
) => {
  try {
    const nouvelleFiliere = new Filiere(filiereData);
    const filiere = await nouvelleFiliere.save();

    const domaine = await Domaine.findById(domaineId);
    if (!domaine) {
      throw new NotFoundError("Domaine non trouvé");
    }

    domaine.Filieres?.push(filiere._id);
    await domaine.save();

    return filiere;
  } catch (error) {
    throw new InternalServerError(
      "Erreur lors de l'ajout de la filière au domaine"
    );
  }
};

export const getAllFilieres = async () => {
  try {
    return await Filiere.find().populate("Specialites");
  } catch (error) {
    throw new InternalServerError(
      "Erreur lors de la récupération des filières"
    );
  }
};

export const getFiliereById = async (id: mongoose.Types.ObjectId) => {
  try {
    const filiere = await Filiere.findById(id).populate("Specialites");
    if (!filiere) {
      throw new NotFoundError("Filière non trouvée");
    }
    return filiere;
  } catch (error) {
    throw new InternalServerError(
      "Erreur lors de la récupération de la filière"
    );
  }
};

export const updateFiliere = async (
  id: mongoose.Types.ObjectId,
  updateData: Partial<IFiliere>
) => {
  try {
    const updatedFiliere = await Filiere.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("Specialites");

    if (!updatedFiliere) {
      throw new NotFoundError("Filière non trouvée");
    }

    return updatedFiliere;
  } catch (error) {
    throw new InternalServerError(
      "Erreur lors de la mise à jour de la filière"
    );
  }
};

export const deleteFiliere = async (id: mongoose.Types.ObjectId) => {
  try {
    const filiere = await Filiere.findById(id);
    if (!filiere) {
      throw new NotFoundError("Filière non trouvée");
    }

    // Supprimer la filière
    await Filiere.findByIdAndDelete(id);

    // Retirer la référence de la filière de tous les domaines
    await Domaine.updateMany({ Filieres: id }, { $pull: { Filieres: id } });

    return filiere;
  } catch (error) {
    throw new InternalServerError(
      "Erreur lors de la suppression de la filière"
    );
  }
};
