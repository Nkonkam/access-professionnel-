export class SuccessfulResponse {
  statusCode: number; // Comme un indicateur de succès, par exemple, 200 pour OK
  data: any; // Les données que tu veux envoyer en retour, cela peut être n'importe quoi

  constructor(statusCode: number, data: any) {
    this.statusCode = statusCode; // On définit le statut de la réponse, souvent 200 pour OK
    this.data = data; // On définit les données qu'on veut renvoyer
  }

  send(response: any) {
    // Ici, "response" est l'objet de réponse de ton serveur, comme dans Express.js
    response.status(this.statusCode).json(this.data);
  }
}

// // Utilisation
// const mySuccessResponse = new SuccessfulResponse(200, { message: "Tout va bien !" });
// // Supposons que "res" est l'objet de réponse dans un gestionnaire de route Express
// mySuccessResponse.send(res);
