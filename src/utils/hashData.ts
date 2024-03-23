const bcrypt = require("bcrypt");

export const hashData = async (
  data: String,
  saltRounds: Number = 10
): Promise<String> => {
  try {
    const hashedData: string = await bcrypt.hash(data, saltRounds);
    return hashedData;
  } catch (error) {
    // Comme précédemment, envisagez de logger l'erreur ou de notifier votre équipe
    console.error("Error hashing data: ", error);

    // Lancez une nouvelle erreur avec un message spécifique pour votre contexte d'application
    throw new Error("An error occurred while hashing data.");
  }
};

// const hashData = async (data : any , saltRounds = 10) => {
//   try {
//     const hashedData = await bcrypt.hash(data, saltRounds);
//     return hashedData;
//   } catch (error) {
//     throw error;
//   }
// };

// const verifyHashedData = async (unhashed, hashed) => {
//   try {
//     const match = await bcrypt.compare(unhashed, hashed);
//     return match;
//   } catch (error) {
//     throw error;
//   }
// };

export const verifyHashedData = async (
  unhashed: String,
  hashed: String
): Promise<boolean> => {
  try {
    const match: boolean = await bcrypt.compare(unhashed, hashed);
    return match;
  } catch (error) {
    // Dans un contexte de production, il peut être judicieux de logger l'erreur
    // avec un outil de monitoring des erreurs ou d'en informer l'équipe technique
    // pour investigation. Par exemple, utiliser console.error ou un système de logging dédié.
    console.error("Error during hash comparison: ", error);

    // Selon le contexte, vous pourriez vouloir gérer l'erreur de manière plus spécifique
    // ou même renvoyer un résultat différent. Pour simplifier, nous pouvons ici
    // relancer l'erreur pour la capturer plus haut dans la pile d'appels.
    throw new Error("An error occurred while verifying hashed data.");
  }
};
