import { createRouter } from "@/utils/app-utils.js";

import * as handlers from "./collection.handlers.js";
import * as routes from "./collection.routes.js";

const router = createRouter()
  .openapi(routes.list, handlers.listHandler)
  .openapi(routes.get, handlers.getHandler);

export default router;
