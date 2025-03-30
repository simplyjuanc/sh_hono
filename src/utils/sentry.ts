import Sentry from "@sentry/node";

import env from "@/env";

export default Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  profileSessionSampleRate: 1.0,
});
