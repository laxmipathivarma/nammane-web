// Single source of truth for the version badge shown in the footer.
// Bump this alongside the git tag on every deploy (see the release
// checklist in the deploy workflow) so what's on screen always matches
// what's actually live -- it isn't derived automatically from git because
// the production build has no access to tag history at build time.
export const APP_VERSION = 'v1.5.1'
