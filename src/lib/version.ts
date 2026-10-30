// Single source of truth for the version shown in the webapp.
// Bump this alongside the git tag and package.json's "version" field on
// every deploy (see the release checklist in the deploy workflow) so
// what's on screen always matches what's actually live -- it isn't
// derived automatically from git because the production build has no
// access to tag history at build time.
export const APP_VERSION = 'v1.6.13'

// Display helpers so every place that shows the version uses the same
// wording -- just update APP_VERSION above and these follow.
export const APP_VERSION_NUMBER = APP_VERSION.replace(/^v/, '')
export const FOOTER_VERSION_LABEL = `Version ${APP_VERSION_NUMBER}`
export const WEBAPP_VERSION_LABEL = `WebApp Version No ${APP_VERSION_NUMBER}`
