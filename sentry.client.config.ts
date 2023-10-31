// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
const { name, version } = require('./package.json');

Sentry.init({
  release: `${name}@${version}`,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // // in development and sample at a lower rate in production
  // replaysSessionSampleRate: 0.1,
  //
  // // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  // integrations: [
  //   new Sentry.Replay({
  //     // Additional Replay configuration goes in here, for example:
  //     maskAllText: true,
  //     blockAllMedia: true,
  //   }),
  // ],

  maxBreadcrumbs: 50,

  beforeSend(event, hint) {
    // Check if the event is an error
    if (event.level === 'error') {
      return event;  // If it is an error, send the event to Sentry
    }
    return null;  // If it's not an error, discard the event
  },
});
