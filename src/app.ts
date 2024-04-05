import path from "path";
import cors from "cors";
import morgan from "morgan";
import express from "express";

import { errorHandler } from "./middlewares/errorHandler";

import { verifyTokenAccessAPI } from "./middlewares/verifyTokenAccessAPI";

import router from "./routes";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

// app.use(verifyTokenAccessAPI);

app.use(morgan("combined"));

app.use(express.json());

app.use("/api/v1/learner/profile_picture", express.static("public/uploads"));

app.use("/api/v1", router);

app.use(errorHandler);

export default app;
