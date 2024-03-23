import http from "http";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

import { mongoConnect } from "./config/mongo";

const { PORT } = process.env;

const server = http.createServer(app);

function startServer() {
  mongoConnect()
    .then((data) => {
      server.listen(PORT, () => {
        console.log("connexion reussie");
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

startServer();
