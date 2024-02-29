import express from "express";
import cors from "cors";

import routes from "./routes";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: '*' }));

app.use("/api/", routes);

export default app;
