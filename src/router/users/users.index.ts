import { createRouter } from "@/utils/app-utils";

import * as handlers from "./users.handlers";
import * as routes from "./users.routes";

const router = createRouter()
  .openapi(routes.userSignUpRoute, handlers.userSignupHandler)
  .openapi(routes.userLoginRoute, handlers.userLoginHandler)
  .openapi(routes.userLogoutRoute, handlers.userLogoutHandler);

export default router;
