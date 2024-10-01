import mongoose from "mongoose";
import { Option, IOption } from "./model";
import { Specialite } from "../specialites/model";
import { InternalServerError, NotFoundError } from "../../utils/errorClass";

export const addOptionToSpecialite = async (
  specialiteId: mongoose.Types.ObjectId,
  optionData: Partial<IOption>
) => {
  try {
    const nouvelleOption = new Option(optionData);
    const option = await nouvelleOption.save();

    const specialite = await Specialite.findById(specialiteId);
    if (!specialite) {
      throw new NotFoundError("Spécialité non trouvée");
    }

    specialite.Options.push(option._id);
    await specialite.save();
    return option;
  } catch (error) {
    throw new InternalServerError(
      "Erreur lors de l'ajout de l'option à la spécialité"
    );
  }
};

export const getAllOptions = async () => {
  try {
    return await Option.find().populate("Specialite");
  } catch (error) {
    throw new InternalServerError("Erreur lors de la récupération des options");
  }
};

export const getOptionById = async (id: mongoose.Types.ObjectId) => {
  try {
    const option = await Option.findById(id).populate("Specialite");
    if (!option) {
      throw new NotFoundError("Option non trouvée");
    }
    return option;
  } catch (error) {
    throw new InternalServerError("Erreur lors de la récupération de l'option");
  }
};

export const updateOption = async (
  id: mongoose.Types.ObjectId,
  updateData: Partial<IOption>
) => {
  try {
    const updatedOption = await Option.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("Specialite");

    if (!updatedOption) {
      throw new NotFoundError("Option non trouvée");
    }

    return updatedOption;
  } catch (error) {
    throw new InternalServerError("Erreur lors de la mise à jour de l'option");
  }
};

export const deleteOption = async (id: mongoose.Types.ObjectId) => {
  try {
    const option = await Option.findById(id);
    if (!option) {
      throw new NotFoundError("Option non trouvée");
    }

    // Supprimer l'option
    await Option.findByIdAndDelete(id);

    // Retirer la référence de l'option de toutes les spécialités
    await Specialite.updateMany({ Options: id }, { $pull: { Options: id } });

    return option;
  } catch (error) {
    throw new InternalServerError("Erreur lors de la suppression de l'option");
  }
};
