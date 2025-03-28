import { sentry } from "@hono/sentry";

import { createOpenAPIApp, registerApiRoutes, registerProtectedApiRoutes } from "@/utils/app-utils";

import env from "./env";
import collectionRouter from "./router/collection/collection.index";
import healthRouter from "./router/health.routes";
import usersRouter from "./router/users/users.index";
import { configureOpenAPI } from "./utils/open-api-utils";

const app = createOpenAPIApp();
app.use("*", sentry({
  dsn: env.SENTRY_DSN,
}));

configureOpenAPI(app);

const publicRoutes = [
  healthRouter,
  usersRouter,
];

const privateRoutes = [
  collectionRouter,
];

registerApiRoutes(app, publicRoutes);
registerProtectedApiRoutes(app, privateRoutes);

export default app;
