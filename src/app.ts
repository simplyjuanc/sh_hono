import { createOpenAPIApp, registerApiRoutes } from "@/utils/app-utils.js";

import collectionRouter from "./router/collection/collection.index.js";
import healthRouter from "./router/index.routes.js";
import { configureOpenAPI } from "./utils/open-api-utils.js";

const app = createOpenAPIApp();
configureOpenAPI(app);

const routes = [
  healthRouter,
  collectionRouter,
];

registerApiRoutes(app, routes);

export default app;
