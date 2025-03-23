import { createOpenAPIApp, registerPublicApiRoutes } from "@/utils/app-utils";

import collectionRouter from "./router/collection/collection.index";
import healthRouter from "./router/health.routes";
import usersRouter from "./router/users/users.index";
import { configureOpenAPI } from "./utils/open-api-utils";

const app = createOpenAPIApp();
configureOpenAPI(app);

const publicRoutes = [
  healthRouter,
  collectionRouter,
  usersRouter,
];

registerPublicApiRoutes(app, publicRoutes);

export default app;
