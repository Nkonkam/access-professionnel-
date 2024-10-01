import mongoose from "mongoose";
import { Domaine, IDomaine } from "./models";
import { Secteur } from "../secteurs/model";
import { InternalServerError, NotFoundError } from "../../utils/errorClass";

export const addDomaineToSecteur = async (
  secteurId: mongoose.Types.ObjectId,
  domaineData: Partial<IDomaine>
) => {
  try {
    // Créer un nouveau domaine
    const nouveauDomaine = new Domaine(domaineData);
    const domaine = await nouveauDomaine.save();

    // Trouver le secteur et ajouter la référence du domaine
    const secteur = await Secteur.findById(secteurId);
    if (!secteur) {
      throw new NotFoundError("Secteur non trouvé");
    }

    secteur.Domaines?.push(domaine._id);
    await secteur.save();

    return domaine;
  } catch (error) {
    console.log("error", error);

    throw new InternalServerError(
      "Erreur lors de l'ajout du domaine au secteur"
    );
  }
};

export const getAllDomaines = async () => {
  try {
    return await Domaine.find().populate("Filieres");
  } catch (error) {
    throw new InternalServerError(
      "Erreur lors de la récupération des domaines"
    );
  }
};

export const getDomaineById = async (id: string) => {
  try {
    const domaine = await Domaine.findById(id).populate("Filieres");
    if (!domaine) {
      throw new NotFoundError("Domaine non trouvé");
    }
    return domaine;
  } catch (error) {
    throw new InternalServerError("Erreur lors de la récupération du domaine");
  }
};

export const updateDomaine = async (
  id: string,
  updateData: Partial<IDomaine>
) => {
  try {
    const updatedDomaine = await Domaine.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("Filieres");
    if (!updatedDomaine) {
      throw new NotFoundError("Domaine non trouvé");
    }
    return updatedDomaine;
  } catch (error) {
    throw new InternalServerError("Erreur lors de la mise à jour du domaine");
  }
};

export const deleteDomaine = async (id: string) => {
  try {
    const domaine = await Domaine.findById(id);
    if (!domaine) {
      throw new NotFoundError("Domaine non trouvé");
    }

    // Supprimer le domaine
    await Domaine.findByIdAndDelete(id);

    // Retirer la référence du domaine de tous les secteurs
    await Secteur.updateMany({ Domaines: id }, { $pull: { Domaines: id } });

    return domaine;
  } catch (error) {
    throw new InternalServerError("Erreur lors de la suppression du domaine");
  }
};
