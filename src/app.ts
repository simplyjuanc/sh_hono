import configureOpenAPI from "@/utils/configure-open-api.js";
import createOpenAPIApp from "@/utils/create-app.js";

const app = createOpenAPIApp();
configureOpenAPI(app);

export default app;
