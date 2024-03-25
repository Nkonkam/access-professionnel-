export const generateOTP = async () => {
  try {
    // Générer un nombre aléatoire entre 100000 (inclus) et 999999 (inclus)
    return `${Math.floor(100000 + Math.random() * 900000)}`;
  } catch (error) {
    throw error;
  }
};
