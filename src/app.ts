import { configureOpenAPI, createOpenAPIApp } from "@/utils/app-utils.js";

import router from "./router/index.js";

const app = createOpenAPIApp();
configureOpenAPI(app);

const routes = [
  router,
];

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
