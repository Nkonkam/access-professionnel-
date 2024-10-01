import { ISecteur, Secteur } from "./model"; // Assure-toi de mettre à jour le chemin selon ta structure de projet
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from "../../utils/errorClass";
import mongoose from "mongoose";

import { IDomaine, Domaine } from "../domaines/models";

export const createSecteur = async (data: ISecteur) => {
  try {
    const nouveauSecteur = new Secteur(data);
    return await nouveauSecteur.save();
  } catch (error) {
    throw new InternalServerError("Erreur lors de la création du secteur");
  }
};

export const getSecteurs = async () => {
  try {
    return await Secteur.find().populate("Domaines");
  } catch (error) {
    console.log("error ", error);

    throw new InternalServerError(
      "Erreur lors de la récupération des secteurs"
    );
  }
};

export const getSecteurById = async (id: mongoose.Types.ObjectId) => {
  try {
    const secteurId = new mongoose.Types.ObjectId(id);
    const secteur = await Secteur.findById(secteurId);
    if (!secteur) {
      throw new NotFoundError("Secteur non trouvé");
    }
    return secteur;
  } catch (error) {
    throw new InternalServerError("Erreur lors de la récupération du secteur");
  }
};

export const updateSecteur = async (
  id: mongoose.Types.ObjectId,
  data: Partial<ISecteur>
) => {
  try {
    const secteur = await Secteur.findByIdAndUpdate(id, data, { new: true });
    if (!secteur) {
      throw new NotFoundError("Secteur non trouvé");
    }
    return secteur;
  } catch (error) {
    throw new InternalServerError("Erreur lors de la mise à jour du secteur");
  }
};

// export const deleteSecteur = async (id: string) => {
//     try {
//       const secteur = await Secteur.findByIdAndDelete(id);
//       if (!secteur) {
//         throw new NotFoundError('Secteur non trouvé');
//       }
//       return secteur;
//     } catch (error) {
//       throw new InternalServerError('Erreur lors de la suppression du secteur');
//     }
//   };
