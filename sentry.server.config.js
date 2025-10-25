import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://7c59c7c02de414fd4a3faa931a185232@o4510252345786369.ingest.de.sentry.io/4510252364398672',
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Environment
  environment: process.env.NODE_ENV || 'development',
  
  // Performance Monitoring
  integrations: [
    Sentry.httpIntegration(),
    Sentry.nodeProfilingIntegration(),
  ],
  
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
})
