import "dotenv/config";
import express from "express";
import routes from "./routes/index";
import ErrorMiddleware from "./middlewares/error.middleware";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./configs/swagger";

const app = express();

app.use(express.json());
app.use("/api", routes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(ErrorMiddleware);

export default app;
