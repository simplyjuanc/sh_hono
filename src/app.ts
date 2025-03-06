import { createOpenAPIApp, registerApiRoutes } from "@/utils/app-utils";

import collectionRouter from "./router/collection/collection.index";
import healthRouter from "./router/health.routes";
import { configureOpenAPI } from "./utils/open-api-utils";

const app = createOpenAPIApp();
configureOpenAPI(app);

const routes = [
  healthRouter,
  collectionRouter,
];

registerApiRoutes(app, routes);

export default app;
