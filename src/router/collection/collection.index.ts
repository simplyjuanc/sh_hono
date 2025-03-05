import { createRouter } from "@/utils/app-utils";

import * as handlers from "./collection.handlers";
import * as routes from "./collection.routes";

const router = createRouter()
  .openapi(routes.list, handlers.listHandler)
  .openapi(routes.get, handlers.getHandler);

export default router;
