import path from "path";
import cors from "cors";
import morgan from "morgan";
import express from "express";

import router from "./routes";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(morgan("combined"));

app.use(express.json());

app.use("/api/v1", router);

export default app;
