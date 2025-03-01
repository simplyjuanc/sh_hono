import type { OpenApiApp } from "@/types.js";

export default function configureOpenAPI(app: OpenApiApp) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      title: "Sound Harbour API",
      version: "1.0.0",
    },
  });
}
