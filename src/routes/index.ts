import { Router } from "express";

import authRoute from "./auth.routes";
import urlRoute from "./url.routes";

const routes = Router();

routes.use("/auth", authRoute);
routes.use("/url", urlRoute);

export default routes;
