import type { OpenApiApp } from "@/types.js";

import { createOpenAPIApp } from "./app-utils.js";

export function createTestRouter() {
  const testApp = createOpenAPIApp();
  return testApp;
}
