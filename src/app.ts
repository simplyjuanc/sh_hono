import { configureOpenAPI, createOpenAPIApp } from "@/utils/app-utils.js";

const app = createOpenAPIApp();
configureOpenAPI(app);

export default app;
