import { createRouter } from "@/utils/app-utils";

import * as handlers from "./users.handlers";
import * as routes from "./users.routes";

const router = createRouter()
  .openapi(routes.post, handlers.postHandler)
  .openapi(routes.get, handlers.getHandler);

export default router;
