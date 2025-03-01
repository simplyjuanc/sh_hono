import { createOpenAPIApp } from "@/utils/app-utils.js";

import router from "./router/index.js";
import { configureOpenAPI } from "./utils/open-api-utils.js";

const app = createOpenAPIApp();
configureOpenAPI(app);

const routes = [
  router,
];

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
